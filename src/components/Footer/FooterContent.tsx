'use client';

import IconEmail from '@/assets/icon/icon-mail.svg';
import IconPhone from '@/assets/icon/icon-phone.svg';
import logoHT from '@/assets/icon/logo-hungthai.svg';
// import Bocongthuong from '@/assets/images/BoCongThuong.png';
import { NAVIGATION } from '@/data/navigation';
import useAllSettingLandingPage from '@/hooks/useAllSettingLandingPage';
import { listingType } from '@/libs/appconst';
import { PropertyTypeModel } from '@/models/propertyModel/propertyTypeModel';
import { Route } from '@/routers/types';
import SocialsList from '@/shared/SocialsList';
import * as _ from 'lodash';
import { useTranslations } from 'next-intl';
import Link from 'next-intl/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ScrollToTopButton from './ScrollToTopButton';
import './style.scss';

export interface CustomLink {
  label: string;
  href: Route<string> | string;
  targetBlank?: boolean;
  icon?: any;
  width?: string;
  height?: string;
  marginText?: string;
  type?: string;
}
export interface WidgetFooterMenu {
  id: string;
  title: string;
  menus?: CustomLink[];
  menus2?: PropertyTypeModel[];
  icon?: any;
}

interface Props {
  propertyTypes: PropertyTypeModel[];
}
const FooterContent: React.FC<Props> = ({ propertyTypes }) => {
  const t = useTranslations('webLabel');
  const [position, setPosition] = useState(0);
  const pathname = usePathname();
  const { allSettingLandingPage } = useAllSettingLandingPage();
  const [urlLinkLogo, setUrlLinkLogo] = useState('');
  const [isLoginAdmin, setIsLoginAdmin] = useState(false);

  useEffect(() => {
    if (allSettingLandingPage) {
      let find = _.find(allSettingLandingPage, { key: 'LOGO_LANDING_PAGE' });
      if (find) {
        setUrlLinkLogo(find.value);
      }
    }
  }, [allSettingLandingPage]);

  const [widgetMenus1, setWidgetMenus1] = useState<WidgetFooterMenu[]>([
    {
      id: '1',
      title: null,
      menus2: [],
      menus: [
        {
          href: NAVIGATION.saleListing.href,
          label: 'EcomHomePageMenuSale',
        },
        {
          href: NAVIGATION.rentListing.href,
          label: 'EcomHomePageMenuRent',
        },
        {
          href: NAVIGATION.projectList.href,
          label: 'EcomHomePageMenuProjects',
        },
        {
          href: NAVIGATION.entrust.href,
          label: 'EcomHomePageMenuEntrust',
        },
        ,
        {
          href: NAVIGATION.contactUs.href,
          label: 'EcomHomePageMenuContactUs',
        },
      ],
    },
  ]);

  useEffect(() => {
    if (pathname == '/account/login-admin') {
      setIsLoginAdmin(true);
    } else {
      setIsLoginAdmin(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleEvent);
    }
  }, []);

  const handleEvent = () => {
    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(showHideHeaderMenu);
    }
  };
  const showHideHeaderMenu = () => {
    let curEcomHomePageFooterRentScrollPos = window.pageYOffset;
    setPosition(curEcomHomePageFooterRentScrollPos);
  };
  const renderLocationMenuItem = (menu: WidgetFooterMenu, index: number) => {
    return (
      <div key={index} className="mb-2 w-full text-sm">
        <ul className="mt-5 space-y-4">
          {menu.menus.map((item, index) => (
            <li key={index}>
              <div className="grid w-full grid-cols-12">
                <div className="col-span-1 lg:col-span-1">
                  {item.icon ? (
                    <Image
                      alt={item.label}
                      src={item.icon}
                      className={`${item?.height ? item?.height : 'h-4'} ${
                        item?.width ? item?.width : 'w-4'
                      } `}
                    />
                  ) : (
                    <h1 className="text-base font-semibold">&bull;</h1>
                  )}
                </div>
                <div
                  className={` ${
                    index ? `lg:col-span-8` : `lg:col-span-10`
                  } col-span-11 ${item.marginText} `}
                >
                  <Link key={index} className={`hover:text-neutral-600`} href={item.href || '#'}>
                    {item.type == 'translate' ? t(item.label) : item.label}
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  const renderWidgetMenuItem = (menu: WidgetFooterMenu, index: number) => {
    return (
      <div key={index} className="text-sm">
        {menu.title && <h2 className="text-[14px] font-bold lg:text-[16px]">{t(menu.title)}</h2>}
        <ul className="space-y-4">
          {menu.menus &&
            menu.menus.map((item, index) => (
              <li key={index}>
                <Link
                  key={index}
                  className="hover:text-neutral-600"
                  href={item.href}
                  passHref
                  target="_blank"
                >
                  {t(item.label)}
                </Link>
              </li>
            ))}
          {menu.menus2 &&
            menu.menus2.map((item, index) => (
              <li key={index}>
                <Link
                  prefetch={false}
                  key={index}
                  className="hover:text-neutral-600"
                  passHref
                  href={`${
                    item.type === listingType.sale
                      ? NAVIGATION.saleListing.href
                      : NAVIGATION.rentListing.href
                  }?c=${item.id}`}
                  target="_blank"
                >
                  {item?.name}
                </Link>
              </li>
            ))}
        </ul>
      </div>
    );
  };

  return !isLoginAdmin ? (
    <>
      {/* pc */}
      <div className="nc-Footer relative bg-portal-yellow pt-7 text-black lg:block">
        <>{position > 0 ? <ScrollToTopButton /> : ''}</>

        <div className="flex w-full flex-col justify-between gap-16 text-xs">
          <div className="grid grid-cols-1 gap-y-10 self-center px-4 pb-14 pt-7 md:grid-cols-6 lg:grid-cols-6 lg:px-0">
            <div className="col-span-2 flex flex-col gap-3 px-4 lg:gap-2 lg:px-32">
              <div className="flex flex-col gap-4">
                <div className="w-40 lg:flex">
                  {/* {urlLinkLogo ? (
                    <Image
                      className="object-cover"
                      src={urlLinkLogo}
                      alt="logoDomDom"
                      width={260}
                      height={260}
                    />
                  ) : ( */}
                  <Image className="object-cover" src={logoHT} alt="logoDomDom" />
                  {/* )} */}
                </div>
                <h2 className="text-[14px] font-bold uppercase lg:text-[16px]">
                  {t('EcomHomePageFooterCustomer')}
                </h2>
              </div>
              <div className="flex flex-col gap-2 lg:hidden">
                <div className="flex items-center gap-3 lg:hidden">
                  <Image alt={'phone-icon'} src={IconPhone} className={`h-7 w-7`} />{' '}
                  <div className="flex flex-col">
                    <span className="text-sm">{t('Hotline')}</span>
                    <Link
                      className={`text-sm font-bold hover:text-neutral-600`}
                      href={'tel:0906651055'}
                    >
                      090 665 1055
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-3 lg:hidden">
                  <Image alt={'email-icon'} src={IconEmail} className={`h-7 w-7`} />{' '}
                  <div className="flex flex-col">
                    <span className="text-sm">{t('FooterCustomerSupport')}</span>
                    <Link
                      className={`text-sm font-bold hover:text-neutral-600`}
                      href={'mailto:support@ht-tech.vn'}
                    >
                      support@ht-tech.vn
                    </Link>
                  </div>
                </div>
              </div>

              <span className="pt-4 text-sm lg:py-0">
                {t('EcomContactUsPageDetailAddressLocation')}
              </span>
              <span className="pt-3 text-sm lg:py-0">{t('FooterRepresentative')}:</span>
              <span className="text-sm">Copyright © 2024 NAM LONG. All Right Reserved.</span>
              <span className="text-sm">{t('EcomContractInfoLandingPage')}</span>
            </div>

            <div className="col-span-4 grid grid-cols-2 px-4 lg:gap-8 lg:px-32">
              <div className="flex flex-col gap-14">
                <div className="hidden items-center gap-3 lg:flex">
                  <Image alt={'phone-icon'} src={IconPhone} className={`h-7 w-7`} />{' '}
                  <div className="flex flex-col">
                    <span className="text-sm">{t('Hotline')}</span>
                    <Link
                      className={`text-sm font-bold hover:text-neutral-600`}
                      href={'tel:0906651055'}
                    >
                      090 665 1055
                    </Link>
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <h2 className="text-[14px] font-bold uppercase lg:text-[16px]">
                    {t('FooterMenu')}
                  </h2>
                  {widgetMenus1.map(renderWidgetMenuItem)}
                </div>
              </div>

              <div className="flex flex-col gap-14">
                <div className="hidden items-center gap-3 lg:flex">
                  <Image alt={'email-icon'} src={IconEmail} className={`h-7 w-7`} />{' '}
                  <div className="flex flex-col">
                    <span className="text-sm">{t('FooterCustomerSupport')}</span>
                    <Link
                      className={`text-sm font-bold hover:text-neutral-600`}
                      href={'mailto:support@ht-tech.vn'}
                    >
                      support@nl-tech.vn
                    </Link>
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <h2 className="text-[14px] font-bold uppercase lg:text-[16px]">
                    {t('FooterRules')}
                  </h2>
                  <div className="flex flex-col gap-4">
                    <Link className="text-sm hover:text-neutral-600" href={'/quy-che-hoat-dong'}>
                      {t('quychehoatdong')}
                    </Link>
                    <Link className="text-sm hover:text-neutral-600" href={'/dieu-khoan-dieu-kien'}>
                      {t('dieukhoanthoathuan')}
                    </Link>
                    <Link
                      className="text-sm hover:text-neutral-600"
                      href={'/chinh-sach-quyen-rieng-tu'}
                    >
                      {t('EcomLeftMenuBarPrivacyPolicy')}
                    </Link>
                    <Link
                      className="text-sm hover:text-neutral-600"
                      href={'/quy-dinh-ve-tranh-chap'}
                    >
                      {t('EcomLeftMenuBarRegulationSettlement')}
                    </Link>
                    <div className="hidden gap-4 lg:flex">
                      {/* <Image src={Bocongthuong} width={138} height={54} alt="bocongthuong" /> */}

                      <SocialsList
                        className="w-full"
                        itemClass="flex dark:bg-neutral-800 text-xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4 lg:hidden">
              {/* <Image src={Bocongthuong} width={138} height={54} alt="bocongthuong" /> */}

              <SocialsList className="w-fit" itemClass="flex dark:bg-neutral-800 text-xl" />
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <></>
  );
};

export default FooterContent;
