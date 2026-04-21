import type {Metadata} from 'next';
import './globals.css';
import { InteractionProvider } from '@/context/InteractionContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';

export const metadata: Metadata = {
  title: 'Sankalp | Your Path to Discipline',
  description: 'Track your resolve, hold control, and master your focus with Sankalp.',
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
      <body className="font-body antialiased min-h-screen">
        <ThemeProvider>
          <LanguageProvider>
            <InteractionProvider>
              {children}
            </InteractionProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
