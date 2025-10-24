'use client';
import ReportApiService from '@/apiServices/externalApiServices/reportApiService';
import { getAuthCookie } from '@/app/api/auth/[...nextauth]/cookieAuth';
import { formatDate, formatNumber } from '@/libs/helper';
import ReportResultModel from '@/models/reportModel/reportResultModel';
import { DatePicker, Spin } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import { useEffect, useState } from 'react';
import LoginReport from './loginReport';

const { RangePicker }: any = DatePicker;

const Report = () => {
  const t = useTranslations('report');

  const router = useRouter();
  const authToken = getAuthCookie();
  const [isLogin, setIsLogin] = useState(authToken ? true : false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataReport, setDataReport] = useState<ReportResultModel>(undefined);

  // Check if the user is authenticated
  useEffect(() => {
    // If the user is not authenticated, redirect to the login page
    if (!authToken) {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [authToken, router]);
  useEffect(() => {
    if (isLogin) {
      getInitData();
      setLoginModalVisible(false);
    } else {
      setLoginModalVisible(true);
      setDataReport(undefined);
    }
  }, [isLogin]);

  const getInitData = async (fromToDate?) => {
    const token = getAuthCookie();
    setIsLoading(true);
    let res;
    if (token) {
      if (fromToDate) {
        const body = {
          fromDate: fromToDate[0],
          toDate: fromToDate[1],
          ...token,
        };
        res = await ReportApiService.getReport(body);
      } else {
        const body = {
          ...token,
        };
        res = await ReportApiService.getReport(body);
      }
      if (res?.data) {
        setDataReport(res.data);
      }
      setIsLoading(false);
    } else {
      setIsLogin(false);
    }
  };
  const handleLogin = (result) => {
    setIsLogin(result?.success);
  };

  const tdClassName = 'px-3 py-2 pl-3 pr-16 border ';
  const tdClassNumber = 'px-3 py-2 border text-right font-semibold text-[#25793A]';
  const trClass = 'bg-white border';
  return (
    <>
      <div className="mb-4 flex flex-col items-center bg-white text-base text-neutral-900 dark:bg-neutral-900 dark:text-neutral-200">
        <LoginReport isVisible={loginModalVisible} loginResult={handleLogin} />
        <Spin spinning={isLoading}>
          <div>
            <div className="my-8 flex justify-center">
              <span className="text-4xl font-bold">{t('DATA_REPORT')}</span>
            </div>
            <div className="my-4 flex items-center">
              <span className="mr-2">{t('DATE_REPORT')}</span>
              <RangePicker
                size="middle"
                onChange={(value) => {
                  if (value && value[0] !== null && value[1] !== null) {
                    getInitData(value);
                  }
                  if (value === null) {
                    getInitData(value);
                  }
                }}
                format={formatDate}
                allowEmpty={[true, true]}
              />
            </div>

            <table className="w-full !rounded-sm py-2">
              <thead className="border bg-gray-100 text-left text-sm">
                <tr>
                  <th scope="col" className="px-6 py-3 text-center text-sm" colSpan={2}>
                    {t('REPORT_CRITERIA')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-sm">
                    {t('REPORT_QUANTITY')}
                  </th>
                </tr>
              </thead>

              <tbody className="text-left">
                <tr className={trClass}>
                  <td className={tdClassName} colSpan={2}>
                    <span> {t('THE_NUMBER_OF_ACCCESSES')}</span>
                    <br />
                    <span className="text-xs"> {t('THE_NUMBER_OF_ACCCESSES_NOTE')}</span>
                  </td>
                  <td className={tdClassNumber}>{formatNumber(dataReport?.totalUsers ?? 0)}</td>
                </tr>
                <tr className={trClass}>
                  <td className={tdClassName} rowSpan={2}>
                    <span> {t('NUMBER_OF_SELLERS')}</span>
                    <br />
                    <span className="text-xs italic">( {t('NUMBER_OF_PRODUCTS_NOTE')} )</span>
                  </td>
                  <td className={tdClassName}>
                    <span>{t('TOTAL_OF_SELLERS')} </span> <br />
                    <span className="text-xs">{t('THE_NUMBER_OF_ACCCESSES_NOTE')}</span>
                  </td>
                  <td className={tdClassNumber}> {formatNumber(dataReport?.totalOwner ?? 0)}</td>
                </tr>
                <tr className={trClass}>
                  <td className={tdClassName}>
                    <span>{t('NUMBER_OF_NEW_SELLERS')} </span> <br />
                    <span className="text-xs">
                      {t('NUMBER_OF_SELLERS_NOTE', {
                        fromDate: dataReport?.fromDate
                          ? dayjs(dataReport?.fromDate).format('DD/MM/YYYY')
                          : null,
                        toDate: dataReport?.toDate
                          ? dayjs(dataReport?.toDate).format('DD/MM/YYYY')
                          : null,
                      })}
                    </span>
                  </td>
                  <td className={tdClassNumber}> {formatNumber(dataReport?.totalNewOwner) ?? 0}</td>
                </tr>

                <tr className={trClass}>
                  <td className={tdClassName} rowSpan={2}>
                    <span> {t('NUMBER_OF_PRODUCTS')}</span>
                    <br />
                    <span className="text-xs italic">( {t('NUMBER_OF_PRODUCTS_NOTE')} )</span>
                  </td>
                  <td className={tdClassName}>
                    <span>{t('TOTAL_OF_PRODUCTS_SUK')}</span>
                    <br />
                    <span className="text-xs">{t('THE_NUMBER_OF_ACCCESSES_NOTE')}</span>
                  </td>
                  <td className={tdClassNumber}> {formatNumber(dataReport?.totalListing)}</td>
                </tr>
                <tr className={trClass}>
                  <td className={tdClassName}>
                    <span>{t('NUMBER_OF_NEW_PRODUCTS_POSTED_FOR_SALE')}</span>
                    <br />
                    <span className="text-xs">
                      {t('NUMBER_OF_SELLERS_NOTE', {
                        fromDate: dataReport?.fromDate
                          ? dayjs(dataReport?.fromDate).format('DD/MM/YYYY')
                          : null,
                        toDate: dataReport?.toDate
                          ? dayjs(dataReport?.toDate).format('DD/MM/YYYY')
                          : null,
                      })}
                    </span>
                  </td>
                  <td className={tdClassNumber}>{formatNumber(dataReport?.totalNewListing)}</td>
                </tr>

                <tr className={trClass}>
                  <td className={tdClassName} rowSpan={3}>
                    <span> {t('NUMBER_OF_TRANSACTIONS')}</span>
                    <br />
                    <span className="text-xs italic">( {t('NUMBER_OF_PRODUCTS_NOTE')} )</span>
                  </td>
                  <td className={tdClassName}>
                    <span>{t('TOTAL_OF_ORDERS')}</span>
                    <br />
                    <span className="text-xs">
                      {t('NUMBER_OF_SELLERS_NOTE', {
                        fromDate: dataReport?.fromDate
                          ? dayjs(dataReport?.fromDate).format('DD/MM/YYYY')
                          : null,
                        toDate: dataReport?.toDate
                          ? dayjs(dataReport?.toDate).format('DD/MM/YYYY')
                          : null,
                      })}
                    </span>
                  </td>
                  <td className={tdClassNumber}>{formatNumber(dataReport?.totalTransaction)}</td>
                </tr>
                <tr className={trClass}>
                  <td className={tdClassName}>
                    <span>{t('NUMBER_OF_SUCCESSFUL_ORDERS')}</span>
                    <br />
                    <span className="text-xs">
                      {t('NUMBER_OF_SELLERS_NOTE', {
                        fromDate: dataReport?.fromDate
                          ? dayjs(dataReport?.fromDate).format('DD/MM/YYYY')
                          : null,
                        toDate: dataReport?.toDate
                          ? dayjs(dataReport?.toDate).format('DD/MM/YYYY')
                          : null,
                      })}
                    </span>
                  </td>
                  <td className={tdClassNumber}>
                    {formatNumber(dataReport?.totalTransactionSuccessCount)}
                  </td>
                </tr>
                <tr className={trClass}>
                  <td className={tdClassName}>
                    <span>{t('NUMBER_OF_FAILED_ORDERS')}</span>
                    <br />
                    <span className="text-xs">
                      {t('NUMBER_OF_SELLERS_NOTE', {
                        fromDate: dataReport?.fromDate
                          ? dayjs(dataReport?.fromDate).format('DD/MM/YYYY')
                          : null,
                        toDate: dataReport?.toDate
                          ? dayjs(dataReport?.toDate).format('DD/MM/YYYY')
                          : null,
                      })}
                    </span>
                  </td>
                  <td className={tdClassNumber}>
                    {formatNumber(dataReport?.totalTransactionFailedCount)}
                  </td>
                </tr>
                <tr className="border bg-gray-100 text-left">
                  <td className="px-3 py-2 pl-3 pr-16" colSpan={2}>
                    <span> {t('TOTAL_TRANSACTION_VALUE')}</span>
                    <br />
                    <span className="text-xs">
                      {t('NUMBER_OF_SELLERS_NOTE', {
                        fromDate: dataReport?.fromDate
                          ? dayjs(dataReport?.fromDate).format('DD/MM/YYYY')
                          : null,
                        toDate: dataReport?.toDate
                          ? dayjs(dataReport?.toDate).format('DD/MM/YYYY')
                          : null,
                      })}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right font-semibold text-[#25793A]">
                    {formatNumber(dataReport?.totalAmount ?? 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <span style={{ whiteSpace: 'pre-line' }} className="py-4 text-sm">
            {t('NOTE_BAO_BTC')}
          </span>
        </Spin>
      </div>
    </>
  );
};
export default Report;
