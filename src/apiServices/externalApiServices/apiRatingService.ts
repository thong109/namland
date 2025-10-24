import ApiResponseModel from '../../models/reponseModel/apiResponseModel';
import apiClient from './apiClient';

const ratingApiService = {
  submitRating: async (body: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>('EcomRating/Create', body);
    return response.data;
  },

  getAllRatingAdmin: async (params: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>('/EcomRating/GetAll', { params });

    return response.data.data;
  },

  getAllRatingAgent: async (params: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>('/EcomRating/GetAllMyRating', {
      params,
    });

    return response.data.data;
  },
  activeOrInActive: async (body: any): Promise<any> => {
    await apiClient.post<ApiResponseModel<any>>('/EcomRating/Active', {
      ...body,
    });
  },

  getAllByUserId: async (params: any): Promise<any> => {
    const response = await apiClient.get<ApiResponseModel<any>>('/EcomRating/GetAllByUserId', {
      params: {
        ...params,
      },
    });

    return response.data.data;
  },
};

export default ratingApiService;
