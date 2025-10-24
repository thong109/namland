import { PropertyTypeModel } from '@/models/propertyModel/propertyTypeModel';
import AccountModel from '../models/accountModel/accountModel';
import GlobalSettingModel from './globalSettingModel';
export default interface GlobalSettingContextModel extends GlobalSettingModel {
  getCurrentUser: () => Promise<AccountModel>;
  unsetCurrentUser: () => void;
  resetState: () => void;
  getKeywordBlacklist: () => Promise<string[]>;
  getProvince: () => Promise<any[]>;
  getDistrict: () => Promise<any[]>;
  getWard: () => Promise<any[]>;
  getAllSettingLandingPage: () => Promise<any[]>;
  getPropertyType: () => Promise<PropertyTypeModel[]>;
}
