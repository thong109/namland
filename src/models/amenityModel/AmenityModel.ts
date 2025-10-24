import { listLangue } from '@/libs/appconst';
import { map2Array } from '@/libs/helper';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
dayjs.extend(utc);
export interface IAmenity {
  id?: string;
}

export class AmenityModel implements IAmenity {
  id?: string;

  public static assign(obj) {
    if (!obj) return undefined;

    const newObj = Object.assign(new AmenityModel(), obj);

    newObj.amenitiesTranslation =
      obj.amenitiesTranslation.length < 1
        ? [
            { language: 'vi', value: '' },
            { language: 'en', value: '' },
            { language: 'ko', value: '' },
          ]
        : map2Array(listLangue, obj.amenitiesTranslation);

    return newObj;
  }

  public static assigns<T>(objs) {
    const results: any[] = [];
    objs.forEach((item) => results.push(this.assign(item)));

    return results;
  }
}
