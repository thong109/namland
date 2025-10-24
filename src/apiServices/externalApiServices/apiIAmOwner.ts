import { IamOwnerAdminDetailModel } from '@/models/iamOwner/iamOwnerAdmin';
import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import apiClient from './apiClient';

const iamOwnerApiInAdmin = {
  getDetailEdit: async (): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>('/Ecom/Owner/GetDetailEdit');

    return IamOwnerAdminDetailModel.assign(response.data.data);
  },

  createOrUpdate: async (body, valuesEdit): Promise<ApiResponseModel<any>> => {
    const formData = new FormData();
    (valuesEdit.imageBanner || []).forEach((file) => {
      const partName = `OWNERBANNER`;
      formData.append(partName, file);
    });
    if (valuesEdit.imageService1) {
      formData.append(`Service 1`, valuesEdit.imageService1);
    }
    if (valuesEdit.imageService2) {
      formData.append(`Service 2`, valuesEdit.imageService2);
    }
    if (valuesEdit.imageService3) {
      formData.append(`Service 3`, valuesEdit.imageService3);
    }
    formData.append(`model`, JSON.stringify(body));
    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/Owner/CreateOrUpdate',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  },
};
export default iamOwnerApiInAdmin;
