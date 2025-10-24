'use client';
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
import { checkPermissionModule } from '@/libs/helper';
import useGlobalStore from '@/stores/useGlobalStore';
import { Tooltip } from 'antd';
import { useTranslations } from 'next-intl';
import Link from 'next-intl/link';
import { usePathname } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import UserTopup from '../UserTopup/UserTopup';
export interface Props {
  className?: string;
}

const SliderBarPortal: FC<Props> = () => {
  const t = useTranslations('webLabel');
  const [isActive, setIsActive] = useState<any>();
  const pathName = usePathname();
  const { userInfo } = useGlobalStore();

  useEffect(() => {
    selectModulePagePortal();
  }, [pathName]);

  const selectModulePagePortal = () => {
    for (let key in listRouterPortal) {
      if (pathName.includes(listRouterPortal[key])) {
        setIsActive(key);
        break;
      }
    }
  };

  const sidebarOptionsMember = [
    {
      name: 'EcomLeftMenuBarMyPropoperties',
      href: '/client/tin-dang-cua-toi',
      icon: myPropertiesIcon,
      // permission: appPermissions.portal_properties,
      current: isActive === 'myProperties' ? true : false,
    },
    {
      name: 'EcomLeftMenuBarMyFavorite',
      href: '/client/tin-yeu-thich',
      icon: myFavoriteIcon,
      // permission: appPermissions.portal_properties,
      current: isActive === 'myFavorite' ? true : false,
    },
    {
      name: 'EcomLeftMenuBarRatingMe',
      href: '/client/danh-gia-cua-toi',
      icon: myFavoriteIcon,
      //  permission: appPermissions.,
      current: isActive === 'ratingMe' ? true : false,
    },
    {
      name: 'EcomLeftMenuBarTenantInquiry',
      href: '/client/client-inquiry',
      icon: ticketManagementIcon,
      // permission: appPermissions.portal_properties,
      current: isActive === 'clientInquiry' ? true : false,
    },

    {
      name: 'EcomLeftMenuBarOwnInquiryManagement',
      href: '/client/own-inquiry',
      icon: ticketManagementIcon,
      // permission: appPermissions.portal_ticket,
      current: isActive === 'ownInquiry' ? true : false,
    },
    {
      name: 'EcomLeftMenuBarTransaction',
      href: '/client/lich-su-giao-dich',
      icon: topupIcon,
      //  permission: appPermissions.,
      current: isActive === 'transaction' ? true : false,
    },
    {
      name: 'EcomLeftMenuBarMyProfile',
      href: '/my-profile',
      icon: myProfileIcon,
      // ermission: appPermissions.portal_profile,
      current: isActive === 'myProfile' ? true : false,
    },
  ];

  const sidebarOptionsStaff = [
    {
      name: 'EcomLeftMenuBarDashboard',
      href: '/admin/dashboard',
      permission: appPermissions.portal_dashboard,
      icon: dashboardIcon,
      current: isActive === 'dashboard' ? true : false,
    },
    {
      name: 'EcomPropertyListingPageMenuListing',
      href: '/admin/staff-properties',
      icon: myPropertiesIcon,
      permission: appPermissions.portal_listing,
      current: isActive === 'staffProperties' ? true : false,
    },
    {
      name: 'EcomLeftMenuBarTenantInquiry',
      href: '/admin/client-inquiry-admin',
      icon: ticketManagementIcon,
      permission: appPermissions.portal_ticket,
      current: isActive === 'clientInquiryAdmin' ? true : false,
    },
    {
      name: 'EcomLeftMenuBarOwnInquiryManagement',
      href: '/admin/own-inquiry-admin',
      icon: ticketManagementIcon,
      permission: appPermissions.portal_owner_inquiry,
      current: isActive === 'ownInquiryAdmin' ? true : false,
    },
    {
      name: 'EcomLeftMenuBarRatingAgent',
      href: '/admin/danh-gia-agent',
      icon: ticketManagementIcon,
      permission: appPermissions.portal_rating,
      current: isActive === 'ratingAdmin' ? true : false,
    },
    {
      name: 'EcomLeftMenuBarLeaseAgreement',
      href: '/admin/lease-agreement',
      icon: myPropertiesIcon,
      permission: appPermissions.portal_la,
      current: isActive === 'leaseAgreement' ? true : false,
    },
    {
      name: 'EcomLeftMenuBarOwnerServiceAgreement',
      href: '/admin/owner-service-agreement',
      icon: myPropertiesIcon,
      permission: appPermissions.portal_osa,
      current: isActive === 'ownerServiceAgreement' ? true : false,
    },

    {
      name: 'EcomLeftMenuBarProjectManagement',
      href: '/admin/quan-ly-du-an',
      permission: appPermissions.portal_project,
      icon: dashboardIcon,
      current: isActive === 'projectManagement' ? true : false,
    },
    {
      name: 'EcomLeftMenuBarNewHomeManagement',
      href: '/admin/new-home',
      permission: appPermissions.newHomes,
      icon: dashboardIcon,
      current: isActive === 'newHome' ? true : false,
    },
    {
      name: 'EcomLeftMenuBarAmenities',
      href: '/admin/ameniti-management',
      icon: ticketManagementIcon,
      permission: appPermissions.portal_setting,
      current: isActive === 'amenityModule' ? true : false,
    },
    {
      name: 'EcomLeftMenuBarProductTypeManagement',
      href: '/admin/product-type',
      icon: productTypeIcon,
      permission: appPermissions.portal_listingcategory,
      current: isActive === 'productType' ? true : false,
    },
    // {
    //   name: 'EcomLeftMenuBarIamOwner',
    //   href: '/admin/i-am-owner',
    //   icon: ownerContentIcon,
    //   permission: appPermissions.portal_owner_content,
    //   current: isActive === 'iamOwner' ? true : false,
    // },
    {
      name: 'EcomLeftMenuBarBanner',
      href: '/admin/banner-management',
      icon: bannerIcon,
      permission: appPermissions.portal_banner,
      current: isActive === 'bannerManagement' ? true : false,
    },
    {
      name: 'EcomLeftMenuFindAgent',
      href: '/admin/find-agent',
      icon: bannerIcon,
      permission: appPermissions.portal_find_agent,
      current: isActive === 'agentManagement' ? true : false,
    },
    {
      name: 'EcomLeftMenuBarTopupPoint',
      href: '/admin/topup-points',
      icon: topupIcon,
      permission: appPermissions.portal_point,
      current: isActive === 'topupPoint' ? true : false,
    },
    {
      name: 'EcomLeftMenuBarPaymeConfig',
      href: '/admin/payme-config',
      icon: topupIcon,
      permission: appPermissions.paymeConfig,
      current: isActive === 'paymeConfig' ? true : false,
    },
    {
      name: 'EcomLeftMenuBarSystemFeeConfig',
      href: '/admin/system-fee-config',
      icon: topupIcon,
      permission: appPermissions.systemFeeConfig,
      current: isActive === 'systemFeeConfig' ? true : false,
    },
    {
      name: 'EcomLeftMenuBarTransaction',
      href: '/admin/transaction-management',
      icon: topupIcon,
      permission: appPermissions.portal_point,
      current: isActive === 'transactionAdmin' ? true : false,
    },
    {
      name: 'EcomLeftMenuPackage',
      href: '/admin/listing-package-management',
      icon: ticketManagementIcon,
      permission: appPermissions.portal_listing_package,
      current: isActive === 'listingPackageManagement' ? true : false,
    },
    {
      name: 'EcomLeftMenuPushPackage',
      href: '/admin/listing-push-package',
      icon: ticketManagementIcon,
      permission: appPermissions.portal_listing_push,
      current: isActive === 'listingPushPackage' ? true : false,
    },
    {
      name: 'EcomLeftMenuBarUserWallet',
      href: '/admin/user-wallet-management',
      icon: wallMoneyIcon,
      permission: appPermissions.portal_userwallet,
      current: isActive === 'userWallet' ? true : false,
    },
    {
      name: 'EcomLeftMenuBarOtpManagement',
      href: '/admin/otp-management',
      icon: otpIcon,
      permission: appPermissions.portal_otp,
      current: isActive === 'otpManagement' ? true : false,
    },
    {
      name: 'EcomLeftMenuBarKeyword',
      href: '/admin/keyword-management',
      icon: keywordIcon,
      permission: appPermissions.portal_keyword,
      current: isActive === 'keywordManagement' ? true : false,
    },
    {
      name: 'EcomLeftMenuBarMember',
      href: '/admin/quan-ly-thanh-vien',
      icon: myProfileIcon,
      permission: appPermissions.portal_member,
      current: isActive === 'member' ? true : false,
    },
    {
      name: 'EcomLeftMenuBarStaffManagement',
      href: '/admin/quan-ly-nhan-vien',
      permission: appPermissions.portal_staff,
      icon: myProfileIcon,
      current: isActive === 'staffManagement' ? true : false,
    },
    {
      name: 'EcomLeftMenuBarRoleManagement',
      href: '/admin/quan-ly-phan-quyen',
      permission: appPermissions.portal_roles,
      icon: ownerContentIcon,
      current: isActive === 'roleManagement' ? true : false,
    },
    {
      name: 'EcomLeftMenuBarMyProfile',
      href: '/my-profile',
      icon: myProfileIcon,
      permission: appPermissions.portal_profile,
      current: isActive === 'myProfile' ? true : false,
    },
    {
      name: 'EcomPageTsAnhCsTitlePage',
      href: '/admin/ts-and-cs-management',
      permission: appPermissions.portal_setting,
      icon: dashboardIcon,
      current: isActive === 'tsAndCsManagent' ? true : false,
    },
    {
      name: 'EcomPageTsAnhCsTitlePageMobile',
      href: '/admin/ts-and-cs-mobile',
      permission: appPermissions.portal_setting,
      icon: dashboardIcon,
      current: isActive === 'tsAndCsManagentMobile' ? true : false,
    },
    {
      name: 'EcomPageTermCondinPageWeb',
      href: '/admin/term-condition-managent',
      permission: appPermissions.portal_setting,
      icon: dashboardIcon,
      current: isActive === 'termCondinWeb' ? true : false,
    },
    {
      name: 'EcomPageTermCondinPageMobile',
      href: '/admin/term-condition-mobile',
      permission: appPermissions.portal_setting,
      icon: dashboardIcon,
      current: isActive === 'termCondinMobile' ? true : false,
    },
    {
      name: 'EcomLeftMenuBarReportBCT',
      href: '/admin/report-bct',
      icon: myPropertiesIcon,
      permission: appPermissions.portal_setting,
      current: isActive === 'reportBCT' ? true : false,
    },
    {
      name: 'EcomLeftMenuBarPrivacyPolicy',
      href: '/admin/privacy-policy-web',
      icon: myPropertiesIcon,
      permission: appPermissions.portal_setting,
      current: isActive === 'privacyPolicy' ? true : false,
    },
    {
      name: 'EcomLeftMenuBarPrivacyPolicyMobile',
      href: '/admin/privacy-policy-mobile',
      icon: myPropertiesIcon,
      permission: appPermissions.portal_setting,
      current: isActive === 'privacyPolicyMobile' ? true : false,
    },
    {
      name: 'EcomLeftMenuBarRegulationSettlement',
      href: '/admin/regulation-on-settlement-management',
      icon: myPropertiesIcon,
      permission: appPermissions.portal_setting,
      current: isActive === 'regulationSettlementWeb' ? true : false,
    },
    {
      name: 'EcomLeftMenuBarRegulationSettlementMobile',
      href: '/admin/regulation-on-settlement-mobile',
      icon: myPropertiesIcon,
      permission: appPermissions.portal_setting,
      current: isActive === 'regulationSettlementMobile' ? true : false,
    },
    {
      name: 'EcomLeftMenuBarSetting',
      href: '/admin/setting-management',
      icon: settingIcon,
      permission: appPermissions.portal_setting,
      current: isActive === 'settingManagement' ? true : false,
    },
  ];

  return (
    <div className="mt-20 flex w-full flex-auto flex-shrink-0 flex-col text-gray-800 antialiased">
      {userInfo?.type === UserTypeConstant.Customer && <UserTopup userInfo={userInfo} />}

      <ul className={`flex flex-col rounded-2xl bg-white py-2`}>
        {UserTypeConstant.Salesman.toLocaleUpperCase() === userInfo?.type?.toLocaleUpperCase()
          ? sidebarOptionsStaff.map(
              (item: any) =>
                checkPermissionModule(userInfo?.accesses, item.permission) && (
                  <li key={item.name} className="px-2">
                    <Link
                      onClick={() => setIsActive(item.name)}
                      href={item.href}
                      className={`${
                        item.current
                          ? 'rounded-3xl border-[1px] border-solid border-portal-primaryMainAdmin font-semibold text-portal-primaryMainAdmin'
                          : 'text-portal-black'
                      } group relative flex h-10 flex-row items-center rounded-2xl px-2 py-7`}
                    >
                      <Tooltip title={t(item.name)} trigger="contextMenu">
                        <label className="flex w-full cursor-pointer items-center truncate text-sm tracking-wide hover:text-portal-primaryMainAdmin">
                          <span className="mr-2"> {item.icon}</span>
                          {t(item.name)}
                        </label>
                      </Tooltip>
                    </Link>
                  </li>
                ),
            )
          : sidebarOptionsMember.map((item: any) => (
              <li key={item.name} className="px-2">
                <Link
                  onClick={() => setIsActive(item.name)}
                  href={item.href}
                  className={`${
                    item.current
                      ? 'rounded-3xl border-[1px] border-solid border-portal-primaryMainAdmin font-medium text-portal-primaryMainAdmin'
                      : 'text-portal-black'
                  } group relative flex h-11 flex-row items-center rounded-2xl px-3 py-8`}
                >
                  <Tooltip title={t(item.name)} trigger="contextMenu">
                    <label className="flex w-full items-center truncate text-sm tracking-wide hover:text-portal-primaryMainAdmin">
                      <span className="mr-2"> {item.icon}</span>
                      {t(item.name)}
                    </label>
                  </Tooltip>
                </Link>
              </li>
            ))}
      </ul>
    </div>
  );
};

export default SliderBarPortal;