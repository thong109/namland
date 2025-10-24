import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(utc);

export class OwnInquiryDetailModel {
  id?: number;
  visitDate?: string;
  osaInfo?: any;

  constructor() {
    this.id = undefined;
  }

  public static assign(obj) {
    if (!obj) return undefined;

    const newObj = Object.assign(new OwnInquiryDetailModel(), obj);
    newObj.visitDate = obj.visitDate ? dayjs(obj.visitDate) : null;
    newObj.osaInfo = obj.osaInfo
      ? {
          ...obj.osaInfo,
          startDate: obj.osaInfo?.startDate ? dayjs(obj.osaInfo.startDate) : null,
          endDate: obj.osaInfo?.endDate ? dayjs(obj.osaInfo.endDate) : null,
        }
      : null;

    return newObj;
  }

  public static assigns<T>(objs) {
    const results: any[] = [];
    objs.forEach((item) => results.push(this.assign(item)));

    return results;
  }
}
