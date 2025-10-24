'use client';

import apiHomePageService from '@/apiServices/externalApiServices/apiHomePageServices';
import ArrowRightIcon from '@/assets/icon/arrow-right.svg';
import SwiperComponent from '@/components/Swiper';
import ListingModel from '@/models/listingModel/listingModel';
import BannerModel from '@/models/masterDataModel/bannerModel';
import { Spin } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import AdsBannerComponent from '../AdsBannerComponent/AdsBannerComponent';
import CardItemProperties from '../Cards/CardItemProperties';
import Heading from './HeadLing';
export interface PropertiesForRentProps {
  className?: string;
  itemClassName?: string;
  banner?: BannerModel;
}

const PropertiesForRent: FC<PropertiesForRentProps> = ({
  className = '',
  itemClassName = '',
  banner,
}) => {
  const t = useTranslations('webLabel');
  const [data, setData] = useState<ListingModel[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const locale = useLocale();
  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {}, [data]);
  const getData = async () => {
    try {
      return Promise.all([
        apiHomePageService
          .getListForRent({
            from: 0,
            size: banner.status ? 6 : 8,
            lang: locale,
          })
          .then((x) => setData(x?.data?.data || [])),
      ]).finally(() => {
        setLoading(false);
      });
    } catch (error) {
      setLoading(false);
      setData([]);
    }
  };

  const onClick = async (item) => {
    // let stringNotUniCode= removeDiacritics(item.title);
    // let string = stringNotUniCode.replaceAll(/ /g, '-');
    // router.push(`/property/${string+"-"+item.id}`)
  };
  return (
    <div className={`nc-PropertiesForRent ${className} `}>
      {loading ? (
        <div className="flex h-[900px] justify-center">
          <Spin></Spin>
        </div>
      ) : (
        <>
          <Heading desc={t('EcomHomePageRecentListingsForRentRecentListingsForRentSub')}>
            <span className="portal-primaryLiving border-b-4">
              {t('EcomHomePageRecentListingsForRentRecentListingsForRent')}
            </span>
          </Heading>

          <div className="hidden lg:block">
            <div className="grid w-full grid-cols-12 p-0 lg:mt-5">
              <div className={`${banner?.status ? 'col-span-9' : 'col-span-12'} grid`}>
                <div className={`${banner?.status ? 'grid-cols-3' : 'grid-cols-4'} grid`}>
                  {data && data.length ? (
                    data.map((item, index) => (
                      <div
                        key={index + item.id}
                        onClick={() => onClick(item)}
                        className="cursor-pointer"
                      >
                        <CardItemProperties
                          type="rent"
                          data={item}
                          className="mb-8 mr-4"
                          hiddenMonth={true}
                        />
                      </div>
                    ))
                  ) : (
                    <span>{t('noData')}</span>
                  )}
                </div>
                <div className="flex justify-end pr-4">
                  <div
                    onClick={() => {
                      router.push('/tin-dang-cho-thue');
                    }}
                    className="flex cursor-pointer items-center justify-center text-[20px] text-[#696969] underline"
                  >
                    {t('EcomHomePageRecentListingsForRentViewMore')}{' '}
                    <Image alt=" " src={ArrowRightIcon} className="ml-2 h-[10px] w-[10px]"></Image>
                  </div>
                </div>
              </div>
              {banner?.status && (
                <div className="col-span-3 mb-8 transition-transform duration-300 lg:hover:scale-105">
                  <AdsBannerComponent banner={banner}></AdsBannerComponent>
                </div>
              )}
            </div>
          </div>
          <div className="lg:hidden">
            <SwiperComponent
              data={data}
              onClick={(item) => onClick(item)}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  spaceBetween: 10,
                },
                321: {
                  // width: 576,
                  slidesPerView: 1.3,
                  spaceBetween: 10,
                },
                768: {
                  // width: 768,
                  slidesPerView: 2.5,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
              }}
              center={false}
              hiddenMonth={true}
              type="rent"
            />
            <div className="flex justify-center py-3">
              <div
                onClick={() => {
                  router.push('/tin-dang-cho-thue');
                }}
                className="flex cursor-pointer items-center justify-center text-[#696969]"
              >
                {t('EcomHomePageRecentListingsForRentViewMore')}{' '}
                <Image alt=" " src={ArrowRightIcon} className="ml-2 h-[10px] w-[10px]"></Image>
              </div>
            </div>
            {banner?.status && (
              <div className="w-full transition-transform duration-300 hover:rounded lg:h-[900px] lg:hover:scale-105">
                <AdsBannerComponent banner={banner}></AdsBannerComponent>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PropertiesForRent;
