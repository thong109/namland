import { PropertyTypeModel } from '@/models/propertyModel/propertyTypeModel';
import AccountModel from '../models/accountModel/accountModel';
export default interface GlobalSettingModel {
  currentUser: AccountModel;
  keyword: string[];
  allSettingLandingPage: any[];
  listProvince: any[];
  listDistrict: any[];
  listWard: any[];
  listPropertyType: PropertyTypeModel[];
}
