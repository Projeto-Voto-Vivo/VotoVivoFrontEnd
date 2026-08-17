'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface NavLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Link de navegação com feedback visual de carregamento.
 * Substitui o <Link> do Next.js quando a página de destino é SSR
 * e o delay de navegação precisa ser comunicado ao usuário.
 */
export function NavLink({ href, className, children }: NavLinkProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    router.push(href);
  }

  if (loading) {
    return (
      <span className={`inline-flex cursor-wait items-center gap-2 ${className ?? ''}`}>
        <Loader2 size={16} className="animate-spin" />
        Carregando...
      </span>
    );
  }

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
