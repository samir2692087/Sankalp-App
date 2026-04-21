
import type {Metadata} from 'next';
import './globals.css';
import { InteractionProvider } from '@/context/InteractionContext';

export const metadata: Metadata = {
  title: 'IronWill | Your Path to Discipline',
  description: 'Track your streak, resist urges, and master your focus with IronWill.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen">
        <InteractionProvider>
          {children}
        </InteractionProvider>
      </body>
    </html>
  );
}
