import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import apiClient from './apiClient';

const listingApiPackageService = {
  getListPackage: async (params: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      '/Ecom/EcomListingPackage/GetByQuery',
      {
        params,
      },
    );

    return response.data.data;
  },

  getById: async (id: string): Promise<any> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      `/Ecom/EcomListingPackage/GetDetail`,
      {
        params: {
          id: id,
        },
      },
    );

    return response.data.data;
  },

  createPackage: async (body: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/EcomListingPackage/Create',
      body,
    );
    return response.data;
  },
  updatePackage: async (body: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.put<ApiResponseModel<any>>(
      'Ecom/EcomListingPackage/Update',
      body,
    );

    return response.data;
  },
};
export default listingApiPackageService;
