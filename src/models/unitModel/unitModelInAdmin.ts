import { ILanguageValue, listLangue } from '@/libs/appconst';
import { map2Array } from '@/libs/helper';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
dayjs.extend(utc);

export interface IUnit {
  id?: string;
  type?: number;
}

export class UnitDetailModel implements IUnit {
  id?: string;
  type?: number;
  status?: number;
  description?: ILanguageValue[];
  unitYearBuild?: string;
  constructor() {
    this.id = undefined;
  }

  public static assign(obj) {
    if (!obj) return undefined;

    const newObj = Object.assign(new UnitDetailModel(), obj);

    newObj.description =
      obj.description.length < 1
        ? [
            { language: 'vi', value: '' },
            { language: 'en', value: '' },
            { language: 'ko', value: '' },
          ]
        : map2Array(listLangue, obj.description);
    newObj.unitYearBuild = obj.unitYearBuild ? dayjs(obj.unitYearBuild) : null;
    return newObj;
  }

  public static assigns<T>(objs) {
    const results: any[] = [];
    objs.forEach((item) => results.push(this.assign(item)));

    return results;
  }
}
