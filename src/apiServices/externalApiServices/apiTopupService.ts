import { IModalPayment, PaymentResponeModel } from '@/models/TopupModel/paymentResponeModel';
import { ResponePaymentStatus } from '@/models/TopupModel/responePaymentStatus';
import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import apiClient from './apiClient';

const apiTopupService = {
  getListRedeemPackage: async (params: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      '/Ecom/EcomListingPackage/GetList',
      {
        params,
      },
    );

    return response.data.data;
  },

  getById: async (id: string): Promise<any> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      `/Ecom/EcomListingPackage/GetDetail`,
      {
        params: {
          id: id,
        },
      },
    );

    return response.data.data;
  },

  createPackage: async (body: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/EcomListingPackage/Create',
      body,
    );
    return response.data;
  },
  updatePackage: async (body: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.put<ApiResponseModel<any>>(
      'Ecom/EcomListingPackage/Update',
      body,
    );

    return response.data;
  },

  redeemAPackage: async (body: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      '/Ecom/EcomListingMemberPackage/RedeemAPackage',
      body,
    );
    return response.data;
  },

  redeemAPush: async (body: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      '/Ecom/EcomListingMemberPackage/RedeemAPush',
      body,
    );
    return response?.data;
  },

  createOrderPayment: async (body: any): Promise<IModalPayment> => {
    const response = await apiClient.post<ApiResponseModel<any>>('/Ecom/PayMe/Payment/Web', body);
    return PaymentResponeModel.assign(response.data.data);
  },

  getQueryOrder: async (params: any): Promise<ResponePaymentStatus> => {
    const response = await apiClient.get<ApiResponseModel<any>>('/Ecom/PayMe/Payment/Query', {
      params,
    });
    return ResponePaymentStatus.assign(response.data.data);
  },

  GetListFeeConfig: async (): Promise<any[]> => {
    const response = await apiClient.post<ApiResponseModel<any>>('/EcomConfigPayment/GetList');

    return response.data.data;
  },
};
export default apiTopupService;
