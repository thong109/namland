import { applyQuery } from '@/libs/helper';
import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import PageResultModel from '@/models/reponseModel/pageResultModel';
import SearchRequestModel from '@/models/searchModel/searchRequestModel';

import { INewFilterModelInAdmin, NewsDetailInAdmin } from '@/models/newsModel/newFilterModel';
import apiClient from './apiClient';

const newsApiInAdmin = {
  getNewsList: async (
    filter: SearchRequestModel,
  ): Promise<ApiResponseModel<PageResultModel<INewFilterModelInAdmin>>> => {
    const query = applyQuery(filter);
    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/EcomArticle/GetByQuery',
      query,
    );

    return response.data;
  },

  getById: async (id: string): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(`Ecom/EcomArticle/GetDetailById`, {
      params: {
        id: id,
      },
    });

    return NewsDetailInAdmin.assign(response.data.data);
  },

  createNews: async (projectInfo: any, projectImage: File): Promise<ApiResponseModel<any>> => {
    const formData = new FormData();
    formData.append(`model`, JSON.stringify(projectInfo));
    if (projectImage) {
      formData.append('imageThumbnail', projectImage);
    }
    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/EcomArticle/Create',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  },

  updateNews: async (projectInfo: any, projectImage: File): Promise<ApiResponseModel<any>> => {
    const formData = new FormData();
    formData.append(`model`, JSON.stringify(projectInfo));
    if (projectImage) {
      formData.append('imageThumbnail', projectImage);
    }

    const response = await apiClient.put<ApiResponseModel<any>>(
      'Ecom/EcomArticle/Update',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  },
};
export default newsApiInAdmin;
