'use client';

import { PathName } from '@/routers/types';
import { useThemeMode } from '@/utils/useThemeMode';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Header from './Header';
export type SiteHeaders = 'Header 1';

interface HomePageItem {
  name: string;
  slug: PathName;
}

let OPTIONS = {
  root: null,
  rootMargin: '0px',
  threshold: 1.0,
};
let OBSERVER: IntersectionObserver | null = null;

const SiteHeader = () => {
  const anchorRef = useRef<HTMLDivElement>(null);

  const [headerSelected, setHeaderSelected] = useState<SiteHeaders>('Header 1');
  const pathname = usePathname();
  const [isLoginAdmin, setIsLoginAdmin] = useState(false);

  useEffect(() => {
    if (pathname == '/account/login-admin') {
      setIsLoginAdmin(true);
    } else {
      setIsLoginAdmin(false);
    }
  }, [pathname]);

  useThemeMode();

  const renderHeader = () => {
    let headerClassName = 'shadow-sm dark:border-b dark:border-neutral-700';

    switch (headerSelected) {
      case 'Header 1':
        return <Header className={headerClassName} navType="MainNav1" />;
      default:
        return <Header className={headerClassName} navType="MainNav1" />;
    }
  };

  return !isLoginAdmin ? (
    <>
      {renderHeader()}
      <div ref={anchorRef} className="invisible absolute h-1"></div>
    </>
  ) : (
    <></>
  );
};

export default SiteHeader;
