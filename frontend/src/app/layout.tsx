import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BookBazaar',
  description: 'A modern marketplace for buying and selling old books',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
