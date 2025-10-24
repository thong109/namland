import { listLangue } from '@/libs/appconst';
import { map2Array } from '@/libs/helper';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
dayjs.extend(utc);

export interface INewFilterModelInAdmin {
  keyword?: string;
  status?: number;
  createdBy?: string;
  fromDate?: string;
  toDate?: string;
  type?: number;
  from?: number;
  size?: number;
  isActive?: boolean;
  category?: string;
}

export class NewsDetailInAdmin {
  id?: string;

  public static assign(obj) {
    if (!obj) return undefined;
    const newObj = Object.assign(new NewsDetailInAdmin(), obj);

    newObj.postAt = obj.postAt ? dayjs(obj.postAt) : null;
    newObj.title =
      obj.title.length < 1
        ? [
            { language: 'vi', value: '' },
            { language: 'en', value: '' },
            { language: 'ko', value: '' },
          ]
        : map2Array(listLangue, obj.title);

    newObj.description =
      obj.description.length < 1
        ? [
            { language: 'vi', value: '' },
            { language: 'en', value: '' },
            { language: 'ko', value: '' },
          ]
        : map2Array(listLangue, obj.description);

    newObj.content =
      obj.content.length < 1
        ? [
            { language: 'vi', value: '' },
            { language: 'en', value: '' },
            { language: 'ko', value: '' },
          ]
        : map2Array(listLangue, obj.content);
    return newObj;
  }
  public static assigns<T>(objs) {
    const results: any[] = [];
    objs.forEach((item) => results.push(this.assign(item)));

    return results;
  }
}
