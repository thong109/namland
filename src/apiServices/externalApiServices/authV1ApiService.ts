import PhoneLoginModel from '@/models/accountV1Model/phoneLoginModel';
import PhoneLoginResponseModel from '@/models/accountV1Model/phoneLoginResponseModel';
import ApiResponseModel from '../../models/reponseModel/apiResponseModel';
import apiClient from './apiClient';

const authV1ApiService = {
  login: async (data: PhoneLoginModel): Promise<ApiResponseModel<PhoneLoginResponseModel>> => {
    const response = await apiClient.post<ApiResponseModel<PhoneLoginResponseModel>>(
      'Ecom/v1/EcomAccount/Login',
      data,
    );
    return response.data;
  },
};

export default authV1ApiService;
