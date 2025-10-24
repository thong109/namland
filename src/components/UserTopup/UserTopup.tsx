'use client';
import AvatarDefault from '@/assets/images/avarta-default.svg';
import { getEcomEcomListingMemberPackageGetMemberPackageProfile } from '@/ecom-sadec-api-client';
import useAllSettingLandingPage from '@/hooks/useAllSettingLandingPage';
import {
  ListingBasicIcon,
  ListingGoldIcon,
  PostListingIcon,
  listingPlantinumIcon,
  reloadIcon,
  wallMoneyIcon,
} from '@/libs/appComponents';
import { listAccountTypeEnum, listingType, packageListingEnum } from '@/libs/appconst';
import { formatNumber } from '@/libs/helper';
import AccountModel from '@/models/accountModel/accountModel';
import useGlobalStore from '@/stores/useGlobalStore';
import { Form } from 'antd';
import { useTranslations } from 'next-intl';
import { FC, useEffect, useState, useTransition } from 'react';
import BuyPackageModal from '../TopupModal/BuyPackageModal';
import BuyPushPackageModal from '../TopupModal/BuyPushPackage';
import TopupModal from '../TopupModal/TopupModal';

const typeModal = {
  Topup: 1,
  BuyPackage: 2,
  BuyPush: 3,
};

export interface Props {
  userInfo: AccountModel;
}

const UserTopup: FC<Props> = ({ userInfo }) => {
  const comm = useTranslations('Common');

  const [isPending, startTransition] = useTransition();

  const { userPackage, setUserPackage } = useGlobalStore();
  const { allSettingLandingPage } = useAllSettingLandingPage();
  const [isTopupOpen, setIsTopupOpen] = useState(false);
  const [isBuyPackageOpen, setIsBuyPackageOpen] = useState(false);
  const [isBuyPushPackageOpen, setIsBuyPushPackageOpen] = useState(false);
  const [allowTopup, setAllowTopup] = useState<boolean>(true);

  useEffect(() => {
    const allowTopup = allSettingLandingPage?.find((item) => item.key === 'ZONE_TOP_UP');
    console.log(allowTopup);
    if (allowTopup !== undefined) {
      setAllowTopup(allowTopup?.value);
    }
  }, [allSettingLandingPage]);

  const [formRef] = Form.useForm();
  const handleOpenModal = (typeShow) => {
    if (userInfo) {
      switch (typeShow) {
        case typeModal.Topup:
          formRef.setFieldValue('totalAmount', 0);
          setIsTopupOpen(true);
          break;
        case typeModal.BuyPackage:
          setIsBuyPackageOpen(true);
          break;
        case typeModal.BuyPush:
          setIsBuyPushPackageOpen(true);
          break;
      }
    }
  };

  const updateProfilePackage = async () => {
    startTransition(async () => {
      const resUserPackage = await getEcomEcomListingMemberPackageGetMemberPackageProfile({
        authorization: null,
      });
      setUserPackage((resUserPackage as any)?.data);
    });
  };

  const handleCloseModal = (typeShow) => {
    switch (typeShow) {
      case typeModal.Topup:
        setIsTopupOpen(false);
        break;
      case typeModal.BuyPackage:
        setIsBuyPackageOpen(false);
        break;
      case typeModal.BuyPush:
        setIsBuyPushPackageOpen(false);
        break;
    }
  };

  return (
    <>
      <div className="mb-2 grid h-fit grid-cols-12 justify-items-center rounded-2xl bg-[rgba(255,255,255,0.82)] py-4">
        <div className="col-span-12 grid grid-cols-12 items-start gap-x-2">
          <div className="col-span-4 flex justify-center">
            <div className="h-[65px] w-[65px] rounded-full bg-white">
              <img
                className="h-[60px] w-[60px] rounded-full object-cover"
                alt="avatar"
                src={userInfo?.avatarUrl ?? AvatarDefault?.src}
              />
            </div>
          </div>
          <div className="col-span-8 grid grid-cols-1">
            <div className="col-span-1 font-bold">{userInfo?.fullName}</div>
            <div className="col-span-1 mt-2 flex items-center py-1 text-sm">
              {isPending ? (
                <span className="mr-2 animate-spin">{reloadIcon}</span>
              ) : (
                <button onClick={updateProfilePackage} className="mr-2">
                  {wallMoneyIcon}
                </button>
              )}
              {comm('MemberPoint', {
                totalPoint: formatNumber(userPackage?.totalPoint),
              })}
            </div>
            {/*  Hidden Top Up */}
            <div className="col-span-1 mb-2">
              {userInfo?.accountType === listAccountTypeEnum.Owner_broker && allowTopup && (
                <button
                  onClick={() => handleOpenModal(typeModal.Topup)}
                  className="rounded-md bg-portal-primaryMainAdmin px-3 py-1 text-sm font-medium text-white"
                >
                  {comm('Topup')}
                </button>
              )}
            </div>

            {/* number for sell */}
            <div className="col-span-1 mt-1 flex items-center py-1 text-sm font-bold">
              <span className="mr-2">{PostListingIcon}</span>
              {comm('TotalPostForSell', {
                total: formatNumber(
                  userPackage?.memberPackages
                    .filter((obj) => obj.type === listingType.sale)
                    .reduce((sum, obj) => sum + obj.numberOfPost, 0),
                ),
              })}
            </div>
            <div className="col-span-1 my-1 flex items-center text-sm">
              <span className="ml-3 mr-2">{listingPlantinumIcon}</span>
              {comm('MemberPost', {
                total: formatNumber(
                  userPackage?.memberPackages.find(
                    (item) =>
                      item?.packageType === packageListingEnum.Platinum &&
                      item?.type == listingType.sale,
                  )?.numberOfPost ?? 0,
                ),
              })}
            </div>
            <div className="col-span-1 flex items-center text-sm">
              <span className="mb-1 ml-3 mr-2">{ListingGoldIcon}</span>
              {comm('MemberPost', {
                total: formatNumber(
                  userPackage?.memberPackages.find(
                    (item) =>
                      item?.packageType === packageListingEnum.Gold &&
                      item?.type == listingType.sale,
                  )?.numberOfPost ?? 0,
                ),
              })}
            </div>
            <div className="col-span-1 flex items-center text-sm">
              <span className="mb-1 ml-3 mr-2">{ListingBasicIcon}</span>
              {comm('MemberPost', {
                total: formatNumber(
                  userPackage?.memberPackages.find(
                    (item) =>
                      item?.packageType === packageListingEnum.Basic &&
                      item?.type == listingType.sale,
                  )?.numberOfPost ?? 0,
                ),
              })}
            </div>

            {/* number for rent */}
            <div className="col-span-1 mt-1 flex items-center py-1 text-sm font-bold">
              <span className="mr-2">{PostListingIcon}</span>
              {comm('TotalPostForRent', {
                total: formatNumber(
                  userPackage?.memberPackages
                    .filter((obj) => obj.type === listingType.rent)
                    .reduce((sum, obj) => sum + obj.numberOfPost, 0),
                ),
              })}
            </div>
            <div className="col-span-1 my-1 flex items-center text-sm">
              <span className="ml-3 mr-2">{listingPlantinumIcon}</span>
              {comm('MemberPost', {
                total: formatNumber(
                  userPackage?.memberPackages.find(
                    (item) =>
                      item?.packageType === packageListingEnum.Platinum &&
                      item?.type == listingType.rent,
                  )?.numberOfPost ?? 0,
                ),
              })}
            </div>
            <div className="col-span-1 flex items-center text-sm">
              <span className="mb-1 ml-3 mr-2">{ListingGoldIcon}</span>
              {comm('MemberPost', {
                total: formatNumber(
                  userPackage?.memberPackages.find(
                    (item) =>
                      item?.packageType === packageListingEnum.Gold &&
                      item?.type == listingType.rent,
                  )?.numberOfPost ?? 0,
                ),
              })}
            </div>
            <div className="col-span-1 flex items-center text-sm">
              <span className="mb-1 ml-3 mr-2">{ListingBasicIcon}</span>
              {comm('MemberPost', {
                total: formatNumber(
                  userPackage?.memberPackages.find(
                    (item) =>
                      item?.packageType === packageListingEnum.Basic &&
                      item?.type == listingType.rent,
                  )?.numberOfPost ?? 0,
                ),
              })}
            </div>
            <div className="col-span-1 mb-2">
              {userInfo?.accountType === listAccountTypeEnum.Owner_broker && (
                <button
                  onClick={() => handleOpenModal(typeModal.BuyPackage)}
                  className="rounded-md bg-portal-primaryMainAdmin px-3 py-1 text-sm font-medium text-white"
                >
                  {comm('BuyPackage')}
                </button>
              )}
            </div>

            {/* number of push */}
            <div className="col-span-1 mt-1 flex items-center py-1 text-sm font-bold">
              <span className="mr-2">{PostListingIcon}</span>
              {comm('TotalPushSale', {
                total: formatNumber(
                  userPackage?.memberPackages
                    .filter((obj) => obj.type === listingType.sale)
                    .reduce((sum, obj) => sum + obj.numberOfPush, 0),
                ),
              })}
            </div>
            <div className="col-span-1 my-1 flex items-center text-sm">
              <span className="ml-3 mr-2">{listingPlantinumIcon}</span>
              {comm('TurnPush', {
                total: formatNumber(
                  userPackage?.memberPackages.find(
                    (item) =>
                      item?.packageType === packageListingEnum.Platinum &&
                      item?.type == listingType.sale,
                  )?.numberOfPush ?? 0,
                ),
              })}
            </div>
            <div className="col-span-1 flex items-center text-sm">
              <span className="mb-1 ml-3 mr-2">{ListingGoldIcon}</span>
              {comm('TurnPush', {
                total: formatNumber(
                  userPackage?.memberPackages.find(
                    (item) =>
                      item?.packageType === packageListingEnum.Gold &&
                      item?.type == listingType.sale,
                  )?.numberOfPush ?? 0,
                ),
              })}
            </div>
            <div className="col-span-1 flex items-center text-sm">
              <span className="mb-1 ml-3 mr-2">{ListingBasicIcon}</span>
              {comm('TurnPush', {
                total: formatNumber(
                  userPackage?.memberPackages.find(
                    (item) =>
                      item?.packageType === packageListingEnum.Basic &&
                      item?.type == listingType.sale,
                  )?.numberOfPush ?? 0,
                ),
              })}
            </div>
            <div className="col-span-1 mt-1 flex items-center py-1 text-sm font-bold">
              <span className="mr-2">{PostListingIcon}</span>
              {comm('TotalPushRent', {
                total: formatNumber(
                  userPackage?.memberPackages
                    .filter((obj) => obj.type === listingType.rent)
                    .reduce((sum, obj) => sum + obj.numberOfPush, 0),
                ),
              })}
            </div>
            <div className="col-span-1 my-1 flex items-center text-sm">
              <span className="ml-3 mr-2">{listingPlantinumIcon}</span>
              {comm('TurnPush', {
                total: formatNumber(
                  userPackage?.memberPackages.find(
                    (item) =>
                      item?.packageType === packageListingEnum.Platinum &&
                      item?.type == listingType.rent,
                  )?.numberOfPush ?? 0,
                ),
              })}
            </div>
            <div className="col-span-1 flex items-center text-sm">
              <span className="mb-1 ml-3 mr-2">{ListingGoldIcon}</span>
              {comm('TurnPush', {
                total: formatNumber(
                  userPackage?.memberPackages.find(
                    (item) =>
                      item?.packageType === packageListingEnum.Gold &&
                      item?.type == listingType.rent,
                  )?.numberOfPush ?? 0,
                ),
              })}
            </div>
            <div className="col-span-1 flex items-center text-sm">
              <span className="mb-1 ml-3 mr-2">{ListingBasicIcon}</span>
              {comm('TurnPush', {
                total: formatNumber(
                  userPackage?.memberPackages.find(
                    (item) =>
                      item?.packageType === packageListingEnum.Basic &&
                      item?.type == listingType.rent,
                  )?.numberOfPush ?? 0,
                ),
              })}
            </div>
            <div className="col-span-1 mb-2">
              {userInfo?.accountType === listAccountTypeEnum.Owner_broker && (
                <button
                  className="rounded-md bg-portal-primaryMainAdmin px-3 py-1 text-sm font-medium text-white"
                  onClick={() => handleOpenModal(typeModal.BuyPush)}
                >
                  {comm('BuyPush')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <TopupModal
        isVisible={isTopupOpen}
        closeModal={() => handleCloseModal(typeModal.Topup)}
        formRef={formRef}
      />

      <BuyPushPackageModal
        isVisible={isBuyPushPackageOpen}
        closeModal={() => handleCloseModal(typeModal.BuyPush)}
      />
      <BuyPackageModal
        isVisible={isBuyPackageOpen}
        closeModal={() => handleCloseModal(typeModal.BuyPackage)}
      />
    </>
  );
};

export default UserTopup;
