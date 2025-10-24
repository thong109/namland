import { LADetailModel } from '@/models/LAModel/LADetailModel';
import { IProjectFilterModelInAdmin } from '@/models/projectModelInAdmin/projectModelInAdmin';
import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import PageResultModel from '@/models/reponseModel/pageResultModel';
import apiClient from './apiClient';

const leaseAgreementApiService = {
  getListLA: async (
    params: any,
  ): Promise<ApiResponseModel<PageResultModel<IProjectFilterModelInAdmin>>> => {
    const response = await apiClient.get<ApiResponseModel<any>>('Ecom/LA/GetByQuery', { params });

    return response.data.data;
  },

  getById: async (id: string): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(`Ecom/LA/GetDetail`, {
      params: {
        id: id,
      },
    });
    return LADetailModel.assign(response.data.data);
  },

  createLA: async (body: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>('/Ecom/LA/Create', body);

    return response.data;
  },

  updateLA: async (body: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.put<ApiResponseModel<any>>('Ecom/LA/Update', body);

    return response.data;
  },
};
export default leaseAgreementApiService;
