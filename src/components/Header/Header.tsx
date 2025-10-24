import { FC } from 'react';
import MainNav2 from './MainNav2';

export interface HeaderProps {
  navType?: 'MainNav1' | 'MainNav2';
  className?: string;
}

const Header: FC<HeaderProps> = ({ navType = 'MainNav2', className = '' }) => {
  const renderNav = () => {
    switch (navType) {
      case 'MainNav2':
        return <MainNav2 />;
      default:
        return <MainNav2 />;
    }
  };

  return (
    <div
      className={`nc-Header nc-header-bg nc-header-bg sticky left-0 right-0 top-0 z-[9999] ${className}`}
    >
      {renderNav()}
    </div>
  );
};

export default Header;
