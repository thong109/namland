import {
  SearchLocationDetailModel,
  SearchLocationListModel,
} from '@/models/propertyModel/searchLoticationModal';
import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import PageResultModel from '@/models/reponseModel/pageResultModel';
import apiClient from './apiClient';

const SearchLocationApiService = {
  getList: async (
    filter: any,
  ): Promise<ApiResponseModel<PageResultModel<SearchLocationListModel>>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      'Ecom/EcomSearchLocation/GetByQuery',
      {
        params: filter,
      },
    );
    return response.data.data;
  },
  getByid: async (id: string): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      `Ecom/EcomSearchLocation/GetDetailForEdit`,
      {
        params: {
          id: id,
        },
      },
    );
    return response.data.data;
  },

  create: async (params: SearchLocationDetailModel): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/EcomSearchLocation/Create',
      params,
    );

    return response.data;
  },
  update: async (params: SearchLocationDetailModel): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.put<ApiResponseModel<any>>(
      'Ecom/EcomSearchLocation/Update',
      params,
    );

    return response.data;
  },
  getListLocation: async (keyword: string): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      `Ecom/EcomSearchLocation/GetAutoComplete/Autocomplete?input=${keyword}`,
    );
    return response.data;
  },

  deleteMaterialPlaceItem: async (params: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/EcomSearchLocation/DeleteMaterialPlace',
      params,
    );

    return response.data;
  },
};

export default SearchLocationApiService;
