'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface BackButtonProps {
  /** Rota para onde voltar. Se omitido, usa router.back() */
  href?: string;
  label?: string;
  /** Quantos px de scroll antes de aparecer (default: 120) */
  scrollThreshold?: number;
}

export function BackButton({
  href,
  label = 'Voltar',
  scrollThreshold = 120,
}: BackButtonProps) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > scrollThreshold);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollThreshold]);

  function handleClick() {
    if (loading) return;
    setLoading(true);
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      aria-label={label}
      className={`fixed bottom-6 left-4 z-50 inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2.5 text-sm font-semibold shadow-lg transition-all duration-300 md:left-6 ${
        loading
          ? 'border-brasil-blue text-brasil-blue'
          : 'border-slate-200 text-slate-700 hover:border-brasil-blue hover:text-brasil-blue'
      } ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      {loading ? (
        <Loader2 size={15} className="animate-spin" />
      ) : (
        <ArrowLeft size={15} />
      )}
      {loading ? 'Carregando...' : label}
    </button>
  );
}
