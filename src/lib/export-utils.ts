
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
  let csv = "Type,Timestamp,Detail\n";
  
  data.relapses.forEach(r => {
    csv += `Relapse,${new Date(r.timestamp).toLocaleString()},Reason: ${r.reason} | Time: ${r.timeOfDay}\n`;
  });
  
  data.urges.forEach(u => {
    csv += `Urge Resisted,${new Date(u.timestamp).toLocaleString()},Intensity: ${u.intensity}\n`;
  });
  
  data.checkIns.forEach(c => {
    csv += `Check-in,${c.date},Completed\n`;
  });

  downloadFile(csv, `ironwill-report-${new Date().toISOString().split('T')[0]}.csv`, "text/csv");
}

export function exportToText(data: UserData) {
  const report = `
IRONWILL DISCIPLINE REPORT
Generated: ${new Date().toLocaleString()}

SUMMARY:
Current Streak: ${data.currentStreak} days
Best Streak: ${data.bestStreak} days
Discipline Score: ${data.disciplineScore}/100
Total Urges Resisted: ${data.urges.length}
Total Relapses: ${data.relapses.length}

BEHAVIORAL NOTES:
Keep pushing forward. Every day is a victory.
  `;
  downloadFile(report, `ironwill-report.txt`, "text/plain");
}

export async function exportToPDF(data: UserData) {
  const doc = new jsPDF();
  
  doc.setFontSize(22);
  doc.text("IronWill Progress Report", 20, 20);
  
  doc.setFontSize(14);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);
  
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);
  
  doc.setFontSize(16);
  doc.text("Statistics", 20, 50);
  doc.setFontSize(12);
  doc.text(`Current Streak: ${data.currentStreak} Days`, 25, 60);
  doc.text(`Best Streak: ${data.bestStreak} Days`, 25, 70);
  doc.text(`Discipline Score: ${data.disciplineScore}/100`, 25, 80);
  doc.text(`Urges Resisted: ${data.urges.length}`, 25, 90);
  doc.text(`Total Relapses: ${data.relapses.length}`, 25, 100);
  
  doc.setFontSize(16);
  doc.text("Encouragement", 20, 120);
  doc.setFontSize(12);
  doc.text("Discipline is the bridge between goals and accomplishment.", 25, 130);
  doc.text("You are stronger than your weakest moments.", 25, 140);
  
  doc.save(`ironwill-report-${Date.now()}.pdf`);
}
