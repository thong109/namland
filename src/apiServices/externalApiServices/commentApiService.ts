import { tabModulComment } from '@/libs/appconst';
import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import PageResultModel from '@/models/reponseModel/pageResultModel';
import apiClient from './apiClient';

const CommentApiService = {
  getCommentList: async (
    filter: any,
    commentType: number,
  ): Promise<ApiResponseModel<PageResultModel<any>>> => {
    let apiString = '';
    switch (commentType) {
      case tabModulComment.property:
        apiString = 'Ecom/EcomReview/GetReviewListingByQuery';
        break;
      case tabModulComment.member:
        apiString = 'Ecom/EcomReview/GetReviewMemberByQuery';
        break;
      default:
        apiString = '';
        break;
    }

    const response = await apiClient.post<ApiResponseModel<any>>(apiString, {
      from: filter.from,
      query: {
        bool: {
          must: filter.must,
          filter: [...filter.terms, ...filter.range],
          must_not: [],
        },
      },
      size: filter.size,
      sort: {
        label: 'Số thứ tự tăng dần',
        field: 'createdAt',
        sortOrder: 1,
        isDefault: true,
      },
    });
    return response.data.data;
  },
  approveComment: async (commentId: string): Promise<ApiResponseModel<PageResultModel<any>>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      `Ecom/EcomReview/Approve/${commentId}`,
    );
    return response.data;
  },
  rejectComment: async (commentId: string): Promise<ApiResponseModel<PageResultModel<any>>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      `Ecom/EcomReview/Reject/${commentId}`,
    );
    return response.data;
  },
  deleteComment: async (commentId: string): Promise<ApiResponseModel<PageResultModel<any>>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      `Ecom/EcomReview/Delete/${commentId}`,
    );
    return response.data;
  },
};

export default CommentApiService;
