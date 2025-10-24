import ApiResponseModel from '../../models/reponseModel/apiResponseModel';
import apiClient from './apiClient';

const commentApiService = {
  getMyPropertyListReviewForListing: async (
    id: string,
    filter: any,
  ): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      `Ecom/EcomReview/GetReviewMyListing`,
      {
        from: filter.from || 0,
        query: {
          bool: {
            must: [
              {
                term: {
                  applyId: `${id}`,
                },
              },
            ],
            must_not: [],
          },
        },
        size: filter.size || 5,
        sort: {
          label: 'Số thứ tự tăng dần',
          field: 'createdAt',
          sortOrder: 1,
          isDefault: true,
        },
      },
      {
        params: {
          listingId: id,
        },
      },
    );
    return response.data.data;
  },
  getListReview: async (
    id: string,
    filter: any,
    commenId?: string,
  ): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      `Ecom/EcomReview/GetByQueryMember`,
      {
        from: filter.from || 0,
        query: {
          bool: {
            must: [
              {
                term: {
                  applyId: id,
                  id: commenId,
                },
              },
            ],
            must_not: [],
          },
        },
        size: filter.size || 10,
        sort: {
          label: 'Số thứ tự tăng dần',
          field: 'createdAt',
          sortOrder: 1,
          isDefault: true,
        },
      },
    );
    return response.data.data;
  },
  getListReviewForListing: async (
    applyId: string,
    filter: any,
    commenId?: string,
  ): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      `Ecom/EcomReview/GetByQueryListing`,
      {
        from: filter.from || 0,
        query: {
          bool: {
            must: [
              {
                term: {
                  applyId: applyId,
                  id: commenId,
                },
              },
            ],
            must_not: [],
          },
        },
        size: filter.size || 5,
        sort: {
          label: 'Số thứ tự tăng dần',
          field: 'createdAt',
          sortOrder: 1,
          isDefault: true,
        },
      },
    );
    return response.data.data;
  },
  approveReview: async (id: string): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      `Ecom/EcomReview/Approve/${id}`,
      {},
    );
    return response.data;
  },

  rejectReview: async (id: string): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      `Ecom/EcomReview/Reject/${id}`,
      {},
    );
    return response.data;
  },

  showAndUnShowReview: async (id: string, isShow: boolean): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      `Ecom/EcomReview/ToggleShow/${id}?show=${isShow}`,
      {},
    );
    return response.data;
  },
};

export default commentApiService;
