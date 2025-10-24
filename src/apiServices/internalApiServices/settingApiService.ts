import GlobalSettingModel from '../../contexts/globalSettingModel';
import ApiResponseModel from '../../models/reponseModel/apiResponseModel';

const settingApiService = {
  getGlobalSetting: async (): Promise<GlobalSettingModel> => {
    const response: ApiResponseModel<GlobalSettingModel> = await (
      await fetch('/api/globalSetting', { next: { revalidate: 3600 } })
    ).json();
    return response.data as GlobalSettingModel;
  },
};

export default settingApiService;
