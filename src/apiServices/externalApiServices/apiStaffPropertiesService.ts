import { PropertyDetailModel } from '@/models/propertyModel/propertyDetailModel';
import { PropertyListModel } from '@/models/propertyModel/propertyListModel';
import { PropertyUpdateModel } from '@/models/propertyModel/propertyUpdateModel';
import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import PageResultModel from '@/models/reponseModel/pageResultModel';
import SearchRequestModel from '@/models/searchModel/searchRequestModel';
import ApiUtil from '@/utils/apiUtil';
import { PropertyCreateModel } from '../../models/propertyModel/propertyCreateModel';
import apiClient from './apiClient';

const apiStaffPropertiesService = {
  saveAsDraft: async (
    property: PropertyCreateModel | PropertyUpdateModel,
  ): Promise<ApiResponseModel<string>> => {
    const formData = new FormData();
    (property.gallery || []).forEach((file) => {
      const partName = `gallery`;
      formData.append(partName, file);
    });

    (property.saleContract || []).forEach((file) => {
      const partName = `saleContract`;
      formData.append(partName, file);
    });
    (property.saleContract || []).forEach((file) => {
      const partName = `certificateOfTitle`;
      formData.append(partName, file);
    });

    formData.append(`imageThumbnail`, property.imageThumbnail);

    formData.append(`model`, JSON.stringify(property));

    const response = await apiClient.post<ApiResponseModel<any>>(
      '/EcomListing/CreateByUser/Multipart',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  },

  saveAndSendForApproval: async (
    property: PropertyCreateModel | PropertyUpdateModel,
  ): Promise<ApiResponseModel<string>> => {
    const formData = ApiUtil.getFormData(property);
    // should return property id
    return Promise.resolve({
      success: true,
      data: '12345',
    });
  },
  sendForApproval: async (propertyId: string): Promise<ApiResponseModel<boolean>> => {
    return Promise.resolve({
      success: true,
      data: true,
    });
  },
  //todo
  takeDown: async (propertyId: string): Promise<ApiResponseModel<boolean>> => {
    return Promise.resolve({
      success: true,
      data: true,
    });
  },
  //todo
  cancelRequest: async (propertyId: string): Promise<ApiResponseModel<boolean>> => {
    return Promise.resolve({
      success: true,
      data: true,
    });
  },

  getPropertiesList: async (
    filter: SearchRequestModel,
  ): Promise<ApiResponseModel<PageResultModel<PropertyListModel>>> => {
    const response = await apiClient.post<ApiResponseModel<any>>('EcomListing/GetByQueryForStaff', {
      from: filter.from || 0,
      size: filter.size || 10,
    });
    return response.data.data;
  },

  getDetailByQueryForStaff: async (id: string): Promise<any> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      `EcomListing/GetDetailByQueryForStaff`,
      {
        params: {
          id: id,
        },
      },
    );

    return PropertyDetailModel.assign(response.data.data);
  },
  getDetailForEditByStaff: async (id: string): Promise<ApiResponseModel<PropertyDetailModel>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      `EcomListing/GetDetailForEditByStaff`,
      {
        params: {
          id: id,
        },
      },
    );

    return response.data.data;
  },
};

export default apiStaffPropertiesService;
