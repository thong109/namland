import { NewHomeModel } from '@/models/newHomeModel/newHomeModel';
import { NewHomeLandingPageModel } from '@/models/newHomeModel/newHomeModelLandingPage';
import { IProjectFilterModelInAdmin } from '@/models/projectModelInAdmin/projectModelInAdmin';
import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import PageResultModel from '@/models/reponseModel/pageResultModel';
import apiClient from './apiClient';

const newHomeApiService = {
  getAll: async (
    params: any,
  ): Promise<ApiResponseModel<PageResultModel<IProjectFilterModelInAdmin>>> => {
    const response = await apiClient.get<ApiResponseModel<any>>('/EcomNewHomes/GetAll', { params });

    return response.data.data;
  },

  getById: async (id: string): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(`/EcomNewHomes/Get`, {
      params: {
        id: id,
      },
    });

    return NewHomeModel.assign(response.data.data);
  },

  create: async (body): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>('/EcomNewHomes/Create', body);

    return response.data;
  },

  update: async (body): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.put<ApiResponseModel<any>>('/EcomNewHomes/Update', body);

    return response.data;
  },

  Active: async (body): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>('/EcomNewHomes/Active', body);

    return response.data;
  },

  createInquiryChat: async (body): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      '/EcomNewHomesInquiry/Create',
      body,
    );

    return response.data;
  },

  favorite: async (body): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>('/EcomNewHomes/Favorite', body);

    return response.data;
  },

  getLandingPageWithId: async (id: string): Promise<NewHomeLandingPageModel> => {
    const response = await apiClient.get<ApiResponseModel<any>>(`EcomNewHomes/GetLandingPage`, {
      params: {
        id: id,
      },
    });

    return response.data.data;
  },
};
export default newHomeApiService;
