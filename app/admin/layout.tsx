import type { Metadata } from 'next';
import { geistMono, geistSans } from '@/lib/fonts';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Admin | Xento IT-Solutions',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
