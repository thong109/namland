import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(utc);
export interface IMember {
  id?: string;
  accountType?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  isActive?: string;
  ownershipType?: number;
  phone?: string;
  showOnHome?: boolean;
  type?: string;
}

export class MemberDetailModel implements IMember {
  id?: string;
  extraInfo?: any;

  constructor() {
    this.id = undefined;
  }

  public static assign(obj) {
    if (!obj) return undefined;

    const newObj = Object.assign(new MemberDetailModel(), obj);
    newObj.extraInfo = {
      taxCodeDateOfIssue: obj.extraInfo?.taxCodeDateOfIssue
        ? dayjs(obj.extraInfo?.taxCodeDateOfIssue)
        : null,
      address: obj.extraInfo?.address,
      taxCode: obj.extraInfo?.taxCode,
      taxCodePlaceOfIssue: obj.extraInfo?.taxCodePlaceOfIssue,
    };
    return newObj;
  }

  public static assigns<T>(objs) {
    const results: any[] = [];
    objs.forEach((item) => results.push(this.assign(item)));

    return results;
  }
}
