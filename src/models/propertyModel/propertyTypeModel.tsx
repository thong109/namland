//todo
interface UserInfo {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  // Add any other user info properties here
}
export interface PropertyTypeModel {
  createdBy: string;
  iconUrl: string;
  id: string;
  imageUrl: string;
  name: string;
  userInfo: UserInfo;
  type?: number;
  order?: number;
}
