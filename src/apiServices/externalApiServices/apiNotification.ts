import ApiResponseModel from '../../models/reponseModel/apiResponseModel';

import apiClient from './apiClient';

const notifyApiService = {
  getListNotify: async (filter?: any): Promise<any> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/EcomNotification/GetByQuery',
      { ...filter, from: 0, size: 5000 },
    );
    return response.data?.data;
  },

  markReadNotify: async (id: string): Promise<any> => {
    await apiClient.post<ApiResponseModel<any>>(`Ecom/EcomNotification/MarkRead?id=${id}`);
  },

  getCountUnRead: async (): Promise<any> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      'Ecom/EcomNotification/CountUnread',
    );

    return response.data.data;
  },

  markReadAll: async (): Promise<any> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/EcomNotification/MarkReadAll',
    );

    return response.data;
  },
};

export default notifyApiService;
