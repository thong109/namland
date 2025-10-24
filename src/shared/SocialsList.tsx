import logoFB from '@/assets/icon/icon-facebook.svg';
import { SocialTypeV2 } from '@/shared/SocialsShare';
import Image from 'next/image';
import { FC } from 'react';

export interface SocialsListProps {
  className?: string;
  itemClass?: string;
}

const socialsDemo: SocialTypeV2[] = [
  { name: 'Facebook', logo: logoFB, href: 'https://www.facebook.com/domdompmh' },
  // { name: 'Twitter', logo: logoIG, href: '#' },
  // { name: 'Youtube', logo: logoTW, href: '#' },
  // { name: 'Instagram', logo: logoYT, href: '#' },
];

const SocialsList: FC<SocialsListProps> = ({ className = '', itemClass = 'block' }) => {
  return (
    <nav
      className={`nc-SocialsList flex space-x-4 text-2xl text-neutral-6000 dark:text-neutral-300 ${className}`}
      data-nc-id="SocialsList"
    >
      {socialsDemo.map((item, i) => (
        <a
          key={i}
          className={`${itemClass}`}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          title={item.name}
        >
          <Image src={item.logo} width={30} height={30} alt={item.name} />
        </a>
      ))}
    </nav>
  );
};

export default SocialsList;
