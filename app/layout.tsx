import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VotoVivo.leg',
  description: 'Painel para acompanhar parlamentares, votações, proposições e despesas do Poder Legislativo.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
