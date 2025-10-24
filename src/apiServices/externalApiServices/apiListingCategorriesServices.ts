import ScoreModel from '@/models/inqueryModel/ScoreModel';
import listingPropertyModel from '@/models/listingModel/listingPropertyModel';
import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import ReviewModelListingResponse from '@/models/reviewModel/ReviewModelListingResponse';
import dataListingModel from '../../models/listingModel/dataListingModel';
import LocationNearbyListing from '../../models/propertyModel/locationNearbyListing';
import apiClient from './apiClient';
const apiListingCategorriesServices = {
  getByid: async (params: any): Promise<ApiResponseModel<listingPropertyModel>> => {
    const response = await apiClient.get<ApiResponseModel<listingPropertyModel>>(
      `EcomListing/GetDetailByQuery?id=${params.id}`,
      {
        headers: {
          'App.Culture': params?.lang || 'vi',
        },
      },
    );
    return response.data;
  },
  getListSimilarProject: async (params: any): Promise<ApiResponseModel<dataListingModel>> => {
    let query = {
      from: params?.from || 0,
      query: {
        bool: {
          must: [],
          must_not: [
            {
              term: {
                id: params?.propertyId,
              },
            },
          ],
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
    if (params?.projectId) {
      query.query.bool.must.push({
        term: {
          projectId: params?.projectId,
        },
      });
    }
    const response = await apiClient.post<ApiResponseModel<dataListingModel>>(
      `/EcomListing/GetSimilarInProjectQuery?listingId=${params?.propertyId}`,
      { ...query },
    );
    return response.data;
  },
  getListSimilarNearBy: async (params: any): Promise<ApiResponseModel<dataListingModel>> => {
    let query = {
      from: params?.from || 0,
      query: {
        bool: {
          must: [],
          must_not: [
            {
              term: {
                id: params?.propertyId,
              },
            },
          ],
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
    if (params?.projectId) {
      query.query.bool.must.push({
        term: {
          projectId: params?.projectId,
        },
      });
    }
    const response = await apiClient.post<ApiResponseModel<dataListingModel>>(
      `/EcomListing/GetSimilarNearByProjectQuery?listingId=${params?.propertyId}`,
      { ...query },
    );
    return response.data;
  },
  getLocationNearbyListing: async (
    id: string,
    size?: number,
  ): Promise<ApiResponseModel<LocationNearbyListing[]>> => {
    const response = await apiClient.get<ApiResponseModel<LocationNearbyListing[]>>(
      `/EcomListing/GetLocationNearByListing?id=${id}${size ? `&size=${size}` : ''}`,
      {},
    );
    return response.data;
  },
  getReviewListing: async (params: any): Promise<ApiResponseModel<ReviewModelListingResponse>> => {
    let query = {
      from: params?.from || 0,
      query: {
        bool: {
          must: [
            {
              term: {
                applyId: params?.id,
              },
            },
          ],
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
    const response = await apiClient.post<ApiResponseModel<ReviewModelListingResponse>>(
      '/Ecom/EcomReviewPublic/GetByQueryListing',
      { ...query },
    );
    return response.data;
  },
  getReviewAgency: async (params: any): Promise<ApiResponseModel<ReviewModelListingResponse>> => {
    let query = {
      from: params?.from || 0,
      query: {
        bool: {
          must: [
            {
              term: {
                applyId: params?.id,
              },
            },
          ],
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
    const response = await apiClient.post<ApiResponseModel<ReviewModelListingResponse>>(
      '/Ecom/EcomReviewPublic/GetByQueryMember',
      { ...query },
    );
    return response.data;
  },
  getSumaryListing: async (id: string): Promise<ScoreModel> => {
    const response = await apiClient.get<ScoreModel>(
      `/Ecom/EcomReviewPublic/SummaryReview?applyId=${id}`,
      {},
    );
    return response.data;
  },
};

export default apiListingCategorriesServices;
