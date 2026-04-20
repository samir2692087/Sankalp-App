import { UserData } from './types';
import jsPDF from 'jspdf';

export function downloadFile(content: string, fileName: string, contentType: string) {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function exportToCSV(data: UserData) {
  let csv = "Date,Type,Detail\n";
  
  data.relapses.forEach(r => {
    csv += `"${new Date(r.timestamp).toLocaleDateString()}","Relapse","Reason: ${r.reason} | Time: ${r.timeOfDay}"\n`;
  });
  
  data.urges.forEach(u => {
    csv += `"${new Date(u.timestamp).toLocaleDateString()}","Urge Resisted","Intensity: ${u.intensity}"\n`;
  });
  
  data.checkIns.forEach(c => {
    csv += `"${c.date}","Check-in","Completed"\n`;
  });

  downloadFile(csv, `ironwill-report-${new Date().toISOString().split('T')[0]}.csv`, "text/csv");
}

export function exportToText(data: UserData) {
  const report = `
IRONWILL DISCIPLINE REPORT
Generated: ${new Date().toLocaleString()}
------------------------------------------

SUMMARY:
- Current Streak: ${data.currentStreak} Days
- Personal Best: ${data.bestStreak} Days
- Discipline Score: ${data.disciplineScore}/100
- Total Urges Resisted: ${data.urges.length}
- Total Relapses: ${data.relapses.length}

BEHAVIORAL NOTES:
Stay strong. Every urge resisted is a brain-rewiring victory.
Consistency is the only path to mastery.

Stay strong 💪
  `;
  downloadFile(report.trim(), `ironwill-summary.txt`, "text/plain");
}

export async function exportToPDF(data: UserData) {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(108, 76, 255); // Primary color
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text("IronWill Mastery Report", 20, 25);
  
  doc.setFontSize(10);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 32);
  
  // Stats Section
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.text("Performance Overview", 20, 60);
  
  doc.setFontSize(12);
  const stats = [
    ["Current Mastery Streak", `${data.currentStreak} Days`],
    ["Personal Best", `${data.bestStreak} Days`],
    ["Discipline Integrity Score", `${data.disciplineScore}/100`],
    ["Total Battles Won (Urges)", `${data.urges.length}`],
    ["Recorded Relapses", `${data.relapses.length}`]
  ];

  let y = 75;
  stats.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label + ":", 25, y);
    doc.setFont("helvetica", "normal");
    doc.text(value, 100, y);
    y += 10;
  });

  // Insights
  doc.setFontSize(16);
  doc.text("Behavioral Insights", 20, 140);
  doc.setFontSize(11);
  doc.text("• Consistency builds neural resilience.", 25, 150);
  doc.text("• Every urge resisted strengthens your willpower muscle.", 25, 158);
  doc.text("• A relapse is a lesson, not a finality.", 25, 166);

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text("IronWill - Discipline Monitor Pro", 105, 285, { align: "center" });
  
  doc.save(`ironwill-report-${Date.now()}.pdf`);
}