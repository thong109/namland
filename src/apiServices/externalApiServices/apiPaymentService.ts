import { INewFilterModelInAdmin } from '@/models/newsModel/newFilterModel';
import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import PageResultModel from '@/models/reponseModel/pageResultModel';
import apiClient from './apiClient';

const apiPaymentService = {
  getListTransactionTopup: async (
    params: any,
  ): Promise<ApiResponseModel<PageResultModel<INewFilterModelInAdmin>>> => {
    const response = await apiClient.get<ApiResponseModel<any>>('Ecom/EcomTopupStaff/GetByQuery', {
      params,
    });

    return response.data.data;
  },

  topupPoint4user: async (body: any): Promise<any> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      '/Ecom/EcomTopupStaff/CreateRequest',
      body,
    );

    return response.data;
  },

  getAutoCompleteClient: async (keyword: string): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      '/Ecom/EcomAccount/GetAutoCompleteCustomer',
      {
        params: {
          input: keyword,
        },
      },
    );
    return response.data;
  },
};
export default apiPaymentService;
