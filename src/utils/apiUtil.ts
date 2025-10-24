import ApiResponseModel from '@/models/reponseModel/apiResponseModel';

export default class ApiUtil {
  static createSuccessReponse<T>(data: T): ApiResponseModel<T> {
    return {
      data: data,
      success: true,
    };
  }

  static createErrorReponse<T>(message: string): ApiResponseModel<T> {
    return {
      success: false,
      message: message,
    };
  }

  static flattenObject(obj) {
    return Object.keys(obj).reduce((acc, key) => {
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        const nested = ApiUtil.flattenObject(obj[key]);
        for (const nestedKey in nested) {
          acc[`${key}.${nestedKey}`] = nested[nestedKey];
        }
      } else if (Array.isArray(obj[key])) {
        for (let i = 0; i < obj[key].length; i++) {
          const arrayItem = obj[key][i];
          if (typeof arrayItem === 'object') {
            const arrayItemKey = `${key}[${i}]`;
            const arrayItemFlattened = ApiUtil.flattenObject(arrayItem);
            for (const nestedKey in arrayItemFlattened) {
              acc[`${arrayItemKey}.${nestedKey}`] = arrayItemFlattened[nestedKey];
            }
          } else {
            acc[`${key}[${i}]`] = arrayItem;
          }
        }
      } else if (obj[key] !== null && typeof obj[key] !== 'undefined') {
        acc[key] = obj[key];
      }
      return acc;
    }, {});
  }

  static getFormData(object) {
    const formData = new FormData();
    const flattenObj = ApiUtil.flattenObject(object);

    Object.keys(flattenObj).forEach((key) => {
      formData.append(key, flattenObj[key]);
    });
    return formData;
  }
}
