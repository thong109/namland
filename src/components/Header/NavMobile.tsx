'use client';
import IconButton from '@/assets/icon/button-icon-header.svg';
import IconPerson from '@/assets/icon/icon-person-header.svg';
import logoHT from '@/assets/icon/logo-hungthai.svg';
import { NAVIGATION } from '@/data/navigation';
import useAllSettingLandingPage from '@/hooks/useAllSettingLandingPage';
import {
  bannerIcon,
  dashboardIcon,
  keywordIcon,
  myFavoriteIcon,
  myProfileIcon,
  myPropertiesIcon,
  otpIcon,
  ownerContentIcon,
  productTypeIcon,
  settingIcon,
  ticketManagementIcon,
  topupIcon,
  wallMoneyIcon,
} from '@/libs/appComponents';
import { appPermissions, listRouterPortal } from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import useGlobalStore from '@/stores/useGlobalStore';
import ncNanoId from '@/utils/ncNanoId';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/solid';
import * as _ from 'lodash';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next-intl/client';
import Link from 'next-intl/link';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import UserTopup from '../UserTopup/UserTopup';
import AvatarDropdown from './AvatarDropdown';
import { ModalLoginOpen } from './ultil/ModalLoginOpen';
export interface NavMobileProps {
  data?: any;
  onClickClose?: () => void;
}

const NavMobile: React.FC<NavMobileProps> = ({ onClickClose }) => {
  const t = useTranslations('Header');
  const l = useTranslations('webLabel');
  const pathName = usePathname();
  const [isActive, setIsActive] = useState<any>();
  const [isPortal, setIsportal] = useState<boolean>(false);
  const { userInfo } = useGlobalStore();
  const { allSettingLandingPage } = useAllSettingLandingPage();
  const [urlLinkLogo, setUrlLinkLogo] = useState('');
  const [isModalOpen, setIsModalOpen] = ModalLoginOpen();
  const { push } = useRouter();
  useEffect(() => {
    if (allSettingLandingPage) {
      let find = _.find(allSettingLandingPage, { key: 'LOGO_LANDING_PAGE' });
      if (find) {
        setUrlLinkLogo(find.value);
      }
    }
  }, [allSettingLandingPage]);
  useEffect(() => {
    selectModulePagePortal();
  }, [pathName]);

  const selectModulePagePortal = () => {
    for (let key in listRouterPortal) {
      if (pathName.includes(listRouterPortal[key])) {
        setIsActive(key);
        setIsportal(true);
        break;
      }
      setIsportal(false);
    }
  };

  const handleOpenModal = () => {
    if (!userInfo) {
      setIsModalOpen(true);
    }
  };

  let data = [
    {
      id: ncNanoId(),
      href: '/',
      name: 'EcomHomePageMenuHome',
      type: 'dropdown',
    },

    {
      id: ncNanoId(),
      href: '/sale-listing',
      name: 'EcomHomePageMenuSale',
      type: 'dropdown',
    },
    {
      id: ncNanoId(),
      href: '/rent-listing',
      name: 'EcomHomePageMenuRent',
      type: 'dropdown',
    },
    {
      id: ncNanoId(),
      href: '/project',
      name: 'EcomHomePageMenuProjects',
      type: 'dropdown',
    },
    {
      id: ncNanoId(),
      href: NAVIGATION.newHomePage.href,
      name: 'EcomHomePageMenuNewHome',
      type: 'dropdown',
    },
    {
      id: ncNanoId(),
      href: '/tin-tuc',
      name: 'EcomHomePageMenuNews',
      type: 'dropdown',
    },
    {
      id: ncNanoId(),
      href: '/nhu-cau-cua-toi',
      name: 'EcomHomePageMenuEntrust',
      type: 'dropdown',
      children: [
        {
          id: ncNanoId(),
          href: '/toi-muon-tim-nha',
          name: 'FIND_A_HOUSE',
          type: 'dropdown',
        },
        {
          id: ncNanoId(),
          href: '/find-agent',
          name: 'SELL_RENT_MY_HOUSE',
          type: 'dropdown',
        },
      ],
    },
    {
      id: ncNanoId(),
      href: '/contact-us',
      name: 'EcomHomePageMenuContactUs',
      type: 'dropdown',
    },
  ];

  let dataPortalMember = [
    {
      id: ncNanoId(),
      name: 'EcomLeftMenuBarMyPropoperties',
      href: '/client/tin-dang-cua-toi',
      icon: myPropertiesIcon,
      iconSelect: myPropertiesIcon,
      // permission: appPermissions.portal_properties,
      current: isActive === 'myProperties' ? true : false,
      type: 'dropdown',
    },
    {
      id: ncNanoId(),
      name: 'EcomLeftMenuBarMyProfile',
      href: '/my-profile',
      icon: myProfileIcon,
      // permission: appPermissions.portal_profile,
      iconSelect: myProfileIcon,
      current: isActive === 'myProfile' ? true : false,
      type: 'dropdown',
    },
    {
      id: ncNanoId(),
      name: 'EcomLeftMenuBarMyFavorite',
      href: '/client/tin-yeu-thich',
      icon: myFavoriteIcon,
      iconSelect: myFavoriteIcon,
      current: isActive === 'myFavorite' ? true : false,
      type: 'dropdown',
    },
    {
      id: ncNanoId(),
      name: 'EcomLeftMenuBarTenantInquiry',
      href: '/client/client-inquiry',
      icon: ticketManagementIcon,
      // permission: appPermissions.portal_ticket,
      iconSelect: ticketManagementIcon,
      current: isActive === 'ticketManagment' ? true : false,
      type: 'dropdown',
    },
    {
      id: ncNanoId(),
      name: 'EcomLeftMenuBarTenantInquiry',
      href: '/client/client-inquiry',
      icon: ticketManagementIcon,
      // permission: appPermissions.portal_ticket,
      iconSelect: ticketManagementIcon,
      current: isActive === 'clientInquiry' ? true : false,
      type: 'dropdown',
    },
    {
      id: ncNanoId(),
      name: 'EcomLeftMenuBarOwnInquiryManagement',
      href: '/client/own-inquiry',
      icon: ticketManagementIcon,
      // permission: appPermissions.portal_ticket,
      iconSelect: ticketManagementIcon,
      current: isActive === 'ownInquiry' ? true : false,
      type: 'dropdown',
    },
  ];

  let dataPortalStaff = [
    {
      id: ncNanoId(),
      name: 'EcomLeftMenuBarDashboard',
      href: '/admin/dashboard',
      permission: appPermissions.portal_dashboard,
      icon: dashboardIcon,
      iconSelect: dashboardIcon,
      current: isActive === 'dashboard' ? true : false,
      type: 'dropdown',
    },
    {
      id: ncNanoId(),
      name: 'EcomPropertyListingPageMenuListing',
      href: '/admin/staff-properties',
      icon: myPropertiesIcon,
      permission: appPermissions.portal_listing,
      iconSelect: myPropertiesIcon,
      current: isActive === 'staffProperties' ? true : false,
      type: 'dropdown',
    },
    {
      id: ncNanoId(),
      name: 'EcomLeftMenuBarTenantInquiry',
      href: '/admin/client-inquiry-admin',
      permission: appPermissions.portal_ticket,
      icon: ticketManagementIcon,
      iconSelect: ticketManagementIcon,
      current: isActive === 'clientInquiryAdmin' ? true : false,
      type: 'dropdown',
    },
    {
      id: ncNanoId(),
      name: 'EcomLeftMenuBarOwnInquiryManagement',
      href: '/admin/own-inquiry-admin',
      icon: ticketManagementIcon,
      permission: appPermissions.portal_owner_inquiry,
      iconSelect: ticketManagementIcon,
      current: isActive === 'ownInquiryAdmin' ? true : false,
      type: 'dropdown',
    },
    {
      id: ncNanoId(),
      name: 'EcomLeftMenuBarLeaseAgreement',
      href: '/admin/lease-agreement',
      icon: myPropertiesIcon,
      permission: appPermissions.portal_la,
      iconSelect: myPropertiesIcon,
      current: isActive === 'leaseAgreement' ? true : false,
      type: 'dropdown',
    },
    {
      id: ncNanoId(),
      name: 'EcomLeftMenuBarOwnerServiceAgreement',
      href: '/admin/owner-service-agreement',
      icon: myPropertiesIcon,
      permission: appPermissions.portal_osa,
      iconSelect: myPropertiesIcon,
      current: isActive === 'ownerServiceAgreement' ? true : false,
      type: 'dropdown',
    },

    {
      id: ncNanoId(),
      name: 'EcomLeftMenuBarProjectManagement',
      href: '/admin/quan-ly-du-an',
      icon: dashboardIcon,
      permission: appPermissions.portal_project,
      iconSelect: dashboardIcon,
      current: isActive === 'projectManagement' ? true : false,
      type: 'dropdown',
    },
    {
      id: ncNanoId(),
      name: 'EcomLeftMenuBarAmenities',
      href: '/admin/ameniti-management',
      icon: ticketManagementIcon,
      permission: appPermissions.portal_setting,
      iconSelect: ticketManagementIcon,
      current: isActive === 'amenityModule' ? true : false,
      type: 'dropdown',
    },
    {
      id: ncNanoId(),
      name: 'EcomLeftMenuBarProductTypeManagement',
      href: '/admin/product-type',
      icon: productTypeIcon,
      permission: appPermissions.portal_listingcategory,
      iconSelect: productTypeIcon,
      current: isActive === 'productType' ? true : false,
      type: 'dropdown',
    },
    {
      id: ncNanoId(),
      name: 'EcomLeftMenuBarIamOwner',
      href: '/admin/i-am-owner',
      icon: ownerContentIcon,
      permission: appPermissions.portal_owner_content,
      iconSelect: ownerContentIcon,
      current: isActive === 'iamOwner' ? true : false,
      type: 'dropdown',
    },
    {
      id: ncNanoId(),
      name: 'EcomLeftMenuBarBanner',
      href: '/admin/banner-management',
      icon: bannerIcon,
      permission: appPermissions.portal_banner,
      iconSelect: bannerIcon,
      current: isActive === 'bannerManagement' ? true : false,
      type: 'dropdown',
    },
    {
      name: 'EcomLeftMenuFindAgent',
      href: '/admin/find-agent',
      icon: bannerIcon,
      permission: appPermissions.portal_find_agent,
      current: isActive === 'agentManagement' ? true : false,
      type: 'dropdown',
    },
    {
      id: ncNanoId(),
      name: 'EcomLeftMenuBarTopupPoint',
      href: '/admin/topup-points',
      icon: topupIcon,
      permission: appPermissions.portal_point,
      iconSelect: topupIcon,
      current: isActive === 'topupPoint' ? true : false,
      type: 'dropdown',
    },
    {
      id: ncNanoId(),
      name: 'EcomLeftMenuPackage',
      href: '/admin/listing-package-management',
      icon: ticketManagementIcon,
      permission: appPermissions.portal_listing_package,
      iconSelect: ticketManagementIcon,
      current: isActive === 'listingPackageManagement' ? true : false,
      type: 'dropdown',
    },
    {
      id: ncNanoId(),
      name: 'EcomLeftMenuPushPackage',
      href: '/admin/listing-push-package',
      icon: ticketManagementIcon,
      permission: appPermissions.portal_listing_push,
      iconSelect: ticketManagementIcon,
      current: isActive === 'listingPushPackage' ? true : false,
      type: 'dropdown',
    },
    {
      id: ncNanoId(),
      name: 'EcomLeftMenuBarUserWallet',
      href: '/admin/user-wallet-management',
      icon: wallMoneyIcon,
      permission: appPermissions.portal_userwallet,
      iconSelect: wallMoneyIcon,
      current: isActive === 'userWallet' ? true : false,
      type: 'dropdown',
    },
    {
      id: ncNanoId(),
      name: 'EcomLeftMenuBarOtpManagement',
      href: '/admin/otp-management',
      icon: otpIcon,
      permission: appPermissions.portal_otp,
      iconSelect: otpIcon,
      current: isActive === 'otpManagement' ? true : false,
      type: 'dropdown',
    },
    {
      id: ncNanoId(),
      name: 'EcomLeftMenuBarKeyword',
      href: '/admin/keyword-management',
      icon: keywordIcon,
      permission: appPermissions.portal_keyword,
      iconSelect: keywordIcon,
      current: isActive === 'keywordManagement' ? true : false,
      type: 'dropdown',
    },
    {
      id: ncNanoId(),
      name: 'EcomLeftMenuBarMember',
      href: '/admin/quan-ly-thanh-vien',
      icon: myProfileIcon,
      permission: appPermissions.portal_member,
      iconSelect: myProfileIcon,
      current: isActive === 'member' ? true : false,
      type: 'dropdown',
    },
    {
      id: ncNanoId(),
      name: 'EcomLeftMenuBarReportBCT',
      href: '/admin/report-bct',
      icon: productTypeIcon,
      permission: appPermissions.portal_exportBCT,
      iconSelect: productTypeIcon,
      current: isActive === 'reportBCT' ? true : false,
      type: 'dropdown',
    },
    {
      id: ncNanoId(),
      name: 'EcomLeftMenuBarStaffManagement',
      href: '/admin/quan-ly-nhan-vien',
      permission: appPermissions.portal_staff,
      icon: myProfileIcon,
      iconSelect: myProfileIcon,
      current: isActive === 'staffManagement' ? true : false,
      type: 'dropdown',
    },
    {
      id: ncNanoId(),
      name: 'EcomLeftMenuBarRoleManagement',
      href: '/admin/quan-ly-phan-quyen',
      permission: appPermissions.portal_roles,
      icon: ownerContentIcon,
      current: isActive === 'roleManagement' ? true : false,
      iconSelect: ownerContentIcon,
      type: 'dropdown',
    },
    {
      id: ncNanoId(),
      name: 'EcomLeftMenuBarMyProfile',
      href: '/my-profile',
      icon: myProfileIcon,
      permission: appPermissions.portal_profile,
      current: isActive === 'myProfile' ? true : false,
      iconSelect: myProfileIcon,
      type: 'dropdown',
    },
    {
      id: ncNanoId(),
      name: 'EcomLeftMenuBarSetting',
      href: '/admin/setting-management',
      icon: settingIcon,
      permission: appPermissions.portal_setting,
      current: isActive === 'settingManagement' ? true : false,
      iconSelect: settingIcon,
      type: 'dropdown',
    },
  ];

  const getPathName = (name: string) => {
    const segments = name.split('/');
    if (segments[1]) {
      return `/${segments[1]}`;
    }
    return '/';
  };
  const _renderItem = (item: any, index: number) => {
    return (
      <Disclosure key={item.id} as="li" className="text-neutral-900 dark:text-white">
        {({ open }) => (
          <>
            <Link
              className={`flex w-full rounded-lg px-4 text-sm font-medium uppercase tracking-wide hover:text-portal-primaryButtonAdmin ${
                getPathName(pathName) == item.href ? `text-portal-primaryButtonAdmin` : ''
              }`}
              href={{
                pathname: item.href || undefined,
              }}
            >
              <span className={`py-2.5 pr-3 ${!item.children ? 'block w-full' : ''}`}>
                {l(item.name)}
              </span>
              {item.children && (
                <span className="flex flex-1" onClick={(e) => e.preventDefault()}>
                  <Disclosure.Button
                    as="span"
                    className="flex flex-1 items-center justify-end py-2.5"
                  >
                    <ChevronDownIcon
                      className={`ml-2 h-4 w-4 transition-transform duration-200 ${
                        open ? 'rotate-180' : ''
                      } text-neutral-500`}
                      aria-hidden="true"
                    />
                  </Disclosure.Button>
                </span>
              )}
            </Link>

            {/* Children render here */}
            {item.children && (
              <Disclosure.Panel className="ml-6 mt-1 space-y-1">
                {item.children.map((child: any) => (
                  <Link
                    key={child.id}
                    href={{ pathname: child.href || undefined }}
                    className={`block rounded-md px-4 py-2 text-sm font-normal ${
                      getPathName(pathName) == child.href
                        ? 'text-portal-primaryButtonAdmin'
                        : 'text-neutral-700 dark:text-neutral-300'
                    } hover:text-portal-primaryButtonAdmin`}
                  >
                    {l(child.name)}
                  </Link>
                ))}
              </Disclosure.Panel>
            )}

            {/* Custom button for customer user type */}
            {index == data.length - 1 &&
              UserTypeConstant.Customer.toLocaleUpperCase() ===
                userInfo?.type?.toLocaleUpperCase() && (
                <Link href="/client/tin-dang-cua-toi" className="px-4">
                  <button className="inline-flex items-center rounded border border-portal-primaryLiving bg-transparent px-4 py-2 font-semibold hover:bg-gray-100">
                    <Image src={IconButton} className="mr-2 h-5 w-5 fill-current" alt="" />
                    <span>{l('EcomHomePageMenuCreateListing')}</span>
                  </button>
                </Link>
              )}
          </>
        )}
      </Disclosure>
    );
  };
  const _renderItemPorTal = (item: any) => {
    return (
      <Disclosure
        onClick={() => setIsActive(item.name)}
        key={item.id}
        as="li"
        className="text-neutral-900 dark:text-white"
      >
        <Link
          onClick={() => setIsActive(item.name)}
          href={item.href}
          className={`${
            item.current ? 'bg-portal-primaryLiving text-white' : 'bg-white text-portal-black'
          } group relative flex h-11 flex-row items-center border-l-4 border-transparent px-5 py-8 pl-6 pr-6 text-gray-600 hover:bg-portal-primaryLiving hover:text-white focus:outline-none`}
        >
          <div className="flex items-center">
            <span className={`py-2.5 pr-3`}>{item.current ? item.iconSelect : item.icon}</span>
            <span className={`py-2.5 pr-3 ${!item.children ? 'block w-full' : ''}`}>
              {l(item.name)}
            </span>
          </div>
        </Link>
      </Disclosure>
    );
  };

  return (
    <div className="fixed h-screen w-80 transform divide-y-2 divide-neutral-100 overflow-y-scroll bg-white pb-[50px] shadow-lg ring-1 transition dark:divide-neutral-800 dark:bg-neutral-900 dark:ring-neutral-700">
      <div className="flex h-[60px] items-center justify-between px-2">
        <Link href={'/'}>
          {urlLinkLogo ? (
            <Image
              alt="logoDomDom"
              src={urlLinkLogo}
              className="object-cover"
              width={140}
              height={140}
            />
          ) : (
            <Image alt="logoHT" src={logoHT} className="object-cover" />
          )}
        </Link>

        <div className="flex items-center justify-end">
          {/* <LangDropdown isHiddenIcon></LangDropdown> */}

          {userInfo ? (
            <AvatarDropdown className="mx-[10px]" />
          ) : (
            <div className="flex h-10 w-10 items-center self-center sm:h-12 sm:w-12">
              <button
                onClick={handleOpenModal}
                // className="flex h-5 w-5 rounded-2xl bg-transparent  text-white hover:bg-gray-100 sm:h-9 sm:w-9"
              >
                <Image src={IconPerson} alt="Icon" className="h-5 w-5 font-bold" />
              </button>
            </div>
          )}

          <button onClick={onClickClose}>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
      {userInfo?.type === UserTypeConstant.Customer && <UserTopup userInfo={userInfo} />}

      {!isPortal && (
        <ul className="flex flex-col space-y-1 px-2 py-6 md:hidden lg:hidden">
          {data.map(_renderItem)}
        </ul>
      )}
      {isPortal && (
        <ul className="flex flex-col space-y-1 px-2 py-6">
          {UserTypeConstant.Salesman.toLocaleUpperCase() === userInfo?.type?.toLocaleUpperCase()
            ? dataPortalStaff.map(_renderItemPorTal)
            : dataPortalMember.map(_renderItemPorTal)}
        </ul>
      )}
      <div></div>
    </div>
  );
};

export default NavMobile;
