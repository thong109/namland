export interface SearchLocationListModel {
  id: string;
  province?: string;
  district?: string;
  districtName?: string;
  type?: string;
  status?: Boolean;
  materialPlaces?: any;
  userInfo?: any;
  createdBy?: any;
  createdAt: Date;
}
export interface SearchLocationDetailModel {
  id?: string;
  province: string;
  district: string;
  type: string;
  status: Boolean;
  materialPlaces?: any;
}
