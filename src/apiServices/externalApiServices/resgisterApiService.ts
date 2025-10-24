import LoginResponseModel from '@/models/accountModel/loginResponseModel';
import RegisterModel from '@/models/accountModel/registerModel';
import otpModel from '@/models/otpModel';
import forgotModel from '@/models/otpModel/forgotModel';
import otpResponseModel from '@/models/otpModel/otpResponseModel';
import otpSubmitModel from '@/models/otpModel/otpSubmitModel';
import otpSubmitResponseModel from '@/models/otpModel/otpSubmitResponseModel';
import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import apiClient from './apiClient';
const registerApiService = {
  register: async (data: RegisterModel): Promise<ApiResponseModel<LoginResponseModel>> => {
    const response = await apiClient.post<ApiResponseModel<LoginResponseModel>>(
      'Ecom/EcomAccount/Register',
      data,
    );
    return response.data;
  },
  requestOTP: async (data: otpModel): Promise<ApiResponseModel<otpResponseModel>> => {
    const response = await apiClient.post<ApiResponseModel<otpResponseModel>>(
      'Ecom/EcomAccount/RequestOtp',
      data,
    );
    return response.data;
  },
  submitOTP: async (data: otpSubmitModel): Promise<ApiResponseModel<otpSubmitResponseModel>> => {
    const response = await apiClient.post<ApiResponseModel<otpSubmitResponseModel>>(
      'Ecom/EcomAccount/SubmitOtp',
      data,
    );
    return response.data;
  },

  forgotPassword: async (data: forgotModel): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/EcomAccount/SetNewPassword',
      data,
    );
    return response.data;
  },
};

export default registerApiService;
