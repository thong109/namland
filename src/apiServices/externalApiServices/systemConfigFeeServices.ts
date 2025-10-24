import { INewFilterModelInAdmin } from '@/models/newsModel/newFilterModel';
import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import PageResultModel from '@/models/reponseModel/pageResultModel';
import apiClient from './apiClient';

const SystemConfigFeeService = {
  migrationPayment: async (): Promise<
    ApiResponseModel<PageResultModel<INewFilterModelInAdmin>>
  > => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      '/Ecom/EcomVatConfig/MigrationVatDefault',
    );

    return response.data.data;
  },

  GetAll: async (): Promise<ApiResponseModel<PageResultModel<INewFilterModelInAdmin>>> => {
    const response = await apiClient.post<ApiResponseModel<any>>('/Ecom/EcomVatConfig/GetAll', {
      from: 0,
      size: 500,
    });

    return response.data.data;
  },

  getById: async (id: string): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(`/Ecom/EcomVatConfig/Get`, {
      params: {
        id: id,
      },
    });

    return response.data.data;
  },

  update: async (body: any): Promise<ApiResponseModel<PageResultModel<INewFilterModelInAdmin>>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      '/Ecom/EcomVatConfig/Update',
      body,
    );

    return response.data.data;
  },

  create: async (body: any): Promise<ApiResponseModel<PageResultModel<INewFilterModelInAdmin>>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      '/Ecom/EcomVatConfig/Create',
      body,
    );

    return response.data.data;
  },

  getCurrentFeeVAT: async (): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(`/Ecom/EcomVatConfig/GetCurrent`);

    return response.data.data;
  },

  deleteConfig: async (
    id: any,
  ): Promise<ApiResponseModel<PageResultModel<INewFilterModelInAdmin>>> => {
    const response = await apiClient.delete<ApiResponseModel<any>>(
      '/Ecom/EcomVatConfig/DeleteById',
      {
        params: {
          id: id,
        },
      },
    );

    return response.data.data;
  },
};
export default SystemConfigFeeService;
