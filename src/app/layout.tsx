import './globals.css';

import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';
import { Toaster } from 'sonner';

import { ThemeProvider } from '@/components/providers/theme-provider';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Attendancy',
  description:
    'Attendancy is an application that allows companies manage their employees attendance',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn('h-full', 'antialiased', 'font-sans', GeistSans.variable)}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="attendancy-theme"
        >
          {children}

          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
