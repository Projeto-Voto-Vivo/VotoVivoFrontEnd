import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/HeaderLayout';
import { Footer } from '@/components/layout/FooterLayout';

export const metadata: Metadata = {
  title: 'VotoVivo.leg',
  description:
    'Dados públicos organizados para transparência e educação cívica.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
