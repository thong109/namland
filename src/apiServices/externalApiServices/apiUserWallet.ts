import { applyQuery, downloadFile } from '@/libs/helper';
import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import PageResultModel from '@/models/reponseModel/pageResultModel';
import SearchRequestModel from '@/models/searchModel/searchRequestModel';

import { renderDateTime } from '@/libs/appconst';
import { INewFilterModelInAdmin } from '@/models/newsModel/newFilterModel';
import { UserWalletModel } from '@/models/userWalletModel/UserWalletModel';
import dayjs from 'dayjs';
import apiClient from './apiClient';

const userWalletApiInAdmin = {
  getUserWallets: async (
    params: any,
  ): Promise<ApiResponseModel<PageResultModel<INewFilterModelInAdmin>>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      'Ecom/EcomCashAdvanceStaff/GetByQuery',
      {
        params: params,
      },
    );

    return response.data.data;
  },

  getUserTransction: async (
    params: any,
  ): Promise<ApiResponseModel<PageResultModel<INewFilterModelInAdmin>>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      'Ecom/EcomCashAdvanceStaff/GetReceiptByQuery',
      {
        params: params,
      },
    );

    return response.data.data;
  },

  getById: async (id: string): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(`Ecom/EcomArticle/GetDetailById`, {
      params: {
        id: id,
      },
    });

    return UserWalletModel.assign(response.data.data);
  },

  getDataUser: async (
    filter: SearchRequestModel,
  ): Promise<ApiResponseModel<PageResultModel<INewFilterModelInAdmin>>> => {
    const query = applyQuery(filter);
    const response = await apiClient.post<ApiResponseModel<any>>('/baodeptrai', query);

    return response.data;
  },

  async exportCashAdvance(params) {
    const body = {
      fromDate: params.fromDate,
      toDate: params.fromDate,
      cashAdvanceId: params.cashAdvanceId,
    };
    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/EcomCashAdvanceStaff/ExportCashAdvance',
      body,
      { responseType: 'blob' },
    );
    downloadFile(response.data, `ExportCashAdvance_${renderDateTime(dayjs())}.xlsx`);
  },

  async exportExcel(params) {
    const response = await apiClient.post<ApiResponseModel<any>>(
      '/Ecom/EcomCashAdvanceStaff/ExportOverviewCashAdvance',
      params,
    );
    return response.data;
  },
};
export default userWalletApiInAdmin;
