'use client';
import IconPerson from '@/assets/icon/icon-person-header.svg';
import logoHT from '@/assets/icon/logo-hungthai.svg';
import { NAVIGATION } from '@/data/navigation';
import useAllSettingLandingPage from '@/hooks/useAllSettingLandingPage';
import { listRouterPortal } from '@/libs/appconst';
import useGlobalStore from '@/stores/useGlobalStore';
import ncNanoId from '@/utils/ncNanoId';
import { Popover } from 'antd';
import clsx from 'clsx';
import * as _ from 'lodash';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next-intl/client';
import Link from 'next-intl/link';
import Image from 'next/image';
import * as NProgress from 'nprogress';
import { FC, useEffect, useState } from 'react';
import LoginModal from '../LoginModal/LoginModal';
import AvatarDropdown from './AvatarDropdown';
import LangDropdownSingle from './SelectLanguage';
import MenuBar from './MenuBar';
import NotifyDropdown from './NotifyDropdown';
import { ModalLoginOpen } from './ultil/ModalLoginOpen';
export interface MainNav2Props {
  className?: string;
}

const MainNav2: FC<MainNav2Props> = ({ className = '' }) => {
  const t = useTranslations('webLabel');
  const { push } = useRouter();
  const pathName = usePathname();
  const { userInfo } = useGlobalStore();
  const [isModalOpen, setIsModalOpen] = ModalLoginOpen();
  const { allSettingLandingPage } = useAllSettingLandingPage();

  const [urlLinkLogo, setUrlLinkLogo] = useState(
    _.find(allSettingLandingPage, { key: 'LOGO_LANDING_PAGE' })?.value ?? '',
  );

  const [isPortal, setIsPortal] = useState<boolean>(false);

  const [isSHowHeader, setIsShowHeader] = useState<boolean>(false);

  useEffect(() => {
    if (allSettingLandingPage && !urlLinkLogo) {
      let find = _.find(allSettingLandingPage, { key: 'LOGO_LANDING_PAGE' });
      if (find && find.value !== urlLinkLogo) {
        setUrlLinkLogo(find.value);
      }
    }
  }, [allSettingLandingPage, urlLinkLogo]);

  useEffect(() => {
    checkIsPortail();
  }, [pathName]);

  const checkIsPortail = () => {
    setIsShowHeader(false);
    for (let key in listRouterPortal) {
      if (pathName.includes(listRouterPortal[key])) {
        setIsPortal(true);
        break;
      } else {
        setIsPortal(false);
      }
    }
  };

  const handleOpenModal = () => {
    if (!userInfo) {
      setIsModalOpen(true);
    }
  };

  const getPathName = (name: string) => {
    const segments = name.split('/');
    if (segments[1]) {
      return `/${segments[1]}`;
    }
    return '/';
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const dataMenu = [
    {
      id: ncNanoId(),
      href: `${NAVIGATION.saleListing.href}?p=518C73F1-2621-40B8-8373-50458BBEF950&d=88B34FC2-F199-4772-B1E7-96E232A84F9C`, //Default HCM, Quận 7
      name: 'EcomHomePageMenuSale',
      type: 'dropdown',
      subMenu: null,
    },
    {
      id: ncNanoId(),
      href: `${NAVIGATION.rentListing.href}?p=518C73F1-2621-40B8-8373-50458BBEF950&d=88B34FC2-F199-4772-B1E7-96E232A84F9C`, //Default HCM, Quận 7
      name: 'EcomHomePageMenuRent',
      type: 'dropdown',
      subMenu: null,
    },
    {
      id: ncNanoId(),
      href: NAVIGATION.projectList.href,
      name: 'EcomHomePageMenuProjects',
      type: 'dropdown',
      subMenu: null,
    },
    {
      id: ncNanoId(),
      href: NAVIGATION.newHomePage.href,
      name: 'EcomHomePageMenuNewHome',
      type: 'dropdown',
      subMenu: null,
    },
    {
      id: ncNanoId(),
      href: NAVIGATION.entrust.href,
      name: 'EcomHomePageMenuEntrust',
      type: 'dropdown',
      subMenu: (
        <div className="w-full">
          <div
            className="bg-portal-primaryLiving p-2 text-white hover:bg-portal-primaryButtonAdmin"
            onClick={() => push('/toi-muon-tim-nha')}
          >
            {t('FIND_A_HOUSE')}
          </div>
          <div
            className="bg-portal-primaryLiving p-2 text-white hover:bg-portal-primaryButtonAdmin"
            onClick={() => push('/find-agent')}
          >
            {t('SELL_RENT_MY_HOUSE')}
          </div>
        </div>
      ),
    },
    ,
    {
      id: ncNanoId(),
      href: NAVIGATION.contactUs.href,
      name: 'EcomHomePageMenuContactUs',
      type: 'dropdown',
      subMenu: null,
    },
  ];

  return (
    <div className={clsx(`relative`, className)}>
      <div className="hidden min-h-20 justify-between px-4 lg:flex xl:grid xl:grid-cols-[1fr_repeat(1,_auto)_1fr]">
        <div className="hidden justify-start space-x-3 sm:space-x-8 lg:flex lg:space-x-10">
          <div
            className="w-100 hidden cursor-pointer self-center lg:flex"
            onClick={() => {
              NProgress.start();
              window.location.href = '/';
            }}
          >
            {/* {urlLinkLogo ? (
              <Image
                alt="logoDomDom"
                src={urlLinkLogo}
                className="max-h-[40px] object-cover"
                width={180}
                height={40}
              />
            ) : ( */}
            <Image className="object-cover" src={logoHT} alt="logoNL" width={200} />
            {/* )} */}
          </div>
        </div>

        <div className="mx-auto hidden grid-cols-6 justify-center lg:grid">
          {!isPortal &&
            dataMenu.map((item, index) => (
              <Link legacyBehavior href={item?.href} key={index} className="col-span-1">
                <Popover placement="topLeft" content={item.subMenu} trigger="hover" arrow={false}>
                  <a>
                    <div
                      className={clsx(
                        `flex h-full items-center justify-center self-center border-x-black font-bold`,
                        index === 0 ? 'border-l border-r' : 'border-r',
                        'hover:bg-neutral-100 hover:bg-opacity-60',
                        {
                          'bg-neutral-0': getPathName(pathName) === item.href,
                        },
                      )}
                    >
                      <span
                        className={clsx(
                          `cursor-pointer gap-8 whitespace-nowrap rounded-3xl px-3 py-2 font-semibold transition duration-150 ease-in-out`,
                        )}
                      >
                        {t(item.name)}
                      </span>
                    </div>
                  </a>
                </Popover>
              </Link>
            ))}
        </div>
        <div className="hidden flex-1 flex-shrink-0 justify-end text-neutral-700 dark:text-neutral-100 lg:flex lg:flex-none">
          <div className="hidden space-x-1 lg:flex">
            <div className="self-center">
              <LangDropdownSingle isHiddenIcon />
            </div>

            {userInfo ? (
              <AvatarDropdown className="mx-[10px]" />
            ) : (
              <div className="!mx-[10px] flex h-10 w-10 items-center justify-center self-center sm:h-12 sm:w-12">
                <button
                  onClick={handleOpenModal}
                  className="flex h-8 w-8 items-center justify-center rounded-2xl bg-transparent font-bold text-white hover:bg-gray-100 sm:h-9 sm:w-9"
                >
                  <Image src={IconPerson} alt="Icon" className="h-5.5 w-5" />
                </button>
              </div>
            )}

            {userInfo && <NotifyDropdown />}
          </div>
        </div>
      </div>

      {/* mobile */}
      <div
        className={`flex ${!isSHowHeader ? 'h-[60px]' : 'hidden'} v w-full justify-between px-3 lg:hidden`}
      >
        <div
          className="w-100 cursor-pointer self-center py-1"
          onClick={() => {
            NProgress.start();
            push('/');
          }}
        >
          {urlLinkLogo ? (
            <Image
              alt="logoDomDom"
              src={urlLinkLogo}
              className="object-contain"
              width={180}
              height={180}
            />
          ) : (
            <Image src={logoHT} alt="logoDomDom" className="object-contain" />
          )}
        </div>
        <div className="flex">
          <div className="self-center">
            <LangDropdownSingle isHiddenIcon />
          </div>
          <MenuBar changeShowHeader={(isShow) => setIsShowHeader(isShow)} />
        </div>
      </div>
      <style scoped>
        {`
.ant-popover-inner{
padding: 0px !important}

`}
      </style>

      {!userInfo && (
        <LoginModal
          isVisible={isModalOpen}
          closeModal={handleCloseModal}
          handleOk={handleCloseModal}
        />
      )}
    </div>
  );
};

export default MainNav2;
