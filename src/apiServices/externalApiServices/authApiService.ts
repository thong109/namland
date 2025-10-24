import ProfileModel from '@/models/accountModel/profileModel';
import UploadModal from '@/models/accountModel/uploadModel';
import AccountModel from '../../models/accountModel/accountModel';
import LoginModel from '../../models/accountModel/loginModel';
import LoginResponseModel from '../../models/accountModel/loginResponseModel';
import ApiResponseModel from '../../models/reponseModel/apiResponseModel';
import apiClient from './apiClient';

const authApiService = {
  login: async (data: LoginModel): Promise<ApiResponseModel<LoginResponseModel>> => {
    const response = await apiClient.post<ApiResponseModel<LoginResponseModel>>(
      'Ecom/EcomAccount/Login',
      data,
    );
    return response.data;
  },
  getCurrentUser: async (): Promise<ApiResponseModel<AccountModel>> => {
    const response = await apiClient.get<ApiResponseModel<AccountModel>>('Ecom/EcomAccount/Me');
    return response.data;
  },

  updateProfile: async (data: any): Promise<ApiResponseModel<ProfileModel>> => {
    const response = await apiClient.post<ApiResponseModel<ProfileModel>>(
      'Ecom/EcomAccount/UpdateOwnMember',
      { ...data },
    );
    return response.data;
  },

  uploadAvatar: async (file): Promise<ApiResponseModel<UploadModal>> => {
    const formData = new FormData();
    formData.append(`avatar`, file);

    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/EcomAccount/UpdateOwnAvatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  },

  changePassword: async (data: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/EcomAccount/ChangePassword',
      { ...data },
    );
    return response.data;
  },
  updateLang: async (lang: string): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      `Ecom/EcomAccount/UpdateLanguage/${lang}`,
    );
    return response.data;
  },

  linkSocial: async (data: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      '/Ecom/v1/EcomAccount/LinkSocial',
      { ...data },
    );
    return response.data;
  },

  removeSocial: async (authProvider: string): Promise<any> => {
    const response = await apiClient.delete<ApiResponseModel<any>>(
      `/Ecom/v1/EcomAccount/RemoveSocial`,
      {
        params: {
          authProvider: authProvider,
        },
      },
    );
    return response.data.data;
  },

  updateCorporate: async (data: any): Promise<ApiResponseModel<ProfileModel>> => {
    const response = await apiClient.post<ApiResponseModel<ProfileModel>>(
      'Ecom/EcomAccount/UpdateCorporate',
      { ...data },
    );
    return response.data;
  },
};

export default authApiService;
