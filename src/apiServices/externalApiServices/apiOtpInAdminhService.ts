import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import apiClient from './apiClient';

const otpApiInAdmin = {
  getListOtp: async (params: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>('/Ecom/Otp/GetOtpByQuery', {
      params,
    });

    return response.data.data;
  },
};
export default otpApiInAdmin;
