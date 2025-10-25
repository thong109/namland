'use client';
import React, { FC } from 'react';
import { languageConst } from '@/libs/appconst';
import moment from 'moment';
import 'moment/locale/ko';
import 'moment/locale/vi';
import "./Breadcrumb.css";
import Link from 'next/link';

export interface BreadCrumbItem {
  path: string;
  title: string;
}

export interface BreadCrumbProps {
  className?: string;
  items: BreadCrumbItem[];
}

const Breadcrumb: FC<BreadCrumbProps> = ({ className, items }) => {
  return (
    <nav className={`p-[13px] ${className ?? ''}`}>
      <div className='container p-0 flex items-center gap-2'>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <span key={index} className="flex items-center gap-2">
              {!isLast ? (
                <Link href={item.path} className="text-[#9a9a9a] text-base leading-tight hover:underline">
                  {item.title}
                </Link>
              ) : (
                <span className="text-[#444444] text-base leading-tight">{item.title}</span>
              )}
              {!isLast && <span className="text-[#9A9A9A] text-base leading-tight">&gt;</span>}
            </span>
          );
        })}
      </div>
    </nav>
  );
};

export default Breadcrumb;
