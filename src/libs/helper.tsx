import dayjs from 'dayjs';
import _, { debounce } from 'lodash';
import { checkValidText, emailRegex, roleAdminGod } from './appconst';
// dayjs.extend(utc);

export function arrayToObject(arr, key, value) {
  return (arr || []).reduce((obj, current) => {
    return { ...obj, [current[key]]: current[value] };
  }, {});
}
export function isNullOrEmpty(text) {
  return !text || (text = text.trim()).length < 1;
}

export function checkMultiLanguageRequired(rule, value, label) {
  if (
    !value ||
    value.length < 1 ||
    value.findIndex((language) =>
      language.language == 'ko' || language.language == 'en'
        ? false
        : isNullOrEmpty(language.value),
    ) !== -1
  ) {
    return Promise.reject(label);
  }
  return Promise.resolve();
}

export function checkTextMultiLanguageInBlackListForForm(text, listText, label) {
  let listKeywordBlock = [];
  text.map((language) => {
    if (language.value?.length > 0) {
      const listKeyBlock = checkValidText(language.value, listText);
      listKeywordBlock = [...listKeywordBlock, ...listKeyBlock];
    }
  });
  if (listKeywordBlock.length > 0) {
    return Promise.reject(
      label + listKeywordBlock.map((item, index) => (index > 0 ? ' ' + item : '' + item)),
    );
  }
  return Promise.resolve();
}

export function checkMultiLanguageMaxLength(rule, value, label) {
  if (
    !value ||
    value.length < 1 ||
    value.findIndex((language) => (language.value || '').length > rule.max) !== -1
  ) {
    return Promise.reject(label);
  }
  return Promise.resolve();
}

export function checkValidTextInBlackListForForm(text, listText, label) {
  if (text) {
    // Tách chuỗi thành các từ

    const listKeyBlock = checkValidText(text, listText);
    // Kiểm tra xem từ nào trong mảng array xuất hiện trong wordsInText

    if (listKeyBlock.length > 0) {
      return Promise.reject(
        label + listKeyBlock.map((item, index) => (index > 0 ? ' ' + item : '' + item)),
      );
    }
  }
  return Promise.resolve();
}

export function inputNumberFormatter(value) {
  return `${(value + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}
export function inputNumberParse(value) {
  return value.replace(/\$\s?|(,*)/g, '');
}
export function mergeArraysLangue(title, description) {
  let infoTranslation = [];

  for (let i = 0; i < title.length; i++) {
    let language = title[i].language;

    let titleValue = title[i].value;
    let descriptionValue = description[i].value;

    let translation = {
      language: language,
      title: titleValue,
      description: descriptionValue,
    };

    infoTranslation.push(translation);
  }

  return infoTranslation;
}
export function formatNumber(val: string | number) {
  const convertedNum = Number(val);
  if (isNaN(convertedNum)) return '';

  return new Intl.NumberFormat().format(convertedNum);
}

export function getCookie(name) {
  let cookie = {};
  document.cookie.split(';').forEach(function (el) {
    let [k, v] = el.split('=');
    cookie[k.trim()] = v;
  });
  return cookie[name];
}

export function checkDuplicateParamInFilter(array, obj, keyword) {
  let found = false;

  for (let i = 0; i < array.length; i++) {
    if (array[i].term && array[i].term[keyword] !== undefined) {
      array[i].term[keyword] = obj[keyword];
      found = true;
      break;
    }
  }

  if (!found) {
    array.push({ term: { [keyword]: obj[keyword] } });
  }

  return array;
}

export function removeparamInFilter(array, obj, keyword) {
  // Kiểm tra xem obj có thuộc tính 'status' và có giá trị là null hoặc undefined không

  if (
    obj.hasOwnProperty(`${keyword}`) &&
    (obj[keyword] === null || obj[keyword] === undefined || obj[keyword] === 'all')
  ) {
    // Lọc mảng để loại bỏ phần tử có 'term' và 'status'
    array = array.filter((item) =>
      item.term[keyword] == 0 ? false : !(item.term && item.term[keyword]),
    );
  }
  return array;
}

export function blockKeyEnter(event) {
  if (event.code === 'Enter') {
    event.preventDefault();
    return true;
  } else false;
}

export const rhythmSlowForCallApi = debounce(async (api) => {
  try {
    await api();
  } catch (error) {
    console.error(error);
  }
}, 250);
export const formatDate = 'DD/MM/YYYY';
export const formatDateTime = 'HH:mm DD/MM/YYYY';

export const filterOptions = (input: string, option?: { label: string; value: string }) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

export const filterOptionsRemoveVietnameseTones = (
  input: string,
  option?: { label: string; value: string; children: any },
) => {
  // Hàm loại bỏ dấu tiếng Việt
  const removeVietnameseTones = (str: string) => {
    str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    str = str.replace(/đ/g, 'd').replace(/Đ/g, 'D');
    return str;
  };

  // Chuyển chuỗi input và option về dạng không dấu, chữ thường để so sánh
  const normalizedInput = removeVietnameseTones(input.toLowerCase());
  const normalizedOption = removeVietnameseTones(
    (option?.label ?? option?.children ?? '').toLowerCase(),
  );

  // Kiểm tra nếu normalizedOption chứa normalizedInput
  return normalizedOption.includes(normalizedInput);
};

export function formatPhoneHidden(str: string) {
  return str.replace(/^84/, '0').replace(/^(\d{3})\d{3}(\d{4})$/, '$1*******');
}

interface ConvertedData {
  ZONE_LOGO_BANNER: boolean;
  ZONE_REVIEW: boolean;
  LOGO_IMAGE: string;
  SUGGESTED_RADIUS: number;
  EMAIL_CONTACT: string[];
  LOGO_LANDING_PAGE: string;
  NOTIFICATION_INFO: any[];
}

export function convertJsonSetting(originalData: any[]): ConvertedData {
  const convertedData: ConvertedData = {
    ZONE_LOGO_BANNER: false, // default value
    ZONE_REVIEW: false, // default value
    LOGO_IMAGE: '', // default value
    SUGGESTED_RADIUS: 0, // default value
    EMAIL_CONTACT: [], // default value
    LOGO_LANDING_PAGE: '', // default value
    NOTIFICATION_INFO: [],
  };

  originalData.forEach((item) => {
    convertedData[item.key] = item.value;
  });

  return convertedData;
}

export function isValidEmail(text) {
  if (!text || isNullOrEmpty(text)) {
    return false;
  }
  return emailRegex.test(text);
}

export function checkNumberPhone(text) {
  let isNumberPhone = false;
  if (/^\d+$/.test(text)) {
    if (text.startsWith('0')) {
      text = '84' + text.substring(1);
      isNumberPhone = true;
    } else {
      isNumberPhone = false;
    }
  } else {
    isNumberPhone = false;
  }
  // Nếu không phải là số, giữ nguyên chuỗi

  return isNumberPhone;
}

export function convertCountryPhoneCode(text) {
  // Kiểm tra xem chuỗi có phải là số không

  if (/^\d+$/.test(text)) {
    // Nếu là số, kiểm tra xem có số 0 ở đầu không
    if (text.startsWith('0')) {
      // Nếu có, thay thế số 0 đầu tiên bằng 84
      text = '84' + text.substring(1);
    }
  }
  // Nếu không phải là số, giữ nguyên chuỗi

  return text;
}

export const validKey = (filter: any, key: string) => {
  return (
    (!Array.isArray(filter[key]) && filter[key] !== null && typeof filter[key] !== 'undefined') ||
    (Array.isArray(filter[key]) && filter[key].length > 0)
  );
};
export function checkPermissionModule(userAccesses: string[], permission: any) {
  const values = [`${permission?.view}`, `${permission?.admin}`, `${roleAdminGod}`];

  return _.intersection(values, userAccesses).length > 0;
}

export function checkPermissonAcion(userAccesses: string[], listPermission: string[]) {
  return _.intersection(userAccesses, listPermission).length > 0;
}

export function applyQuery(filter) {
  let query = {
    from: 0,
    query: {
      bool: {
        must: [],
        filter: [],
        must_not: [],
        should: [],
      },
    },
    size: 5,
    sort: {
      label: 'Thời gian tạo giảm dần',
      field: 'createdAt',
      sortOrder: 1,
      isDefault: true,
    },
  };
  if (filter?.size) {
    query.size = filter?.size;
  }
  if (filter?.from) {
    query.from = filter?.from;
  }
  if (filter?.isActive !== null && filter?.isActive != undefined) {
    query.query.bool.filter.push({
      term: { isActive: filter?.isActive },
    });
  }
  if (filter?.accountType) {
    query.query.bool.filter.push({
      term: { accountType: filter?.accountType },
    });
  }
  if (filter?.notiType) {
    query.query.bool.filter.push({
      term: { notiType: filter?.notiType },
    });
  }
  if (filter?.category) {
    query.query.bool.filter.push({
      term: { category: filter?.category },
    });
  }
  if (filter?.type > -1 && filter?.type != undefined) {
    query.query.bool.filter.push({
      term: { type: filter?.type },
    });
  }

  if (filter?.userApproveOrReject) {
    query.query.bool.filter.push({
      bool: {
        should: [
          {
            term: {
              'lastApprovedLog.userInfo.userName': filter?.userApproveOrReject,
            },
          },
          {
            term: {
              'lastRejectedLog.userInfo.userName': filter?.userApproveOrReject,
            },
          },
        ],
        minimum_should_match: 1,
      },
    });
  }

  if (filter?.ticketStatus > -1 && filter?.ticketStatus != undefined) {
    query.query.bool.filter.push({
      term: { ticketStatus: filter?.ticketStatus },
    });
  }

  if (filter?.province) {
    query.query.bool.filter.push({
      bool: {
        filter: [
          {
            match_phrase: {
              'location.province': filter?.province,
            },
          },
        ],
      },
    });
  }

  if (filter?.district) {
    query.query.bool.filter.push({
      bool: {
        filter: [
          {
            match_phrase: {
              'location.district': filter?.district,
            },
          },
        ],
      },
    });
  }

  if (filter?.ward) {
    query.query.bool.filter.push({
      bool: {
        filter: [
          {
            match_phrase: {
              'location.ward': filter?.ward,
            },
          },
        ],
      },
    });
  }

  if (filter?.ticketStatus > -1 && filter?.ticketStatus != undefined) {
    query.query.bool.filter.push({
      term: { ticketStatus: filter?.ticketStatus },
    });
  }

  if (filter.multipleStatusListting) {
    if (Array.isArray(filter.multipleStatusListting)) {
      if (filter.multipleStatusListting.length > 0) {
        query.query.bool.filter.push({
          terms: { status: [...filter.multipleStatusListting] },
        });
      }
    } else {
      const multipleStatusListting = filter.multipleStatusListting.split(',').map(Number);

      query.query.bool.filter.push({
        terms: { status: [...multipleStatusListting] },
      });
    }
  }

  if (filter?.status > -1 && filter?.status != undefined) {
    query.query.bool.filter.push({
      term: { status: filter?.status },
    });
  }

  if (filter?.createdBy) {
    query.query.bool.filter.push({
      term: { createdBy: filter?.createdBy },
    });
  }
  if (filter?.keyword) {
    // let cleanedText = filter?.keyword.replace(/[^a-zA-Z0-9\s\u00C0-\u024F\u1E00-\u1EFF]/g, '');
    let cleanedText = filter?.keyword;
    if (cleanedText.startsWith('0')) {
      cleanedText = '84' + cleanedText.substring(1);
    }

    query.query.bool.must.push({
      query_string: {
        query: `*${cleanedText}*`,
        fields: [
          'name',
          'title.value',
          'shortDescription.value',
          'phone',
          'fullName',
          'firstName',
          'lastName',
          'listingCategoryTranslation.name',
        ],
        default_operator: 'AND',
      },
    });
  }

  if (filter?.keywordContact) {
    if (checkNumberPhone(filter?.keywordContact)) {
      query.query.bool.must.push({
        query_string: {
          query: `*${convertCountryPhoneCode(filter?.keywordContact)}*`,
          fields: ['phone'],
          default_operator: 'OR',
        },
      });
    }
    query.query.bool.must.push({
      query_string: {
        query: `*${filter.keywordContact}*`,
        fields: ['clientName', 'email', 'phone'],
        default_operator: 'OR',
      },
    });
  }

  if (filter?.date) {
    query.query.bool.filter.push({
      range: {
        createdAt: {
          time_zone: '+07:00',
          gte: dayjs(filter?.date[0]).format('YYYY/MM/DD 00:00'),
          lte: dayjs(filter?.date[1]).format('YYYY/MM/DD 23:59'),
          format: 'yyyy/MM/dd HH:mm',
        },
      },
    });
  }

  if (
    filter?.publishedDate &&
    filter.publishedDate[0] !== null &&
    filter.publishedDate[1] !== null
  ) {
    // query.query.bool.filter.push({
    //   range: {
    //     publishedDate: {
    //       time_zone: '+07:00',
    //       gte: dayjs(filter?.publishedDate[0]).format('YYYY/MM/DD 00:00'),
    //       lte: dayjs(filter?.publishedDate[1]).format('YYYY/MM/DD 23:59'),
    //       format: 'yyyy/MM/dd HH:mm',
    //     },
    //   },
    // });
    query.query.bool.filter.push({
      range: {
        createdAt: {
          time_zone: '+07:00',
          gte: dayjs(filter?.publishedDate[0]).format('YYYY/MM/DD 00:00'),
          lte: dayjs(filter?.publishedDate[1]).format('YYYY/MM/DD 23:59'),
          format: 'yyyy/MM/dd HH:mm',
        },
      },
    });
  }

  if (filter?.postAt && filter.postAt[0] !== null && filter.postAt[1] !== null) {
    query.query.bool.filter.push({
      range: {
        postAt: {
          time_zone: '+07:00',
          gte: dayjs(filter?.postAt[0]).format('YYYY/MM/DD 00:00'),
          lte: dayjs(filter?.postAt[1]).format('YYYY/MM/DD 23:59'),
          format: 'yyyy/MM/dd HH:mm',
        },
      },
    });
  }
  if (filter?.projectId) {
    query.query.bool.filter.push({
      term: { projectId: filter?.projectId },
    });
  }

  return query;
}

export function downloadFile(data, fileName) {
  const url = window.URL.createObjectURL(data);
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.setAttribute('style', 'display: none');
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove(); // remove the element
}

export function map2Array(arayA, arrayB) {
  const arrayC = arayA.map((lang) => {
    // Tìm kiếm giá trị tương ứng trong mảng b
    const foundValue = arrayB.find((item) => item.language === lang.name);

    // Nếu không tìm thấy, giá trị mặc định là chuỗi rỗng
    const value = foundValue ? foundValue.value : '';

    // Trả về object mới cho mảng c
    return { language: lang.name, value };
  });

  return arrayC;
}

export function renderStatusActive(value, active, inActive) {
  return value === true ? (
    <span
      style={{
        fontSize: 12,
        backgroundColor: '#E2EEFE',
        color: '#1178F5',
        padding: '6px 8px',
        borderRadius: '8px',
        fontWeight: 600,
      }}
    >
      {active}
    </span>
  ) : (
    <span
      style={{
        fontSize: 12,
        backgroundColor: '#FCE4E4',
        color: '#840B1F',
        padding: '6px 8px',
        borderRadius: '8px',
        fontWeight: 600,
      }}
    >
      {inActive}
    </span>
  );
}

export function convertPhoneNumber(phoneNumber: string): string {
  // Check if the number starts with '0'
  if (!phoneNumber) {
    return phoneNumber;
  }
  if (phoneNumber.startsWith('0')) {
    // Replace '0' with '84'
    return '84' + phoneNumber.slice(1);
  }
  // If it doesn't start with '0', return the original number
  return phoneNumber;
}

export function convertPhoneNumber84To0(phoneNumber: string): string {
  if (!phoneNumber) {
    return phoneNumber;
  }
  // Check if the number starts with '0'
  if (phoneNumber.startsWith('84')) {
    // Replace '0' with '84'
    return '0' + phoneNumber.slice(2);
  }
  // If it doesn't start with '0', return the original number
  return phoneNumber;
}
export const convertFilterDate = (currentFilter, newDatePicker, fromName?, toName?) => {
  const fName = fromName ? fromName : 'fromDate';
  const tName = toName ? toName : 'toDate';
  const date = new Date();

  // const offset = date.getTimezoneOffset() / 60;
  // console.log(offset);
  const fromDate = newDatePicker
    ? dayjs(newDatePicker[0])
        .set('hour', 0 + 7) // +7 vì giờ VN là múi giờ +7
        .set('minute', 0)
        .set('second', 0)
        .set('millisecond', 0)
        .toISOString()
    : undefined;
  const toDate = newDatePicker
    ? dayjs(newDatePicker[1])
        .set('hour', 24 - 1 + 7) // +7 vì giờ VN là múi giờ +7
        .set('minute', 59)
        .set('second', 59)
        .set('millisecond', 999)
        .toISOString()
    : undefined;
  return { ...currentFilter, [fName]: fromDate, [tName]: toDate };
};

export const convertFilterDateLocalVN = (currentFilter, newDatePicker, fromName?, toName?) => {
  const fName = fromName ? fromName : 'fromDate';
  const tName = toName ? toName : 'toDate';
  const date = new Date();

  // const offset = date.getTimezoneOffset() / 60;
  // console.log(offset);
  const fromDate = newDatePicker
    ? dayjs(newDatePicker[0])
        .set('hour', 0 + 7)
        .set('minute', 0)
        .set('second', 0)
        .set('millisecond', 0)
        .toISOString()
    : undefined;
  const toDate = newDatePicker
    ? dayjs(newDatePicker[1])
        .set('hour', 24 - 1 + 7)
        .set('minute', 59)
        .set('second', 59)
        .set('millisecond', 999)
        .toISOString()
    : undefined;
  return { ...currentFilter, [fName]: fromDate, [tName]: toDate };
};

export const tinhSoTienTruocThue = (tongTien, thueVAT) => {
  // thueVAT là phần trăm, ví dụ 10% thì nhập 10
  const thueSuat = thueVAT / 100;
  const soTienTruocThue = tongTien / (1 + thueSuat);
  const tienVAT = tongTien - soTienTruocThue;

  return tienVAT; // Làm tròn 2 chữ số thập phân
};

export const transformContentArrayToObject = (contentArray: any[]) => {
  const obj: Record<string, string> = {};
  contentArray?.forEach(({ language, value }) => {
    obj[language] = value || '';
  });
  return obj;
};

export const transformContentObjectToArray = (contentObj: Record<string, string>) => {
  return Object.entries(contentObj).map(([language, value]) => ({
    language,
    value: value || null,
  }));
};

export const caculateDiffYears = (date: string) => {
  if (date) {
    const startDate = new Date(date);
    const now = new Date();

    const diffInMs = now.getTime() - startDate.getTime();
    const diffInYears = diffInMs / (1000 * 60 * 60 * 24 * 365.25);

    // Làm tròn lên
    const roundedYears = Math.ceil(diffInYears);

    return roundedYears;
  }
};
