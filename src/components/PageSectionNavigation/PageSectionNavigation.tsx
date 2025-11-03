'use client';

import React from 'react';
import { scrollToId } from '@/utils/scrollToId';
import Image from 'next/image';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  iconSize?: string;
}

interface Props {
  items: NavItem[];
  additional?: React.ReactNode;
}

const PageSectionNavigation: React.FC<Props> = ({ items, additional }) => {
  return (
    <div className="navigation-common-page">
      <div className="container flex justify-between items-center">
        <ul className="navigation-common-page__wrapper flex flex-wrap gap-3">
          {items.map((item) => (
            <li key={item.id} className="navigation-common-page__entry">
              <span
                className="navigation-common-page__entry-wrapper cursor-pointer flex items-center gap-2"
                onClick={() => scrollToId(item.id)}
              >
                <span
                  className="navigation-common-page__entry-icon block bg-no-repeat bg-center"
                  style={{
                    backgroundImage: `url(${item.icon})`,
                    backgroundSize: item.iconSize || 'calc(24 / 24 * 100%) auto',
                    width: '24px',
                    height: '24px',
                  }}
                ></span>
                {item.label}
              </span>
            </li>
          ))}
        </ul>

        {additional && (
          <ul className="navigation-common-page__additional flex gap-2">
            {additional}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PageSectionNavigation;