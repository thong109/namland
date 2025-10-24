export interface IUserModel {}
export class UserDetailModal implements IUserModel {
  id?: number;
  userName?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  nickName?: string;
  phone?: string;
  gender?: string;
  birthdate?: Date;
  email?: string;
  isActive?: boolean;
  avatarUrl?: string;
  constructor() {
    this.birthdate = undefined;
  }

  public static assign(obj: any) {
    if (!obj) return undefined;

    const newObj = Object.assign(new UserDetailModal(), obj);

    return newObj;
  }
}
