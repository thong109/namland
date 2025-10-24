import { ILanguageValue, listLangue } from '@/libs/appconst';
import { map2Array } from '@/libs/helper';
import ImagUrlModel from '@/models/commonModel/imageUrlModel';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
dayjs.extend(utc);

export interface IUnit {
  id?: string;
  type?: number;
}

export class NewHomeModel implements IUnit {
  id?: string;
  type?: number;
  imageUrls?: ImagUrlModel[];
  status?: number;
  description?: ILanguageValue[];
  unitYearBuild?: string;
  constructor() {
    this.id = undefined;
  }

  public static assign(obj) {
    if (!obj) return undefined;

    const newObj = Object.assign(new NewHomeModel(), obj);

    newObj.layouts = obj.layouts.map((item) => ({
      ...item,
      name:
        item.name.length < 1
          ? [
              { language: 'vi', value: '' },
              { language: 'en', value: '' },
              { language: 'ko', value: '' },
            ]
          : map2Array(listLangue, item.name),
      area:
        item.area.length < 1
          ? [
              { language: 'vi', value: '' },
              { language: 'en', value: '' },
              { language: 'ko', value: '' },
            ]
          : map2Array(listLangue, item.area),
      imageIds: item?.files?.map((item) => item?.id),
      listImage: item?.files?.map((item) => item?.id),
    }));
    newObj.imageUrls = obj.images?.map((item) => ({
      id: item.id,
      url: item?.url,
    }));
    newObj.title =
      obj.title.length < 1
        ? [
            { language: 'vi', value: '' },
            { language: 'en', value: '' },
            { language: 'ko', value: '' },
          ]
        : map2Array(listLangue, obj.title);

    newObj.layout =
      obj.layout.length < 1
        ? [
            { language: 'vi', value: '' },
            { language: 'en', value: '' },
            { language: 'ko', value: '' },
          ]
        : map2Array(listLangue, obj.layout);

    newObj.unitArea =
      obj.unitArea.length < 1
        ? [
            { language: 'vi', value: '' },
            { language: 'en', value: '' },
            { language: 'ko', value: '' },
          ]
        : map2Array(listLangue, obj.unitArea);

    newObj.investor =
      obj.investor.length < 1
        ? [
            { language: 'vi', value: '' },
            { language: 'en', value: '' },
            { language: 'ko', value: '' },
          ]
        : map2Array(listLangue, obj.investor);

    return newObj;
  }

  public static assigns<T>(objs) {
    const results: any[] = [];
    objs.forEach((item) => results.push(this.assign(item)));

    return results;
  }
}
