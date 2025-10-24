import { applyQuery } from '@/libs/helper';
import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import PageResultModel from '@/models/reponseModel/pageResultModel';
import SearchRequestModel from '@/models/searchModel/searchRequestModel';
import { StaffDetailModel } from '@/models/staffModel/staffDetailModel';
import { IStaffFilterModelInAdmin } from '@/models/staffModel/staffFilterModel';
import apiClient from './apiClient';

const staffApiService = {
  getListStaff: async (
    filter: SearchRequestModel,
  ): Promise<ApiResponseModel<PageResultModel<IStaffFilterModelInAdmin>>> => {
    const query = applyQuery(filter);
    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/EcomAccount/GetStaffByQuery',
      query,
    );
    return response.data;
  },

  getById: async (id: string): Promise<any> => {
    const response = await apiClient.get<ApiResponseModel<any>>(`Ecom/EcomAccount/GetDetailById`, {
      params: {
        id: id,
      },
    });

    return StaffDetailModel.assign(response.data.data);
  },

  createStaff: async (projectInfo: any, avatar: File): Promise<ApiResponseModel<any>> => {
    const formData = new FormData();
    formData.append(`model`, JSON.stringify(projectInfo));
    if (avatar) {
      formData.append('avatar', avatar);
    }
    const response = await apiClient.post<ApiResponseModel<any>>(
      '/Ecom/EcomAccount/Create',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  },

  updateStaff: async (projectInfo: any, avatar: File): Promise<ApiResponseModel<any>> => {
    const formData = new FormData();
    formData.append(`model`, JSON.stringify(projectInfo));
    if (avatar) {
      formData.append('avatar', avatar);
    }

    const response = await apiClient.put<ApiResponseModel<any>>(
      'Ecom/EcomAccount/Update',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  },

  activeOrInActiveMember: async (body: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(`Ecom/EcomAccount/Active`, body);
    return response.data;
  },
};

export default staffApiService;
