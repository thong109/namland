import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import apiClient from './apiClient';

const ApicheckHealth = {
  getStatusHealth: async (): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(`/Ecom/Reports/ReportEcommerce`);

    return response.data;
  },
};

export default ApicheckHealth;
