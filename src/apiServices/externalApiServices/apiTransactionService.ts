import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import PageResultModel from '@/models/reponseModel/pageResultModel';

import { renderDateTime } from '@/libs/appconst';
import { downloadFile } from '@/libs/helper';
import { INewFilterModelInAdmin } from '@/models/newsModel/newFilterModel';
import dayjs from 'dayjs';
import apiClient from './apiClient';

const TransactionApiInAdmin = {
  getListTransactionTopup: async (
    params: any,
  ): Promise<ApiResponseModel<PageResultModel<INewFilterModelInAdmin>>> => {
    const response = await apiClient.get<ApiResponseModel<any>>('/Ecom/EcomTopupUser/GetByQuery', {
      params: params,
    });

    return response.data.data;
  },

  getListTransactionTopupV2: async (
    params: any,
  ): Promise<ApiResponseModel<PageResultModel<INewFilterModelInAdmin>>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      '/Ecom/EcomTransaction/GetAllTransaction',
      {
        params: params,
      },
    );

    return response.data.data;
  },
  getMyTransactionTopupV2: async (
    params: any,
  ): Promise<ApiResponseModel<PageResultModel<INewFilterModelInAdmin>>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      '/Ecom/EcomTransaction/GetMyTransaction',
      {
        params: params,
      },
    );

    return response.data.data;
  },
  getListTransactionListPackage: async (
    params: any,
  ): Promise<ApiResponseModel<PageResultModel<INewFilterModelInAdmin>>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      '/Ecom/EcomListingMemberPackage/GetMyTransactionPackage',
      {
        params: params,
      },
    );

    return response.data.data;
  },

  getListTransactionListPush: async (params: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      '/Ecom/EcomListingMemberPackage/GetMyTransactionPush',
      {
        params: params,
      },
    );

    return response.data.data;
  },

  getListTransactionTopupStaff: async (
    params: any,
  ): Promise<ApiResponseModel<PageResultModel<INewFilterModelInAdmin>>> => {
    const response = await apiClient.get<ApiResponseModel<any>>('/Ecom/EcomTopupStaff/GetByQuery', {
      params,
    });

    return response.data.data;
  },

  getListTransactionTopupStaffV2: async (
    params: any,
  ): Promise<ApiResponseModel<PageResultModel<INewFilterModelInAdmin>>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      '/Ecom/EcomTransaction/GetAllTransaction',
      {
        params,
      },
    );

    return response.data.data;
  },

  getOrderById: async (
    params: any,
  ): Promise<ApiResponseModel<PageResultModel<INewFilterModelInAdmin>>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      '/Ecom/EcomTransaction/GetOrderById',
      {
        params,
      },
    );

    return response.data.data;
  },

  getListTransactionListPackageStaff: async (
    params: any,
  ): Promise<ApiResponseModel<PageResultModel<INewFilterModelInAdmin>>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      '/Ecom/EcomListingMemberPackage/GetTransactionPackageForStaff',
      {
        params: params,
      },
    );

    return response.data.data;
  },

  getListingPackageLog: async (
    params: any,
  ): Promise<ApiResponseModel<PageResultModel<INewFilterModelInAdmin>>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      '/Ecom/EcomListingLogs/GetListingPackageLog',
      {
        params: params,
      },
    );

    return response.data.data;
  },

  getMyListingPackageLog: async (
    params: any,
  ): Promise<ApiResponseModel<PageResultModel<INewFilterModelInAdmin>>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      '/Ecom/EcomListingLogs/GetMyListingPackageLog',
      {
        params: params,
      },
    );

    return response.data.data;
  },

  getListingPushLog: async (
    params: any,
  ): Promise<ApiResponseModel<PageResultModel<INewFilterModelInAdmin>>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      '/Ecom/EcomListingLogs/GetListingPushLog',
      {
        params: params,
      },
    );

    return response.data.data;
  },

  GetMyListingPushLog: async (
    params: any,
  ): Promise<ApiResponseModel<PageResultModel<INewFilterModelInAdmin>>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      '/Ecom/EcomListingLogs/GetMyListingPushLog',
      {
        params: params,
      },
    );

    return response.data.data;
  },

  getListTransactionListPushStaff: async (params: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      '/Ecom/EcomListingMemberPackage/GetTransactionPushForStaff',
      {
        params: params,
      },
    );

    return response.data.data;
  },

  async exportTopUp(params) {
    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/EcomTopupStaff/ExportTopUp',
      params,
      { responseType: 'blob' },
    );
    downloadFile(response.data, `ExportTopUp_${renderDateTime(dayjs())}.xlsx`);
  },

  async exportTopUpV2(params) {
    const response = await apiClient.post<ApiResponseModel<any>>(
      '/Ecom/EcomTransaction/ExportGetAllTransaction',
      params,
      { responseType: 'blob' },
    );
    downloadFile(response.data, `ExportTopUp_${renderDateTime(dayjs())}.xlsx`);
  },

  async exportMyTransaction(params) {
    const response = await apiClient.post<ApiResponseModel<any>>(
      '/Ecom/EcomTransaction/ExportMyTransaction',
      params,
      { responseType: 'blob' },
    );
    downloadFile(response.data, `ExportTopUpClient_${renderDateTime(dayjs())}.xlsx`);
  },
  async exportTransactionPush(params) {
    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/EcomListingMemberPackage/ExportTransactionPush',
      params,
      { responseType: 'blob' },
    );
    downloadFile(response.data, `ExportTransactionPush_${renderDateTime(dayjs())}.xlsx`);
  },
  async exportMyTransactionPush(params) {
    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/EcomListingMemberPackage/ExportMyTransactionPush',
      params,
      { responseType: 'blob' },
    );
    downloadFile(response.data, `ExportTransactionPushClient_${renderDateTime(dayjs())}.xlsx`);
  },
  async exportTransactionPackage(params) {
    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/EcomListingMemberPackage/ExportTransactionPackage',
      params,
      { responseType: 'blob' },
    );
    downloadFile(response.data, `ExportTransactionPackage_${renderDateTime(dayjs())}.xlsx`);
  },
  async exportMyTransactionPackage(params) {
    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/EcomListingMemberPackage/ExportMyTransactionPackage',
      params,
      { responseType: 'blob' },
    );
    downloadFile(response.data, `ExportTransactionPackageClient_${renderDateTime(dayjs())}.xlsx`);
  },
};
export default TransactionApiInAdmin;
