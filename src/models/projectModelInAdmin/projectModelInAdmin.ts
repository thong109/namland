import { listLangue } from '@/libs/appconst';
import { map2Array } from '@/libs/helper';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
dayjs.extend(utc);
export interface IProjectFilterModelInAdmin {
  keyword?: string;
  status?: number;
  createdBy?: string;
  fromDate?: string;
  toDate?: string;
  type?: number;
  images?: any[];
  indoorAmenities?: any[];
  outdoorAmenities?: any[];
  from?: number;
  size?: number;
  isActive?: boolean;
}

export class ProjectDetailInAdmin {
  id?: string;

  public static assign(obj) {
    if (!obj) return undefined;
    const newObj = Object.assign(new ProjectDetailInAdmin(), obj);

    newObj.publishDate = obj.publishDate ? dayjs(obj.publishDate) : null;
    newObj.yearBuited = obj.yearBuited ? dayjs(obj.yearBuited) : null;
    newObj.indoorAmenities = obj.indoorAmenities.map((item) => item?.id);
    newObj.outdoorAmenities = obj.outdoorAmenities.map((item) => item?.id);
    newObj.descriptions =
      obj.descriptions.length < 1
        ? [
            { language: 'vi', value: '' },
            { language: 'en', value: '' },
            { language: 'ko', value: '' },
          ]
        : map2Array(listLangue, obj.descriptions);
    newObj.unitTypeRentIds = obj.unitTypeRent.map((item) => item?.id);
    newObj.unitTypeSellIds = obj.unitTypeSell.map((item) => item?.id);
    return newObj;
  }
  public static assigns<T>(objs) {
    const results: any[] = [];
    objs.forEach((item) => results.push(this.assign(item)));

    return results;
  }
}
