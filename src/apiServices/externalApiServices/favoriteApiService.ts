import { PropertyFavoriteModel } from '@/models/propertyModel/propertyFavoriteModel';
import ApiResponseModel from '../../models/reponseModel/apiResponseModel';
import apiClient from './apiClient';

const favoriteApiService = {
  getListFarvorite: async (params: any): Promise<ApiResponseModel<PropertyFavoriteModel[]>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      'EcomListingFavorite/GetMyFavorite',
      params,
    );
    return response.data;
  },

  activeOrDeActiveFavorite: async (
    id: string,
    isFavorite: boolean,
  ): Promise<ApiResponseModel<PropertyFavoriteModel[]>> => {
    const response = await apiClient.post<ApiResponseModel<any>>('EcomListingFavorite/Favorite', {
      listingId: id,
      isFavorite: isFavorite,
    });
    return response.data;
  },
  compareFavorite: async (body: string[]): Promise<ApiResponseModel<PropertyFavoriteModel[]>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      '/EcomListingFavorite/CompareFavorite',
      body,
    );
    return response.data.data;
  },

  unFavorite: async (body: any): Promise<ApiResponseModel<PropertyFavoriteModel[]>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      '/EcomListingFavorite/Favorite',
      body,
    );
    return response.data.data;
  },


  getListFarvoriteNewHome: async (params: any): Promise<ApiResponseModel<any[]>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      'EcomNewHomes/GetMyFavorite',
      params,
    );
    return response.data.data;
  },

  unFavoriteNewHome: async (body: any): Promise<ApiResponseModel<PropertyFavoriteModel[]>> => {

    const response = await apiClient.post<ApiResponseModel<any>>(
      '/EcomNewHomes/Favorite',
      body,
    );
    return response.data.data;
  },

  getAllLandingPage: async (params: any): Promise<any> => {
    const encodedParams = {
      ...params,
      keyword:params.keyword? encodeURIComponent(params.keyword):undefined, // Encode special characters
    };
    
  
    const response = await apiClient.get<ApiResponseModel<any>>(
      'EcomNewHomes/GetAllLandingPage',
      {params:{...encodedParams}},
    );
    return response.data;
  },

};

export default favoriteApiService;
