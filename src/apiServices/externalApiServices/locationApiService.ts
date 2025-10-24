import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import apiClient from './apiClient';
const locationApiService = {
  getListLocation: async (keyword: string): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      `GoogleMaps/Autocomplete?input=${keyword}`,
    );
    return response.data;
  },

  getLocationDetail: async (placeId: string): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(`GoogleMaps/PlaceDetail`, {
      params: {
        placeId: placeId,
      },
    });
    return response.data;
  },

  getInfoLocation: async (lat: number, lng: number): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(`/GoogleMaps/LocationGeocode`, {
      params: {
        lat: lat,
        lng: lng,
      },
    });
    return response.data;
  },
};

export default locationApiService;
