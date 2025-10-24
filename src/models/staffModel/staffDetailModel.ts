import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(utc);
export interface IStaff {
  id?: string;
  birthday?: string;
  startedWorkDate?: string;
  ImageUrl?: string;
}

export class StaffDetailModel implements IStaff {
  id?: string;

  constructor() {
    this.id = undefined;
  }
  birthday: string;
  startedWorkDate?: string;
  ImageUrl?: string;

  public static assign(obj) {
    if (!obj) return undefined;

    const newObj = Object.assign(new StaffDetailModel(), obj);
    newObj.birthday = obj.birthday ? dayjs(obj.birthday) : null;
    newObj.startedWorkDate = obj.startedWorkDate ? dayjs(obj.startedWorkDate) : null;
    return newObj;
  }

  public static assigns<T>(objs) {
    const results: any[] = [];
    objs.forEach((item) => results.push(this.assign(item)));

    return results;
  }
}
