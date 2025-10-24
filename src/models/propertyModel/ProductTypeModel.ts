import { ILanguageValue, listLangue } from '@/libs/appconst';
import { map2Array } from '@/libs/helper';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(utc);
export interface IMember {
  id?: string;
  listingCategoryTranslationme?: ILanguageValue[];
}

export class ProductTypeDetailModel implements IMember {
  id?: string;
  listingCategoryTranslationRequest?: any;

  constructor() {
    this.id = undefined;
  }

  public static assign(obj) {
    if (!obj) return undefined;

    const newObj = Object.assign(new ProductTypeDetailModel(), obj);
    newObj.listingCategoryTranslation =
      obj.listingCategoryTranslation.length < 1
        ? [
            { language: 'vi', value: '' },
            { language: 'en', value: '' },
            { language: 'ko', value: '' },
          ]
        : map2Array(listLangue, obj.listingCategoryTranslation);

    return newObj;
  }

  public static assigns<T>(objs) {
    const results: any[] = [];
    objs.forEach((item) => results.push(this.assign(item)));

    return results;
  }
}
