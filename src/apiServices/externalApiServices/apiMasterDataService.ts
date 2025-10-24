import BannerModel from '@/models/masterDataModel/bannerModel';
import DistrictModel from '@/models/masterDataModel/districtModel';
import ProvinceModel from '@/models/masterDataModel/provinceModel';
import { PropertyTypeModel } from '@/models/propertyModel/propertyTypeModel';
import * as _ from 'lodash';
import ApiResponseModel from '../../models/reponseModel/apiResponseModel';
import apiClient from './apiClient';
const apiMasterDataService = {
  getProvinceV2: async (): Promise<any> => {
    let result = await await apiClient.get<ApiResponseModel<any>>('Ecom/EcomPlace/GetProvince');

    if (result.data.data.data) {
      let dataSort = _.orderBy(result.data.data.data, ['sort'], ['desc']);
      return dataSort;
    }
    return [];
  },
  getAllDistric: async (): Promise<any> => {
    let result = await apiClient.get<ApiResponseModel<any>>(`Ecom/EcomPlace/GetDistrict`);

    if (result.data.data.data) {
      let dataSort = _.orderBy(result.data.data.data, ['sort'], ['desc']);
      return dataSort;
    }
    return [];
  },
  getDistrictV2: async (provinceId?): Promise<any> => {
    let result = await apiClient.get<ApiResponseModel<any>>(
      `Ecom/EcomPlace/GetDistrict?provinceId=${provinceId}`,
    );

    if (result.data.data.data) {
      let dataSort = _.orderBy(result.data.data.data, ['sort'], ['desc']);
      return dataSort;
    }
    return [];
  },

  getPropertyTypes: async (): Promise<ApiResponseModel<PropertyTypeModel[]>> => {
    const response = await apiClient.get<ApiResponseModel<any>>('EcomListingCategory/GetList');
    return response.data?.data;
  },

  getAllWard: async (): Promise<any> => {
    let result = await apiClient.get<ApiResponseModel<any>>(`Ecom/EcomPlace/GetWard`);
    if (result.data.data.data) {
      let dataSort = _.orderBy(result.data.data.data, ['sort'], ['desc']);
      return dataSort;
    }
    return [];
  },

  getWards: async (districtId): Promise<any> => {
    let result = await apiClient.get<ApiResponseModel<any>>(
      `Ecom/EcomPlace/GetWard?districtId=${districtId}`,
    );
    if (result.data.data.data) {
      let dataSort = _.orderBy(result.data.data.data, ['sort'], ['desc']);
      return dataSort;
    }
    return [];
  },
  getProvincev2: async (): Promise<ApiResponseModel<ProvinceModel[]>> => {
    const result = await apiClient.get<ApiResponseModel<ProvinceModel[]>>(
      '/Ecom/EcomPlace/GetProvince',
    );

    // if (result.data) {
    //   let dataSort = _.orderBy(result.data, ['sort'], ['desc']);
    //   return dataSort;
    // }
    return result.data;
  },
  getDistrictv2: async (provinceId): Promise<ApiResponseModel<DistrictModel[]>> => {
    let result = await apiClient.get<ApiResponseModel<DistrictModel[]>>(
      `/Ecom/EcomPlace/GetDistrict?provinceId=${provinceId}`,
    );
    return result.data;
  },

  getBannerWithPosition: async (position): Promise<ApiResponseModel<BannerModel>> => {
    let response = await apiClient.get<ApiResponseModel<BannerModel>>(
      `/EcomAdBanner/GetAdBannerByPosition?position=${position}`,
    );
    return response.data;
  },
  getKeywordBlacklist: async (): Promise<ApiResponseModel<string[]>> => {
    let response = await apiClient.get<ApiResponseModel<string[]>>(
      `/Ecom/KeywordBlacklist/GetLists`,
    );
    return response.data;
  },
  getLocationNearBySearch: async (provinceId, districtId): Promise<any> => {
    let result = await apiClient.get<ApiResponseModel<any>>(
      `/Ecom/EcomSearchLocation/GetListForSearch?district=${districtId}&province=${provinceId}`,
    );
    if (provinceId && districtId) {
      if (result?.data?.data?.data) {
        let array = [];
        let data = _.map(result.data.data.data, (e) => {
          return { ...e, isShow: false };
        });
        data.map((item) => {
          let find = _.find(array, (e) => {
            return e.type === item.type;
          });
          if (find) {
            find.materialPlaces = [...item.materialPlaces, ...find.materialPlaces];
          } else {
            array.push(item);
          }
        });
        return array;
      }
      return [];
    } else {
      return [];
    }
  },
};

export default apiMasterDataService;
