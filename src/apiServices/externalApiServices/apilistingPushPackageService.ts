import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import apiClient from './apiClient';

const pushlistingApiPackageService = {
  getListPushPackage: async (params: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      '/Ecom/EcomListingPush/GetByQuery',
      {
        params,
      },
    );

    return response.data.data;
  },

  getById: async (id): Promise<any> => {
    const response = await apiClient.get<ApiResponseModel<any>>(`/Ecom/EcomListingPush/GetDetail`, {
      params: {
        id: id,
      },
    });

    return response.data.data;
  },

  createPushPackage: async (body: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/EcomListingPush/CreateOrUpdate',
      body,
    );
    return response.data;
  },
  updatePushPackage: async (body: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      '/Ecom/EcomListingPush/Update',
      body,
    );

    return response.data;
  },
};
export default pushlistingApiPackageService;
