import { INewFilterModelInAdmin } from '@/models/newsModel/newFilterModel';
import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import PageResultModel from '@/models/reponseModel/pageResultModel';
import apiClient from './apiClient';

const paymeConfigService = {
  migrationPayment: async (): Promise<
    ApiResponseModel<PageResultModel<INewFilterModelInAdmin>>
  > => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      '/EcomConfigPayment/MigrationPayment',
    );

    return response.data.data;
  },

  GetAll: async (): Promise<ApiResponseModel<PageResultModel<INewFilterModelInAdmin>>> => {
    const response = await apiClient.post<ApiResponseModel<any>>('/EcomConfigPayment/GetAll', {
      from: 0,
      size: 500,
    });

    return response.data;
  },

  GetAllAuditLog: async (key: string): Promise<ApiResponseModel<PageResultModel<any>>> => {
    const response = await apiClient.get<ApiResponseModel<any>>('/Ecom/EcomAuditLog/GetAuditLog', {
      params: {
        Action: key,
      },
    });

    return response.data.data;
  },

  getById: async (id: string): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(`EcomConfigPayment/Get`, {
      params: {
        id: id,
      },
    });

    return response.data.data;
  },

  update: async (body: any): Promise<ApiResponseModel<PageResultModel<INewFilterModelInAdmin>>> => {
    const response = await apiClient.post<ApiResponseModel<any>>('/EcomConfigPayment/Update', body);

    return response.data.data;
  },
};
export default paymeConfigService;
