import { renderDateTime } from '@/libs/appconst';
import { downloadFile } from '@/libs/helper';
import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import dayjs from 'dayjs';
import apiClient from './apiClient';

const ReportApiService = {
  //Public
  getReport: async (param): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      `/Ecom/Reports/ReportEcommerce`,
      param,
    );
    return response.data;
  },

  //Priveate use only staff, admin, manager

  // Tổng số người dùng
  ExportTotalUser: async (param): Promise<any> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      `/Ecom/Reports/ExportTotalUser`,
      param,
      { responseType: 'blob' },
    );

    downloadFile(response.data, `ExportTotalUser_${renderDateTime(dayjs())}.xlsx`);
  },

  // Tổng số người đăng tin
  ExportTotalOwner: async (param): Promise<any> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      `/Ecom/Reports/ExportTotalOwner`,
      param,
      { responseType: 'blob' },
    );

    downloadFile(response.data, `ExportTotalOwner_${renderDateTime(dayjs())}.xlsx`);
  },

  // Tổng số tin đăng
  ExportTotalListing: async (param): Promise<any> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      `/Ecom/Reports/ExportTotalListing`,
      param,
      { responseType: 'blob' },
    );

    downloadFile(response.data, `ExportTotalListing_${renderDateTime(dayjs())}.xlsx`);
  },

  // Tổng số tin đăng mới
  ExportListingByQuery: async (param): Promise<any> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      `/Ecom/Reports/ExportListingByQuery`,
      param,
      { responseType: 'blob' },
    );
    downloadFile(response.data, `ExportListingByQuery_${renderDateTime(dayjs())}.xlsx`);
  },

  // Tổng số đơn hàng
  ExportToTalListingByQuery: async (param): Promise<any> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      `/Ecom/Reports/ExportToTalListingByQuery`,
      param,
      { responseType: 'blob' },
    );
    downloadFile(response.data, `ExportToTalListingByQuery_${renderDateTime(dayjs())}.xlsx`);
  },

  // Số đơn hàng thành công
  ExportListingSuccess: async (param): Promise<any> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      `/Ecom/Reports/ExportListingSuccess`,
      param,
      { responseType: 'blob' },
    );
    downloadFile(response.data, `ExportListingSuccess_${renderDateTime(dayjs())}.xlsx`);
  },

  // Số đơn hàng không thành công
  ExportListingFailed: async (param): Promise<any> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      `/Ecom/Reports/ExportListingFailed`,
      param,
      { responseType: 'blob' },
    );
    downloadFile(response.data, `ExportListingFailed_${renderDateTime(dayjs())}.xlsx`);
  },

  //Tổng giá trị giao dịch
  ExportTransactionSuccess: async (param): Promise<any> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      `/Ecom/Reports/ExportTransactionSuccess`,
      param,
      { responseType: 'blob' },
    );
    downloadFile(response.data, `ExportTransactionSuccess_${renderDateTime(dayjs())}.xlsx`);
  },
};

export default ReportApiService;
