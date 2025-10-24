import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
dayjs.extend(utc);

export class LADetailModel {
  id?: string;
  leaseExecution?: any;
  public static assign(obj) {
    if (!obj) return undefined;
    const newObj = Object.assign(new LADetailModel(), obj);

    newObj.leaseExecution.laCommencementDate = obj.leaseExecution.laCommencementDate
      ? dayjs(obj.leaseExecution.laCommencementDate)
      : null;
    newObj.leaseExecution.laExpirationDate = obj.leaseExecution.laExpirationDate
      ? dayjs(obj.leaseExecution.laExpirationDate)
      : null;

    return newObj;
  }
  public static assigns<T>(objs) {
    const results: any[] = [];
    objs.forEach((item) => results.push(this.assign(item)));

    return results;
  }
}
