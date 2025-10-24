import { applyQuery } from '@/libs/helper';
import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import PageResultModel from '@/models/reponseModel/pageResultModel';
import SearchRequestModel from '@/models/searchModel/searchRequestModel';
import { IStaffFilterModelInAdmin } from '@/models/staffModel/staffFilterModel';
import apiClient from './apiClient';

const roleApiService = {
  getListRole: async (
    filter: SearchRequestModel,
  ): Promise<ApiResponseModel<PageResultModel<IStaffFilterModelInAdmin>>> => {
    const query = applyQuery(filter);
    const response = await apiClient.post<ApiResponseModel<any>>('AccessGroup/GetByQuery', query);
    return response.data;
  },
  getRolesInStaff: async (
    filter: SearchRequestModel,
  ): Promise<ApiResponseModel<PageResultModel<IStaffFilterModelInAdmin>>> => {
    const query = applyQuery(filter);
    const response = await apiClient.post<ApiResponseModel<any>>('AccessGroup/GetAll', query);
    return response.data;
  },

  getById: async (id: string): Promise<any> => {
    const response = await apiClient.get<ApiResponseModel<any>>(`AccessGroup/GetDetailById`, {
      params: {
        id: id,
      },
    });

    return response.data;
  },

  createRole: async (roleInfo: any): Promise<ApiResponseModel<any>> => {
    const formData = new FormData();
    formData.append(`model`, JSON.stringify(roleInfo));

    const response = await apiClient.post<ApiResponseModel<any>>('/AccessGroup/Create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  updateRole: async (roleInfo: any): Promise<ApiResponseModel<any>> => {
    const formData = new FormData();
    formData.append(`model`, JSON.stringify(roleInfo));

    const response = await apiClient.put<ApiResponseModel<any>>('/AccessGroup/Update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};

export default roleApiService;
