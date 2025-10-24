'use client';
import apiDashBoardService from '@/apiServices/externalApiServices/apiDashBoardService';
import { convertPhoneNumber84To0, formatNumber } from '@/libs/helper';
import { Button } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import ChartPerformance from './ChartPerformance';

const DomDomReport = ({ tabActive, tabKey, myProfile }) => {
  const t = useTranslations('webLabel');
  const [reportDate, setReportDate] = useState(null);
  useEffect(() => {
    console.log('myProfile', myProfile);
    const initDataChart = async (userId) => {
      const result = await apiDashBoardService.getAgentReport({ userId });

      setReportDate(result?.data);
    };

    if (tabActive === tabKey) {
      initDataChart(myProfile?.id);
    }
  }, [tabActive]);

  return (
    <div className="overflow-hidden rounded-md border border-gray-200 bg-white p-3 font-sans text-sm shadow-md">
      {/* Filter */}
      <div className="mb-4 flex items-start justify-between">
        <div>filter</div>
        <div className="flex">
          <Button>Export</Button>
          <Button>Export</Button>
        </div>
      </div>

      <div className="mx-auto flex w-[820px] items-start justify-between bg-yellow-400 p-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{t('DOMDOM_REPORT_PER')}</h1>
          <p className="text-sm">Land/Development · ID 23548</p>
        </div>
        <div className="text-right text-xs">logo</div>
      </div>
      <div className="gtid mx-auto grid w-[840px] grid-cols-12 gap-2 bg-white p-3">
        <div className="col-span-9 flex w-full flex-col pl-2">
          {/* Dòng 1: 2 cột 40% - 60% */}
          <div className="flex w-full">
            <div className="flex w-[40%] flex-col">
              <span>{t('DayonMarket')}</span>
              <span className="text-base font-semibold">{7}</span>
            </div>
            <div className="flex w-[60%] flex-col">
              <span>{t('AtType')}</span>
              <span className="text-base font-semibold">Developed</span>
            </div>
          </div>

          {/* Dòng 2: chiếm 100% */}
          <div className="mt-5 flex w-full flex-col">
            <span className="text-lg font-semibold">{t('DomDomReportTitle')}</span>
          </div>

          {/* Dòng 3: 5 phần bằng nhau */}
          <div className="mt-2 flex w-full">
            <div className="flex-1">
              <span>{t('totalCompaign')}</span>
            </div>
            <div className="ml-2 flex flex-1 flex-col">
              <span className="text-lg font-semibold">{formatNumber(2048)} </span>
              <span>{t('views')}</span>
            </div>
            <div className="ml-2 flex flex-1 flex-col">
              <span className="text-lg font-semibold">{formatNumber(2930)} </span>
              <span>{t('engagement')}</span>
            </div>
            <div className="ml-2 flex flex-1 flex-col">
              <span className="text-lg font-semibold">{formatNumber(849)} </span>
              <span>{t('saveAndShare')}</span>
            </div>
            <div className="ml-2 flex flex-1 flex-col">
              <span className="text-lg font-semibold">{formatNumber(100)} </span>
              <span>{t('Enquiries')}</span>
            </div>
          </div>
          {/* Dòng 4: 5 phần bằng nhau */}
          <div className="mt-2 flex w-full border-b border-t border-[#A6A6A6] py-1">
            <div className="flex-1">
              <span className="text-[#E8CE6C]">{t('domdomDomain')}</span>
            </div>
            <div className="ml-2 flex-1">
              <span className="font-semibold">{formatNumber(2048)} </span>
            </div>
            <div className="ml-2 flex-1">
              <span className="font-semibold">{formatNumber(2930)} </span>
            </div>
            <div className="ml-2 flex-1">
              <span className="font-semibold">{formatNumber(849)} </span>
            </div>
            <div className="ml-2 flex-1">
              <span className="font-semibold">{formatNumber(100)} </span>
            </div>
          </div>
          {/* Dòng 5: 5 phần bằng nhau */}
          <div className="flex w-full pt-1">
            <div className="flex-1">
              <span>{t('Orther')}</span>
            </div>
            <div className="ml-2 flex-1">
              <span className="font-semibold">{formatNumber(0)} </span>
            </div>
            <div className="ml-2 flex-1">
              <span className="font-semibold">{formatNumber(0)} </span>
            </div>
            <div className="ml-2 flex-1">
              <span className="font-semibold">{formatNumber(0)} </span>
            </div>
            <div className="ml-2 flex-1">
              <span className="font-semibold">{formatNumber(0)} </span>
            </div>
          </div>

          {/* Chart */}
          <div className="mt-5 flex w-full flex-col">
            <span className="text-lg font-semibold">{t('DomDomReportTitleChartPerformance')}</span>
            <ChartPerformance data={reportDate} />
          </div>
        </div>
        <div className="col-span-3 flex flex-col pr-2">
          <div className="mb-3">
            <img src="https://cdnmedia.baotintuc.vn/Upload/DmtgOUlHWBO5POIHzIwr1A/files/2022/12/26/review-avatar-2-26122022.jpg" />
          </div>
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-6">
              <img className="h-[120px] w-[100px]" src={myProfile?.avatarUrl ?? ''} />
            </div>
            <div className="col-span-6 flex flex-col">
              <span className="text-base font-semibold">{myProfile?.fullName}</span>
            </div>
            <div className="col-span-12 flex flex-col">
              <div className="flex">
                <span>
                  {t('EcomPropertyListingPageSearchBarPhone')}:{' '}
                  {convertPhoneNumber84To0(myProfile?.phone)}
                </span>
              </div>
              <div className="flex">
                <span>
                  {t('EcomPropertyListingPageSearchBarEmail')}: {myProfile?.email}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomDomReport;
