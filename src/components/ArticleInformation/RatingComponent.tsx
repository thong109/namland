'use client';
import ratingApiService from '@/apiServices/externalApiServices/apiRatingService';
import AvatarDefault from '@/assets/images/avarta-default.svg';
import backToHome from '@/assets/images/backToHome.png';
import { caculateDiffYears } from '@/libs/helper';
import { Rate } from 'antd';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export const RatingComponent = ({ listingDetail }) => {
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  const agentRating = listingDetail?.agentRating;
  const [ratings, setRatings] = useState<any[]>([]);
  const [from, setFrom] = useState<number>(0);
  const [disableViewMore, setDisableViewMore] = useState<boolean>(false);
  const onShowMoreRating = async (init: boolean) => {
    let values = [];
    if (init) {
      values = agentRating?.data ?? [];
      setRatings(agentRating?.data);
    } else {
      values = await ratingApiService.getAllByUserId({
        userId: listingDetail?.userInfo?.id,
        from: from,
        size: 10,
      });
      setFrom(from + 10);
      setRatings((prevRatings) => {
        const safePrev = prevRatings ?? [];
        const existingIds = new Set(safePrev.map((item) => item.id));
        const newValues = values.filter((item) => !existingIds.has(item.id));
        return [...safePrev, ...newValues];
      });
    }
    if (values.length < 1) {
      setDisableViewMore(true);
    } else {
      setDisableViewMore(false);
    }
  };
  useEffect(() => {
    onShowMoreRating(true);
    setDisableViewMore(false);
    setFrom(0);
  }, []);
  return (
    <div>
      <span className="mb-2 flex justify-center font-semibold lg:justify-start">
        {t('REAL_ESTATE_AGENT')}
      </span>
      <div className="grid w-full grid-cols-11 border-t border-black">
        <div className="hidden h-[300px] flex-col justify-center gap-4 bg-gray-200 lg:col-span-3 lg:flex">
          <div className="flex w-full justify-center">
            <Image
              src={listingDetail?.userInfo?.avatarUrl ?? AvatarDefault?.src}
              alt="avatar"
              width={120}
              height={120}
              className="rounded-full"
            />
          </div>
          <div className="flex justify-center">
            <div className="text-xl font-semibold">{listingDetail?.userInfo?.fullName}</div>
          </div>
        </div>
        <div className="col-span-11 grid grid-cols-4 lg:col-span-8">
          <div className="col-span-2 flex flex-col items-center justify-center border-r border-black lg:col-span-1">
            <span className="mb-[-5px] text-3xl font-semibold">
              {agentRating?.totalReview && agentRating.totalReview >= 1
                ? agentRating.totalReview
                : '-'}
            </span>
            <span>{comm('totalReview')}</span>
          </div>
          <div className="col-span-2 flex flex-col items-center justify-center border-r border-black lg:col-span-1">
            <span className="mb-[-5px] text-3xl font-semibold">
              {agentRating?.rating && agentRating.rating >= 1 ? agentRating.rating : '-'}
            </span>
            <span>{comm('rating')}</span>
          </div>
          <div className="col-span-2 flex flex-col items-center justify-center border-r border-black lg:col-span-1">
            <span className="mb-[-5px] text-3xl font-semibold">
              {agentRating?.yearsOfService && agentRating.yearsOfService >= 1
                ? agentRating.yearsOfService
                : '-'}
            </span>
            <span>{comm('yearsOfService')}</span>
          </div>
          <div className="col-span-2 flex flex-col items-center justify-center border-r border-black lg:col-span-1">
            <span className="mb-[-5px] text-3xl font-semibold">
              {agentRating?.dealsClosed && agentRating.dealsClosed >= 1
                ? agentRating.dealsClosed
                : '-'}
            </span>
            <span>{comm('dealsClosed')}</span>
          </div>
          <div className="col-span-4 grid grid-cols-2 gap-x-10 border-r border-t border-black p-5">
            <div className="col-span-2 flex flex-col justify-evenly lg:col-span-1">
              <div className="flex justify-between">
                <span>{t('professionalism')}</span>
                <span className="font-semibold">
                  {agentRating?.professionalism && agentRating.professionalism >= 1
                    ? agentRating.professionalism
                    : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t('serviceAttitude')}</span>
                <span className="font-semibold">
                  {agentRating?.serviceAttitude && agentRating.serviceAttitude >= 1
                    ? agentRating.serviceAttitude
                    : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t('agentServiceExperienceRating')}</span>
                <span className="font-semibold">
                  {agentRating?.serviceValueRating && agentRating.serviceValueRating >= 1
                    ? agentRating.serviceValueRating
                    : '-'}
                </span>
              </div>
            </div>
            <div className="col-span-2 flex flex-col justify-evenly lg:col-span-1">
              <div className="flex justify-between">
                <span>{t('responseSpeed')}</span>
                <span className="font-semibold">
                  {agentRating?.responseSpeed && agentRating.responseSpeed >= 1
                    ? agentRating.responseSpeed
                    : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t('listingAccuracyComparedToVisit')}</span>
                <span className="font-semibold">
                  {agentRating?.listingAccuracyComparedToVisit &&
                  agentRating.listingAccuracyComparedToVisit >= 1
                    ? agentRating.listingAccuracyComparedToVisit
                    : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t('EcomRatingStart')}</span>
                <span className="font-semibold">
                  {agentRating?.rating && agentRating.rating >= 1 ? agentRating.rating : '-'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-11 grid h-[90px] grid-cols-4 border-y border-r border-black bg-gray-200">
          <div className="col-span-4 flex justify-around">
            <span className="flex items-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 13 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.138 8.53026L9.51305 7.40526C9.40091 7.35747 9.27628 7.3474 9.15792 7.37656C9.03957 7.40573 8.93389 7.47255 8.8568 7.56698L7.6943 8.98729C5.86986 8.12708 4.40161 6.65883 3.54141 4.8344L4.96172 3.6719C5.05633 3.59495 5.1233 3.48927 5.15248 3.37085C5.18166 3.25244 5.17146 3.12775 5.12344 3.01565L3.99844 0.390647C3.94573 0.269805 3.85251 0.171142 3.73485 0.11167C3.61719 0.0521981 3.48246 0.0356452 3.35391 0.0648656L0.916406 0.627366C0.792462 0.655987 0.681878 0.725775 0.602704 0.825338C0.523529 0.924902 0.48044 1.04836 0.480469 1.17557C0.480469 7.18729 5.35312 12.0506 11.3555 12.0506C11.4827 12.0507 11.6062 12.0076 11.7058 11.9284C11.8055 11.8492 11.8753 11.7386 11.9039 11.6146L12.4664 9.17713C12.4954 9.04795 12.4785 8.91269 12.4186 8.79462C12.3587 8.67655 12.2595 8.58307 12.138 8.53026Z"
                  fill="#333333"
                />
              </svg>{' '}
              <span className="ml-3">{listingDetail?.userInfo?.phone}</span>
            </span>
            <span className="flex items-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 13 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.4133 4.52266C12.5047 4.45 12.6406 4.51797 12.6406 4.63281V9.42578C12.6406 10.0469 12.1367 10.5508 11.5156 10.5508H1.76562C1.14453 10.5508 0.640625 10.0469 0.640625 9.42578V4.63516C0.640625 4.51797 0.774219 4.45234 0.867969 4.525C1.39297 4.93281 2.08906 5.45078 4.47969 7.1875C4.97422 7.54844 5.80859 8.30781 6.64062 8.30313C7.47734 8.31016 8.32812 7.53438 8.80391 7.1875C11.1945 5.45078 11.8883 4.93047 12.4133 4.52266ZM6.64062 7.55078C7.18437 7.56016 7.96719 6.86641 8.36094 6.58047C11.4711 4.32344 11.7078 4.12656 12.425 3.56406C12.5609 3.45859 12.6406 3.29453 12.6406 3.12109V2.67578C12.6406 2.05469 12.1367 1.55078 11.5156 1.55078H1.76562C1.14453 1.55078 0.640625 2.05469 0.640625 2.67578V3.12109C0.640625 3.29453 0.720312 3.45625 0.85625 3.56406C1.57344 4.12422 1.81016 4.32344 4.92031 6.58047C5.31406 6.86641 6.09688 7.56016 6.64062 7.55078Z"
                  fill="#333333"
                />
              </svg>{' '}
              <span className="ml-3">{listingDetail?.userInfo?.email}</span>
            </span>
          </div>
        </div>
        <div className="custom-scroll col-span-11 flex max-h-[450px] w-full flex-col overflow-y-auto">
          {ratings?.map((item) => {
            return (
              <div className="col-span-11 grid h-[160px] grid-cols-5 border-b border-r border-black lg:h-[90px]">
                {/* UI DESKTOP */}
                <div className="col-span-4 hidden h-[90px] grid-cols-9 lg:grid">
                  <div className="col-span-4 flex items-center border-r border-black pl-4">
                    <div className="mr-5">
                      <Image
                        src={item?.userCreated?.avatarUrl ?? AvatarDefault?.src}
                        alt="avatar"
                        width={60}
                        height={60}
                        className="rounded-full"
                      />
                    </div>
                    <div className="flex flex-col">
                      <Rate value={item?.rating} allowHalf />
                      <span className="text-sm">
                        {t('jonhDomDOMto', {
                          yearsOfService: item?.userCreated?.createdAt
                            ? caculateDiffYears(item?.userCreated?.createdAt)
                            : 1,
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-5 w-full p-2">
                    <span className="line-clamp-3 font-semibold">"{item?.note}"</span>
                  </div>
                </div>
                {/* UI MOBILE */}
                <div className="col-span-5 block lg:hidden">
                  <div className="flex w-full items-center">
                    <div className="mr-5 flex items-center py-2">
                      <Image
                        src={listingDetail?.userInfo?.avatarUrl ?? AvatarDefault?.src}
                        alt="avatar"
                        width={60}
                        height={60}
                        className="rounded-full"
                      />
                      <div className="flex flex-col">
                        <Rate value={item?.rating} allowHalf />
                        <span className="text-sm">
                          {t('jonhDomDOMto', {
                            yearsOfService: item?.userCreated?.createdAt
                              ? caculateDiffYears(item?.userCreated?.createdAt)
                              : 1,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="line-clamp-3 font-semibold">"{item?.note}"</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {!disableViewMore && (
        <div className="mt-5 flex w-full items-center justify-center">
          <a
            onClick={() => onShowMoreRating(false)}
            className="flex cursor-pointer items-center justify-center uppercase transition duration-300"
          >
            {comm('viewMore')}
          </a>
          <Image
            onClick={() => onShowMoreRating(false)}
            src={backToHome}
            alt={'vew more'}
            height={60}
            width={60}
            className="ml-3 rotate-90 rounded-full"
          />
        </div>
      )}
    </div>
  );
};
