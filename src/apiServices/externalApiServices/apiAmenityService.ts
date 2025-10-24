import { AmenityModel } from '@/models/amenityModel/AmenityModel';
import ApiResponseModel from '../../models/reponseModel/apiResponseModel';
import apiClient from './apiClient';

const amenityApiService = {
  getAll: async (params: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      'EcomListingAmenities/GetByQuery',

      params,
    );
    return response.data.data;
  },

  getById: async (id: string): Promise<any> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      `/EcomListingAmenities/GetDetailForEdit`,
      {
        params: {
          id: id,
        },
      },
    );

    return AmenityModel.assign(response.data.data);
  },

  create: async (amenity): Promise<ApiResponseModel<string>> => {
    const formData = new FormData();
    if (amenity?.amenityIcon) {
      const partName = `amenities`;
      formData.append(partName, amenity.amenityIcon);
    }
    formData.append(`model`, JSON.stringify(amenity));

    const response = await apiClient.post<ApiResponseModel<any>>(
      'EcomListingAmenities/Create',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  },
  update: async (amenity): Promise<ApiResponseModel<string>> => {
    const formData = new FormData();

    if (amenity?.amenityIcon) {
      const partName = `amenities`;
      formData.append(partName, amenity?.amenityIcon);
    }
    formData.append(`model`, JSON.stringify(amenity));

    const response = await apiClient.put<ApiResponseModel<any>>(
      'EcomListingAmenities/Update',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  },

  activeOrInActice: async (id): Promise<ApiResponseModel<string>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      '/EcomListingCategory/UpdateStatus',
      {
        params: {
          id: id,
        },
      },
    );

    return response.data;
  },
};

export default amenityApiService;
