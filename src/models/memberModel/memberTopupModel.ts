export class MemberTopupModel {
  id?: number;
  userName?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  phone?: string;

  constructor() {}

  public static assign(obj: any) {
    if (!obj) return undefined;

    const newObj = Object.assign(new MemberTopupModel(), obj);

    return newObj;
  }
}
