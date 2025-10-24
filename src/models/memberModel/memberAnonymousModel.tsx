export interface IUserModel {}
export class MemberAnonymousModel implements IUserModel {
  id?: number;
  userName?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  nickName?: string;
  email?: string;
  contactAddress?: string;
  birthdate?: Date;
  avatarUrl?: string;
  aboutMe?: boolean;
  phone?: string;
  constructor() {
    this.birthdate = undefined;
  }

  public static assign(obj: any) {
    if (!obj) return undefined;

    const newObj = Object.assign(new MemberAnonymousModel(), obj);

    return newObj;
  }
}
