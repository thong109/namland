import { renderDateTime } from '@/libs/appconst';
import { downloadFile } from '@/libs/helper';
import dayjs from 'dayjs';
import ApiResponseModel from '../../models/reponseModel/apiResponseModel';
import apiClient from './apiClient';
const apiDashBoardService = {
  reportListingForType: async (filter: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      '/Ecom/Reports/ReportListingForType',
      {
        ...filter,
        status: [3],
      },
    );
    return response.data;
  },

  reportListingForCategoryEveryMonth: async (filter: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      '/Ecom/Reports/ReportListingForCategoryEveryMonth',
      {
        ...filter,
        status: [3],
        type: [0],
        listingCategories: [],
      },
    );
    return response.data;
  },

  reportListingForCategory: async (filter: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      '/Ecom/Reports/ReportListingForCategory',
      {
        ...filter,
        status: [3],
        type: [0],
        listingCategories: [],
      },
    );
    return response.data;
  },

  reportListingAveragePriceSale: async (filter: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      '/Ecom/Reports/ReportListingAveragePrice',
      {
        ...filter,
        status: [3],
        type: [1],
        listingCategories: [],
      },
    );
    return response.data;
  },
  reportListingAveragePriceRent: async (filter: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      '/Ecom/Reports/ReportListingAveragePrice',
      {
        ...filter,
        status: [3],
        type: [0],
        listingCategories: [],
      },
    );
    return response.data;
  },

  reportGetTopListingSale: async (filter: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      '/Ecom/Reports/ReportGetTopListing',
      {
        ...filter,
        status: [3],
        type: [1],
        listingCategories: [],
      },
    );
    return response.data;
  },

  reportGetTopListingRent: async (filter: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      '/Ecom/Reports/ReportGetTopListing',
      {
        ...filter,
        status: [3],
        type: [0],
        listingCategories: [],
      },
    );
    return response.data;
  },
  reportListingAreaSale: async (filter: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      '/Ecom/Reports/ReportListingArea',
      {
        ...filter,
        status: [3],
        type: [0],
      },
    );
    return response.data;
  },

  reportListingAreaRent: async (filter: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      '/Ecom/Reports/ReportListingArea',
      {
        ...filter,
        status: [3],
        type: [1],
      },
    );
    return response.data;
  },
  reportListingAreaAVGPriceSale: async (filter: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/Reports/ReportListingAreaAveragePrice',
      {
        ...filter,
        status: [3],
        type: [0],
      },
    );
    return response.data;
  },

  reportListingAreaAVGPriceRent: async (filter: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/Reports/ReportListingAreaAveragePrice',
      {
        ...filter,
        status: [3],
        type: [1],
      },
    );
    return response.data;
  },

  exportListingAreaSale: async (filter: any): Promise<any> => {
    delete filter.from;
    delete filter.size;
    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/Reports/ExportListingArea',
      {
        ...filter,
        status: [3],
        type: [0],
      },
      { responseType: 'blob' },
    );
    downloadFile(response.data, `Listing_area_sale_${renderDateTime(dayjs())}.xlsx`);
  },
  exportListingAreaRent: async (filter: any): Promise<any> => {
    delete filter.from;
    delete filter.size;
    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/Reports/ExportListingArea',
      {
        ...filter,
        status: [3],
        type: [0],
      },
      { responseType: 'blob' },
    );
    downloadFile(response.data, `Listing_area_rent_${renderDateTime(dayjs())}.xlsx`);
  },
  exportListingAVGSale: async (filter: any): Promise<any> => {
    delete filter.from;
    delete filter.size;
    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/Reports/ExportListingAreaAveragePrice',
      {
        ...filter,
        status: [3],
        type: [0],
      },
      { responseType: 'blob' },
    );
    downloadFile(response.data, `Listing_areaAverage_price_sale_${renderDateTime(dayjs())}.xlsx`);
  },
  exportListingAVGRent: async (filter: any): Promise<any> => {
    delete filter.from;
    delete filter.size;
    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/Reports/ExportListingAreaAveragePrice',
      {
        ...filter,
        status: [3],
        type: [0],
      },
      { responseType: 'blob' },
    );

    downloadFile(response.data, `Listing_areaAverage_price_rent_${renderDateTime(dayjs())}.xlsx`);
  },

  getAgentReport: async (filter: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>('Ecom/Reports/GetAgentReport', {
      ...filter,
    });
    return response.data.data;
  },
};

export default apiDashBoardService;
