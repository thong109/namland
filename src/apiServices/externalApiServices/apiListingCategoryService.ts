import { applyQuery } from '@/libs/helper';
import { ProductTypeDetailModel } from '@/models/propertyModel/ProductTypeModel';
import { PropertyTypeModel } from '@/models/propertyModel/propertyTypeModel';
import ApiResponseModel from '../../models/reponseModel/apiResponseModel';
import apiClient from './apiClient';

const listingCategoriApiService = {
  getAll: async (filter: any): Promise<ApiResponseModel<any>> => {
    const query = applyQuery(filter);

    const response = await apiClient.post<ApiResponseModel<any>>(
      'EcomListingCategory/GetByQuery',
      query,
    );
    return response.data.data;
  },

  getById: async (id: string): Promise<any> => {
    const response = await apiClient.get<ApiResponseModel<any>>(`/EcomListingCategory/GetById`, {
      params: {
        id: id,
      },
    });

    return ProductTypeDetailModel.assign(response.data.data);
  },

  create: async (body): Promise<ApiResponseModel<string>> => {
    const formData = new FormData();

    if (body?.productIcon) {
      formData.append('listingCategoryIcon', body?.productIcon);
    }

    formData.append(`model`, JSON.stringify(body));

    const response = await apiClient.post<ApiResponseModel<any>>(
      'EcomListingCategory/Create',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  },
  update: async (body): Promise<ApiResponseModel<string>> => {
    const formData = new FormData();

    if (body?.productIcon) {
      formData.append('listingCategoryIcon', body?.productIcon);
    }

    formData.append(`model`, JSON.stringify(body));

    const response = await apiClient.put<ApiResponseModel<any>>(
      'EcomListingCategory/Update',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  },

  activeOrInActice: async (id): Promise<ApiResponseModel<string>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      '/EcomListingCategory/UpdateStatus',
      {
        params: {
          id: id,
        },
      },
    );

    return response.data;
  },

  updateOrder: async (ids: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      'EcomListingCategory/UpdateOrder',
      ids,
    );
    return response.data;
  },

  getPropertyTypes: async (params?: any): Promise<ApiResponseModel<PropertyTypeModel[]>> => {
    const response = await apiClient.get<ApiResponseModel<any>>('EcomListingCategory/GetList', {
      params,
    });
    return response.data?.data;
  },
};

export default listingCategoriApiService;
