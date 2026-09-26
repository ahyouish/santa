import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from './ClientLayout';

export const metadata: Metadata = {
  title: "North Pole Wish System | Santa's Command Dashboard",
  description: 'A magical Christmas wish management system featuring Santa Admin Dashboard, Child Wish Letters, and Elf Sleigh Delivery Logistics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
