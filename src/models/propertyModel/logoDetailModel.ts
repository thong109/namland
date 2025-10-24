import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(utc);
export interface IProperty {
  id?: string;
  createdAt?: string;
  endDate?: string;
  startDate?: string;
  logoLink?: string;
  logoImageUrl?: string;
  status?: boolean;
}

export class LogoDetailModel implements IProperty {
  id?: string;

  constructor() {
    this.id = undefined;
  }

  public static assign(obj) {
    if (!obj) return undefined;

    const newObj = Object.assign(new LogoDetailModel(), obj);
    newObj.startDate = obj.startDate ? dayjs(obj.startDate) : null;
    newObj.endDate = obj.endDate ? dayjs(obj.endDate) : null;

    return newObj;
  }

  public static assigns<T>(objs) {
    const results: any[] = [];
    objs.forEach((item) => results.push(this.assign(item)));

    return results;
  }
}
