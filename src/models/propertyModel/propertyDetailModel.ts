import { ILanguageValue, listLangue } from '@/libs/appconst';
import { map2Array } from '@/libs/helper';
import ImagUrlModel from '@/models/commonModel/imageUrlModel';
import dayjs from 'dayjs';

export interface IProperty {
  id?: string;
  type?: string;
  categoryProject?: string;
  amenities?: string[];
}

export class PropertyDetailModel implements IProperty {
  id?: string;
  type?: string;
  inDoorAmenities?: string[];
  outDoorAmenities?: string[];
  listingCategoryId?: string;
  interiorId: string;
  viewsIds?: string;
  viewBalconyIds?: string;
  expectedPublishingDate?: string;
  approvalResultDate?: string;
  rejectedDate?: string;
  expiredDate?: string;
  saleContracts?: ImagUrlModel[];
  imageUrls?: ImagUrlModel[];
  certificateOfTitles?: ImagUrlModel[];
  title?: ILanguageValue[];
  description?: ILanguageValue[];
  displayPriceType?: number;
  autoPushDate?: string;
  canMoveInAfter?: string;
  constructor() {
    this.id = undefined;
  }

  public static assign(obj) {
    if (!obj) return undefined;

    const newObj = Object.assign(new PropertyDetailModel(), obj);
    newObj.projectId = obj.project ? obj.project?.id : undefined;
    newObj.interiorId = obj.interior ? obj.interior?.id : undefined;
    newObj.listingCategoryId = obj.listingCategory ? obj.listingCategory?.id : null;
    newObj.inDoorAmenities = obj.inDoorAmenities?.map((item) => item.id);
    newObj.outDoorAmenities = obj.outDoorAmenities?.map((item) => item.id);
    newObj.viewsIds = obj.views?.map((item) => item.id);

    newObj.expectedPublishingDate = obj.expectedPublishingDate
      ? dayjs(obj.expectedPublishingDate)
      : null;

    newObj.approvalResultDate = obj.lastApprovedLog?.createdAt
      ? dayjs(obj.lastApprovedLog.createdAt)
      : null;
    newObj.rejectedDate = obj.lastRejectedLog?.createdAt
      ? dayjs(obj.lastRejectedLog.createdAt)
      : null;

    newObj.dateAutoPush = obj.dateAutoPush ? dayjs(obj.dateAutoPush) : null;

    newObj.expiredDate = obj.expiredDate ? dayjs(obj.expiredDate) : null;
    newObj.autoPushDate = obj.autoPushDate ? dayjs(obj.autoPushDate) : null;
    newObj.canMoveInAfter = obj.canMoveInAfter ? dayjs(obj.canMoveInAfter) : null;
    newObj.imageUrls = obj.imageUrls?.map((item) => ({
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

    newObj.description =
      obj.description.length < 1
        ? [
            { language: 'vi', value: '' },
            { language: 'en', value: '' },
            { language: 'ko', value: '' },
          ]
        : map2Array(listLangue, obj.description);

    return newObj;
  }

  public static assigns<T>(objs) {
    const results: any[] = [];
    objs.forEach((item) => results.push(this.assign(item)));

    return results;
  }
}

export const PropertyStatus = {
  Draft: 0,
  WaitingForApproval: 1,
  approved: 2,
  Published: 3,
  Cancelled: 4,
  Takedown: 5,
  TakeDownSold: 6, //đã bán
  TakeDownLeased: 7, //đã thuê
  Rejected: 99,
  Expired: 100,
};
