import { applyQuery } from '@/libs/helper';
import { BannerListModel } from '@/models/propertyModel/bannerListModal';
import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import PageResultModel from '@/models/reponseModel/pageResultModel';
import SearchBannerModel from '@/models/searchModel/searchBannerModel';
import apiClient from './apiClient';

const BannerApiService = {
  getBannerList: async (
    filter: SearchBannerModel,
  ): Promise<ApiResponseModel<PageResultModel<BannerListModel>>> => {
    const query = applyQuery(filter);
    const response = await apiClient.post<ApiResponseModel<any>>('EcomAdBanner/GetByQuery', query);
    return response.data.data;
  },
  getByid: async (id: string): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(`EcomAdBanner/GetDetailForEdit`, {
      params: {
        id: id,
      },
    });
    return response.data;
  },

  createBanner: async (bannerInfo: any, bannerImage: any): Promise<ApiResponseModel<any>> => {
    const formData = new FormData();
    formData.append(`model`, JSON.stringify(bannerInfo));
    (bannerImage || []).forEach((model, index) => {
      const partName = model.bannerName;
      formData.append(partName, model.newFile);
    });
    const response = await apiClient.post<ApiResponseModel<any>>('EcomAdBanner/Create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  updateBanner: async (bannerInfo: any, bannerImage: any): Promise<ApiResponseModel<any>> => {
    const formData = new FormData();
    formData.append(`model`, JSON.stringify(bannerInfo));
    (bannerImage || []).forEach((model, index) => {
      const partName = model.bannerName;
      formData.append(partName, model.newFile);
    });
    const response = await apiClient.put<ApiResponseModel<any>>('EcomAdBanner/Update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};

export default BannerApiService;
