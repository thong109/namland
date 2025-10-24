'use client';
import GoogleMapComponent from '@/components/GoogleMap';
import { renderDate } from '@/libs/appconst';
import { Steps } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';

interface Props {
  projectDetail: any;
}
const PorjectNewNews: React.FC<Props> = ({ projectDetail }) => {
  const t = useTranslations('webLabel');

  return (
    <>
      <div className="mb-4 mt-8 flex w-full justify-center text-lg font-semibold">
        {t('EcomProjectDetaiNews')}
      </div>
      <div className="">
        <div className="grid grid-cols-2 gap-x-1">
          <div className="col-span-1">
            <div
              className={`flex w-full flex-col rounded-none border-none !bg-portal-primaryButtonAdmin py-2 text-center !text-black`}
            >
              <span className="text-sm font-semibold"> {t('EcomProjectDetailCaseOpened')}</span>

              <span className="text-xs">{renderDate(projectDetail?.caseOpened?.dateTime)}</span>
            </div>
          </div>
          <div className="col-span-1">
            <div
              className={`$border-[0.5px] flex w-full flex-col rounded-none border-[0.5px] border-[#] border-gray-700 py-2 text-center !text-black`}
            >
              <span className="text-sm font-semibold">
                {t('EcomProjectDetailPendingCompletion')}
              </span>

              <span className="text-xs">
                {renderDate(projectDetail?.pendingCompletion?.dateTime)}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-3 w-full">
          <Steps
            progressDot
            direction="vertical"
            items={projectDetail?.caseOpened?.items
              ?.slice()
              .reverse()
              .map((item) => {
                return {
                  title: (
                    <div className="w-screen border-b border-gray-700 pb-2">
                      <span className="mr-4 font-semibold">{renderDate(item?.dateTime)}</span>
                      {item?.content}
                    </div>
                  ),
                };
              })}
          />
        </div>
      </div>

      {/* Google Map */}
      <div className="mt-4 flex w-full justify-center text-lg font-semibold">
        {t('EcomProjectDetailLocation')}
      </div>
      <div className="relative">
        <div className="relative h-[300px] w-full rounded-b border bg-white lg:h-[530px]">
          <GoogleMapComponent
            disabled
            initCenter={{
              lat: projectDetail?.location?.location?.lat,
              lng: projectDetail?.location?.location?.lng,
            }}
            isMarker
            listMarker={[
              {
                lat: projectDetail?.location?.location?.lat,
                lng: projectDetail?.location?.location?.lng,
              },
            ]}
          ></GoogleMapComponent>
        </div>
      </div>
    </>
  );
};

export default PorjectNewNews;
