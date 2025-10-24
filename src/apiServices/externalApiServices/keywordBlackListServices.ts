import { keywordBlackListModel } from '@/models/keywordBlackListModel/keywordBlackListModel';
import ApiResponseModel from '../../models/reponseModel/apiResponseModel';
import apiClient from './apiClient';
const apikeywordBlackListService = {
  getAllKeywordBlacklist: async (): Promise<any> => {
    let response = await apiClient.get<ApiResponseModel<any>>(`/Ecom/KeywordBlacklist/GetAll`);
    return keywordBlackListModel.assigns(response.data.data);
  },

  deleteById: async (id: string): Promise<ApiResponseModel<string>> => {
    const response = await apiClient.delete<ApiResponseModel<string>>(
      `Ecom/KeywordBlacklist/Delete`,
      {
        params: {
          id: id,
        },
      },
    );

    return response.data;
  },

  deleteAllKeyword: async (): Promise<ApiResponseModel<string>> => {
    const response = await apiClient.delete<ApiResponseModel<string>>(
      `Ecom/KeywordBlacklist/DeleteAll`,
    );

    return response.data;
  },

  createOrUpdateKeyBlack: async (value: string): Promise<ApiResponseModel<string>> => {
    const response = await apiClient.post<ApiResponseModel<string>>(
      `Ecom/KeywordBlacklist/CreateOrUpdate`,
      {
        value,
      },
    );

    return keywordBlackListModel.assign(response.data.data);
  },
};

export default apikeywordBlackListService;
