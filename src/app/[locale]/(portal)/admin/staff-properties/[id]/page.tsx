'use client';
import apiMasterDataService from '@/apiServices/externalApiServices/apiMasterDataService';
import unitApiInAdmin from '@/apiServices/externalApiServices/apiUnitInAdmin';
import locationApiService from '@/apiServices/externalApiServices/locationApiService';
import projectApiService from '@/apiServices/externalApiServices/projectApiService';
import propertyApiService from '@/apiServices/externalApiServices/propertyApiService';
import ButtonBack from '@/components/Button/ButtonBack/ButtonBack';
import FormSelectChip from '@/components/FormInput/FormSelectChip';
import FormSelectIcon from '@/components/FormInput/FormSelectIcon';
import FormTagInputShap from '@/components/FormInput/FormTagInput';
import MultiLanguageInput from '@/components/FormInput/MultiLanguageInput';
import SelectItemHaveIcon from '@/components/FormInput/SelectItemHaveIcon';
import FormFloatDate from '@/components/FormInput/formDatePicker';
import FormFloatInput from '@/components/FormInput/formInput';
import FormFloatNumber from '@/components/FormInput/formNumber';
import FormRadioAdmin from '@/components/FormInput/formRadioAdmin';
import FormFloatSelect from '@/components/FormInput/formSelect/Index';
import GoogleMapComponent from '@/components/GoogleMap';
import ModalApproveOrRejectStatus from '@/components/ModalApproveOrRejectStatus/ModalApproveOrRejectStatus';
import UploadGallery from '@/components/UploadGallery/UploadGalley';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import WrapPageScroll from '@/components/WrapPageScoll';
import useKeywordBanned from '@/hooks/useKeywordBaned';
import useProvince from '@/hooks/useProvince';
import { noteMarkIcon } from '@/libs/appComponents';
import {
  amenityType,
  appPermissions,
  baths,
  beds,
  handOverStatuses,
  legalStatuses,
  listPackage,
  listPriotyStatusFilter,
  listStatusProject,
  listingRentLeaseTerm,
  listingStatus,
  listingType,
  packageListingEnum,
  roleAdminGod,
  typeUserPostListing,
} from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import {
  checkMultiLanguageMaxLength,
  checkMultiLanguageRequired,
  checkPermissonAcion,
  checkTextMultiLanguageInBlackListForForm,
  checkValidTextInBlackListForForm,
  formatNumber,
} from '@/libs/helper';
import { ProjectLookupModel } from '@/models/projectModel/projectLookupModel';
import { PropertyStatus } from '@/models/propertyModel/propertyDetailModel';
import { PropertyTypeModel } from '@/models/propertyModel/propertyTypeModel';
import { PropertyViewModel } from '@/models/propertyModel/propertyViewModel';
import useGlobalStore from '@/stores/useGlobalStore';
import { Button, Checkbox, Popover } from 'antd';
import Form from 'antd/es/form';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import React, { useEffect, useState, useTransition } from 'react';
import { TypeOptions, toast } from 'react-toastify';

const disabledDate = (current) => {
  return current < dayjs().subtract(1, 'hour') ? true : false;
};
const ListingDetailPage = ({ params }: { params: { id: string } }) => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);

  const [listingForm] = Form.useForm();

  const [isPending, startTransition] = useTransition();

  const { keyword } = useKeywordBanned();
  const { userInfo } = useGlobalStore();
  const isAddNew = params.id === 'add-new' ? true : false;
  const { back, push } = useRouter();
  const t = useTranslations('webLabel');
  const success = useTranslations('successNotifi');
  const errorNoti = useTranslations('errorNotifi');
  const eForm = useTranslations('error');
  const comm = useTranslations('Common');
  const { listProvince } = useProvince();

  const [listingDetail, setListingDetail] = useState<any>(undefined);
  const locale = useLocale();
  const [showModalApprover, setShowModalApprover] = useState<boolean>(false);
  const [typeModal, setTypeModal] = useState<number>(undefined);
  const [listProductType, setListProductType] = useState<PropertyTypeModel[]>([]);
  const [amenitiesIn, setAmenitiesIn] = useState<any>([] as any);
  const [amenitiesOut, setAmenitiesOut] = useState<any>([] as any);
  const [listDistrict, setListDistrict] = useState<any[]>([]);
  const [listWard, setListWard] = useState<any[]>([]);
  const [listView, setListView] = useState<PropertyViewModel[]>([]);
  const [listInterior, setListInterior] = useState<any[]>([]);
  const [listLocationSuggest, setListLocationSuggest] = useState<any[]>([]);
  const [listProject, setListPorject] = useState<ProjectLookupModel[]>([]);
  const [listUnit, setListUnit] = useState<any[]>([]);
  const [coordinate, setCoordinate] = useState({
    lat: 10.7340344,
    lng: 106.7215787,
  }); // default HCM quan 7
  const [isSell, setIsSell] = useState<boolean>(false);
  const [isPlantinum, setIsPlantinum] = useState<boolean>(false);
  const [numberImageUpload, setNumberImageUpload] = useState<number>(20);

  const [countGalleryImages, setCountGalleryImages] = useState<number>(0);
  const [listIdImageDelete, setListIdImageDelete] = useState<string[]>([]);

  useEffect(() => {
    initMasterData();
    getDetail();
  }, []);

  const initMasterData = async () => {
    getPropertyAmenitiesIn();
    getPropertyAmenitiesOut();
    // await propertyApiService.getPropertyTypes().then((x) => setListProductType(x?.data || []));
    await propertyApiService.getPropertyViews().then((x) => setListView(x.data));
    await propertyApiService.getPropertyInterior().then((x) => setListInterior(x.data));
    await projectApiService.getLookupProjects().then((x) => setListPorject(x.data));
  };

  const getIdFromUrl = () => {
    const decodedString = decodeURIComponent(params.id);
    const urlParams = new URLSearchParams(decodedString);
    const paramsObject = {} as any;
    for (const [key, value] of urlParams.entries()) {
      paramsObject[key] = value;
    }

    if (paramsObject?.listing) {
      return paramsObject?.listing;
    } else {
      return null;
    }
  };

  const onChangePlace = async (placeId: string) => {
    if (placeId) {
      const dataResult = await locationApiService.getLocationDetail(placeId);

      setCoordinate({
        lat: dataResult.data.geometry.location?.lat,
        lng: dataResult.data.geometry.location?.lng,
      });
    }
  };

  const onSearchGoogleMap = debounce(async (keyword: string) => {
    if (keyword) {
      await locationApiService.getListLocation(keyword).then((x) => setListLocationSuggest(x.data));
    }
  }, 200);

  const getInfoLocation = (location) => {
    if (location?.province) {
      getListDistric(location?.province);
    }
    if (location?.district) {
      getListWard(location?.district);
    }
    if (location?.placeId) {
      const place = [
        {
          place_id: location.placeId,
          description: location.formattedAddress,
        },
      ];

      setListLocationSuggest(place);
    }
  };

  const getDetail = async () => {
    if (!isAddNew) {
      const id = getIdFromUrl();

      if (id) {
        const listingInfo = await propertyApiService.getDetailForEditForStaff(id);

        await getListDataWhenSelectType(listingInfo?.type);
        setIsSell(listingInfo.type === listingType.sale ? true : false);
        setIsPlantinum(listingInfo.priorityStatus === packageListingEnum.Platinum ? true : false);
        setNumberImageUpload(listingInfo.priorityStatus === packageListingEnum.Platinum ? 30 : 20);

        await onChangePlace(listingInfo?.location?.placeId);

        await listingForm.setFieldsValue({
          ...listingInfo,
          isAutoPushDate: listingInfo?.dateAutoPush ? true : false,
        });
        getInfoLocation(listingInfo?.location);
        // getListUnit(listingInfo?.projectId, '', true);

        setListUnit([
          {
            ...listingInfo?.unit,
          },
        ]);
        setListPorject([{ ...listingInfo?.project }]);
        setListingDetail(listingInfo);
        setCountGalleryImages(listingInfo?.images?.length);
      }
    } else {
      listingForm.resetFields();
      listingForm.setFieldValue('type', listingType.sale);
      setNumberImageUpload(20);
    }
  };

  const getListDataWhenSelectType = async (typeListing: number) => {
    // get product type tương ứng
    await propertyApiService
      .getPropertyTypes({ type: typeListing })
      .then((x) => setListProductType(x?.data || []));
  };

  const getPropertyAmenitiesIn = async () => {
    const amenities = await propertyApiService.getPropertyAmenitiesFilter({
      type: amenityType.In,
    });

    setAmenitiesIn(amenities.data);
  };

  const getPropertyAmenitiesOut = async () => {
    const amenities = await propertyApiService.getPropertyAmenitiesFilter({
      type: amenityType.Out,
    });

    setAmenitiesOut(amenities.data);
  };

  const getListDistric = async (provinceId: string) => {
    let dataDistrict = await apiMasterDataService.getDistrictV2(provinceId);

    setListDistrict(dataDistrict);
  };

  const getListWard = async (districId: string) => {
    let dataWard = await apiMasterDataService.getWards(districId);
    setListWard(dataWard);
  };

  const getListUnit = async (projectId?: number, keyword?: string, init?: boolean) => {
    if (init) {
      if (projectId) {
        const filter = {
          from: 0,
          size: 50,
          projectId: projectId,
          keyword: keyword,
        };
        const res: any = await unitApiInAdmin.getUnitList(filter);
        setListUnit(res.data);
      }
    } else {
      if (projectId) {
        const filter = {
          from: 0,
          size: 50,
          projectId: projectId,
          keyword: keyword,
        };
        const res: any = await unitApiInAdmin.getUnitList(filter);
        listingForm.setFieldValue('unitId', undefined);
        setListUnit(res.data);
      } else {
        listingForm.setFieldValue('unitId', undefined);
        setListUnit([]);
      }
    }
  };

  const onChangeNextStatus = async (nextStatus) => {
    await listingForm.validateFields();
    switch (nextStatus) {
      case PropertyStatus.Rejected:
        startTransition(() => {
          showModal(PropertyStatus.Rejected);
        });
        break;
      case PropertyStatus.approved:
        startTransition(() => {
          showModal(PropertyStatus.approved);
        });
        break;
    }
  };

  const HandleApproveOrReject = async () => {
    await listingForm.validateFields();
    const values = listingForm.getFieldsValue();
    const body = {
      id: listingDetail?.id,
      status: typeModal,
      message: values.message,
    };
    try {
      await propertyApiService.updateStatusForStaff(body);
      notify('success', success('updateAPI'));
      back();
    } catch (e) {
      notify('error', e.response?.data?.message ?? errorNoti('updateAPI'));
    }
  };

  const onCloseModalApproval = () => {
    setShowModalApprover(false);
    setTypeModal(undefined);
    listingForm.setFieldValue('message', undefined);
  };

  const showModal = (statusModal: number) => {
    if (PropertyStatus.Rejected === statusModal) {
      setShowModalApprover(true);
      setTypeModal(PropertyStatus.Rejected);
    }
    if (PropertyStatus.approved === statusModal) {
      setTypeModal(PropertyStatus.approved);
      setShowModalApprover(true);
    }
  };

  const onUploadGallery = (
    files: File[],
    listIdRemove?: string,
    isDeleteFileBeforUpdate?: boolean,
  ) => {
    if (isDeleteFileBeforUpdate) {
      const newCount = countGalleryImages - 1;
      if (newCount < 1) {
        listingForm.setFieldValue('gallery', undefined);
      }
      setCountGalleryImages(newCount);
    } else {
      const newCount = countGalleryImages + files.length;
      setCountGalleryImages(newCount);
      if (listIdRemove) {
        const newList = [...listIdImageDelete, listIdRemove];
        setListIdImageDelete(newList);
        const newCount = countGalleryImages - 1;
        setCountGalleryImages(newCount);
      }
    }
  };

  const renderAction = () => {
    return (
      <div className="flex justify-end">
        <ButtonBack text={t('goBack')} onClick={back} />

        {listingDetail?.status === PropertyStatus.WaitingForApproval &&
          checkPermissonAcion(userInfo?.accesses, [
            roleAdminGod,
            appPermissions.portal_listing.update,
            appPermissions.portal_listing.approve,
            appPermissions.portal_listing.reject,
            appPermissions.portal_banner.admin,
          ]) && (
            <>
              <Button
                loading={isPending}
                size="large"
                onClick={() => onChangeNextStatus(PropertyStatus.Rejected)}
                className="ml-1 rounded-full !bg-[#EB5757] px-6 text-sm !text-white"
              >
                {comm('Rejected')}
              </Button>
              <Button
                loading={isPending}
                size="large"
                onClick={() => onChangeNextStatus(PropertyStatus.approved)}
                className="ml-1 rounded-full !bg-[#1178F5] px-6 text-sm !text-white"
              >
                {comm('Approve')}
              </Button>
            </>
          )}
      </div>
    );
  };

  const renderStatusListing = (status) => {
    let approvalStatus = listPriotyStatusFilter.find((x) => x.value === status)?.label;

    let textColor = '';
    let backgroundColor = '';
    let borderColor = '';

    switch (status) {
      case PropertyStatus.Draft: {
        textColor = 'text-[#0C1419]'; //đen
        backgroundColor = 'bg-transparent';
        borderColor = 'border-[#FFD14B]';
        break;
      }
      case PropertyStatus.WaitingForApproval: {
        textColor = 'text-[#FFFFFF]'; // trắng
        backgroundColor = 'bg-[#F2994A]'; // cam
        borderColor = '';
        break;
      }
      case PropertyStatus.approved: {
        textColor = 'text-[#FFFFFF]'; // trắng
        backgroundColor = 'bg-[#1178F5]'; // xanh dương
        borderColor = '';
        break;
      }
      case PropertyStatus.Cancelled: {
        textColor = 'text-[#FFFFFF]'; // trắng
        backgroundColor = 'bg-[#EB5757]'; // đỏ
        borderColor = '';
        break;
      }
      case PropertyStatus.Published: {
        textColor = 'text-[#FFFFFF]'; // trắng
        backgroundColor = 'bg-[#27AE60]'; // cam
        borderColor = '';
        break;
      }
      case PropertyStatus.Expired: {
        textColor = 'text-[#FFFFFF]'; // trắng
        backgroundColor = 'bg-[#EB5757]'; // đỏ
        borderColor = '';
        break;
      }
      case PropertyStatus.Rejected: {
        textColor = 'text-[#FFFFFF]'; // trắng
        backgroundColor = 'bg-[#EB5757]'; // đỏ
        borderColor = '';
        break;
      }
      case PropertyStatus.Takedown: {
        textColor = 'text-[#FFFFFF]'; // trắng
        backgroundColor = 'bg-[#FEDB71]'; // vàng
        borderColor = '';
        break;
      }
      case PropertyStatus.TakeDownLeased:
      case PropertyStatus.TakeDownSold: {
        textColor = 'text-[#FFFFFF]'; // trắng
        backgroundColor = 'bg-[#7D35B5]'; // tím
        borderColor = '';
        break;
      }
      default: {
        break;
      }
    }

    return (
      <label
        className={`ml-2 rounded-full px-3 py-[6px] ${borderColor} ${backgroundColor} ${textColor} `}
      >
        {t(approvalStatus)}
      </label>
    );
  };

  return userInfo?.type === UserTypeConstant.Salesman &&
    checkPermissonAcion(userInfo?.accesses, [
      roleAdminGod,
      appPermissions.portal_listing.view,
      appPermissions.portal_listing.approve,
      appPermissions.portal_listing.reject,
      appPermissions.portal_banner.admin,
    ]) ? (
    <WrapPageScroll renderActions={renderAction}>
      <div className="p-6">
        <div className="mb-3 flex w-full flex-col">
          <div className="flex">
            <h1 className="w-fit text-3xl font-semibold text-portal-primaryMainAdmin">
              {isAddNew
                ? t('addNewProperty')
                : `${t('EcomTicketManagementInforPageSearchBarPropertyId')} #${
                    listingDetail?.listingId
                  }`}
            </h1>
            {renderStatusListing(listingDetail?.status)}
          </div>

          {listingDetail?.lastRejectedLog && (
            <div className="flex">
              <label className="text-[#FF3131]">{t('reason')}: </label>
              <span className="ml-1">{listingDetail?.lastRejectedLog?.message}</span>
            </div>
          )}
        </div>
        {(listingDetail?.status === listingStatus.Expired ||
          listingDetail?.status === 7 ||
          listingDetail?.status === 6) &&
          listingDetail?.actualPrice && (
            <div className="flex font-medium text-[#A80707]">
              {t('PriceActual')}
              <label className="ml-1 font-medium text-[#A80707]">
                {formatNumber(listingDetail?.actualPrice)} {locale === 'vi' ? 'VNĐ' : 'VNĐ'}
                {listingDetail?.type === listingType.rent && t('/mo')}
              </label>
            </div>
          )}

        <Form form={listingForm} layout="vertical" size="middle">
          <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
            <div className="col-span-12 py-2">
              <label className="text-base font-bold text-portal-primaryMainAdmin">
                {t('EcomPropertyListingDetailPageContactInformatioPropertyDetail')}
              </label>
            </div>
            <div className="col-span-4">
              <FormRadioAdmin
                disabled={true}
                label={t('EcomPropertyListingIAm')}
                name="posterRoleCode"
                rules={[
                  {
                    required: true,
                    message: `${eForm('pleaseSelect')} ${t('EcomPropertyListingIAm')}`,
                  },
                ]}
                options={typeUserPostListing.map((item) => ({
                  value: item.value,
                  name: comm(item.name),
                }))}
              />
            </div>
            <div className="col-span-4">
              <FormRadioAdmin
                disabled={true}
                label={t('EcomPropertyListingDetailPagePropertyInformationPropertyStatus')}
                name="type"
                rules={[
                  {
                    required: true,
                    message: `${eForm('pleaseSelect')} ${t('EcomPropertyListingDetailPagePropertyInformationPropertyStatus')}`,
                  },
                ]}
                options={listStatusProject.map((item) => ({
                  id: item.id,
                  name: comm(item.name),
                }))}
              />
            </div>

            <div className="col-span-4">
              <FormRadioAdmin
                disabled={true}
                label={t('EcomPropertyListingDetailPagePropertyInformationpostPackage')}
                name="priorityStatus"
                rules={[
                  {
                    required: true,
                    message: `${eForm('pleaseSelect')} ${t(
                      'EcomPropertyListingDetailPagePropertyInformationpostPackage',
                    )}`,
                  },
                ]}
                options={listPackage.map((item) => ({
                  id: item.id,
                  name: comm(item.name),
                }))}
              />
            </div>
            <div className="col-span-12">
              <Form.Item
                label={t('EcomPropertyListingDetailPageContactInformationCategory')}
                name="listingCategoryId"
                rules={[
                  {
                    required: true,
                    message: `${eForm('pleaseSelect')} ${t(
                      'EcomPropertyListingDetailPageContactInformationCategory',
                    )}`,
                  },
                ]}
              >
                <SelectItemHaveIcon disabled={true} options={listProductType} />
              </Form.Item>
            </div>
          </div>

          <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
            <div className="col-span-12 py-2">
              <label className="text-base font-bold text-portal-primaryMainAdmin">
                {t('EcomPropertyListingDetailPageContactInformationTellThem')}
              </label>
            </div>
            <div className="col-span-12">
              <label>{t('EcomPropertyListingDetailPageContactInformatioPropertyTitle')}</label>
              <span className="text-[14px] text-danger"> *</span>
              <br />
              <span className="text-xs text-[#263238]">{t('noteTitleListingRequiredVN')}</span>
              <Form.Item
                name="title"
                label=""
                rules={[
                  {
                    required: true,
                    validator: (rule, value) =>
                      checkMultiLanguageRequired(
                        rule,
                        value,
                        `${eForm('pleaseInput')} ${t(
                          'EcomPropertyListingDetailPageContactInformatioPropertyTitle',
                        )}`,
                      ),
                  },
                  {
                    max: 500,
                    validator: (rule, value) =>
                      checkMultiLanguageMaxLength(rule, value, `${eForm('maxlength')} 500`),
                  },

                  {
                    validator: (rule, value) =>
                      checkTextMultiLanguageInBlackListForForm(
                        value,
                        keyword,
                        `${eForm('keywordInBlackList')}`,
                      ),
                  },
                ]}
                initialValue={[
                  { language: 'vi', value: '' },
                  { language: 'en', value: '' },
                  { language: 'ko', value: '' },
                ]}
              >
                <MultiLanguageInput maxLength={501} disabled={true} />
              </Form.Item>
            </div>
            <div className="col-span-12 rounded-lg bg-[#D4DFD1] p-3 text-sm">
              <div>
                <span className="rounded-lg bg-[#25793A] px-2 py-1 text-[#FFFFFF]">
                  {t('GoodListingTitleShouldIncludeTitle')}
                </span>
              </div>
              <div className="mt-2 font-light text-[#0C1419]">
                {t('GoodListingTitleShouldIncludeContent1')}
              </div>

              <div className="mt-[2px] font-light text-[#0C1419]">
                {t('GoodListingTitleShouldIncludeContent2')}
              </div>
            </div>

            <div className="col-span-12 mt-3">
              <label>
                {t('EcomPropertyListingDetailPageContactInformationPropertyDescription')}
              </label>
              <span className="text-[14px] text-danger"> *</span>
              <br />
              <span className="text-xs text-[#263238]">{t('noteTitleListingRequiredVN')}</span>
              <Form.Item
                name="description"
                label=""
                rules={[
                  {
                    required: true,
                    validator: (rule, value) =>
                      checkMultiLanguageRequired(
                        rule,
                        value,
                        `${eForm('pleaseInput')} ${t(
                          'EcomPropertyListingDetailPageContactInformationPropertyDescription',
                        )}`,
                      ),
                  },
                  {
                    max: 5000,
                    validator: (rule, value) =>
                      checkMultiLanguageMaxLength(rule, value, `${eForm('maxlength')} 5000`),
                  },
                  {
                    validator: (rule, value) =>
                      checkTextMultiLanguageInBlackListForForm(
                        value,
                        keyword,
                        `${eForm('keywordInBlackList')}`,
                      ),
                  },
                ]}
                initialValue={[
                  { language: 'vi', value: '' },
                  { language: 'en', value: '' },
                  { language: 'ko', value: '' },
                ]}
              >
                <MultiLanguageInput maxLength={5001} row={10} disabled={true} />
              </Form.Item>
            </div>

            <div className="col-span-12">
              <FormFloatInput
                disabled={true}
                rules={[
                  {
                    required: true,
                    message: `${eForm('pleaseInput')} ${t(
                      'EcomPropertyListingDetailPagePropertyInformationAddress',
                    )}`,
                  },
                  { max: 500, message: `${eForm('maxlength')} 500` },
                ]}
                name={['location', 'address']}
                label={t('EcomPropertyListingDetailPagePropertyInformationAddress')}
              />
            </div>

            <div className="col-span-4">
              <FormFloatSelect
                disabled={true}
                name={['location', 'province']}
                label={t('EcomPropertyListingDetailPageLocationCityProvince')}
                required
                showSearch={true}
                options={listProvince.map((province) => ({
                  value: province?.provinceID,
                  label: province?.listProvinceName,
                }))}
                rules={[
                  {
                    required: true,
                    message: `${eForm('pleaseInput')} ${t(
                      'EcomPropertyListingDetailPageLocationCityProvince',
                    )}`,
                  },
                ]}
              />
            </div>
            <div className="col-span-4">
              <FormFloatSelect
                disabled={true}
                name={['location', 'district']}
                label={t('EcomPropertyListingDetailPageLocationDistrict')}
                required
                rules={[
                  {
                    required: true,
                    message: `${eForm('pleaseInput')} ${t(
                      'EcomPropertyListingDetailPageLocationDistrict',
                    )}`,
                  },
                ]}
                showSearch={true}
                options={listDistrict?.map((x) => ({
                  value: x?.listDistrictID,
                  label: x?.nameDisplay,
                  id: x?.listDistrictID,
                }))}
              />
            </div>
            <div className="col-span-4">
              <FormFloatSelect
                disabled={true}
                name={['location', 'ward']}
                label={t('EcomPropertyListingDetailPageLocationWardCommune')}
                required
                rules={[
                  {
                    required: true,
                    message: `${eForm('pleaseInput')} ${t(
                      'EcomPropertyListingDetailPageLocationWardCommune',
                    )}`,
                  },
                ]}
                showSearch={true}
                options={listWard.map((x) => ({
                  value: x?.listWardID,
                  label: x?.nameDisplay,
                  id: x?.listWardID,
                }))}
              />
            </div>

            <div className="col-span-12">
              <FormFloatSelect
                disabled={true}
                placeholder={t('EcomPropertyListingDetailPageLocationAddressPlaceholder')}
                name={['location', 'placeId']}
                label={t('EcomPropertyListingDetailPageLocationAddress')}
                required
                filterOption={false}
                showSearch={true}
                onChange={(value) => onChangePlace(value)}
                onSearch={(value) => onSearchGoogleMap(value)}
                options={listLocationSuggest?.map((x) => ({
                  value: x.place_id,
                  label: x.description,
                  id: x.place_id,
                }))}
                rules={[
                  {
                    required: true,
                    message: `${eForm('pleaseInput')} ${t(
                      'EcomPropertyListingDetailPageLocationAddress',
                    )}`,
                  },
                ]}
              />
            </div>
            <div className="col-span-12">
              <div className="col-span-full mb-5 h-96 w-full">
                <GoogleMapComponent
                  isMarker={true}
                  initCenter={coordinate}
                  listMarker={[coordinate]}
                ></GoogleMapComponent>
              </div>
            </div>

            <div className="col-span-4">
              <FormRadioAdmin
                disabled={true}
                label={t('EcomPropertyListingDetailPagePropertyInformationBeds')}
                name="bedrooms"
                options={beds.map((item) => ({
                  id: item,
                  name: item < 5 ? item.toString() : '>4',
                }))}
              />
            </div>
            <div className="col-span-4">
              <FormRadioAdmin
                disabled={true}
                label={t('EcomPropertyListingDetailPagePropertyInformationBaths')}
                name="bathrooms"
                options={baths.map((item) => ({
                  id: item,
                  name: item < 5 ? item.toString() : '>4',
                }))}
              />
            </div>
            <div className="col-span-4">
              <FormFloatNumber
                maxNum={10000}
                name="size"
                disabled={true}
                special={
                  <>
                    ( m<sup>2</sup>)
                  </>
                }
                label={t('EcomPropertyListingDetailPagePropertyInformationHomeAre')}
                required
                rules={[
                  {
                    required: true,
                    message: `${eForm('pleaseInput')} ${t(
                      'EcomPropertyListingDetailPagePropertyInformationHomeAre',
                    )}`,
                  },
                ]}
              />
            </div>
            {isSell ? (
              <>
                <div className="col-span-6">
                  <FormRadioAdmin
                    disabled={true}
                    label={t('EcomPropertyListingDetailPagePropertyInformationLegalStatus')}
                    name="legalStatus"
                    options={legalStatuses.map((item) => ({
                      id: item.id,
                      name: t(item.name),
                    }))}
                  />
                </div>
                <div className="col-span-6">
                  <FormRadioAdmin
                    disabled={true}
                    label={t('EcomPropertyListingDetailPagePropertyInformationHandoverStatus')}
                    name="handOverStatus"
                    options={handOverStatuses.map((item) => ({
                      id: item.id,
                      name: t(item.name),
                    }))}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="col-span-6">
                  <FormRadioAdmin
                    disabled={true}
                    label={t('EcomPropertyListingDetailPagePropertyInformationLeaseTerm')}
                    name="leaseTerm"
                    options={listingRentLeaseTerm.map((item) => ({
                      id: item.id,
                      name: comm(item.name),
                    }))}
                  />
                </div>
                <div className="col-span-6">
                  <FormRadioAdmin
                    disabled={true}
                    label={t('EcomPropertyListingDetailPagePropertyInformationHandoverStatus')}
                    name="isPetAllowance"
                    options={[
                      { id: true, name: 'Yes' },
                      { id: false, name: 'No' },
                    ].map((item) => ({
                      id: item.id,
                      name: comm(item.name),
                    }))}
                  />
                </div>
              </>
            )}

            <div className="col-span-12">
              <FormRadioAdmin
                disabled={true}
                label={t('EcomPropertyListingDetailPagePropertyInformationGeneralFurniture')}
                name="interiorId"
                options={listInterior.map((item) => ({
                  id: item.id,
                  name: item.interiorName,
                }))}
              />
            </div>
            <div className="col-span-12">
              <FormSelectChip
                disabled={true}
                label={t('EcomPropertyListingDetailPagePropertyInformationView')}
                name="viewsIds"
                options={listView.map((item) => ({
                  id: item.id,
                  name: item.name,
                }))}
              />
            </div>
            {!isSell && (
              <div className="col-span-12 lg:col-span-6">
                <FormFloatDate
                  disabled={true}
                  showTime
                  format="DD/MM/YYYY HH:mm"
                  disabledDate={disabledDate}
                  name="canMoveInAfter"
                  label={t('EcomPropertyListingDetailPagePriceExpectedCanMoveInDate')}
                />
              </div>
            )}
            <div className="col-span-12">
              <label>{t('EcomPropertyListingDetailPageGalleryVideosVideoLink')}</label>

              <br />
              <span className="text-xs text-[#263238]">
                {t('EcomPropertyListingDetailPageGalleryVideosVideoLinkNote')}
              </span>

              <FormFloatInput
                disabled={true}
                rules={[
                  { max: 500, message: `${eForm('maxlength')} 500` },
                  {
                    min: 0,
                    validator: (rule, value) =>
                      checkValidTextInBlackListForForm(
                        value,
                        keyword,
                        `${eForm('keywordInBlackList')} `,
                      ),
                  },
                ]}
                name="videoLink"
              />
            </div>
          </div>

          <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
            <div className="col-span-12 py-2">
              <label className="text-base font-bold text-portal-primaryMainAdmin">
                {t('EcomPropertyListingDetailPageContactInformationPropertyInfo')}
              </label>
            </div>
            <div className="col-span-6">
              <FormFloatSelect
                disabled={true}
                rules={[
                  {
                    required: true,
                    message: `${eForm('pleaseSelect')} ${t(
                      'EcomPropertyListingDetailPagePropertyInformationProject',
                    )}`,
                  },
                ]}
                label={t('EcomPropertyListingDetailPagePropertyInformationProject')}
                name="projectId"
                showSearch
                onChange={(projectId) => getListUnit(projectId)}
                filterOption={true}
                options={listProject?.map((x) => ({
                  value: x.id,
                  label: x.name,
                  id: x.id,
                }))}
              />
            </div>

            <div className="col-span-6">
              <FormFloatInput
                disabled={true}
                rules={[{ max: 250, message: `${eForm('maxlength')} 250` }]}
                name="blockTower"
                label={t('EcomPropertyListingDetailPagePropertyInformationBlock')}
              />
            </div>
            <div className="col-span-6">
              <FormFloatNumber
                disabled={true}
                name="floor"
                label={t('EcomPropertyListingDetailPagePropertyInformationFloor')}
              />
            </div>
            <div className="col-span-6">
              <FormFloatSelect
                disabled={true}
                rules={[
                  {
                    required: true,
                    message: `${eForm('pleaseSelect')} ${t('EcomPageListingDetailOtherUnitCode')}`,
                  },
                ]}
                label={t('EcomPageListingDetailOtherUnitCode')}
                name="unitId"
                showSearch
                onSearch={(keyword) =>
                  getListUnit(listingForm.getFieldValue('projectId'), keyword, false)
                }
                filterOption={true}
                options={listUnit?.map((x) => ({
                  value: x.id,
                  label: x.unitNo,
                  id: x.id,
                }))}
              />
            </div>
            <div className="col-span-6"></div>
            <div className="col-span-6">
              <Form.Item name="isShowUnitCode" valuePropName="checked" className="mt-[-20px]">
                <Checkbox disabled={true} type="checkbox">
                  {t('EcomPropertyListingDetailPagePropertyInformationShowUnitCode')}
                </Checkbox>
              </Form.Item>
            </div>
          </div>

          <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
            <div className="col-span-12 py-2">
              <label className="text-base font-bold text-portal-primaryMainAdmin">
                {t('EcomPropertyListingDetailPagePriceAndExpected')}
              </label>
            </div>
            {isSell ? (
              <>
                <div className="col-span-6">
                  <FormFloatNumber
                    disabled={true}
                    name="priceVnd"
                    label={t('EcomPropertyListingDetailPagePricePriceVND')}
                    required
                    maxNum={9999999999999}
                    rules={[
                      {
                        required: true,
                        message: `${eForm('pleaseInput')} ${t(
                          'EcomPropertyListingDetailPagePricePriceVND',
                        )}`,
                      },
                    ]}
                  />
                </div>
                <div className="col-span-6">
                  <FormFloatDate
                    disabled={true}
                    showTime
                    format="DD/MM/YYYY HH:mm"
                    disabledDate={disabledDate}
                    name="expectedPublishingDate"
                    label={t('EcomPropertyListingDetailPagePriceExpectedPublishingDate')}
                    required
                    rules={[
                      {
                        required: true,
                        message: `${eForm('pleaseInput')} ${t(
                          'EcomPropertyListingDetailPagePriceExpectedPublishingDate',
                        )}`,
                      },
                    ]}
                  />
                </div>

                {isPlantinum && (
                  <div className="col-span-12">
                    <Form.Item name="isAutoPushDate" valuePropName="checked" className="mt-[-20px]">
                      <Checkbox disabled={true} type="checkbox">
                        {t('EcomPropertyListingDetailPagePropertyisAutoPush')}
                      </Checkbox>
                    </Form.Item>
                  </div>
                )}
                {isPlantinum && (
                  <div className="col-span-6">
                    <div className="flex justify-between">
                      <label>{t('noteSelectAutoPush')}</label>
                      <Popover
                        overlayStyle={{
                          width: '400px',
                          fontWeight: 400,
                        }}
                        content={comm('contentNoteMarkListing')}
                        title={comm('titleNoteMarkListing')}
                      >
                        <label>{noteMarkIcon}</label>
                      </Popover>
                    </div>
                    <FormFloatDate
                      format="DD/MM/YYYY HH:mm"
                      disabled={true}
                      disabledDate={disabledDate}
                      name="dateAutoPush"
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="col-span-6">
                  <FormFloatNumber
                    disabled={true}
                    name="priceVnd"
                    label={t('EcomPropertyListingDetailPagePriceRent_Month')}
                    required
                    maxNum={9999999999999}
                    rules={[
                      {
                        required: true,
                        message: `${eForm('pleaseInput')} ${t(
                          'EcomPropertyListingDetailPagePricePriceVND',
                        )}`,
                      },
                    ]}
                  />
                </div>
                <div className="col-span-6">
                  <FormFloatDate
                    disabled={true}
                    showTime
                    format="DD/MM/YYYY HH:mm"
                    disabledDate={disabledDate}
                    name="expectedPublishingDate"
                    label={t('EcomPropertyListingDetailPagePriceExpectedPublishingDate')}
                    required
                    rules={[
                      {
                        required: true,
                        message: `${eForm('pleaseInput')} ${t(
                          'EcomPropertyListingDetailPagePriceExpectedPublishingDate',
                        )}`,
                      },
                    ]}
                  />
                </div>
                <div className="col-span-6">
                  <Form.Item
                    name="isIncludeManagementFee"
                    valuePropName="checked"
                    className="mt-[-20px]"
                  >
                    <Checkbox disabled={true} type="checkbox">
                      {t('EcomPropertyListingDetailPagePropertyInformationIncludeManagementFee')}
                    </Checkbox>
                  </Form.Item>
                </div>
                {isPlantinum && (
                  <div className="col-span-6">
                    <Form.Item name="isAutoPush" valuePropName="checked" className="mt-[-20px]">
                      <Checkbox disabled={true} type="checkbox">
                        {t('EcomPropertyListingDetailPagePropertyisAutoPush')}
                      </Checkbox>
                    </Form.Item>
                  </div>
                )}
                <div className="col-span-6">
                  <FormFloatNumber
                    disabled={true}
                    name="managementFee"
                    label={t('EcomPropertyListingDetailPageManagementFee_Month')}
                    required
                    maxNum={9999999999999}
                    rules={[
                      {
                        required: true,
                        message: `${eForm('pleaseInput')} ${t(
                          'EcomPropertyListingDetailPageManagementFee_Month',
                        )}`,
                      },
                    ]}
                  />
                </div>
                {isPlantinum && (
                  <div className="col-span-6">
                    <div className="mb-1 flex justify-between">
                      <label>{t('noteSelectAutoPush')}</label>
                      <Popover
                        overlayStyle={{
                          width: '400px',
                          fontWeight: 400,
                        }}
                        content={comm('contentNoteMarkListing')}
                        title={comm('titleNoteMarkListing')}
                      >
                        <label>{noteMarkIcon}</label>
                      </Popover>
                    </div>
                    <FormFloatDate
                      format="DD/MM/YYYY HH:mm"
                      disabled={true}
                      disabledDate={disabledDate}
                      name="dateAutoPush"
                    />
                  </div>
                )}
              </>
            )}
          </div>

          <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
            <div className="col-span-12 py-2">
              <label className="text-base font-bold text-portal-primaryMainAdmin">
                {t('EcomPropertyListingDetailPageGalleryVideosGalleryAndVideo')}
              </label>
            </div>
            <div className="col-span-12" id="gallery">
              <Form.Item name="gallery">
                <UploadGallery
                  disabled={true}
                  maxFile={numberImageUpload}
                  multiple={true}
                  noteBeforeUpload={t('maxNumberFile', { number: numberImageUpload })}
                  required
                  initImages={listingDetail?.imageUrls}
                  title={t('EcomPropertyListingDetailPageGalleryVideosGallery')}
                  uploadButtonLabel={comm('uploadFiles')}
                  onChange={async (images, listIdRemove, isDeleteFileBeforUpdate) =>
                    onUploadGallery(images, listIdRemove, isDeleteFileBeforUpdate)
                  }
                ></UploadGallery>
              </Form.Item>
            </div>
          </div>

          <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
            <div className="col-span-12 py-2">
              <label className="text-base font-bold text-portal-primaryMainAdmin">
                {t('EcomTicketManagementDetailPageDetailAmenities')}
              </label>
            </div>
            <div className="col-span-12">
              <label className="text-base font-medium">
                {t('EcomTicketManagementDetailPageDetailIndoorAmenities')}
              </label>
              <FormSelectIcon
                amenityEnum={amenityType.In}
                disabled={true}
                name="inDoorAmenities"
                options={amenitiesIn?.map((p) => ({
                  name: p.name,
                  value: p.id,
                  imageUrl: p.imageUrl,
                }))}
              />
            </div>
            <div className="col-span-12">
              <label className="text-base font-medium">
                {t('EcomTicketManagementDetailPageDetailOutdoorAmenities')}
              </label>
              <FormSelectIcon
                disabled={true}
                amenityEnum={amenityType.Out}
                name="outDoorAmenities"
                options={amenitiesOut?.map((p) => ({
                  name: p.name,
                  value: p.id,
                  imageUrl: p.imageUrl,
                }))}
              />
            </div>

            <div className="col-span-12">
              <label className="text-base font-medium">
                {t('EcomTicketManagementDetailPageDetailNearBy')}
              </label>
              <FormTagInputShap disabled={true} name="nearBy" />
            </div>
          </div>
        </Form>
      </div>

      <ModalApproveOrRejectStatus
        typeModal={typeModal}
        form={listingForm}
        visible={showModalApprover}
        handleOk={HandleApproveOrReject}
        handleCanncel={onCloseModalApproval}
      />
    </WrapPageScroll>
  ) : (
    <WaringPermission />
  );
};

export default ListingDetailPage;
