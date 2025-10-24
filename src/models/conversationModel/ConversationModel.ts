import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(utc);
export interface IConversationModel {
  id?: string;
  createdAt?: string;
}

export class ConversationModel implements IConversationModel {
  id?: string;

  constructor() {
    this.id = undefined;
  }

  public static assign(obj) {
    if (!obj) return undefined;

    const newObj = Object.assign(new ConversationModel(), obj);
    newObj.createdAt = obj.createdAt ? dayjs(obj.createdAt) : null;

    return newObj;
  }

  public static assigns<T>(objs) {
    const results: any[] = [];
    objs.forEach((item) => results.push(this.assign(item)));

    return results;
  }
}
