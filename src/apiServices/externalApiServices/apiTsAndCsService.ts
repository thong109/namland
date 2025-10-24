import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import apiClient from './apiClient';

const TsAndCsService = {
  getData: async (params: any): Promise<any> => {
    const response = await apiClient.get<ApiResponseModel<any>>(`/EcomTermsCondition/Get`, {
      params,
    });

    return response.data.data;
  },

  createOrUpdate: async (body: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      '/EcomTermsCondition/CreateOrUpdate',
      body,
    );

    return response.data;
  },
  getLandingPage: async (params: any): Promise<any> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      `/EcomTermsCondition/GetLandingPage`,
      {
        params,
      },
    );

    return response.data.data;
  },
};

export default TsAndCsService;
