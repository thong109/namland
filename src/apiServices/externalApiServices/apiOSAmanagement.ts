import { OSADetailModel } from '@/models/OASModel/osaDetailModel';
import { TicketListModel } from '@/models/propertyModel/TicketModel';
import PageResultModal from '@/models/reponseModel/pageResultModel';
import ApiResponseModel from '../../models/reponseModel/apiResponseModel';
import apiClient from './apiClient';

const apiOSAService = {
  getListOSA: async (params: any): Promise<ApiResponseModel<PageResultModal<TicketListModel>>> => {
    const response = await apiClient.get<ApiResponseModel<any>>('/Ecom/OSA/GetByQuery', {
      params,
    });
    return response.data?.data;
  },

  getByid: async (id: string): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(`/Ecom/OSA/GetDetail`, {
      params: {
        id: id,
      },
    });
    return OSADetailModel.assign(response.data.data);
  },

  update: async (body: any): Promise<any> => {
    const response = await apiClient.put<ApiResponseModel<any>>('/Ecom/OSA/Update', body);

    return response.data;
  },

  create: async (body: any): Promise<any> => {
    const response = await apiClient.post<ApiResponseModel<any>>('/Ecom/OSA/Create', body);

    return response.data;
  },
};

export default apiOSAService;
