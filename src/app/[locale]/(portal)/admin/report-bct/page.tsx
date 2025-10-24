'use client';
import ReportApiService from '@/apiServices/externalApiServices/reportApiService';
import { appPermissions, roleAdminGod } from '@/libs/appconst';
import { checkPermissonAcion, formatDate, formatNumber } from '@/libs/helper';
import ReportResultModel from '@/models/reportModel/reportResultModel';
import useGlobalStore from '@/stores/useGlobalStore';
import { Button, DatePicker, Spin } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useEffect, useState, useTransition } from 'react';

const { RangePicker }: any = DatePicker;

const ReportBCT = () => {
  const t = useTranslations('report');
  const comm = useTranslations('Common');
  const { userInfo } = useGlobalStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataReport, setDataReport] = useState<ReportResultModel>(undefined);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getInitData();
  }, []);

  const getInitData = async (fromToDate?) => {
    setIsLoading(true);
    let res;

    if (fromToDate) {
      const body = {
        fromDate: fromToDate[0],
        toDate: fromToDate[1],
        username: 'BaocaoTMDT',
        password: 'BaocaoTMDT@112233',
      };
      res = await ReportApiService.getReport(body);
    } else {
      const body = { username: 'BaocaoTMDT', password: 'BaocaoTMDT@112233' };
      res = await ReportApiService.getReport(body);
    }
    if (res?.data) {
      setDataReport(res.data);
    }
    setIsLoading(false);
  };

  const handleExport = async (type: string) => {
    console.log('type', type);
    switch (type) {
      // Tổng số người dùng
      case 'ExportTotalUser':
        startTransition(async () => {
          try {
            await ReportApiService.ExportTotalUser({});
          } catch (error) {
            console.log('error', error);
          }
        });
        break;
      // Tổng số người đăng tin
      case 'ExportTotalOwnerNoFilter':
        startTransition(async () => {
          try {
            await ReportApiService.ExportTotalOwner({});
          } catch (error) {
            console.log('error', error);
          }
        });
        break;
      // Tổng số người đăng tin  có filter
      case 'ExportTotalOwner':
        startTransition(async () => {
          try {
            await ReportApiService.ExportTotalOwner({
              fromDate: dataReport?.fromDate,
              toDate: dataReport?.toDate,
            });
          } catch (error) {
            console.log('error', error);
          }
        });
        break;
      // Tổng số tin đăng
      case 'ExportTotalListing':
        startTransition(async () => {
          try {
            await ReportApiService.ExportTotalListing({
              fromDate: dataReport?.fromDate,
              toDate: dataReport?.toDate,
            });
          } catch (error) {
            console.log('error', error);
          }
        });
        break;
      // Tổng số tin đăng mới
      case 'ExportListingByQuery':
        startTransition(async () => {
          try {
            await ReportApiService.ExportListingByQuery({
              fromDate: dataReport?.fromDate,
              toDate: dataReport?.toDate,
            });
          } catch (error) {
            console.log('error', error);
          }
        });
        break;
      // Tổng số đơn hàng
      case 'ExportToTalListingByQuery':
        startTransition(async () => {
          try {
            await ReportApiService.ExportToTalListingByQuery({
              fromDate: dataReport?.fromDate,
              toDate: dataReport?.toDate,
            });
          } catch (error) {
            console.log('error', error);
          }
        });
        break;
      // Số đơn hàng thành công
      case 'ExportListingSuccess':
        startTransition(async () => {
          try {
            await ReportApiService.ExportListingSuccess({
              fromDate: dataReport?.fromDate,
              toDate: dataReport?.toDate,
            });
          } catch (error) {
            console.log('error', error);
          }
        });
        break;
      // Số đơn hàng không thành công
      case 'ExportListingFailed':
        startTransition(async () => {
          try {
            await ReportApiService.ExportListingFailed({
              fromDate: dataReport?.fromDate,
              toDate: dataReport?.toDate,
            });
          } catch (error) {
            console.log('error', error);
          }
        });
        break;
      //Tổng giá trị giao dịch
      case 'ExportTransactionSuccess':
        startTransition(async () => {
          try {
            await ReportApiService.ExportTransactionSuccess({
              fromDate: dataReport?.fromDate,
              toDate: dataReport?.toDate,
            });
          } catch (error) {
            console.log('error', error);
          }
        });
        break;

      default:
        console.log('Invalid export type');
    }
  };

  const tdClassName = 'px-3 py-2 pl-3 pr-16 border ';
  const tdClassNumber = 'px-3 py-2 border text-right font-semibold text-[#25793A]';
  const trClass = 'bg-white border';
  return (
    <div className="h-[100vh] w-full bg-white">
      <div className="mb-4 flex flex-col items-center bg-white text-base text-neutral-900 dark:bg-neutral-900 dark:text-neutral-200">
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
                  <th scope="col" className="px-6 py-3 text-sm"></th>
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
                  <td className={tdClassNumber}>
                    <Button
                      loading={isPending}
                      disabled={
                        !checkPermissonAcion(userInfo?.accesses, [
                          roleAdminGod,
                          appPermissions.portal_exportBCT.export,
                        ])
                      }
                      onClick={() => handleExport('ExportTotalUser')}
                      type="primary"
                    >
                      {comm('ExportExcel')}
                    </Button>
                  </td>
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
                  <td className={tdClassNumber}>
                    <Button
                      loading={isPending}
                      disabled={
                        !checkPermissonAcion(userInfo?.accesses, [
                          roleAdminGod,
                          appPermissions.portal_exportBCT.export,
                        ])
                      }
                      onClick={() => handleExport('ExportTotalOwnerNoFilter')}
                      type="primary"
                    >
                      {comm('ExportExcel')}
                    </Button>
                  </td>
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
                  <td className={tdClassNumber}>
                    <Button
                      loading={isPending}
                      disabled={
                        !checkPermissonAcion(userInfo?.accesses, [
                          roleAdminGod,
                          appPermissions.portal_exportBCT.export,
                        ])
                      }
                      onClick={() => handleExport('ExportTotalOwner')}
                      type="primary"
                    >
                      {comm('ExportExcel')}
                    </Button>
                  </td>
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
                  <td className={tdClassNumber}>
                    <Button
                      loading={isPending}
                      disabled={
                        !checkPermissonAcion(userInfo?.accesses, [
                          roleAdminGod,
                          appPermissions.portal_exportBCT.export,
                        ])
                      }
                      onClick={() => handleExport('ExportTotalListing')}
                      type="primary"
                    >
                      {comm('ExportExcel')}
                    </Button>
                  </td>
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
                  <td className={tdClassNumber}>
                    <Button
                      loading={isPending}
                      disabled={
                        !checkPermissonAcion(userInfo?.accesses, [
                          roleAdminGod,
                          appPermissions.portal_exportBCT.export,
                        ])
                      }
                      onClick={() => handleExport('ExportListingByQuery')}
                      type="primary"
                    >
                      {comm('ExportExcel')}
                    </Button>
                  </td>
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
                  <td className={tdClassNumber}>
                    <Button
                      loading={isPending}
                      disabled={
                        !checkPermissonAcion(userInfo?.accesses, [
                          roleAdminGod,
                          appPermissions.portal_exportBCT.export,
                        ])
                      }
                      onClick={() => handleExport('ExportToTalListingByQuery')}
                      type="primary"
                    >
                      {comm('ExportExcel')}
                    </Button>
                  </td>
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
                  <td className={tdClassNumber}>
                    <Button
                      loading={isPending}
                      disabled={
                        !checkPermissonAcion(userInfo?.accesses, [
                          roleAdminGod,
                          appPermissions.portal_exportBCT.export,
                        ])
                      }
                      onClick={() => handleExport('ExportListingSuccess')}
                      type="primary"
                    >
                      {comm('ExportExcel')}
                    </Button>
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
                  <td className={tdClassNumber}>
                    <Button
                      loading={isPending}
                      disabled={
                        !checkPermissonAcion(userInfo?.accesses, [
                          roleAdminGod,
                          appPermissions.portal_exportBCT.export,
                        ])
                      }
                      onClick={() => handleExport('ExportListingFailed')}
                      type="primary"
                    >
                      {comm('ExportExcel')}
                    </Button>
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
                  <td className={tdClassNumber}>
                    <Button
                      loading={isPending}
                      disabled={
                        !checkPermissonAcion(userInfo?.accesses, [
                          roleAdminGod,
                          appPermissions.portal_exportBCT.export,
                        ])
                      }
                      onClick={() => handleExport('ExportTransactionSuccess')}
                      type="primary"
                    >
                      {comm('ExportExcel')}
                    </Button>
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
    </div>
  );
};
export default ReportBCT;
