'use client';
import { listRouterPortal } from '@/libs/appconst';
import { GoogleAnalytics } from '@next/third-parties/google';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

function GoogleAnalyticsComponent() {
  const pathName = usePathname();
  useEffect(() => {
    checkIsPortal();
  }, [pathName]);

  const checkIsPortal = () => {
    const isPortal = Object.values(listRouterPortal)
      .filter((value) => typeof value === 'string')
      .includes(pathName);

    isPortal ? endScript() : startScript();
  };

  const endScript = () => {
    var script1 = document.getElementById('_next-ga-init');
    var script2 = document.getElementById('_next-ga');

    if (script1) {
      document.body.removeChild(script1);
    }
    if (script2) {
      document.body.removeChild(script2);
    }
  };

  const startScript = () => {
    return <GoogleAnalytics gaId="G-DR91697NMB" />;
  };

  return <></>;
}

export default GoogleAnalyticsComponent;
