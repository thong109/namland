import ATMIcon from '@/assets/icon/atmIcon.svg';
import CreditCardIcon from '@/assets/icon/creditIcon.svg';
import AvatarDefault from '@/assets/images/avarta-default.svg';

import PaymeIcon from '@/assets/icon/paymeIcon.svg';
import QRcode from '@/assets/icon/qrIcon.svg';
import { ListingTypeEnum } from '@/ecom-sadec-api-client';
import { BaseModel } from '@/models/propertyModel/baseModal';
import { CommentStatusModel } from '@/models/propertyModel/commentStatusModel';
import { PropertyHandoverStatusModel } from '@/models/propertyModel/propertyHandoverStatusModel';
import { PropertyLegalStatusModel } from '@/models/propertyModel/propertyLegalStatusModel';
import { PropertyStatusModel } from '@/models/propertyModel/propertyStatusModel';
import dayjs from 'dayjs';
export default function replaceSpecialStringForES(text) {
  if (text) {
    var specialCharacters = '+ - = && || > < ! ( ) { } [ ] ^ " ~ * ? :  /';
    var specialCharacterArr = specialCharacters.split(' ');
    for (var i = 0; i < specialCharacterArr.length; i++) {
      if (specialCharacterArr[i]) {
        text = text.replaceAll(specialCharacterArr[i], '\\' + specialCharacterArr[i]);
      }
    }
  }
  return text;
}

export const getParamsStringFromObj = (dataFilter) => {
  const filteredValues = Object.keys(dataFilter)
    .filter((key) => dataFilter[key] !== undefined && dataFilter[key] !== '')
    .reduce((obj, key) => {
      obj[key] = dataFilter[key];
      return obj;
    }, {});
  const queryParams = new URLSearchParams();
  Object.keys(filteredValues).forEach((key) => {
    if (Array.isArray(filteredValues[key])) {
      filteredValues[key].forEach((val: string | number) => {
        if (val || val === 0) {
          queryParams.append(key, val.toString());
        }
      });
    } else {
      if (filteredValues[key] || filteredValues[key] === 0) {
        queryParams.append(key, filteredValues[key].toString());
      }
    }
  });
  return queryParams.toString();
};

export const languageConst = { vn: 'vi' as const, en: 'en' as const };
export const align = { right: 'right' as const, left: 'left' as const, center: 'center' as const };

export const typeModal = { new: 'new', approve: 'approved', reject: 'rejected' };

export const appAccountRegisterStatusEnum = { NewAccount: 0, LoginSuccess: 1, BLockLogin: 3 };

export const listRouterPortal = {
  dashboard: '/admin/dashboard',
  myProperties: '/client/tin-dang-cua-toi',
  staffProperties: '/admin/staff-properties',
  myProfile: '/my-profile',
  myFavorite: '/client/tin-yeu-thich',
  otpManagement: '/admin/otp-management',
  ownInquiry: '/client/own-inquiry',
  clientInquiry: '/client/client-inquiry',
  clientInquiryStaff: '/client/own-inquiry',
  member: '/admin/quan-ly-thanh-vien',
  report: '/report',
  reportLogin: '/report-login',
  keywordManagement: '/admin/keyword-management',
  reportBCT: '/admin/report-bct',
  bannerManagement: '/admin/banner-management',
  agentManagement: '/admin/find-agent',
  settingManagement: '/admin/setting-management',
  tsAndCsManagent: '/admin/ts-and-cs-management',
  tsAndCsManagentMobile: '/admin/ts-and-cs-mobile',
  termCondinWeb: '/admin/term-condition-managent',
  termCondinMobile: '/admin/term-condition-mobile',
  searchLocationManagement: '/admin/search-location-management',
  productType: '/admin/product-type',
  staffManagement: '/admin/quan-ly-nhan-vien',
  roleManagement: '/admin/quan-ly-phan-quyen',
  projectManagement: '/admin/quan-ly-du-an',
  clientInquiryAdmin: '/admin/client-inquiry-admin',
  ownInquiryAdmin: '/admin/own-inquiry-admin',
  ownerServiceAgreement: '/admin/owner-service-agreement',
  leaseAgreement: '/admin/lease-agreement',
  iamOwner: '/admin/i-am-owner',
  listingPackageManagement: '/admin/listing-package-management',
  listingPushPackage: '/admin/listing-push-package',
  amenityModule: '/admin/ameniti-management',
  transaction: '/client/lich-su-giao-dich',
  transactionAdmin: '/admin/transaction-management',
  userWallet: '/admin/user-wallet-management',
  topupPoint: '/admin/topup-points',
  paymeConfig: '/admin/payme-config',
  systemFeeConfig: '/admin/system-fee-config',
  newHome: '/admin/new-home',
  ratingMe: '/client/danh-gia-cua-toi',
  ratingAdmin: '/admin/danh-gia-agent',
  privacyPolicy: '/admin/privacy-policy-web',
  privacyPolicyMobile: '/admin/privacy-policy-mobile',
  regulationSettlementWeb: '/admin/regulation-on-settlement-management',
  regulationSettlementMobile: '/admin/regulation-on-settlement-mobile',
};

export function renderDateTime(value) {
  let valueConvet;
  let valueTryConvert;
  if (value) {
    valueConvet = dayjs(value).format('HH:mm, DD/MM/YYYY');
    valueTryConvert = dayjs(value, 'DD/MM/YYYY HH:mm').format('HH:mm, DD/MM/YYYY');
  }

  return valueConvet == 'Invalid Date' ? valueTryConvert : valueConvet;
}

export function renderDateTimeV2(value) {
  let valueConvet;
  let valueTryConvert;
  if (value) {
    valueConvet = dayjs(value).format('HH:mm:ss, DD/MM/YYYY');
    valueTryConvert = dayjs(value, 'DD/MM/YYYY HH:mm:ss').format('HH:mm:ss, DD/MM/YYYY');
  }

  return valueConvet == 'Invalid Date' ? valueTryConvert : valueConvet;
}

export function renderDateTimeIfNotCorrectFormat(values) {
  var originalDate = new Date(values);
  // Lấy thông tin về giờ, phút, ngày, tháng và năm
  var hours = originalDate.getHours();
  var minutes = originalDate.getMinutes();
  var day = originalDate.getDate();
  var month = originalDate.getMonth() + 1; // Lưu ý: Tháng trong JavaScript bắt đầu từ 0
  var year = originalDate.getFullYear();

  // Định dạng lại chuỗi theo định dạng mới
  var formattedString =
    hours.toString().padStart(2, '0') +
    ':' +
    minutes.toString().padStart(2, '0') +
    ', ' +
    day.toString().padStart(2, '0') +
    '/' +
    month.toString().padStart(2, '0') +
    '/' +
    year;

  return values;
}

export function renderDate(value) {
  if (value) {
    value = dayjs(value).format('DD/MM/YYYY');
  }

  return value;
}

export function renderDateAdd7Hours(value) {
  if (value) {
    value = dayjs(value).add(7, 'hour').format('DD/MM/YYYY');
  }

  return value;
}

export const genderList = [
  { id: 'male', name: 'male' },
  { id: 'female', name: 'female' },
  { id: 'other', name: 'other' },
];

export const segmentList = [
  { id: 'high', name: 'high' },
  { id: 'low', name: 'low' },
  { id: 'medium', name: 'medium' },
];

export const projectClassifyList = [
  { id: 'saledopen', name: 'saledopen' },
  { id: 'completed', name: 'completed' },
];

export const projectType = [
  { id: 'apartment', name: 'apartment' },
  { id: 'townhouse', name: 'townhouse' },
  { id: 'villa', name: 'villa' },
];

export const listCategoryNews = [
  { id: 'event', name: 'event' },
  { id: 'introduce', name: 'introduce' },
  { id: 'project', name: 'project' },
];

export const listStatusUnit = [
  { id: 1, name: 'active' },
  { id: 2, name: 'inActive' },
];

export const listStatusRating = [
  { id: true, name: 'active', value: true },
  { id: false, name: 'inActive', value: false },
];

export const removeDiacritics = (str) => {
  if (!str) return str;
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};
export const listStatusProject: any[] = [
  { id: 1, name: 'EcomPropertyListingPageListViewForSale' },
  { id: 0, name: 'EcomPropertyListingPageListViewForRent' },
];

export const CashReceipt: PropertyStatusModel[] = [
  { id: 0, name: 'PushLisingPackage' },
  { id: 1, name: 'ListingPackage' },
  { id: 2, name: 'Topup' },
];

export const listPackage: any[] = [
  { id: 1, name: 'Basic' },
  { id: 2, name: 'Gold' },
  { id: 3, name: 'Platinum' },
];

export const packageListingEnum = { Basic: 1, Gold: 2, Platinum: 3 };

export const listPackageEnum = [
  { id: 1, name: '1Listing', packageType: 1 },
  { id: 2, name: '10Listing', packageType: 2 },
  { id: 3, name: '30Listing', packageType: 3 },
  // { id: 4, name: 'SpecialPromotion' },
];

export const packageEnum = {
  Listing1: 1,
  Listing10: 2,
  Listing30: 3,
  // SpecialPromotion: 4,
};

export const listStatusPackage = [
  { id: 0, name: 'InActive' },
  { id: 1, name: 'Active' },
];

export const listingType = { rent: 0 as ListingTypeEnum, sale: 1 as ListingTypeEnum };

export const priceType = { square: 0, month: 1 };

export const amenityType = { In: 1, Out: 2 };

export const ListamenityType = [
  { id: 1, name: 'Indoor' },
  { id: 2, name: 'Outdoor' },
];

export const typeIamOwner = {
  service1: 'Service 1',
  service2: 'Service 2',
  service3: 'Service 3',
  contactUs: 'Contact Us',
};

export const typePositionBanner = {
  horizontal: 'horizontal',
  vertical: 'vertical',
  newHome: 'newHome',
};

export const listPositionBanner = [
  { id: 1, name: 'AboveSale', type: 'horizontal' },
  { id: 2, name: 'UnderRent', type: 'horizontal' },
  { id: 5, name: 'newHomeList', type: 'newHome' },
];
export const listMaterialPlace: BaseModel[] = [
  { id: 'School', name: 'School' },
  { id: 'Restaurant', name: 'Restaurant' },
  { id: 'ShoppingMall', name: 'ShoppingMall' },
  { id: 'Hospital', name: 'Hospital' },
];

export const bannerImageAspect = {
  horizontal: 1920 / 580,
  vertical: 350 / 900,
  newHome: 2, //nếu là 2 thì đúng format new home
};
export const activeStatus = [
  { id: true, name: 'Active' },
  { id: false, name: 'InActive' },
  { id: null, name: 'All' },
];
export const listPriotyStatus = [
  { value: 'all', label: 'All' },
  { value: 0, label: 'EcomPropertyListingPageListViewDraft' },
  { value: 1, label: 'EcomPropertyListingPageListViewWaitingForApproval' },
  { value: 2, label: 'EcomPropertyListingPageListViewApproval' },
  { value: 3, label: 'EcomPropertyListingPageListViewPublished' },
  { value: 4, label: 'EcomPropertyListingPageListViewCanncel' },
  { value: 5, label: 'EcomPropertyListingPageListViewTackDown' },
  { value: 99, label: 'EcomPropertyListingPageListViewRejected' },
  { value: 100, label: 'EcomPropertyListingPageListViewExpired' },
];

export const listPriotyStatusFilter = [
  { id: 0, value: 0, label: 'EcomPropertyListingPageListViewDraft' },
  { id: 1, value: 1, label: 'EcomPropertyListingPageListViewWaitingForApproval' },
  { id: 2, value: 2, label: 'EcomPropertyListingPageListViewApproval' },
  { id: 3, value: 3, label: 'EcomPropertyListingPageListViewPublished' },
  { id: 4, value: 4, label: 'EcomPropertyListingPageListViewCanncel' },
  { id: 5, value: 5, label: 'EcomPropertyListingPageListViewTakeDown' },
  { id: 6, value: 6, label: 'EcomPropertyListingPageListViewTakeDownSold' },
  { id: 7, value: 7, label: 'EcomPropertyListingPageListViewTakeDownLeased' },
  { id: 99, value: 99, label: 'EcomPropertyListingPageListViewRejected' },
  { id: 100, value: 100, label: 'EcomPropertyListingPageListViewExpired' },
];

export const listPriotyStatusForStaffFilter = [
  { value: 1, label: 'EcomPropertyListingPageListViewWaitingForApproval' },
  { value: 2, label: 'EcomPropertyListingPageListViewApproval' },
  { value: 3, label: 'EcomPropertyListingPageListViewPublished' },
  { value: 4, label: 'EcomPropertyListingPageListViewCanncel' },
  { value: 99, label: 'EcomPropertyListingPageListViewRejected' },
  { value: 100, label: 'EcomPropertyListingPageListViewExpired' },
];

export const listStatusInquiry = [
  {
    name: 'EcomTicketManagementDetailPageDetailNewTicket',
    nameValue: 'New',
    classCode: 'text-[#27AE60] bg-[#FFD14B] p-2 rounded-lg',
  },
  {
    name: 'EcomTicketManagementDetailPageDetailDropped',
    nameValue: 'Dropped',
    classCode: 'text-[#FFD14B] bg-[#FFD14B] p-2 rounded-lg',
  },
  {
    name: 'EcomTicketManagementDetailPageDetailClosed',
    nameValue: 'Closed',
    classCode: 'text-[#111820] bg-[#DEE3ED] p-2 rounded-lg',
  },
  {
    name: 'EcomTicketManagementDetailPageDetailAgreement',
    nameValue: 'Agreement',
    classCode: 'text-[#F2994A] bg-[#FEF4EC] p-2 rounded-lg',
  },
  {
    name: 'EcomTicketManagementDetailPageDetailSiteVisit',
    nameValue: 'SiteVisit',
    classCode: 'text-[#1178F5] bg-[#E2EEFE] p-2 rounded-lg',
  },
];

export const listStatusTicketFilter = [
  {
    id: 0,
    name: 'EcomTicketManagementDetailPageDetailNewTicket',
    value: 0,
    classCode: 'text-[#27AE60] bg-[#E6F9EE] p-2 rounded',
  },
  {
    id: 1,
    name: 'EcomTicketManagementDetailPageDetailSiteVisit',
    value: 1,
    classCode: 'text-[#1178F5] bg-[#E2EEFE] p-2 rounded',
  },
  {
    id: 2,
    name: 'EcomTicketManagementDetailPageDetailOffer',
    value: 2,
    classCode: 'text-[#F2994A] bg-[#FEF4EC] p-2 rounded',
  },
  {
    id: 3,
    name: 'EcomTicketManagementDetailPageDetailAgreement',
    value: 3,
    classCode: 'text-[#F2994A] bg-[#FEF4EC] p-2 rounded',
  },
  {
    id: 4,
    name: 'EcomTicketManagementDetailPageDetailClosed',
    value: 4,
    classCode: 'text-[#111820] bg-[#DEE3ED] p-2 rounded',
  },
  {
    id: 5,
    name: 'EcomTicketManagementDetailPageDetailDropped',
    value: 5,
    classCode: 'text-[#1c1211] bg-[#FFD14B] p-2 rounded',
  },
];
export const listStatusOwnInquiry = [
  { id: 1, name: 'New', value: 1, classCode: 'text-[#27AE60] bg-[#E6F9EE] p-2 rounded' },
  { id: 2, name: 'SiteVisit', value: 2, classCode: 'text-[#1178F5] bg-[#E2EEFE] p-2 rounded' },
  {
    id: 3,
    name: 'OwnerServiceAgreement',
    value: 3,
    classCode: 'text-[#F2994A] bg-[#FEF4EC] p-2 rounded',
  },
  { id: 4, name: 'Close', value: 4, classCode: 'text-[#F2994A] bg-[#FEF4EC] p-2 rounded' },
  { id: 5, name: 'Dropped', value: 5, classCode: 'text-[#111820] bg-[#DEE3ED] p-2 rounded' },
];

export const statusOwnInquiryEnum = {
  New: 1,
  SiteVisit: 2,
  OwnerServiceAgreement: 3,
  Close: 4,
  Dropped: 5,
};

export const listStatusOSA = [
  { id: 1, name: 'New', value: 1, classCode: 'text-[#27AE60] bg-[#E6F9EE] p-2 rounded' },
  { id: 2, name: 'SignRequest', value: 2, classCode: 'text-[#1178F5] bg-[#E2EEFE] p-2 rounded' },
  {
    id: 3,
    name: 'LookingForTenant',
    value: 3,
    classCode: 'text-[#F2994A] bg-[#FEF4EC] p-2 rounded',
  },
  { id: 4, name: 'Completed', value: 4, classCode: 'text-[#F2994A] bg-[#FEF4EC] p-2 rounded' },
  { id: 5, name: 'Cancel', value: 5, classCode: 'text-[#111820] bg-[#DEE3ED] p-2 rounded' },
];

export const LAStatus = [
  { id: 1, name: 'Draft', value: 1, classCode: 'text-[#27AE60] bg-[#E6F9EE]' },
  { id: 2, name: 'Sent', value: 2, classCode: 'text-[#27AE60] bg-[#E6F9EE]' },
  { id: 3, name: 'Signed', value: 3, classCode: 'text-[#27AE60] bg-[#E6F9EE]' },
  { id: 4, name: 'Completed', value: 4, classCode: 'text-[#27AE60] bg-[#E6F9EE]' },
  { id: 5, name: 'Dropped', value: 5, classCode: 'text-[#27AE60] bg-[#E6F9EE]' },
  { id: 6, name: 'Terminate', value: 6, classCode: 'text-[#27AE60] bg-[#E6F9EE]' },
];
export const LADepositStatus = [
  { id: 1, name: 'Unpaid', value: 1, classCode: 'text-[#27AE60] bg-[#E6F9EE] p-2 rounded' },
  { id: 2, name: 'Paid', value: 2, classCode: 'text-[#27AE60] bg-[#E6F9EE] p-2 rounded' },
  { id: 3, name: 'Refund', value: 3, classCode: 'text-[#27AE60] bg-[#E6F9EE] p-2 rounded' },
  { id: 4, name: 'Cancel', value: 4, classCode: 'text-[#27AE60] bg-[#E6F9EE] p-2 rounded' },
];
export const LAPayment = [
  { id: 1, name: 'Monthly', value: 1, classCode: 'text-[#27AE60] bg-[#E6F9EE] p-2 rounded' },
  { id: 2, name: 'Quarterty', value: 2, classCode: 'text-[#27AE60] bg-[#E6F9EE] p-2 rounded' },
  { id: 3, name: 'Yearly', value: 3, classCode: 'text-[#27AE60] bg-[#E6F9EE] p-2 rounded' },
  { id: 4, name: 'OneTimePayment', value: 4, classCode: 'text-[#27AE60] bg-[#E6F9EE] p-2 rounded' },
];

export const listingStatus = {
  Draft: 0,
  WaitingForApproval: 1,
  Approval: 2,
  Published: 3,
  Canncel: 4,
  TaskDown: 5,
  Rejected: 99,
  Expired: 100,
};

export const listpropertyApprovalStatus: PropertyStatusModel[] = [
  { id: 0, name: 'EcomPropertyListingPageListViewDraft' },
  { id: 1, name: 'EcomPropertyListingPageListViewWaitingForApproval' },
  { id: 2, name: 'EcomPropertyListingPageListViewApproval' },
  { id: 3, name: 'EcomPropertyListingPageListViewPublished' },
  { id: 4, name: 'EcomPropertyListingPageListViewCanncel' },
  { id: 5, name: 'EcomPropertyListingPageListViewTackDown' },
  { id: 99, name: 'EcomPropertyListingPageListViewRejected' },
  { id: 100, name: 'EcomPropertyListingPageListViewExpired' },
];
export const listpropertyApprovalStatusFiter: PropertyStatusModel[] = [
  { id: 0, name: 'EcomPropertyListingPageListViewDraft' },
  { id: 1, name: 'EcomPropertyListingPageListViewWaitingForApproval' },
  { id: 2, name: 'EcomPropertyListingPageListViewApproval' },
  { id: 3, name: 'EcomPropertyListingPageListViewPublished' },
  { id: 4, name: 'EcomPropertyListingPageListViewCanncel' },
  { id: 5, name: 'EcomPropertyListingPageListViewTackDown' },
  { id: 99, name: 'EcomPropertyListingPageListViewRejected' },
  { id: 100, name: 'EcomPropertyListingPageListViewExpired' },
];

export const listStatusTopUpTransaction = [
  {
    id: 0,
    name: 'EcomTransactionPageTopUpNewStatus',
    nameValue: 'New',
    classCode: 'text-[#2794ae] bg-[#e6f2f9] p-2 rounded-lg',
    value: 0,
  },
  {
    id: 1,
    name: 'EcomTransactionPageTopUpSucceededStatus',
    nameValue: 'Dropped',
    classCode: 'text-[#27AE60] bg-[#E6F9EE] p-2 rounded-lg',
    value: 1,
  },
  {
    id: 2,
    name: 'EcomTransactionPageTopUpFailedStatus',
    nameValue: 'Closed',
    classCode: 'text-[#EB5757] bg-[#FCE4E4] p-2 rounded-lg',
    value: 2,
  },
  {
    id: 3,
    name: 'EcomTransactionPageTopUpPendingStatus',
    nameValue: 'Agreement',
    classCode: 'text-[#EB5757] bg-[#FCE4E4]  p-2 rounded-lg',
    value: 3,
  },
  {
    id: 4,
    name: 'EcomTransactionPageTopUpExpiredStatus',
    nameValue: 'SiteVisit',
    classCode: 'text-[#EB5757] bg-[#FCE4E4]  p-2 rounded-lg',
    value: 4,
  },
  {
    id: 5,
    name: 'EcomTransactionPageTopUpCancelledStatus',
    nameValue: 'SiteVisit',
    classCode: 'text-[#EB5757] bg-[#FCE4E4]  p-2 rounded-lg',
    value: 5,
  },
  {
    id: 6,
    name: 'EcomTransactionPageTopUpRefundedStatus',
    nameValue: 'SiteVisit',
    classCode: 'text-[#EB5757] bg-[#FCE4E4]  p-2 rounded-lg',
    value: 6,
  },
];

export const NotifyType = {
  CREATE_LISTING_SUCCESS_CUSTOMER: 'CREATE_LISTING_SUCCESS_CUSTOMER',
  LISTING_APPROVED_OWNER: 'LISTING_APPROVED_OWNER',
  LISTING_REJECTED_OWNER: 'LISTING_REJECTED_OWNER',
  LISTING_EXPIRED_OWNER: 'LISTING_EXPIRED_OWNER',
  LISTING_TAKEDOWN_OWNER: 'LISTING_TAKEDOWN_OWNER',
  CREATE_INQUIRY_CUSTOMER: 'CREATE_INQUIRY_CUSTOMER',
  CREATE_SITEVISIT_CUSTOMER: 'CREATE_SITEVISIT_CUSTOMER',
  CONVERSATION: 'CONVERSATION',
  TOP_UP_COMPLETED: 'TOP_UP_COMPLETED',
  PURCHASED_SUCCESSFULLY: 'PURCHASED_SUCCESSFULLY',
};
export const NotificationTypeEnum = {
  LISTING: 0,
  CONVERSATION: 1,
  TOPUP: 2,
  PACKAGE: 3,
  PUSH: 4,
  OTHER: 5,
};

export const legalStatuses: PropertyLegalStatusModel[] = [
  { id: 1, name: 'PinkBookIssued' },
  { id: 2, name: 'DepositContract' },
  { id: 3, name: 'SellAndPurchaseAgreement' },
  { id: 4, name: 'WaitingForPinkBook' },
];

export const handOverStatuses: PropertyHandoverStatusModel[] = [
  { id: 0, name: 'EcomPropertyDetailPageDetailWaitingForHandOver' },
  { id: 1, name: 'EcomPropertyDetailPageDetailHandedOver' },
];

export const beds = [1, 2, 3, 4, 5];
export const baths = [1, 2, 3, 4, 5];

export const listingRentLeaseTerm = [
  { id: 1, name: '6Months' },
  { id: 2, name: '12Months' },
  { id: 3, name: '24Months' },
  { id: 4, name: 'Greate24Months' },
];

export interface ILanguageValue {
  language: string;
  value: string;
  icon?: any;
}

export const listLangue = [
  {
    name: 'vi',
    displayName: 'Tiếng Việt',
    icon: 'icon famfamfam-flags vn',
    isDefault: false,
    isDisabled: false,
    isRightToLeft: false,
  },
  {
    name: 'en',
    displayName: 'English',
    icon: 'icon famfamfam-flags gb',
    isDefault: true,
    isDisabled: false,
    isRightToLeft: false,
  },
  {
    name: 'ko',
    displayName: '한국인',
    icon: 'icon famfamfam-flags kr',
    isDefault: false,
    isDisabled: false,
    isRightToLeft: false,
  },
];

export const rePostDate = [
  { id: 5, name: 'next5days', value: 5 },
  { id: 10, name: 'next10days', value: 10 },
  { id: 15, name: 'next15days', value: 15 },
  { id: 30, name: 'next30day', value: 30 },
];

export const phoneRegex =
  /^[+]?\(?([0-9]{0,3})?\)?[-. ]?([0-9]{1,3})?[-. ]?([0-9]{1,3})[-. ]?([0-9]{1,5})$/;

export const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const primaryColor = '#FFD14B';

export const listOptionSelectStatusTicket = [
  { id: 1, name: 'New', value: 1 },
  { id: 1, name: 'SiteVisit', value: 1 },
  { id: 2, name: 'Offer', value: 2 },
  { id: 3, name: 'Agreement', value: 3 },
  { id: 4, name: 'Closed', value: 4 },
  { id: 5, name: 'Dropped', value: 5 },
];

export const approveFilterStatus = [
  { value: 'new', label: 'new' },
  { value: 'approved', label: 'approved' },
  { value: 'rejected', label: 'rejected' },
];

export const FilterStatusActiveMember = [
  { value: false, label: 'BTN_INACTIVE' },
  { value: true, label: 'BTN_ACTIVE' },
];

export const accountTypeFilterMember = [
  { value: 'all', label: 'All' },
  { value: 'other', label: 'other' },
  { value: 'owner', label: 'owner' },
  { value: 'broker', label: 'broker' },
];

export const typeUserPostListing = [
  { value: 'owner', name: 'owner' },
  { value: 'broker', name: 'broker' },
  { value: 'authorize', name: 'authorize' },
];

export const OwnershipTypeList = [
  { value: 0, label: 'Individual' },
  { value: 1, label: 'Enterprise' },
];

export const statusItem = { ACTIVE: 1, INACTIVE: 2 };

export const listAccountType = [
  { value: 'visitor', name: 'Visitor' },
  { value: 'owner/broker', name: 'Owner/broker' },
];
export const listAccountTypeFilter = [
  { value: 'visitor', name: 'Visitor' },
  { value: 'owner', name: 'Owner/broker' },
];
export const listAccountTypeEnum = { visitor: 'visitor', Owner_broker: 'owner/broker' };

export const listMaritalStatus = [
  { value: 1, name: 'Single' },
  { value: 2, name: 'Married' },
  { value: 3, name: 'Divorced' },
];

export const listEducationLevel = [
  { value: 1, name: 'College_University' },
  { value: 2, name: 'Postgraduate' },
  { value: 3, name: 'Undergraduate' },
];
export const listEmploymentStatus = [
  { value: 1, name: 'BusinessOwner' },
  { value: 2, name: 'CorporateEmployee' },
  { value: 3, name: 'SelfEmployed' },
];

export const listOccupation = [
  { value: 1, name: 'Director' },
  { value: 2, name: 'Engineering' },
  { value: 3, name: 'Finance' },
  { value: 4, name: 'HR' },
  { value: 5, name: 'IT' },
  { value: 6, name: 'Marketing' },
  { value: 7, name: 'Sales' },
];

export const listIncomeRange = [
  { value: 1, name: '_lv1' },
  { value: 2, name: '_lv2' },
  { value: 3, name: '_lv3' },
  { value: 4, name: '_lv4' },
  { value: 5, name: '_lv5' },
  { value: 6, name: '_lv6' },
  { value: 7, name: '_lv7' },
  { value: 8, name: '_lv8' },
];

export const listReligion = [
  { value: 1, name: 'Christianity' },
  { value: 2, name: 'Islam' },
  { value: 3, name: 'Irreligion' },
  { value: 4, name: 'Hinduism' },
  { value: 5, name: 'Buddhism' },
  { value: 6, name: 'Other' },
];

export const listLivingCost = [
  { value: 1, name: 'Under20' },
  { value: 2, name: '20to50' },
  { value: 3, name: '50to80' },
  { value: 4, name: '80to100' },
  { value: 5, name: 'Above100' },
];

export const regex = /(\d+)/g;

export function getIdFronParams(text) {
  return text.substring(text.lastIndexOf('-') + 1).match(regex)[0];
}

export function standardizationString(str) {
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  //str= str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,"-");
  // tìm và thay thế các kí tự đặc biệt trong chuỗi sang kí tự - /
  //str= str.replace(/-+-/g,"-"); //thay thế 2- thành 1-
  str = str.replace(/^\-+|\-+$/g, '');
  //cắt bỏ ký tự - ở đầu và cuối chuỗi
  //eval(obj).value = str.toUpperCase();
  return str;
}

export function checkValidText(text: string, listText: string[]): string[] {
  // Kiểm tra xem từ nào trong mảng array xuất hiện trong wordsInText
  const convertText = '' + text + ' ';
  var foundWords = [];
  listText.forEach(function (word) {
    if (
      convertText.includes(' ' + word + ' ') ||
      convertText.includes(word + ' ') ||
      convertText.includes('\n' + word + '\n') ||
      convertText.includes('\n' + word) ||
      convertText.includes(word + '\n') ||
      convertText.includes(' ' + word + '\n') ||
      convertText.includes('\n' + word + ' ')
    ) {
      foundWords.push(word);
    }
  });

  return foundWords;
}

export function filterObjDuplicateInArray(obj, array) {
  const existingItemIndex = array.findIndex((item) => item.id === obj.id);

  if (existingItemIndex !== -1) {
    // Nếu obj đã tồn tại, thì thay đổi value của nó
    array[existingItemIndex].value = obj.value;
  } else {
    // Ngược lại, thêm obj vào mảng
    array.push(obj);
  }
  return array;
}
export const moduleConversation = { listting: 1, ticket: 2, newHome: 5 };
export const tabModulComment = { property: 1, member: 2 };

export const readStatus = { readed: 'readed', new: 'new' };

export const statusCommentMember = { waitingForApproval: 0, approval: 1, rejected: 99 };

export const listStatusComment: CommentStatusModel[] = [
  { id: 0, name: 'EcomCommentStatusWaitingForApproval', color: '#E2EEFE', textColor: '#1178F5' },
  { id: 1, name: 'EcomCommentStatusApproval', color: '#FFD14B', textColor: '#27AE60' },
  { id: 99, name: 'EcomCommentStatusRejected', color: '#FFD14B', textColor: '#FFD14B' },
];

export const typeInquiry = { myInquiry: 0, inquiryForMe: 1 };

export const listTickTypeRequest = [
  { id: 0, value: 0, label: 'filterInquiryForListing' },
  { id: 1, value: 1, label: 'filterInquiryMySent' },
];

export const typeRequest = { filterInquiryForListing: 0, filterInquiryMySent: 1 };

export const dataType = {
  string: 'string' as const,
  number: 'number' as const,
  boolean: 'boolean' as const,
  method: 'method' as const,
  regexp: 'regexp' as const,
  integer: 'integer' as const,
  float: 'float' as const,
  object: 'object' as const,
  enum: 'enum' as const,
  date: 'date' as const,
  url: 'url' as const,
  hex: 'hex' as const,
  email: 'email' as const,
};

export const roleAdminGod = 'admin';

export const appPermissions = {
  portal_dashboard: {
    view: 'portal_dashboard.view',
    insert: 'portal_dashboard.insert',
    update: 'portal_dashboard.update',
    export: 'portal_dashboard.export',
    admin: 'portal_dashboard.admin',
  },
  portal_properties: {
    view: 'portal_properties.view',
    insert: 'portal_properties.insert',
    update: 'portal_properties.update',
    admin: 'portal_properties.admin',
  },
  portal_profile: {
    view: 'portal_profile.view',
    insert: 'portal_profile.insert',
    update: 'portal_profile.update',
    admin: 'portal_profile.admin',
  },
  portal_project: {
    view: 'portal_project.view',
    insert: 'portal_project.insert',
    update: 'portal_project.update',
    admin: 'portal_project.admin',
  },
  portal_unit: {
    view: 'portal_unit.view',
    insert: 'portal_unit.insert',
    update: 'portal_unit.update',
    delete: 'portal_unit.delete',
    admin: 'portal_unit.admin',
  },
  portal_contact: {
    view: 'portal_contact.view',
    insert: 'portal_contact.insert',
    update: 'portal_contact.update',
    admin: 'portal_contact.admin',
  },
  portal_ticket: {
    view: 'portal_ticket.view',
    insert: 'portal_ticket.insert',
    update: 'portal_ticket.update',
    admin: 'portal_ticket.admin',
  },
  portal_banner: {
    view: 'portal_banner.view',
    insert: 'portal_banner.insert',
    update: 'portal_banner.update',
    admin: 'portal_banner.admin',
  },
  portal_exportBCT: { export: 'portal_report.export' },
  portal_member: {
    view: 'portal_member.view',
    insert: 'portal_member.insert',
    update: 'portal_member.update',
    admin: 'portal_member.admin',
    approve: 'portal_member.approve',
    reject: 'portal_member.reject',
    delete: 'portal_member.delete',
    showhide: 'portal_member.showhide',
    export: 'portal_member.export',
  },
  portal_comment: {
    view: 'portal_comment.view',
    insert: 'portal_comment.insert',
    update: 'portal_comment.update',
    admin: 'portal_comment.admin',
  },
  portal_setting: {
    view: 'portal_setting.view',
    insert: 'portal_setting.insert',
    update: 'portal_setting.update',
    admin: 'portal_setting.admin',
  },
  portal_listing: {
    view: 'portal_listing.view',
    insert: 'portal_listing.insert',
    update: 'portal_listing.update',
    admin: 'portal_listing.admin',
    approve: 'portal_listing.approve',
    reject: 'portal_listing.reject',
  },
  portal_keyword: {
    insert: 'portal_keyword.insert',
    update: 'portal_keyword.update',
    view: 'portal_keyword.view',
    admin: 'portal_keyword.admin',
  },
  portal_listingcategory: {
    insert: 'portal_listingcategory.insert',
    update: 'portal_listingcategory.update',
    view: 'portal_listingcategory.view',
    admin: 'portal_listingcategory.admin',
  },
  portal_searchlocation: { admin: 'portal_searchlocation.admin' },
  portal_news: {
    insert: 'portal_article.insert',
    update: 'portal_article.update',
    view: 'portal_article.view',
    admin: 'portal_article.admin',
  },
  portal_staff: {
    insert: 'portal_staff.insert',
    update: 'portal_staff.update',
    view: 'portal_staff.view',
    admin: 'portal_staff.admin',
  },
  portal_roles: {
    insert: 'portal_accessgroup.insert',
    update: 'portal_accessgroup.update',
    view: 'portal_accessgroup.view',
    admin: 'portal_accessgroup.admin',
  },
  portal_otp: { view: 'portal_otp.view' },
  portal_osa: {
    insert: 'portal_osa.insert',
    update: 'portal_osa.update',
    view: 'portal_osa.view',
    admin: 'portal_osa.admin',
  },
  portal_owner_inquiry: {
    insert: 'portal_owner_inquiry.insert',
    update: 'portal_owner_inquiry.update',
    view: 'portal_owner_inquiry.view',
    admin: 'portal_owner_inquiry.admin',
  },
  portal_rating: {
    update: 'portal_rating.update',
    view: 'portal_rating.view',
  },
  portal_point: { insert: 'portal_point.insert', view: 'portal_point.view' },
  portal_listing_package: {
    insert: 'portal_listing_package.insert',
    update: 'portal_listing_package.update',
    view: 'portal_listing_package.view',
    admin: 'portal_listing_package.admin',
  },
  portal_listing_push: {
    insert: 'portal_listing_push.insert',
    update: 'portal_listing_push.update',
    view: 'portal_listing_push.view',
    admin: 'portal_listing_push.admin',
  },
  portal_userwallet: { view: 'portal_userwallet.view', export: 'portal_userwallet.export' },
  portal_la: {
    insert: 'portal_la.insert',
    update: 'portal_la.update',
    view: 'portal_la.view',
    admin: 'portal_la.admin',
  },
  portal_owner_content: {
    view: 'portal_owner_content.view',
    update: 'portal_owner_content.update',
  },

  portal_find_agent: {
    insert: 'portal_find_agent.insert',
    update: 'portal_find_agent.update',
    view: 'portal_find_agent.view',
    admin: 'portal_find_agent.admin',
    delete: 'portal_find_agent.delete',
  },
  transaction: {
    package: 'transaction_package.view',
    push: 'transaction_push.view',
    point: 'portal_point.view',
    exportPoint: 'portal_point.export',
    exportPackge: 'transaction_package.export',
    exportPush: 'transaction_push.export',
    logsPackage: 'listing_logs.packge',
    logsPush: 'listing_logs.push',
  },
  paymeConfig: { view: 'portal_configpayment.view', update: 'portal_configpayment.update' },
  systemFeeConfig: {
    view: 'portal_vatconfig.view',
    update: 'portal_vatconfig.update',
    create: 'portal_vatconfig.create',
    delete: 'portal_vatconfig.delete',
  },
  newHomes: { view: 'new_homes.view', insert: 'new_homes.insert', update: 'new_homes.update' },
};

export const timeOut = 400;

export const listColorChart = [
  '#FFD14B',
  '#27AE60',
  '#2D9CDB',
  '#D3A429',
  '#4B5C71',
  '#F2994A',
  '#681FAD',
  '#689FAC',
  '4D3C77',
  '4D3C77',
];

export const pageSizeDefault = 20;

export const keySyncfusion =
  'Mgo+DSMBaFt+QHJqVk1hXk5Hd0BLVGpAblJ3T2ZQdVt5ZDU7a15RRnVfRFxgSXtRdEBrUHdXcw==;Mgo+DSMBPh8sVXJ1S0R+X1pFdEBBXHxAd1p/VWJYdVt5flBPcDwsT3RfQF5jT39QdkBhW3pXcHRQRQ==;ORg4AjUWIQA/Gnt2VFhiQlJPd11dXmJWd1p/THNYflR1fV9DaUwxOX1dQl9gSXhSdUVmW31beXRXRWM=;MjQwMTE3MUAzMjMxMmUzMDJlMzBWcml5T3JFdkRac1o1cnRPYnRHQ3ozaEZvZlEzOFlxSFpyVGhBLzBQQ3pJPQ==;MjQwMTE3MkAzMjMxMmUzMDJlMzBUckg5NjlJaXpaeG1LQm52MFN5SzFra3hvOFVueVlFWUsraDNKTE5pd1hJPQ==;NRAiBiAaIQQuGjN/V0d+Xk9HfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hSn5Vd0ZjXH1cdX1UR2Nf;MjQwMTE3NEAzMjMxMmUzMDJlMzBjR3NEUGdBbnpEaUt3NXJTQVpBMHZqWnJ4U0lDUVBCdlVhUS9Vb1J3UTMwPQ==;MjQwMTE3NUAzMjMxMmUzMDJlMzBqNTRTVDdWQVhOeCt0eEdNendTYUFSSXE2M3EyQktwZkRGZ21oL2RLY0tzPQ==;Mgo+DSMBMAY9C3t2VFhiQlJPd11dXmJWd1p/THNYflR1fV9DaUwxOX1dQl9gSXhSdUVmW31beXZVQWM=;MjQwMTE3N0AzMjMxMmUzMDJlMzBhVGlYV1ZGcGs2Z09kTkNNV3ZlUEYzODYvOEdkWFFpc21FcnVTQ2NiVG5ZPQ==;MjQwMTE3OEAzMjMxMmUzMDJlMzBpNnpqYVpiTUFiQ2F2MWZyUit5dGcwSVdLZC9DcXhLbHlIbUNYSmFPV0k4PQ==;MjQwMTE3OUAzMjMxMmUzMDJlMzBjR3NEUGdBbnpEaUt3NXJTQVpBMHZqWnJ4U0lDUVBCdlVhUS9Vb1J3UTMwPQ==';

export const typeFile = {
  excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  excel1: 'application/vnd.ms-excel',
  word: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  word1: 'application/msword',
  pdf: 'application/pdf',
  image_png: 'image/png',
  imamge_jpeg: 'image/jpeg',
};

export const codePaymentPayme = { createOk: 105000, createFailed: 105011 };

export const statusPaymentOnline = {
  SUCCEEDED: 'SUCCEEDED',
  FAILED: 'FAILED',
  PENDING: 'PENDING',
  EXPIRED: 'EXPIRED',
  CANCELED: 'CANCELED',
  REFUNDED: 'REFUNDED',
};

export const paymentMethods = [
  {
    id: 1,
    name: 'EcomTransactionPagePayMePaymentMethod',
    value: 'PAYME', // Thanh toán bằng ví PayME
  },
  {
    id: 2,
    name: 'EcomTransactionPageATMCardPaymentMethod',
    value: 'ATMCARD', // Thanh toán bằng thẻ ATM
  },
  {
    id: 3,
    name: 'EcomTransactionPageCreditCardPaymentMethod',
    value: 'CREDIT', // Thanh toán bằng thẻ Visa/Master/JCB
  },
  {
    id: 4,
    name: 'EcomTransactionPageCreditInternationalCardPaymentMethod',
    value: 'CREDIT_INTERNATIONAL', // Thanh toán bằng thẻ Visa/Master/JCB
  },
  {
    id: 5,
    name: 'EcomTransactionPageCreditCardAllPaymentMethod',
    value: 'CREDITCARD', // Thanh toán bằng thẻ Visa/Master/JCB
  },
  {
    id: 6,
    name: 'EcomTransactionPageVietQRPaymentMethod',
    value: 'VIETQR', // Thanh toán chuyển khoản bằng mã QR
  },

  // {
  //   id: 5,
  //   name: 'EcomTransactionPageCashPaymentMethod',
  //   value: 'cash', // Thanh toán bằng tiền mặt
  // },
  {
    id: 7,
    name: 'EcomTransactionPageBankPaymentMethod',
    value: 'BANK', // Thanh toán qua chuyển khoản
  },
  {
    id: 8,
    name: 'EcomTransactionPageOtherPaymentMethod',
    value: 'OTHER', // Thanh toán khác
  },
];

export const userType = [
  { id: 1, name: 'EcomTransactionPageClientUserType', value: 'client' },
  { id: 2, name: 'EcomTransactionPageBrokerUserType', value: 'owner' },
];

export const userTypeForTrasaction = [
  { id: 1, name: 'Owner/Landlord', value: 'Owner/Landlord' },
  { id: 2, name: 'Broker/Agent', value: 'Broker/Agent' },
];

export const listPaymentMethod = [
  {
    index: 0,
    name: 'PAYME',
    label: 'EcomTransactionPagePayMePaymentMethod',
    labelNode: PaymeIcon,
    value: 0,
    isInternational: false,
  },
  {
    index: 1,
    name: 'ATMCARD',
    label: 'EcomTransactionPageATMCardPaymentMethod',
    labelNode: ATMIcon,
    value: 1,
    isInternational: false,
  },
  {
    index: 2,
    name: 'CREDIT_INTERNATIONAL',
    label: 'EcomTransactionPageCreditInternationalCardPaymentMethod',
    labelNode: CreditCardIcon,
    value: 2,
    isInternational: true,
  },
  {
    index: 3,
    name: 'CREDIT',
    label: 'EcomTransactionPageCreditCardPaymentMethod',
    labelNode: CreditCardIcon,
    value: 3,
    isInternational: false,
  },
  {
    index: 5,
    name: 'CREDITCARD',
    label: 'EcomTransactionPageCreditCardAllPaymentMethod',
    labelNode: CreditCardIcon,
    value: 5,
    isInternational: false,
  },
  { index: 5, name: 'QRCODE', value: 5, isInternational: false },
  {
    index: 6,
    name: 'VIETQR',
    label: 'EcomTransactionPageVietQRPaymentMethod',
    labelNode: QRcode,
    value: 6,
    isInternational: false,
  },
  {
    index: 7,
    name: 'BANK',
    label: 'EcomTransactionPageBankPaymentMethod',
    labelNode: AvatarDefault,
    value: 7,
    isInternational: false,
  },
  {
    index: 8,
    labelNode: AvatarDefault,
    name: 'OTHER',
    label: 'EcomTransactionPageOtherPaymentMethod',
    value: 8,
    isInternational: false,
  },

  {
    index: 9,
    name: 'ATM',
    label: 'EcomTransactionPageATMCardPaymentMethod',
    labelNode: ATMIcon,
    value: 9,
    isInternational: false,
  },
];

export const paymentMethodEnum = {
  PAYME: 'PAYME',
  ATMCARD: 'ATMCARD',
  CREDITCARD: 'CREDITCARD',
  QRCode: 'VIETQR',
};

export const moduleUploadFile = { PROJECT: 'PROJECT', NEW_HOME: 'NEW_HOME' };

export const TypeModuleEnum = {
  TermsCondition: 1,
  OperatingRegulations: 2,
  PrivacyPolicy: 3,
  RegulationOnSettlement: 4,
};

export const typeTextBlock = {
  LOGIN: 1,
  REGISER_WITH_PHONE: 2,
  REGISTER_CLICK: 3,
};
export const PackageExpiredStatus = { NotExpired: 1, Expired: 99 };
