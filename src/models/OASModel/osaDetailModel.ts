import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(utc);

export interface ITicket {
  id?: string;
}

export class OSADetailModel implements ITicket {
  id?: string;
  createdAt?: string;
  agreementInfo?: any;

  constructor() {
    this.id = undefined;
  }

  public static assign(obj) {
    if (!obj) return undefined;

    const newObj = Object.assign(new OSADetailModel(), obj);
    newObj.agreementInfo.startDate = obj.agreementInfo.startDate
      ? dayjs(obj.agreementInfo.startDate)
      : null;
    newObj.agreementInfo.endDate = obj.agreementInfo.endDate
      ? dayjs(obj.agreementInfo.endDate)
      : null;
    return newObj;
  }

  public static assigns<T>(objs) {
    const results: any[] = [];
    objs.forEach((item) => results.push(this.assign(item)));

    return results;
  }
}
