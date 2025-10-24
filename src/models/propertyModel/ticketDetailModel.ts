import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(utc);

export interface ITicket {
  id?: string;
}

export class TicketDetailModel implements ITicket {
  id?: string;
  createdAt?: string;
  visitDate?: string;
  visitTime?: string;

  constructor() {
    this.id = undefined;
  }

  public static assign(obj) {
    if (!obj) return undefined;

    const newObj = Object.assign(new TicketDetailModel(), obj);
    newObj.createdAt = obj.createdAt ? dayjs(obj.createdAt) : null;
    newObj.visitDate = obj.visitDate ? dayjs(obj.visitDate) : null;
    return newObj;
  }

  public static assigns<T>(objs) {
    const results: any[] = [];
    objs.forEach((item) => results.push(this.assign(item)));

    return results;
  }
}
