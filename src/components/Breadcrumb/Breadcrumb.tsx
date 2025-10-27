'use client';
import React, { FC } from 'react';
import { assetsImages } from '../../assets/images/package';
import './Breadcrumb.css';
import { useRouter } from 'next-intl/client';

export interface BreadCrumbItem {
  path: string;
  title: string;
}

export interface BreadCrumbProps {
  additionalClass?: string;
  breadcrumbItems: BreadCrumbItem[];
  hasBanner?: boolean;
}

const Breadcrumb: FC<BreadCrumbProps> = ({ additionalClass, breadcrumbItems, hasBanner = false }) => {
  const { push } = useRouter();
  return (
    <nav className={`breadcrumb-common ${additionalClass} ${hasBanner ? 'has-banner' : ''}`}>
      <div className='container'>
        <ol className='breadcrumb-common__wrapper'>
          {breadcrumbItems.map((breadcrumbItem, index) => {
            const isItemLast = index === breadcrumbItems.length - 1;
            return (
              <li key={index} className='breadcrumb-common__item'>
                {!isItemLast ? (
                  <span className='breadcrumb-common__item-link cursor-pointer' onClick={() => push(breadcrumbItem.path)} style={{ backgroundImage: `url(${assetsImages.commonIconArrow2.src})` }}>{breadcrumbItem.title}</span>
                ) : (
                  <span className='breadcrumb-common__item-label'>{breadcrumbItem.title}</span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumb;
