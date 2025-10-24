import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
dayjs.extend(utc);
export interface IStaffFilterModelInAdmin {
  keyword?: string;
  status?: number;
  createdBy?: string;
  fromDate?: string;
  toDate?: string;
  type?: number;
  projectId?: string;
  from?: number;
  size?: number;
  isActive?: boolean;
}

export class StaffDetailInAdmin {
  id?: string;

  public static assign(obj) {
    if (!obj) return undefined;
    const newObj = Object.assign(new StaffDetailInAdmin(), obj);

    return newObj;
  }
  public static assigns<T>(objs) {
    const results: any[] = [];
    objs.forEach((item) => results.push(this.assign(item)));

    return results;
  }
}
