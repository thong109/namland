import projectApiService from '@/apiServices/externalApiServices/projectApiService';
import propertyApiService from '@/apiServices/externalApiServices/propertyApiService';
import DetailPropertyComponent from '@/app/[locale]/property/[id]/(components)/DetailPropertyComponent';
import ProjectPropertyComponent from '@/app/[locale]/property/[id]/(components)/ProjectPropertyComponent';
import SwiperPropertiesComponent from '@/app/[locale]/property/[id]/(components)/SwiperPropertiesComponent';
import IconBath from '@/assets/icon/icon-bath.svg';
import IconBed from '@/assets/icon/icon-bed.svg';
import IconSquare from '@/assets/icon/icon-square.svg';
import IconImg from '@/assets/icon/img-icon.svg';
import IconPdf from '@/assets/icon/pdf-icon.svg';
import GoogleMapComponent from '@/components/GoogleMap';
import AmenitiesData from '@/libs/appIconAmenities';
import { listingType, priceType } from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import { ProjectDetailModel } from '@/models/projectModel/projectDetailModel';
import { PropertyStatus } from '@/models/propertyModel/propertyDetailModel';
import InputBorder from '@/shared/InputBoder';
import { Form, Input, Spin } from 'antd';
import Modal from 'antd/es/modal';
import _ from 'lodash';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { isDesktop } from 'react-device-detect';
import AdsBannerComponent from '../AdsBannerComponent/AdsBannerComponent';
import BtnFavorist from '../Button/FavoriteButton/BtnFavorist';
import BtnShare from '../Button/ShareButton/BtnShare';
import Label from '../Label';
import NumberFormatPrice from '../NumberFormatPrice/NumberFormatPrice';
import './style.scss';

export interface IProps {
  role: any;
  visible: boolean;
  idProperty: any;
  handleOk: (id, status, type) => void;
  handleCanncel: (id) => void;
}

const typeButton = {
  sendToApprove: 1,
  approve: 2,
  reject: 3,
};
const { TextArea } = Input;

const PreviewProperty = ({ visible, idProperty, handleOk, handleCanncel, role }: any) => {
  const locale = useLocale();
  const t = useTranslations('webLabel');
  const modal = useTranslations('Modal');
  const [viewMore, setViewMore] = useState(false);
  const [property, setProperty] = useState<any>();
  const [listAmetittes, setListAmenities] = useState<any>([]);
  const [project, setProject] = useState<ProjectDetailModel>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (visible) {
      getInfoListting();
    }
  }, [visible]);

  const getProjectById = async (id) => {
    await projectApiService
      .getProjectById({ id: id, lang: locale })
      .then((response) => {
        if (response) {
          setProject(response);
        }
      })
      .then(() => setLoading(false));
  };

  const getInfoListting = async () => {
    if (idProperty) {
      const reponse = await propertyApiService.getPreviewListingById(idProperty);
      setProperty(reponse.data);

      if (reponse.data?.amenities) {
        let amenitiesClone = [...reponse.data?.amenities] as any;
        let dataAmenities = _.map(amenitiesClone, (item) => {
          let find = _.find(AmenitiesData, (e) => {
            return e.code == item.code;
          });
          item.icon = find.icon;
          return item;
        });
        setListAmenities(dataAmenities);
        if (reponse.data?.project && reponse.data?.project?.id) {
          getProjectById(reponse.data?.project?.id);
        }
      }
    }
  };

  const handleBack = () => {
    handleCanncel(property.id);
  };

  const handleAction = (type: number) => {
    if (type === typeButton.sendToApprove) {
      handleOk(property.id, property?.status, typeButton.sendToApprove);
    }
    if (type === typeButton.approve) {
      handleOk(property.id, property?.status, typeButton.approve);
    }
    if (type === typeButton.reject) {
      handleOk(property.id, property?.status, typeButton.reject);
    }
  };

  const renderTienIch = () => {
    return (
      <div className="flex">
        <div className="flex items-center justify-center text-[8px] lg:text-[14px]">
          <span className="mr-1 flex justify-end">
            <Image alt="bed" src={IconBed}></Image>
          </span>
          <span className="pl-1 text-xs font-bold text-neutral-500 dark:text-neutral-400 lg:px-2 lg:pl-2">
            {property?.bedrooms} {t('EcomPropertyDetailPageDetailBedrooms')}
          </span>
        </div>
        {/* ---- */}
        <div className="ml-1 flex items-center justify-center text-[8px] lg:ml-2 lg:text-[14px]">
          <span className="mr-1 flex justify-end">
            <Image alt="bed" src={IconBath}></Image>
          </span>
          <span className="pl-1 text-xs font-bold text-neutral-500 dark:text-neutral-400 lg:px-2 lg:pl-2">
            {property?.bathrooms} {t('EcomPropertyDetailPageDetailBathrooms')}
          </span>
        </div>
        {/* ---- */}
        <div className="ml-1 flex items-center justify-center text-[8px] lg:ml-2 lg:text-[14px]">
          <span className="flex justify-end">
            <Image alt="bed" src={IconSquare}></Image>
          </span>
          <span className="pl-1 text-xs font-bold text-neutral-500 dark:text-neutral-400 lg:px-2 lg:pl-2">
            {property?.size} m<sup>2</sup>
          </span>
        </div>
      </div>
    );
  };
  return (
    <Modal
      wrapClassName="custom-modal-preview"
      width="100%"
      style={{ top: 20 }}
      open={visible}
      onOk={handleOk}
      onCancel={handleBack}
      closeIcon={true}
      footer={[
        <div className="flex justify-center">
          <button
            key="back"
            className="mr-1 border-x border-y border-[#404040] bg-portal-card px-10 py-3"
            onClick={handleBack}
          >
            <label>{t('goBack')}</label>
          </button>
          {property?.status === PropertyStatus.Draft && (
            <button
              key="submit"
              className="ml-1 border-x border-y !border-portal-primaryLiving !bg-portal-primaryLiving px-10 py-3 !text-white"
              onClick={() => handleAction(typeButton.sendToApprove)}
            >
              <label>{property?.status === PropertyStatus.Draft && modal('sendApprove')}</label>
            </button>
          )}
          {property?.status === PropertyStatus.WaitingForApproval &&
            role === UserTypeConstant.Salesman && (
              <>
                <button
                  key="submit"
                  className="ml-1 border-x border-y !border-[#1E854A] !bg-[#BCF0D2] px-10 py-3 !text-[#1E854A]"
                  onClick={() => handleAction(typeButton.approve)}
                >
                  <label>
                    {property?.status === PropertyStatus.WaitingForApproval && modal('approve')}
                  </label>
                </button>

                <button
                  key="submit"
                  className="!border-portal-primaryLiving-4 !bg-portal-primaryLiving-1 !text-portal-primaryLiving-2 ml-1 border-x border-y px-10 py-3"
                  onClick={() => handleAction(typeButton.reject)}
                >
                  <label>
                    {property?.status === PropertyStatus.WaitingForApproval && modal('reject')}
                  </label>
                </button>
              </>
            )}
        </div>,
      ]}
    >
      <>
        {isDesktop ? (
          <>
            {/* destop */}
            <div className="relative p-0">
              <div className="container mt-[20px] pb-[100px] text-portal-gray">
                <div className="grid grid-cols-11">
                  <div className={`relative col-span-8 pr-2`}>
                    <div className="min-h-[900px]">
                      <div className="">
                        {property?.imageUrls && (
                          <SwiperPropertiesComponent
                            listImage={property?.imageUrls}
                          ></SwiperPropertiesComponent>
                        )}
                      </div>
                      <div className="mt-[30px]">
                        <div className="flex w-full justify-between">
                          <div className="flex-1">
                            <span className="text-three-line text-2xl font-semibold capitalize text-primaryColor">
                              {property?.title}
                            </span>
                            <div className="mt-[8px] text-[14px]">
                              {property?.location?.formattedAddress}
                            </div>
                            <div className="mt-[10px]">{renderTienIch()}</div>
                          </div>
                          <div className="relative flex flex-col items-end">
                            <div className="flex">
                              <div className="z-10 mr-[30px] flex items-center">
                                <BtnShare classNameBtn="!bg-[#ffffff]" />
                                {t('EcomPropertyDetailPageDetailShare')}
                              </div>
                              <div className="flex items-center">
                                <BtnFavorist
                                  id={property?.id}
                                  isLiked={property?.isFavourite}
                                  className="mr-2"
                                  fillColor="#ffffff"
                                />
                                {t('EcomPropertyDetailPageDetailSave')}
                              </div>
                            </div>

                            <div className="z-0 mt-[14px] text-[24px] font-semibold !text-[#FFD14B]">
                              <NumberFormatPrice
                                value={
                                  locale == 'vi'
                                    ? property?.type == listingType.sale
                                      ? property?.priceVnd
                                      : property?.displayPriceType === priceType.month
                                        ? property?.priceVnd
                                        : property?.priceVndM2
                                    : property?.type == listingType.sale
                                      ? property?.priceUsd
                                      : property?.displayPriceType === priceType.month
                                        ? property?.priceUsd
                                        : property?.priceUsdM2
                                }
                                className=""
                              ></NumberFormatPrice>

                              {property?.type == listingType.sale ? (
                                ''
                              ) : property?.displayPriceType === priceType.month ? (
                                t('/mo')
                              ) : (
                                <>
                                  {` /m`}
                                  <sup>2</sup>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Content */}
                  </div>

                  <div className="col-span-3 pl-2 transition-transform duration-300 lg:hover:scale-105">
                    <AdsBannerComponent className="sm:h-[900px]" />
                  </div>
                </div>

                <div className="grid grid-cols-11">
                  <div className="col-span-8 pr-2">
                    <div className="mt-[20px]">
                      <div className="flex h-[51px] items-center rounded bg-[#DEE3ED] px-[18px]">
                        <span className="font-semibold uppercase text-primaryColor">
                          {t('EcomPropertyDetailPageDetailDescription')}
                        </span>
                      </div>
                      <div className="rounded-b border-b border-l border-r bg-white p-[30px] shadow-sm">
                        <div
                          className="text-portal-gray"
                          style={{ whiteSpace: 'pre-wrap' }}
                          dangerouslySetInnerHTML={{
                            __html: property?.description,
                          }}
                        ></div>
                        <div
                          className={`mt-[30px] ${
                            property?.saleContracts.length || property?.certificateOfTitles.length
                              ? ''
                              : 'hidden'
                          }`}
                        >
                          <div className="font-semibold text-primaryColor">
                            {t('EcomPropertyDetailPageDetailDocuments')}
                          </div>
                          <div className="mt-[24px] flex text-[14px]">
                            {property?.saleContracts && property?.saleContracts.length ? (
                              <div className="mr-[70px] flex">
                                <div className="mr-2 text-[12px] font-semibold uppercase text-portal-primaryLiving">
                                  {t('EcomPropertyDetailPageDetailSellAndPurchaseAgreement')}
                                </div>
                                <div className="flex flex-col">
                                  {property?.saleContracts && property?.saleContracts.length
                                    ? _.map(property?.saleContracts, (item, index) => {
                                        return (
                                          <div
                                            key={index + 1}
                                            className="flex cursor-pointer items-center"
                                          >
                                            <Image
                                              alt=""
                                              src={
                                                item.mimeType.includes('image') ? IconImg : IconPdf
                                              }
                                              width={40}
                                              height={40}
                                              className="mr-2 h-[20px] w-[20px]"
                                            />
                                            {item?.name}
                                          </div>
                                        );
                                      })
                                    : t('noAttachment')}
                                </div>
                              </div>
                            ) : null}
                            {property?.certificateOfTitles &&
                            property?.certificateOfTitles.length ? (
                              <div className="flex">
                                <div className="mr-2 text-[12px] font-semibold uppercase text-portal-primaryLiving">
                                  {t('EcomPropertyDetailPageDetailPinkBook')}
                                </div>
                                <div className="flex flex-col">
                                  {property?.certificateOfTitles &&
                                  property?.certificateOfTitles.length
                                    ? _.map(property?.certificateOfTitles, (item, index) => {
                                        return (
                                          <div
                                            key={index + 1}
                                            className="flex cursor-pointer items-center"
                                          >
                                            <Image
                                              alt=""
                                              src={
                                                item.mimeType.includes('image') ? IconImg : IconPdf
                                              }
                                              width={40}
                                              height={40}
                                              className="mr-2 h-[20px] w-[20px]"
                                            />
                                            {item?.name}
                                          </div>
                                        );
                                      })
                                    : t('noAttachment')}
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <div className="mt-[20px] block">
                        <div className="flex h-[51px] items-center rounded-t bg-[#DEE3ED] px-[18px]">
                          <div className="font-semibold uppercase text-primaryColor">
                            {t('EcomPropertyDetailPageDetailCharacteristic')}
                          </div>
                        </div>
                        <div className="relative rounded-b border-b border-l border-r bg-white p-[20px] shadow-sm">
                          <DetailPropertyComponent data={property}></DetailPropertyComponent>
                        </div>
                      </div>
                      <div>
                        <div className={`relative mt-[20px] ${viewMore ? '' : 'h-[300px]'}`}>
                          <div className="flex h-[51px] items-center rounded-t bg-[#DEE3ED] px-[18px]">
                            <div className="font-semibold uppercase text-primaryColor">
                              {t('EcomPropertyDetailPageAmenitiesAmenities')}
                            </div>
                          </div>
                          <div className="grid grid-cols-4 rounded-b border-b border-l border-r bg-white p-[30px] shadow-sm">
                            {listAmetittes && listAmetittes.length ? (
                              listAmetittes.map((item, index) => (
                                <div
                                  key={item.id}
                                  className={`${index > 3 ? 'mt-[20px]' : ''} flex items-center`}
                                >
                                  <div
                                    className={`mr-[10px] flex h-[35px] w-[35px] items-center justify-center rounded-full bg-[#F6F8F9]`}
                                  >
                                    <Image src={item.icon} alt="" />
                                  </div>{' '}
                                  <span className="text-[14px]">{item.name}</span>
                                </div>
                              ))
                            ) : (
                              <>{t('noData')}</>
                            )}
                          </div>
                          {!viewMore && (
                            <div className="z-1000 via-76% absolute bottom-0 flex h-[250px] w-full items-end justify-center rounded-b bg-gradient-to-b from-[rgba(1,1,1,0.0)] from-10% via-[rgba(1,1,1,0.5)] to-[rgba(1,1,1,0.7)] to-100% pb-5">
                              <button
                                className="btn-primary focus:shadow-outline h-[55px] max-w-[200px] focus:outline-none"
                                onClick={() => {
                                  setViewMore(true);
                                }}
                              >
                                {t('EcomPropertyDetailPageProjectViewMore')}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* <div
                        className={`mt-[20px]  ${
                          viewMore ? 'block' : 'hidden'
                        } `}
                      >
                        <div className="bg-[#DEE3ED] h-[51px] rounded-t  px-[18px]  flex items-center">
                          <div className="text-primaryColor font-semibold uppercase">
                            {t('EcomPropertyDetailPageTourTour')}
                          </div>
                        </div>
                      </div> */}
                      {/* <div
                        className={`mt-[20px]  ${
                          viewMore &&
                          (property?.videoLink || property?.virtualTour)
                            ? 'block'
                            : 'hidden'
                        } `}
                      >
                        <div className="bg-[#DEE3ED] h-[51px] rounded-t  px-[18px]  flex items-center">
                          <div className="text-primaryColor font-semibold uppercase">
                            {t('EcomPropertyDetailPageVideoVideo')}
                          </div>
                        </div>

                        <div className="p-[20px]  border-b border-l border-r rounded-b bg-white shadow-sm">
                          {property && property?.id ? (
                            <VideoComponent data={property} />
                          ) : null}
                        </div>
                      </div> */}
                      {/* <div
                        className={`mt-[20px]  ${
                          viewMore ? 'block' : 'hidden'
                        } `}
                      >
                        <div className="bg-[#DEE3ED] h-[51px] rounded-t  px-[18px]  flex items-center">
                          <div className="text-primaryColor font-semibold uppercase">
                            {t('EcomPropertyDetailPageNearByNearBy')}
                          </div>
                        </div>
                      </div> */}

                      {/* <div
                        className={`mt-[20px]  ${
                          viewMore ? 'block' : 'hidden'
                        } `}
                      >
                        <div className="bg-[#DEE3ED] h-[51px] rounded-t  px-[18px]  flex items-center">
                          <div className="text-primaryColor font-semibold uppercase">
                            {t('EcomPropertyDetailPageReviewReview')}
                          </div>
                        </div>
                      </div> */}

                      <div className={`relative mt-[20px] ${viewMore ? 'block' : 'hidden'}`}>
                        <div className="flex h-[51px] items-center rounded-t bg-[#DEE3ED] px-[18px]">
                          <div className="font-semibold uppercase text-primaryColor">
                            {t('EcomPropertyDetailPageLocationLocation')}
                          </div>
                        </div>
                        <div
                          className={`w-full ${
                            viewMore ? 'h-[550px]' : 'h-[430px]'
                          } relative rounded-b border bg-white p-[20px]`}
                        >
                          <GoogleMapComponent
                            initCenter={{
                              lat: property?.location?.location?.lat,
                              lng: property?.location?.location?.lng,
                            }}
                            isMarker
                            listMarker={[
                              {
                                lat: property?.location?.location?.lat,
                                lng: property?.location?.location?.lng,
                              },
                            ]}
                          ></GoogleMapComponent>
                        </div>
                      </div>

                      {loading ? (
                        <div className="mt-[20px]">
                          <Spin />
                        </div>
                      ) : (
                        <div className="mt-[20px]">
                          <ProjectPropertyComponent data={project} number={4} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-span-3 pl-2">
                    <div className="mt-[20px] rounded-lg border border-neutral-100 px-[30px] py-5 shadow-md">
                      <div className="flex cursor-pointer items-center">
                        <div className="flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full border-2 border-yellow-100">
                          <img
                            src={property?.userInfo?.avatarUrl}
                            loading="lazy"
                            alt=""
                            width={70}
                            height={70}
                            className="h-[70px] w-[70px] rounded-full"
                          />
                        </div>
                        <div className="ml-2">
                          <div className="font-semibold text-primaryColor">
                            {property?.userInfo?.fullName}
                          </div>
                          <div>09xxxxxxx</div>
                        </div>
                      </div>
                      <Form autoComplete="off">
                        <div>
                          <Form.Item name={'name'}>
                            <InputBorder
                              label={t('EcomPropertyDetailPageTicketName')}
                              type={'text'}
                              name={'name'}
                            ></InputBorder>
                          </Form.Item>
                        </div>
                        <div>
                          <Form.Item name={'email'}>
                            <InputBorder
                              label={t('EcomPropertyDetailPageTicketEmail')}
                              type={'text'}
                              name={'email'}
                            ></InputBorder>
                          </Form.Item>
                        </div>
                        <div>
                          <Form.Item name={'phone'}>
                            <InputBorder
                              label={t('EcomPropertyDetailPageTicketPhone')}
                              type={'tel'}
                              name={'phone'}
                            ></InputBorder>
                          </Form.Item>
                        </div>
                        <div>
                          <label className="block">
                            <div>
                              <Label className="text-primaryColor">
                                {t('EcomPropertyDetailPageTicketMessage')}
                              </Label>
                            </div>
                            <Form.Item className="area-custom" name={'message'}>
                              <TextArea
                                autoSize={{ minRows: 1, maxRows: 6 }}
                                name="message"
                                autoComplete="nope"
                                className="focus:boder-0 mt-1 rounded-none border-0 border-b-2 !bg-transparent focus:!border-portal-primaryLiving focus:ring-0"
                              />
                            </Form.Item>
                          </label>
                        </div>
                        <div className="mt-3">
                          <div className="mb-4 flex">
                            <input
                              id="policy-checkbox"
                              type="checkbox"
                              className="checkbox-primary mt-[2px] focus:ring-0 focus:ring-offset-0"
                            />
                            <label
                              htmlFor="policy-checkbox"
                              className="ml-2 text-sm font-medium dark:text-gray-300"
                            >
                              <span>
                                {t(
                                  'EcomPropertyDetailPageTicketBySubmittingThisFormIAgreeToTermOfUse',
                                )}
                                <a className="underline" target="_blank">
                                  {t('termOfUse')}
                                </a>
                              </span>
                            </label>
                          </div>
                        </div>
                        <div className="mt-[30px]">
                          <button className="btn-primary focus:shadow-outline ] mr-2 uppercase focus:outline-none disabled:!opacity-70 disabled:hover:!bg-[#FFD14B]">
                            {t('EcomPropertyDetailPageTicketLeaveAnInquiry')}
                          </button>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* mobile */}
            <div className="relative p-0 py-[15px]">
              <div className="">
                <div className="">
                  <div className="flex">
                    <div>
                      <h1 className="text-three-line text-xl font-semibold capitalize text-primaryColor">
                        {property?.title}
                      </h1>
                      <div className="mt-[8px] text-[10px]">
                        {property?.location?.formattedAddress}
                      </div>
                      <div className="flex justify-between">
                        <div className="">{renderTienIch()}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-[5px] flex justify-end font-semibold !text-[#FFD14B] text-[18`px]">
                  <NumberFormatPrice
                    value={locale == 'vi' ? property?.priceVnd : property?.priceUsd}
                    className=""
                  ></NumberFormatPrice>

                  {property?.type == 1 ? '' : t('/mo')}
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex">
                    <div className="z-10 mr-[16px] flex items-center text-[9px]">
                      <BtnShare classNameBtn="!bg-[#ffffff]" />
                      {t('EcomPropertyDetailPageDetailShare')}
                    </div>
                    <div className="flex items-center text-[9px]">
                      <BtnFavorist
                        id={property?.id}
                        isLiked={property?.isFavourite}
                        className="mr-2"
                        fillColor="#ffffff"
                      />
                      {t('EcomPropertyDetailPageDetailSave')}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="mt-[10px]">
                  {property?.imageUrls && (
                    <SwiperPropertiesComponent
                      listImage={property?.imageUrls}
                    ></SwiperPropertiesComponent>
                  )}
                </div>
              </div>
              <div className="relative mt-[10px]">
                <div className="flex h-[51px] items-center rounded bg-transparent px-[18px]">
                  <span className="font-semibold uppercase text-primaryColor">
                    {t('EcomPropertyDetailPageDetailDescription')}
                  </span>
                </div>
                <div className="rounded border bg-white p-[15px] shadow-sm">
                  <div
                    className="text-portal-gray"
                    style={{ whiteSpace: 'pre-wrap' }}
                    dangerouslySetInnerHTML={{
                      __html: property?.description,
                    }}
                  >
                    {/* {property?.description} */}
                  </div>
                  <div
                    className={`mt-[10px] ${
                      property?.saleContracts.length || property?.certificateOfTitles.length
                        ? ''
                        : 'hidden'
                    }`}
                  >
                    <div className="font-semibold text-primaryColor">
                      {t('EcomPropertyDetailPageDetailDocuments')}
                    </div>
                    <div className="mt-[10px] text-[14px]">
                      {property?.saleContracts.length ? (
                        <div className="flex">
                          <div className="mr-2 text-[12px] font-semibold uppercase text-portal-primaryLiving">
                            {t('EcomPropertyListingDetailPageGalleryVideosContract')}
                          </div>
                          <div className="flex flex-col">
                            {property?.saleContracts && property?.saleContracts.length
                              ? _.map(property?.saleContracts, (item, index) => {
                                  return (
                                    <div
                                      key={index + 1}
                                      className="flex cursor-pointer items-center"
                                    >
                                      <Image
                                        alt=""
                                        src={item.mimeType.includes('image') ? IconImg : IconPdf}
                                        width={40}
                                        height={40}
                                        className="mr-2 h-[20px] w-[20px]"
                                      />
                                      {item?.name}
                                    </div>
                                  );
                                })
                              : t('noAttachment')}
                          </div>
                        </div>
                      ) : null}
                      {property?.certificateOfTitles.length ? (
                        <div className="flex">
                          <div className="mr-2 text-[12px] font-semibold uppercase text-portal-primaryLiving">
                            {t('EcomPropertyListingDetailPageGalleryVideosPinkBook')}
                          </div>
                          <div className="flex flex-col">
                            {property?.certificateOfTitles && property?.certificateOfTitles.length
                              ? _.map(property?.certificateOfTitles, (item, index) => {
                                  return (
                                    <div
                                      key={index + 1}
                                      className="flex cursor-pointer items-center"
                                    >
                                      <Image
                                        alt=""
                                        src={item.mimeType.includes('image') ? IconImg : IconPdf}
                                        width={40}
                                        height={40}
                                        className="mr-2 h-[20px] w-[20px]"
                                      />
                                      {item?.name}
                                    </div>
                                  );
                                })
                              : t('noAttachment')}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative mt-[10px]">
                <div className="flex h-[51px] items-center rounded bg-transparent px-[18px]">
                  <span className="font-semibold uppercase text-primaryColor">
                    {t('EcomPropertyDetailPageDetailCharacteristic')}
                  </span>
                </div>
                <div className="rounded border bg-white p-[15px] shadow-sm">
                  <div className="relative">
                    <DetailPropertyComponent data={property}></DetailPropertyComponent>
                  </div>
                </div>
                {!viewMore && (
                  <div className="z-1000 via-76% absolute bottom-0 flex h-[200px] w-full items-center justify-center rounded-b bg-gradient-to-b from-[rgba(1,1,1,0.0)] from-10% via-[rgba(1,1,1,0.5)] to-[rgba(1,1,1,0.7)] to-100%">
                    <button
                      className="btn-primary focus:shadow-outline h-[55px] max-w-[200px] focus:outline-none"
                      onClick={() => {
                        setViewMore(true);
                      }}
                    >
                      {t('EcomPropertyDetailPageProjectViewMore')}
                    </button>
                  </div>
                )}
              </div>
              <div className={`mt-[10px] ${viewMore ? 'block' : 'hidden'}`}>
                <div className="flex h-[51px] items-center rounded-t bg-transparent px-[18px]">
                  <div className="font-semibold uppercase text-primaryColor">
                    {t('EcomPropertyDetailPageAmenitiesAmenities')}
                  </div>
                </div>
                <div className="grid grid-cols-2 rounded border bg-white px-[15px] pb-[20px] shadow-sm">
                  {listAmetittes && listAmetittes.length ? (
                    listAmetittes.map((item, index) => (
                      <div key={item.id} className={`mt-[20px] flex items-center`}>
                        <div
                          className={`mr-[5px] flex h-[25px] w-[25px] items-center justify-center rounded-full bg-[#F6F8F9]`}
                        >
                          <Image src={item.icon} alt="" />
                        </div>{' '}
                        <span className="text-[13.5px]">{item.name}</span>
                      </div>
                    ))
                  ) : (
                    <>{t('noData')}</>
                  )}
                </div>
              </div>
              {/* <div
                className={`mt-[10px] relative ${
                  viewMore ? 'block' : 'hidden'
                }`}
              >
                <div className=" h-[51px] rounded-t px-[18px]  flex items-center">
                  <div className="text-primaryColor font-semibold uppercase">
                    {t('EcomPropertyDetailPageNearByNearBy')}
                  </div>
                </div>
              </div> */}
              {/* <div
                className={`mt-[10px] relative ${
                  viewMore ? 'block' : 'hidden'
                }`}
              >
                <div className=" h-[51px] rounded-t px-[18px]  flex items-center">
                  <div className="text-primaryColor font-semibold uppercase">
                    {t('EcomPropertyDetailPageReviewReview')}
                  </div>
                </div>
              </div> */}
              {/* <div
                className={`mt-[10px] relative ${
                  viewMore ? 'block' : 'hidden'
                }`}
              >
                <div className=" h-[51px] rounded-t px-[18px]  flex items-center">
                  <div className="text-primaryColor font-semibold uppercase">
                    {t('EcomPropertyDetailPageTourTour')}
                  </div>
                </div>
              </div> */}
              {/* <div
                className={`mt-[10px] relative ${
                  viewMore && (property?.videoLink || property?.virtualTour)
                    ? 'block'
                    : 'hidden'
                }`}
              >
                <div className=" h-[51px] rounded-t px-[18px]  flex items-center">
                  <div className="text-primaryColor font-semibold uppercase">
                    {t('EcomPropertyDetailPageVideoVideo')}
                  </div>
                </div>
                <div
                  className={`w-full    px-[10px] py-[10px] relative bg-white border rounded`}
                >
                  {property && property?.id ? (
                    <VideoComponent data={property} />
                  ) : null}
                </div>
              </div> */}
              <div className={`relative mt-[10px] rounded-b ${viewMore ? 'block' : 'hidden'}`}>
                <div className="flex h-[51px] items-center rounded-t px-[18px]">
                  <div className="font-semibold uppercase text-primaryColor">
                    {t('EcomPropertyDetailPageLocationLocation')}
                  </div>
                </div>
                <div
                  className={`relative h-[310px] w-full rounded rounded-b border bg-white px-[5px] py-[10px]`}
                >
                  <GoogleMapComponent
                    initCenter={{
                      lat: property?.location?.location?.lat,
                      lng: property?.location?.location?.lng,
                    }}
                    isMarker
                    listMarker={[
                      {
                        lat: property?.location?.location?.lat,
                        lng: property?.location?.location?.lng,
                      },
                    ]}
                  ></GoogleMapComponent>
                </div>
              </div>
              <div>
                <div className="mt-[10px] rounded-lg border border-neutral-100 p-3 px-[10px] py-[60px] shadow-md">
                  <div className="] flex cursor-pointer items-center">
                    <div className="flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full border-2 border-yellow-100">
                      <img
                        src={property?.userInfo?.avatarUrl}
                        loading="lazy"
                        alt=""
                        width={70}
                        height={70}
                        className="h-[70px] w-[70px] rounded-full"
                      />
                    </div>
                    <div className="ml-2">
                      <div className="font-semibold text-primaryColor">
                        {property?.userInfo?.fullName}
                      </div>
                      <div>09xxxxxxxxx</div>
                    </div>
                  </div>
                  <Form autoComplete="off">
                    <div>
                      <Form.Item name={'name'}>
                        <InputBorder
                          label={t('EcomPropertyDetailPageTicketName')}
                          type={'text'}
                          name={'name'}
                        ></InputBorder>
                      </Form.Item>
                    </div>
                    <div>
                      <Form.Item name={'email'}>
                        <InputBorder
                          label={t('EcomPropertyDetailPageTicketEmail')}
                          type={'text'}
                          name={'email'}
                        ></InputBorder>
                      </Form.Item>
                    </div>
                    <div>
                      <Form.Item name={'phone'}>
                        <InputBorder
                          label={t('EcomPropertyDetailPageTicketPhone')}
                          type={'tel'}
                          name={'phone'}
                        ></InputBorder>
                      </Form.Item>
                    </div>

                    <div>
                      <label className="block">
                        <div>
                          <Label className="text-primaryColor">
                            {t('EcomPropertyDetailPageTicketMessage')}
                          </Label>
                        </div>
                        <Form.Item className="area-custom" name={'message'}>
                          <TextArea
                            autoSize={{ minRows: 1, maxRows: 6 }}
                            name="message"
                            autoComplete="nope"
                            className="focus:boder-0 mt-1 rounded-none border-0 border-b-2 !bg-transparent focus:!border-portal-primaryLiving focus:ring-0"
                          />
                        </Form.Item>
                      </label>
                    </div>
                    <div className="mt-3">
                      <div className="mb-4 flex">
                        <input
                          id="policy-checkbox"
                          type="checkbox"
                          className="checkbox-primary mt-[2px] focus:ring-0 focus:ring-offset-0"
                        />
                        <label
                          htmlFor="policy-checkbox"
                          className="= ml-2 text-sm font-medium dark:text-gray-300"
                        >
                          <span>
                            {t('EcomPropertyDetailPageTicketBySubmittingThisFormIAgreeToTermOfUse')}
                            <a className="underline" target="_blank">
                              {t('termOfUse')}
                            </a>
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="mt-[30px]">
                      <button className="btn-primary focus:shadow-outline mr-2 h-[55px] uppercase focus:outline-none disabled:!opacity-70 disabled:hover:!bg-[#FFD14B]">
                        {t('EcomPropertyDetailPageTicketLeaveAnInquiry')}
                      </button>
                    </div>
                  </Form>
                </div>

                <AdsBannerComponent className="mt-[10px] transition-transform duration-300 sm:h-[900px] lg:hover:scale-105" />
              </div>
              {loading ? (
                <Spin />
              ) : (
                <div className="mt-[60px]">
                  <ProjectPropertyComponent data={project} />
                </div>
              )}
            </div>
          </>
        )}
      </>
    </Modal>
  );
};

export default PreviewProperty;
