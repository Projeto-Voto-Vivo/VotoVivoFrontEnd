'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const LOADING_TITLE_PREFIX = 'Carregando · ';
const DEFAULT_TITLE = 'VotoVivo.leg';
const GLOBAL_LOADING_EVENT = 'votovivo:loading';

function cleanTitle(title: string) {
  return title.replace(/^Carregando despesas ·\s*/, '').replace(/^Carregando ·\s*/, '') || DEFAULT_TITLE;
}

export function BrowserLoadingTitle() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const baseTitleRef = useRef(DEFAULT_TITLE);
  const timeoutRef = useRef<number | null>(null);
  const lastPathnameRef = useRef(pathname);

  useEffect(() => {
    baseTitleRef.current = cleanTitle(document.title || DEFAULT_TITLE);

    function clearLoadingTimeout() {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    function startLoading(timeoutMs = 10000) {
      baseTitleRef.current = cleanTitle(document.title || baseTitleRef.current || DEFAULT_TITLE);
      setIsLoading(true);
      clearLoadingTimeout();
      timeoutRef.current = window.setTimeout(() => {
        setIsLoading(false);
      }, timeoutMs);
    }

    function finishLoading() {
      clearLoadingTimeout();
      setIsLoading(false);
    }

    function handleAppLoading(event: Event) {
      const customEvent = event as CustomEvent<{ active?: boolean; timeoutMs?: number }>;

      if (customEvent.detail?.active) {
        startLoading(customEvent.detail.timeoutMs);
        return;
      }

      finishLoading();
    }

    function handleInternalNavigation(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const link = target?.closest('a[href]') as HTMLAnchorElement | null;

      if (!link || event.defaultPrevented || event.button !== 0) {
        return;
      }

      if (link.target && link.target !== '_self') {
        return;
      }

      const url = new URL(link.href, window.location.href);
      const sameOrigin = url.origin === window.location.origin;
      const samePage = url.pathname === window.location.pathname && url.search === window.location.search;

      if (sameOrigin && !samePage) {
        startLoading();
      }
    }

    window.addEventListener(GLOBAL_LOADING_EVENT, handleAppLoading);
    document.addEventListener('click', handleInternalNavigation, true);

    return () => {
      clearLoadingTimeout();
      window.removeEventListener(GLOBAL_LOADING_EVENT, handleAppLoading);
      document.removeEventListener('click', handleInternalNavigation, true);
    };
  }, []);

  useEffect(() => {
    if (lastPathnameRef.current === pathname) {
      return;
    }

    lastPathnameRef.current = pathname;

    const timeout = window.setTimeout(() => {
      setIsLoading(false);
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [pathname]);

  useEffect(() => {
    if (isLoading) {
      baseTitleRef.current = cleanTitle(document.title || baseTitleRef.current || DEFAULT_TITLE);
      document.title = `${LOADING_TITLE_PREFIX}${baseTitleRef.current}`;
      return;
    }

    document.title = cleanTitle(document.title || baseTitleRef.current || DEFAULT_TITLE);
  }, [isLoading]);

  if (!isLoading) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-[9999] h-1 w-full overflow-hidden bg-brasil-blue/10" aria-hidden="true">
      <div className="h-full w-1/3 animate-[loading-bar_1.1s_ease-in-out_infinite] rounded-r-full bg-brasil-blue" />
    </div>
  );
}
