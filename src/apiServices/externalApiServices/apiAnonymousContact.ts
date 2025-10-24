import ReviewModelAgency from '@/models/inqueryModel/ReviewAgencyModel';
import ReviewModel from '@/models/inqueryModel/ReviewModel';
import ApiResponseModel from '../../models/reponseModel/apiResponseModel';
import apiClient from './apiClient';
const contactAnonymousService = {
  createContactMe: async (body: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>('Ecom/EcomContact/Create', body);
    return response.data;
  },
  createContactUS: async (body: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/EcomContact/ContactUs',
      body,
    );

    return response.data;
  },
  submitSubscriber: async (body: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/EcomContact/Subscriber',
      body,
    );
    return response.data;
  },
  submitInquiry: async (body: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>('/Ecom/EcomInquiry/Create', body);
    return response.data;
  },
  submitReviewListing: async (body: ReviewModel): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      '/Ecom/EcomReview/CreateListing',
      body,
    );
    return response.data;
  },
  submitReviewAgency: async (body: ReviewModelAgency): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      '/Ecom/EcomReview/CreateMember',
      body,
    );
    return response.data;
  },

  submitFindAHome: async (body: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>('/Ecom/EcomFindHome/Create', body);
    return response.data;
  },
};

export default contactAnonymousService;
