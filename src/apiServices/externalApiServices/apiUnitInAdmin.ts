import { IProjectFilterModelInAdmin } from '@/models/projectModelInAdmin/projectModelInAdmin';
import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import PageResultModel from '@/models/reponseModel/pageResultModel';
import { UnitDetailModel } from '@/models/unitModel/unitModelInAdmin';
import apiClient from './apiClient';

const unitApiInAdmin = {
  getUnitList: async (
    params: any,
  ): Promise<ApiResponseModel<PageResultModel<IProjectFilterModelInAdmin>>> => {
    const response = await apiClient.get<ApiResponseModel<any>>('EcomUnit/GetAll', { params });

    return response.data.data;
  },

  getListUnit: async (
    params: any,
  ): Promise<ApiResponseModel<PageResultModel<IProjectFilterModelInAdmin>>> => {
    const response = await apiClient.get<ApiResponseModel<any>>('/EcomUnit/GetListByProjectId', {
      params,
    });

    return response.data.data;
  },

  getById: async (id: string): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(`EcomUnit/GetDetail`, {
      params: {
        id: id,
      },
    });

    return UnitDetailModel.assign(response.data.data);
  },

  createUnit: async (body): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>('EcomUnit/Create', body);

    return response.data;
  },

  updateUnit: async (body): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.put<ApiResponseModel<any>>('EcomUnit/Update', body);

    return response.data;
  },
};
export default unitApiInAdmin;
