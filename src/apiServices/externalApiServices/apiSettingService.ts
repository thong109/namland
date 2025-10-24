import ApiResponseModel from '../../models/reponseModel/apiResponseModel';
import apiClient from './apiClient';
const SettingApiService = {
  getListSetting: async (): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>('Ecom/EcomConfig/GetListZone');
    return response.data;
  },

  getAutoComplete: async (keyword: string): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      'Ecom/EcomAccount/GetAutoComplete/Autocomplete',
      {
        params: {
          input: keyword,
        },
      },
    );

    return response.data;
  },
  updateSetting: async (seting: any, logoImage?: File, logoLandingpage?: File): Promise<any> => {
    const formData = new FormData();

    formData.append(`model`, JSON.stringify(seting));

    if (logoImage) {
      const partName = `LOGO_IMAGE`;
      formData.append(partName, logoImage);
    }
    if (logoLandingpage) {
      const partName = `LOGO_LANDING_PAGE`;
      formData.append(partName, logoLandingpage);
    }

    const response = await apiClient.put<ApiResponseModel<any>>(
      'Ecom/EcomConfig/Update',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  },
  getSettingServiceLandingPage: async (): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>('Ecom/EcomConfig/GetAppSettings');
    return response.data;
  },
};

export default SettingApiService;
