import { BannerListModel } from '@/models/propertyModel/bannerListModal';
import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import PageResultModel from '@/models/reponseModel/pageResultModel';
import SearchBannerModel from '@/models/searchModel/searchBannerModel';
import apiClient from './apiClient';

const AgentApiService = {
  getAgentList: async (
    body: SearchBannerModel,
  ): Promise<ApiResponseModel<PageResultModel<BannerListModel>>> => {
    const response = await apiClient.post<ApiResponseModel<any>>('/Ecom/EcomFindAgent/GetAll', {
      body,
    });
    return response.data.data;
  },
  getById: async (id: string): Promise<any> => {
    const response = await apiClient.get<ApiResponseModel<any>>(`/Ecom/EcomFindAgent/Get`, {
      params: {
        id: id,
      },
    });
    return response.data.data;
  },

  createAgent: async (body): Promise<ApiResponseModel<string>> => {
    const formData = new FormData();

    if (body?.image) {
      formData.append('files', body?.image);
    }

    formData.append(`model`, JSON.stringify({}));

    const response = await apiClient.post<ApiResponseModel<any>>(
      '/Ecom/EcomFindAgent/Create',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  },

  updateAgent: async (body): Promise<ApiResponseModel<string>> => {
    const formData = new FormData();

    if (body?.image) {
      formData.append('files', body?.image);
    }

    formData.append(`model`, JSON.stringify({ id: body?.id, isActive: body?.isActive }));

    const response = await apiClient.put<ApiResponseModel<any>>(
      '/Ecom/EcomFindAgent/Update',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  },

  getListNoFilter: async (params?: any): Promise<ApiResponseModel<any[]>> => {
    const response = await apiClient.get<ApiResponseModel<any>>('/Ecom/EcomFindAgent/GetList', {
      params,
    });
    return response.data?.data;
  },

  updateOrder: async (ids: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.put<ApiResponseModel<any>>(
      '/Ecom/EcomFindAgent/UpdateOrder',
      ids,
    );
    return response.data;
  },

  delete: async (id): Promise<ApiResponseModel<string>> => {
    const response = await apiClient.delete<ApiResponseModel<any>>('Ecom/EcomFindAgent/Delete', {
      params: {
        id: id,
      },
    });

    return response.data;
  },
};

export default AgentApiService;
