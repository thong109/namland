import dataListingModel from '../../models/listingModel/dataListingModel';
import AgencyOurModel from '../../models/masterDataModel/agencyOurModel';
import partnerData from '../../models/masterDataModel/partnerModel';
import ApiResponseModel from '../../models/reponseModel/apiResponseModel';
import apiClient from './apiClient';
const apiHomePageService = {
  getListForSale: async (params: any): Promise<ApiResponseModel<dataListingModel>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      '/EcomListing/GetForSellByQuery',

      {
        from: params?.from || 0,
        query: {
          bool: {
            must: [],
            must_not: [],
          },
        },
        size: params?.size || 10,
        sort: {
          label: 'Số thứ tự tăng dần',
          field: 'createdAt',
          sortOrder: 1,
          isDefault: true,
        },
      },
      {
        headers: {
          'App.Culture': params?.lang || 'vi',
        },
      },
    );
    return response.data;
  },
  getListForRent: async (params: any): Promise<ApiResponseModel<dataListingModel>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      '/EcomListing/GetForRentByQuery',
      {
        from: params?.from || 0,
        query: {
          bool: {
            must: [],
            must_not: [],
          },
        },
        size: params?.size || 10,
        sort: {
          label: 'Số thứ tự tăng dần',
          field: 'createdAt',
          sortOrder: 1,
          isDefault: true,
        },
      },
      {
        headers: {
          'App.Culture': params?.lang || 'vi',
        },
      },
    );
    return response.data;
  },
  getListByQuery: async (params: any): Promise<ApiResponseModel<dataListingModel>> => {
    let query = {
      from: params?.from || 0,
      query: {
        bool: {
          must: [],
          must_not: [],
        },
      },
      size: params?.size || 10,
      sort: {
        label: 'Số thứ tự tăng dần',
        field: 'createdAt',
        sortOrder: 1,
        isDefault: true,
      },
    };
    if (params?.userId) {
      query.query.bool.must.push({
        term: {
          'createdBy.keyword': params?.userId,
        },
      });
    }
    if (params?.type) {
      query.query.bool.must.push({
        term: {
          type: params?.type,
        },
      });
    } else {
      query.query.bool.must.push({
        term: {
          type: 0,
        },
      });
    }
    const response = await apiClient.post<ApiResponseModel<dataListingModel>>(
      '/EcomListing/GetByQuery',
      { ...query },
    );
    return response.data;
  },
  getListPartner: async (): Promise<ApiResponseModel<partnerData[]>> => {
    let response = await apiClient.get<ApiResponseModel<partnerData[]>>(`/EcomLogoBanner/GetAll`);
    return response.data;
  },
  getListOurAgency: async (): Promise<ApiResponseModel<AgencyOurModel[]>> => {
    let response = await apiClient.get<ApiResponseModel<AgencyOurModel[]>>(
      `/Ecom/EcomAccountHome/GetOurAgents`,
    );
    return response.data;
  },
};

export default apiHomePageService;
