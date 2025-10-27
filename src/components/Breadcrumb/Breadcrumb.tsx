'use client';
import React, { FC } from 'react';
import Link from 'next/link';
import { assetsImages } from '../../assets/images/package';
import './Breadcrumb.css';

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
  return (
    <nav className={`breadcrumb-common ${hasBanner ? `has-banner` : ``})`}>
      <div className='container'>
        <ol className='breadcrumb-common__wrapper'>
          {breadcrumbItems.map((breadcrumbItem, index) => {
            const isItemLast = index === breadcrumbItems.length - 1;

            return (
              <li key={index} className='breadcrumb-common__item'>
                {!isItemLast ? (
                  <Link className='breadcrumb-common__item-link' href={breadcrumbItem.path} style={{ backgroundImage: `url(${assetsImages.commonIconArrow2.src})` }}>{breadcrumbItem.title}</Link>
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
