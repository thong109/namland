import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
dayjs.extend(utc);

export class UserWalletModel {
  id?: string;
  point?: number;

  public static assign(obj) {
    if (!obj) return undefined;
    const newObj = Object.assign(new UserWalletModel(), obj);

    return newObj;
  }
  public static assigns<T>(objs) {
    const results: any[] = [];
    objs.forEach((item) => results.push(this.assign(item)));

    return results;
  }
}
