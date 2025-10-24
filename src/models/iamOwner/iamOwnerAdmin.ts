import { listLangue, typeIamOwner } from '@/libs/appconst';
import { map2Array } from '@/libs/helper';

export class IamOwnerAdminDetailModel {
  birthday: string;
  service1?: any;
  service2?: any;
  service3?: any;
  contactUs?: any;

  public static assign(obj) {
    if (!obj) return undefined;

    const newObj = Object.assign(new IamOwnerAdminDetailModel(), obj);
    newObj.service1 = {
      ...obj.ownerContentDetails.find((item) => item.type === typeIamOwner.service1),
      content:
        obj.ownerContentDetails.find((item) => item.type === typeIamOwner.service1)?.content < 1
          ? [
              { language: 'vi', value: '' },
              { language: 'en', value: '' },
              { language: 'ko', value: '' },
            ]
          : map2Array(
              listLangue,
              obj.ownerContentDetails.find((item) => item.type === typeIamOwner.service1)?.content,
            ),
    };
    newObj.service2 = {
      ...obj.ownerContentDetails.find((item) => item.type === typeIamOwner.service2),
      content:
        obj.ownerContentDetails.find((item) => item.type === typeIamOwner.service2)?.content < 1
          ? [
              { language: 'vi', value: '' },
              { language: 'en', value: '' },
              { language: 'ko', value: '' },
            ]
          : map2Array(
              listLangue,
              obj.ownerContentDetails.find((item) => item.type === typeIamOwner.service2)?.content,
            ),
    };
    newObj.service3 = {
      ...obj.ownerContentDetails.find((item) => item.type === typeIamOwner.service3),
      content:
        obj.ownerContentDetails.find((item) => item.type === typeIamOwner.service3)?.content < 1
          ? [
              { language: 'vi', value: '' },
              { language: 'en', value: '' },
              { language: 'ko', value: '' },
            ]
          : map2Array(
              listLangue,
              obj.ownerContentDetails.find((item) => item.type === typeIamOwner.service3)?.content,
            ),
    };

    newObj.contactUs = {
      ...obj.ownerContentDetails.find((item) => item.type === typeIamOwner.contactUs),
      content:
        obj.ownerContentDetails.find((item) => item.type === typeIamOwner.contactUs)?.content < 1
          ? [
              { language: 'vi', value: '' },
              { language: 'en', value: '' },
              { language: 'ko', value: '' },
            ]
          : map2Array(
              listLangue,
              obj.ownerContentDetails.find((item) => item.type === typeIamOwner.contactUs)?.content,
            ),
    };
    return newObj;
  }

  public static assigns<T>(objs) {
    const results: any[] = [];
    objs.forEach((item) => results.push(this.assign(item)));

    return results;
  }
}
