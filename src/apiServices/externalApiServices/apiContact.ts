import { applyQuery } from '@/libs/helper';
import ApiResponseModel from '../../models/reponseModel/apiResponseModel';
import apiClient from './apiClient';
const contactApiService = {
  getListContact: async (filter: any): Promise<ApiResponseModel<any>> => {
    const query = applyQuery(filter);

    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/EcomContact/GetByQuery',
      query,
    );
    return response.data.data;
  },
  getListContactForStaff: async (filter: any): Promise<ApiResponseModel<any>> => {
    const query = applyQuery(filter);

    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/EcomContact/GetByQueryByStaff',
      query,
    );
    return response.data.data;
  },
  getByid: async (id: string): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(`Ecom/EcomContact/GetById`, {
      params: {
        id: id,
      },
    });
    return response.data.data;
  },
  createContact: async (body: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>('Ecom/EcomContact/Create', body);
    return response.data;
  },
  updateContact: async (body: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>('Ecom/EcomContact/Update', body);

    return response.data;
  },
};

export default contactApiService;
