'use client';
import apiMasterDataService from '@/apiServices/externalApiServices/apiMasterDataService';
import unitApiInAdmin from '@/apiServices/externalApiServices/apiUnitInAdmin';
import locationApiService from '@/apiServices/externalApiServices/locationApiService';
import projectApiService from '@/apiServices/externalApiServices/projectApiService';
import propertyApiService from '@/apiServices/externalApiServices/propertyApiService';
import ButtonSaveListing from '@/components/Button/ButtonSaveListing/ButtonSaveListing';
import FormRadioSelectPackage from '@/components/FormInput/FormRadioSelectPackage';
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
import UploadGalleryRealTime from '@/components/UploadGallery/UploadGalleyRealTime';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import WrapPageScroll from '@/components/WrapPageScoll';
import { getEcomEcomListingMemberPackageGetMemberPackageProfile } from '@/ecom-sadec-api-client';
import useKeywordBanned from '@/hooks/useKeywordBaned';
import useProvince from '@/hooks/useProvince';
import { noteMarkIcon } from '@/libs/appComponents';
import {
  amenityType,
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
  statusItem,
  typeUserPostListing,
} from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import {
  checkMultiLanguageMaxLength,
  checkMultiLanguageRequired,
  checkTextMultiLanguageInBlackListForForm,
  checkValidTextInBlackListForForm,
  formatNumber,
} from '@/libs/helper';
import { ProjectLookupModel } from '@/models/projectModel/projectLookupModel';
import { PropertyStatus } from '@/models/propertyModel/propertyDetailModel';
import { PropertyTypeModel } from '@/models/propertyModel/propertyTypeModel';
import { PropertyViewModel } from '@/models/propertyModel/propertyViewModel';
import useGlobalStore from '@/stores/useGlobalStore';
import { Checkbox, Form, Modal, Popover } from 'antd';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import React, { useEffect, useState, useTransition } from 'react';
import { TypeOptions, toast } from 'react-toastify';
import ModalAcctionListtingExpired from './components/ModalAcctionListtingExpired';
import ModalReplyDeal from './components/ModalReplyDeal';
import PreviewListingModal from './components/PreviewListing';

const disabledDate = (current) => {
  return current < dayjs().subtract(1, 'day') ? true : false;
};
const ListingDetailPageClient = ({ params }: { params: { id: string } }) => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);
  const [isPending, startTransition] = useTransition();
  const { userInfo, userPackage, setUserPackage } = useGlobalStore();
  const [listingForm] = Form.useForm();

  const { keyword } = useKeywordBanned();
  const isAddNew = params.id === 'add-new' ? true : false;
  const { back } = useRouter();
  const t = useTranslations('webLabel');
  const success = useTranslations('successNotifi');
  const errorNoti = useTranslations('errorNotifi');
  const eForm = useTranslations('error');
  const comm = useTranslations('Common');
  const locale = useLocale();

  const { listProvince } = useProvince();

  const [listingDetail, setListingDetail] = useState<any>(undefined);

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

  const [isSell, setIsSell] = useState<boolean>(false);
  const [isPlantinum, setIsPlantinum] = useState<boolean>(false);

  const [numberImageUpload, setNumberImageUpload] = useState<number>(20);
  const [coordinate, setCoordinate] = useState({
    lat: 10.7340344,
    lng: 106.7215787,
  }); // default HCM quan 7

  const [countGalleryImages, setCountGalleryImages] = useState<number>(0);
  const [listIdImageDelete, setListIdImageDelete] = useState<string[]>([]);
  const [listFileAfterUpload, setListFileAfterUpload] = useState<any[]>([]);
  const [listPackageListing, setListPackageListing] = useState<any[]>([]);

  const [isShowPreview, setIsShowPreview] = useState<boolean>(false);
  const [dataShowPreview, setDataShowPreview] = useState<any>(undefined);
  const [unitCodeTemp, setUnitCodeTemp] = useState<string>(undefined);
  const [isShowNotiExpired, setIsShowNotiExpired] = useState<boolean>(false);
  const [isShowPopupReplyDeal, setIsShowPopupReplyDeal] = useState<boolean>(false);
  const [unBlockPush, setUnBlockPush] = useState<boolean>(false);
  const [minUploadImage, setminUploadImage] = useState<number>(0);

  useEffect(() => {
    initMasterData();
    getDetail();
  }, []);

  const updateProfilePackage = async () => {
    startTransition(async () => {
      const resUserPackage = await getEcomEcomListingMemberPackageGetMemberPackageProfile({
        authorization: null,
      });
      setUserPackage((resUserPackage as any)?.data);
    });
  };

  const initMasterData = async () => {
    setUnBlockPush(false);
    getPropertyAmenitiesIn();
    getPropertyAmenitiesOut();
    await propertyApiService.getPropertyViews().then((x) => setListView(x.data));
    await propertyApiService.getPropertyInterior().then((x) => setListInterior(x.data));
    await projectApiService.getProjectByQueryForPortal().then((x) => setListPorject(x.data));
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

  const handleChangeValueFilter = async (key: string, value: string) => {
    if (key == 'city') {
      let dataDistrict = await apiMasterDataService.getDistrictV2(value);

      setListDistrict(dataDistrict);
      listingForm.setFieldValue(['location', 'district'], undefined);
      listingForm.setFieldValue(['location', 'ward'], undefined);
    }
    if (key == 'district') {
      let dataWard = await apiMasterDataService.getWards(value);

      setListWard(dataWard);
      listingForm.setFieldValue(['location', 'ward'], undefined);
    }
  };

  const getDetail = async () => {
    if (!isAddNew) {
      const id = getIdFromUrl();

      if (id) {
        const listingInfo = await propertyApiService.getDetailMyListingByQuery(id);

        if (listingInfo?.isAutoPush) {
          setUnBlockPush(true);
        } else {
          setUnBlockPush(false);
        }

        await getListDataWhenSelectType(listingInfo?.type);
        setIsSell(listingInfo.type === listingType.sale ? true : false);
        setIsPlantinum(listingInfo.priorityStatus === packageListingEnum.Platinum ? true : false);
        setNumberImageUpload(listingInfo.priorityStatus === packageListingEnum.Platinum ? 30 : 20);

        await onChangePlace(listingInfo?.location?.placeId);

        await listingForm.setFieldsValue({
          ...listingInfo,
          isAutoPushDate: listingInfo?.autoPushDate ? true : false,
          listingCategoryId: [listingInfo.listingCategoryId],
        });
        onChangepriotyListting(listingInfo.priorityStatus);
        getInfoLocation(listingInfo?.location);

        getListUnit(listingInfo?.projectId, '', true);

        setListingDetail(listingInfo);
        setListFileAfterUpload(listingInfo?.imageUrls);
        setCountGalleryImages(listingInfo?.imageUrls?.length);

        checkIsReplyDeal(listingInfo);
      }
    } else {
      listingForm.resetFields();
      // init data default radio
      listingForm.setFieldsValue({
        type: listingType.sale,
        bedrooms: beds[0],
        bathrooms: baths[0],
        legalStatus: legalStatuses[0]?.id,
        handOverStatus: handOverStatuses[0]?.id,
        leaseTerm: listingRentLeaseTerm[0]?.id,
        interiorId: listInterior[0]?.id,
        viewsIds: listView[0]?.id,
      });

      getListDataWhenSelectType(listingType.sale);
      setListFileAfterUpload([]);
      setListIdImageDelete([]);
      setNumberImageUpload(20);
      setIsSell(true);
    }
  };

  const checkIsReplyDeal = (property) => {
    if (
      property?.status === PropertyStatus.Expired ||
      property?.status === PropertyStatus.TakeDownSold ||
      property?.status === PropertyStatus.TakeDownLeased
    ) {
      if (property?.isReplyDeal) {
        setIsShowPopupReplyDeal(false);
      } else {
        setIsShowPopupReplyDeal(true);
      }
    } else {
      setIsShowPopupReplyDeal(false);
    }
  };

  const converlistPackage = (memberPackages, typeListing) => {
    const isValid = typeListing !== undefined;

    if (isValid) {
      const listPackgeNew = listPackage.map((t) => {
        const matchedData = memberPackages.find(
          (d) => d.packageType === t.id && d.type === typeListing,
        ) || {
          numberOfPost: 0,
          numberOfPush: 0,
        };
        return {
          id: t.id,
          name: t.name,
          numberOfPost: matchedData.numberOfPost,
          numberOfPush: matchedData.numberOfPush,
        };
      });

      return listPackgeNew;
    } else {
      return [];
    }
  };

  const getListDataWhenSelectType = async (typeListing: number) => {
    // get product type tương ứng
    await propertyApiService
      .getPropertyTypes({ type: typeListing })
      .then((x) => setListProductType(x?.data || []));

    // get package tương ứng, package nào có thì mới cho nhấn
    const listPackageNew = await converlistPackage(userPackage?.memberPackages, typeListing);

    setListPackageListing(listPackageNew);

    //setup UI sale or rent
    if (typeListing === listingType.sale) {
      setIsSell(true);
    } else {
      setIsSell(false);
    }

    // reset các field có liên quan
    listingForm.setFieldValue('listingCategoryId', undefined);
    listingForm.setFieldValue('priorityStatus', undefined);
  };

  const onChangepriotyListting = (priortyListting: number) => {
    if (priortyListting === packageListingEnum.Basic) {
      setNumberImageUpload(20);
      setIsPlantinum(false);
      setminUploadImage(1);
    }
    if (priortyListting === packageListingEnum.Gold) {
      setNumberImageUpload(20);
      setIsPlantinum(false);
      setminUploadImage(2);
    }
    if (priortyListting === packageListingEnum.Platinum) {
      setNumberImageUpload(30);
      setIsPlantinum(true);
      setminUploadImage(3);
    }
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
        const res: any = await unitApiInAdmin.getListUnit({ projectId: projectId });

        setListUnit(res);
      }
    } else {
      if (projectId) {
        const res: any = await unitApiInAdmin.getListUnit({ projectId: projectId });
        // listingForm.setFieldValue('unitId', undefined);
        setListUnit(res);
      } else {
        listingForm.setFieldValue('unitId', undefined);
        setListUnit([]);
      }
    }
  };

  const getLocation = async (lat, lng, draggable) => {
    const result = await locationApiService.getInfoLocation(lat, lng);

    if (result.errorCode === '200') {
      const place = [
        {
          place_id: result.data[0]?.placeId,
          description: result.data[0]?.formattedAddress,
        },
      ];
      setListLocationSuggest(place);
      listingForm.setFieldsValue({
        location: { placeId: result.data[0]?.placeId },
      });
      if (!draggable) {
        setCoordinate({
          lat: lat,
          lng: lng,
        });
      }
    } else {
      notify('warning', errorNoti('locationNotFound'));
    }
  };

  const sendToApprovalWithExpired = async () => {
    const body = {
      id: listingDetail?.id,
      status: PropertyStatus.WaitingForApproval,
    };

    // Check có đủ số lượng tin push không
    if (
      listingDetail?.isAutoPush &&
      listingDetail?.priorityStatus === packageListingEnum.Platinum
    ) {
      const numberPush = userPackage?.memberPackages?.find(
        (i) => i.packageType === packageListingEnum.Platinum && i.type === listingDetail.type,
      )?.numberOfPush;

      if (numberPush < 8) {
        //DD quy định Plantium dưới 8 k cho auto push
        HandleRePostListingBLockAutoPush(body);
      } else {
        try {
          await propertyApiService.sendToApprovalWithExpired(body);
          notify('success', success('createAPI'));
          back();
        } catch (e) {
          notify('error', e.response?.data?.message);
        }
      }
      return;
    }
    // End check

    try {
      await propertyApiService.sendToApprovalWithExpired(body);
      notify('success', success('createAPI'));
      back();
    } catch (e) {
      notify('error', e.response?.data?.message);
    }
  };

  const handleCheckUploadImage = () => {
    if (!isAddNew && listFileAfterUpload.length < minUploadImage) {
      return true;
    } else if (isAddNew && listingForm.getFieldValue('imageIds').length < minUploadImage) {
      return true;
    } else {
      return false;
    }
  };

  const OnSaveWithStatus = async (statusSendToServe) => {
    if (statusSendToServe === PropertyStatus.WaitingForApproval || isAddNew) {
      await listingForm.validateFields();
      if (handleCheckUploadImage()) {
        Modal.confirm({
          title: t('UploadMinImageTitle'),
          content: t('UploadMinImageNote', { count: minUploadImage }),
          okText: t('YES'),
          centered: true,
          okType: 'default',
          cancelButtonProps: { style: { display: 'none' } }, // Ẩn nút Cancel
          async onOk() {},
        });
        return;
      }
    }

    const values = listingForm.getFieldsValue();

    //TODO flow tạo mới
    if (isAddNew) {
      switch (statusSendToServe) {
        case PropertyStatus.Draft:
          startTransition(async () => {
            const body = {
              ...values,
              autoPushDate: values?.isAutoPushDate ? values.autoPushDate : null,
              displayPriceType: values.type,
              title: values.title.filter((item) => item.value?.length > 0),
              description: values.description.filter((item) => item.value?.length > 0),
              status: PropertyStatus.Draft,
              listingCategoryId: values.listingCategoryId[0],
              imageIds: listFileAfterUpload.map((item) => item?.id),
            };
            try {
              await propertyApiService.createListing(body);
              notify('success', success('createAPI'));
              back();
            } catch (e) {
              notify('error', e.response?.data?.message ?? errorNoti('createAPI'));
            }
          });

          break;
        case PropertyStatus.WaitingForApproval:
          if (values?.expectedPublishingDate < dayjs()) {
            listingForm.setFieldValue('expectedPublishingDate', null);

            return notify('error', errorNoti('khongChoChonBeHonHienTai'));
          }

          startTransition(async () => {
            const body = {
              ...values,
              displayPriceType: values.type,
              title: values.title.filter((item) => item.value?.length > 0),
              description: values.description.filter((item) => item.value?.length > 0),
              status: PropertyStatus.WaitingForApproval,
              listingCategoryId: values.listingCategoryId[0],
              autoPushDate: values?.isAutoPushDate ? values.autoPushDate : null,
              imageIds: listFileAfterUpload.map((item) => item?.id),
            };

            //TODO trường hợp auto push
            if (body?.isAutoPush && body?.priorityStatus === packageListingEnum.Platinum) {
              const numberPush = userPackage?.memberPackages?.find(
                (i) => i.packageType === packageListingEnum.Platinum && i.type === body.type,
              )?.numberOfPush;

              // Trường hợp < 8 lần auto push đối với tin Plantium
              if (numberPush < 8) {
                //DD quy định Plantium dưới 8 k cho auto push
                HandleCreateListingBLockAutoPush(body);
              }
              // Trường hợp > 8 lần auto push đối với tin Plantium
              else {
                try {
                  await propertyApiService.createListing(body);
                  notify('success', success('createAPI'));
                  back();
                } catch (e) {
                  notify('error', e.response?.data?.message ?? errorNoti('createAPI'));
                }
              }
              updateProfilePackage();
              return;
            }

            try {
              await propertyApiService.createListing(body);
              updateProfilePackage();
              notify('success', success('createAPI'));
              back();
            } catch (e) {
              notify('error', e.response?.data?.message ?? errorNoti('createAPI'));
            }
          });

          break;
      }
    }
    //TODO flow update
    else {
      switch (statusSendToServe) {
        case PropertyStatus.Draft:
          //TODO status hiện tại list mà là Rejected, Expired, Takedown thì chỉ update status thành nháp
          if (
            listingDetail?.status === PropertyStatus.Rejected ||
            listingDetail?.status === PropertyStatus.Expired ||
            listingDetail?.status === PropertyStatus.Cancelled ||
            listingDetail?.status === PropertyStatus.Takedown
          ) {
            startTransition(async () => {
              const body = {
                id: listingDetail?.id,
                status: PropertyStatus.Draft,
              };
              try {
                await propertyApiService.updateStatus(body);
                notify('success', success('updateAPI'));
                getDetail();
              } catch (e) {
                notify('error', e.response?.data?.message ?? errorNoti('updateAPI'));
              }
            });
          }
          //TODO status hiện tại list mà là Rejected, Expired, Takedown thì chỉ update status thành nháp
          else {
            startTransition(async () => {
              const body = {
                ...listingDetail,
                ...values,
                displayPriceType: values.type,
                title: values.title.filter((item) => item.value?.length > 0),
                description: values.description.filter((item) => item.value?.length > 0),
                status: PropertyStatus.Draft,
                listingCategoryId: values.listingCategoryId[0],
                autoPushDate: values?.isAutoPushDate ? values.autoPushDate : null,
                imageIds: listFileAfterUpload.map((item) => item?.id),
                imageIdsDelete: listIdImageDelete,
              };
              try {
                await propertyApiService.updatListing(body);
                notify('success', success('updateAPI'));
                getDetail();
              } catch (e) {
                notify('error', e.response?.data?.message ?? errorNoti('updateAPI'));
              }
            });
          }

          break;
        case PropertyStatus.WaitingForApproval:
          if (listFileAfterUpload.length < 1) {
            return notify(
              'error',
              `${eForm('pleaseSelect')} ${t('EcomPropertyListingDetailPageGalleryVideosGallery')}`,
            );
          }
          if (values?.expectedPublishingDate < dayjs()) {
            listingForm.setFieldValue('expectedPublishingDate', null);

            return notify('error', errorNoti('khongChoChonBeHonHienTai'));
          }
          startTransition(async () => {
            const body = {
              ...listingDetail,
              ...values,
              displayPriceType: values.type,
              title: values.title.filter((item) => item.value?.length > 0),
              description: values.description.filter((item) => item.value?.length > 0),
              autoPushDate: values?.isAutoPushDate ? values.autoPushDate : null,
              status: PropertyStatus.WaitingForApproval,
              listingCategoryId: values.listingCategoryId[0],
              imageIds: listFileAfterUpload.map((item) => item?.id),
              imageIdsDelete: listIdImageDelete,
            };

            //TODO trường hợp auto push
            if (body?.isAutoPush && body?.priorityStatus === packageListingEnum.Platinum) {
              const numberPush = userPackage?.memberPackages?.find(
                (i) => i.packageType === packageListingEnum.Platinum && i.type === body.type,
              )?.numberOfPush;

              // Trường hợp < 8 lần auto push đối với tin Plantium
              if (numberPush < 8) {
                //DD quy định Plantium dưới 8 k cho auto push
                HandleUpdateListingBLockAutoPush(body);
              }
              // Trường hợp > 8 lần auto push đối với tin Plantium
              else {
                try {
                  await propertyApiService.updatListing(body);
                  notify('success', success('createAPI'));
                  back();
                } catch (e) {
                  notify('error', e.response?.data?.message ?? errorNoti('createAPI'));
                }
              }
              updateProfilePackage();
              return;
            }

            try {
              await propertyApiService.updatListing(body);
              notify('success', success('updateAPI'));
              updateProfilePackage();
              getDetail();
            } catch (e) {
              notify('error', e.response?.data?.message ?? errorNoti('updateAPI'));
            }
          });
          break;
        case PropertyStatus.Cancelled:
          startTransition(async () => {
            const body = {
              id: listingDetail?.id,
              status: PropertyStatus.Cancelled,
            };
            try {
              await propertyApiService.updateStatus(body);
              notify('success', success('updateAPI'));
              updateProfilePackage();
              getDetail();
            } catch (e) {
              notify('error', e.response?.data?.message ?? errorNoti('updateAPI'));
            }
          });
          break;
        case PropertyStatus.Takedown:
          startTransition(async () => {
            const body = {
              id: listingDetail?.id,
              status: PropertyStatus.Takedown,
            };
            try {
              await propertyApiService.updateStatus(body);
              notify('success', success('updateAPI'));
              getDetail();
            } catch (e) {
              notify('error', e.response?.data?.message ?? errorNoti('updateAPI'));
            }
          });
          break;
        case PropertyStatus.TakeDownSold:
          startTransition(async () => {
            const body = {
              id: listingDetail?.id,
              status: PropertyStatus.TakeDownSold,
            };
            await propertyApiService.updateStatus(body);
            getDetail();
          });
          break;
        case PropertyStatus.TakeDownLeased:
          startTransition(async () => {
            const body = {
              id: listingDetail?.id,
              status: PropertyStatus.TakeDownLeased,
            };
            await propertyApiService.updateStatus(body);
            getDetail();
          });
          break;
      }
      getDetail();
    }
  };

  const HandleCreateListingBLockAutoPush = (dataCallApi) => {
    Modal.confirm({
      title: t('EcomListingNotHaveNumberPushTitle'),
      content: t('EcomListingNotHaveNumberPushContent'),
      okText: t('YES'),
      cancelText: t('NO'),
      centered: true,
      okType: 'default',
      async onOk() {
        const body = {
          ...dataCallApi,
          isAutoPush: false,
          dateAutoPush: undefined,
        };
        listingForm.setFieldValue('dateAutoPush', undefined);
        listingForm.setFieldValue('isAutoPush', false);
        try {
          await propertyApiService.createListing(body);
          notify('success', success('createAPI'));
          back();
        } catch (e) {
          notify('error', e.response?.data?.message ?? errorNoti('createAPI'));
        }
      },
      onCancel() {
        listingForm.setFieldValue('dateAutoPush', undefined);
        listingForm.setFieldValue('isAutoPush', false);
      },
    });
  };

  const HandleUpdateListingBLockAutoPush = (dataCallApi) => {
    Modal.confirm({
      title: t('EcomListingNotHaveNumberPushTitle'),
      content: t('EcomListingNotHaveNumberPushContent'),
      okText: t('YES'),
      cancelText: t('NO'),
      centered: true,
      okType: 'default',
      async onOk() {
        const body = {
          ...dataCallApi,
          isAutoPush: false,
          dateAutoPush: undefined,
        };
        listingForm.setFieldValue('dateAutoPush', undefined);
        listingForm.setFieldValue('isAutoPush', false);
        try {
          await propertyApiService.updatListing(body);
          notify('success', success('createAPI'));
          back();
        } catch (e) {
          notify('error', e.response?.data?.message ?? errorNoti('createAPI'));
        }
      },
      onCancel() {
        listingForm.setFieldValue('dateAutoPush', undefined);
        listingForm.setFieldValue('isAutoPush', false);
      },
    });
  };

  const HandleRePostListingBLockAutoPush = (dataCallApi) => {
    Modal.confirm({
      title: t('EcomListingNotHaveNumberPushTitle'),
      content: t('EcomListingNotHaveNumberPushContent'),
      okText: t('YES'),
      cancelText: t('NO'),
      centered: true,
      okType: 'default',
      async onOk() {
        const body = {
          ...dataCallApi,
          isAutoPush: false,
          dateAutoPush: undefined,
        };
        listingForm.setFieldValue('dateAutoPush', undefined);
        listingForm.setFieldValue('isAutoPush', false);
        try {
          await propertyApiService.sendToApprovalWithExpired(body);
          notify('success', success('createAPI'));
          back();
        } catch (e) {
          notify('error', e.response?.data?.message ?? errorNoti('createAPI'));
        }
      },
      onCancel() {
        listingForm.setFieldValue('dateAutoPush', undefined);
        listingForm.setFieldValue('isAutoPush', false);
      },
    });
  };

  const onCheckKeyEnter = (event) => {
    if (event.code === 'Enter') {
      event.preventDefault();
      listingForm.setFieldValue('unitId', unitCodeTemp);

      return true;
    } else return false;
  };

  const handleBlockPush = (allowSlectDate) => {
    if (allowSlectDate) {
      setUnBlockPush(true);
    } else {
      setUnBlockPush(false);
    }
    listingForm.setFieldValue('dateAutoPush', undefined);
  };

  const checkDateAutoPush = (value) => {
    const expectedPublishingDate = listingForm.getFieldValue('expectedPublishingDate');

    if (expectedPublishingDate > value) {
      notify('error', errorNoti('ngayTuDongDayPhayLonHonDuKien'));
      listingForm.setFieldValue('dateAutoPush', null);
    }
  };

  const onPushListing = async () => {
    startTransition(async () => {
      try {
        await propertyApiService.pushListingForMember(listingDetail?.id);
        notify('success', success('updateAPI'));
        updateProfilePackage();
      } catch (e) {
        notify('error', e?.response?.data?.message);
      }
    });
  };

  const onShowPreview = async (statusSendToServe) => {
    if (statusSendToServe === PropertyStatus.Draft) {
      await listingForm.validateFields();

      const values = listingForm.getFieldsValue();

      const dataShow = {
        ...listingDetail,
        ...values,
        autoPushDate: values?.isAutoPushDate ? values.autoPushDate : null,
        displayPriceType: values.type,
        title:
          values.title.find((item) => item.language === locale).value ??
          dataShowPreview.find((item) => item.language === 'vi').value,
        description:
          values.description.find((item) => item.language === locale).value ??
          dataShowPreview.find((item) => item.language === 'vi').value,
        status: PropertyStatus.Draft,
        listingCategoryId: values.listingCategoryId[0],
        views: listView.filter((item) => values.viewsIds.includes(item.id)),
        outDoorAmenities: amenitiesOut.filter((item) => values.outDoorAmenities.includes(item.id)),
        inDoorAmenities: amenitiesOut.filter((item) => values.inDoorAmenities.includes(item.id)),
      };

      setDataShowPreview(dataShow);
      setIsShowPreview(true);
    }
  };

  const closePreview = () => {
    setIsShowPreview(false);
  };

  const handleOkePreview = () => {
    closePreview();
    OnSaveWithStatus(PropertyStatus.WaitingForApproval);
  };

  const onUploadGallery = (fileAfterUpload: any[], idDelete?: string, isActionDelete?: boolean) => {
    if (isActionDelete) {
      const filesAfterRemove = listFileAfterUpload.filter((item) => item.id !== idDelete);
      setListFileAfterUpload([...filesAfterRemove]);
      listingForm.setFieldValue('imageIds', [...filesAfterRemove]);
      setListIdImageDelete([...listIdImageDelete, idDelete]);
      const newCount = countGalleryImages + 1;
      if (newCount < 1) {
        listingForm.setFieldValue('imageIds', []);
      }
      setCountGalleryImages(newCount);
    } else {
      listingForm.setFieldValue('imageIds', [...listFileAfterUpload, ...fileAfterUpload]);

      setListFileAfterUpload([...listFileAfterUpload, ...fileAfterUpload]);
      const newCount = [...listFileAfterUpload, ...fileAfterUpload].length;
      setCountGalleryImages(newCount);
    }
  };

  const onHandleListingExpired = () => {
    setIsShowNotiExpired(true);
  };

  const handleListingExpired = (isChangeListing) => {
    if (isChangeListing) {
      OnSaveWithStatus(PropertyStatus.Draft);
    } else {
      sendToApprovalWithExpired();
    }
    updateProfilePackage();
    setIsShowNotiExpired(false);
  };

  const renderAction = () => {
    //TODO các button khi tạo mới
    if (isAddNew) {
      return (
        <div className="flex justify-end">
          <ButtonSaveListing isLoading={isPending} text={comm('GoBack')} onClick={back} />

          <ButtonSaveListing
            isLoading={isPending}
            text={comm('SaveAsDraft')}
            onClick={() => OnSaveWithStatus(PropertyStatus.Draft)}
          />

          <ButtonSaveListing
            isLoading={isPending}
            text={comm('Submit')}
            className="!bg-[#FFD14B] px-6 !text-[#ffffff]"
            onClick={() => OnSaveWithStatus(PropertyStatus.WaitingForApproval)}
          />
        </div>
      );
    } else {
      switch (listingDetail?.status) {
        case PropertyStatus.Draft:
          return (
            <div className="flex justify-end">
              <ButtonSaveListing isLoading={isPending} text={comm('GoBack')} onClick={back} />

              <ButtonSaveListing
                isLoading={isPending}
                text={comm('SaveAsDraft')}
                onClick={() => OnSaveWithStatus(PropertyStatus.Draft)}
              />

              <ButtonSaveListing
                isLoading={isPending}
                text={comm('PreviewListing')}
                className="!bg-[#FFD14B] px-6 !text-[#ffffff]"
                onClick={() => onShowPreview(PropertyStatus.Draft)}
              />

              <ButtonSaveListing
                isLoading={isPending}
                text={comm('Submit')}
                className="!bg-[#FFD14B] px-6 !text-[#ffffff]"
                onClick={() => OnSaveWithStatus(PropertyStatus.WaitingForApproval)}
              />
            </div>
          );
        case PropertyStatus.WaitingForApproval:
          return (
            <div className="flex justify-end">
              <ButtonSaveListing isLoading={isPending} text={comm('GoBack')} onClick={back} />

              <ButtonSaveListing
                isLoading={isPending}
                className="!bg-[#EB5757] !text-[#ffffff]"
                text={comm('CancelRequest')}
                onClick={() => OnSaveWithStatus(PropertyStatus.Cancelled)}
              />
            </div>
          );
        case PropertyStatus.Cancelled:
          return (
            <div className="flex justify-end">
              <ButtonSaveListing isLoading={isPending} text={comm('GoBack')} onClick={back} />

              <ButtonSaveListing
                isLoading={isPending}
                className="!bg-[#FFD14B] px-6 !text-[#ffffff]"
                text={comm('Edit')}
                onClick={() => OnSaveWithStatus(PropertyStatus.Draft)}
              />
            </div>
          );
        case PropertyStatus.approved:
          return (
            <div className="flex justify-end">
              <ButtonSaveListing isLoading={isPending} text={comm('GoBack')} onClick={back} />

              <ButtonSaveListing
                isLoading={isPending}
                className="!bg-[#FEDB71] !text-[#ffffff]"
                text={comm('TakeDown')}
                onClick={() => OnSaveWithStatus(PropertyStatus.Takedown)}
              />
              <ButtonSaveListing
                isLoading={isPending}
                className="!bg-[#7D35B5] !text-[#ffffff]"
                text={
                  listingDetail?.type === listingType.sale ? comm('MarkSold') : comm('MarkRent')
                }
                onClick={() =>
                  OnSaveWithStatus(
                    listingDetail?.type === listingType.sale
                      ? PropertyStatus.TakeDownSold
                      : PropertyStatus.TakeDownLeased,
                  )
                }
              />
            </div>
          );
        case PropertyStatus.Rejected:
          return (
            <div className="flex justify-end">
              <ButtonSaveListing isLoading={isPending} text={comm('GoBack')} onClick={back} />

              <ButtonSaveListing
                isLoading={isPending}
                className="!bg-[#FEDB71] !text-[#ffffff]"
                text={comm('Edit')}
                onClick={() => OnSaveWithStatus(PropertyStatus.Draft)}
              />
            </div>
          );
        case PropertyStatus.Published:
          return (
            <div className="flex justify-end">
              <ButtonSaveListing isLoading={isPending} text={comm('GoBack')} onClick={back} />
              <ButtonSaveListing
                isLoading={isPending}
                text={comm('Push')}
                onClick={onPushListing}
              />
              <ButtonSaveListing
                isLoading={isPending}
                className="!bg-[#FEDB71] !text-[#ffffff]"
                text={comm('TakeDown')}
                onClick={() => OnSaveWithStatus(PropertyStatus.Takedown)}
              />
              <ButtonSaveListing
                isLoading={isPending}
                className="!bg-[#7D35B5] !text-[#ffffff]"
                text={
                  listingDetail?.type === listingType.sale ? comm('MarkSold') : comm('MarkRent')
                }
                onClick={() =>
                  OnSaveWithStatus(
                    listingDetail?.type === listingType.sale
                      ? PropertyStatus.TakeDownSold
                      : PropertyStatus.TakeDownLeased,
                  )
                }
              />
            </div>
          );
        case PropertyStatus.Expired:
          return (
            <div className="flex justify-end">
              <ButtonSaveListing isLoading={isPending} text={comm('GoBack')} onClick={back} />

              <ButtonSaveListing
                isLoading={isPending}
                className="!bg-[#FEDB71] !text-[#ffffff]"
                text={comm('RePost')}
                onClick={onHandleListingExpired}
              />
            </div>
          );
        case PropertyStatus.Takedown:
          return (
            <div className="flex justify-end">
              <ButtonSaveListing isLoading={isPending} text={comm('GoBack')} onClick={back} />

              <ButtonSaveListing
                isLoading={isPending}
                className="!bg-[#FEDB71] !text-[#ffffff]"
                text={comm('Edit')}
                onClick={() => OnSaveWithStatus(PropertyStatus.Draft)}
              />
            </div>
          );
        case PropertyStatus.TakeDownLeased:
        case PropertyStatus.TakeDownSold:
          return (
            <div className="flex justify-end">
              <ButtonSaveListing isLoading={isPending} text={comm('GoBack')} onClick={back} />
            </div>
          );
      }
    }
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
        borderColor = 'border-[#FFD14B] border ';
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
        className={`ml-2 w-fit rounded-full px-3 py-[6px] ${borderColor} ${backgroundColor} ${textColor} `}
      >
        {t(approvalStatus)}
      </label>
    );
  };

  return userInfo?.type === UserTypeConstant.Customer ? (
    <WrapPageScroll renderActions={renderAction}>
      <div className="p-6">
        <div className="mb-3 flex w-full flex-col">
          <div className="flex flex-col lg:flex-row">
            <h1 className="w-full text-3xl font-semibold text-portal-primaryMainAdmin lg:w-fit">
              {isAddNew
                ? t('addNewProperty')
                : `${t('EcomTicketManagementInforPageSearchBarPropertyId')} #${
                    listingDetail?.listingId
                  }`}
            </h1>
            {listingDetail?.id && renderStatusListing(listingDetail?.status)}
          </div>

          {listingDetail?.lastRejectedLog && (
            <div className="flex">
              <label className="text-[#FF3131]">{t('reason')}: </label>{' '}
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
            <div className="col-span-12 lg:col-span-4">
              <FormRadioAdmin
                disabled={listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true}
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
            <div className="col-span-12 lg:col-span-4">
              <FormRadioAdmin
                disabled={listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true}
                label={t('EcomPropertyListingDetailPagePropertyInformationPropertyStatus')}
                name="type"
                rules={[
                  {
                    required: true,
                    message: `${eForm('pleaseSelect')} ${t('EcomPropertyListingDetailPagePropertyInformationPropertyStatus')}`,
                  },
                ]}
                onChange={(value) => getListDataWhenSelectType(value?.target?.value)}
                options={listStatusProject.map((item) => ({
                  id: item.id,
                  name: comm(item.name),
                }))}
              />
            </div>

            <div className="col-span-12 lg:col-span-4">
              <FormRadioSelectPackage
                onChange={(value) => onChangepriotyListting(value?.target?.value)}
                disabled={listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true}
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
                options={listPackageListing.map((item) => ({
                  id: item.id,
                  name: comm(item.name),
                  numberOfPost: item?.numberOfPost,
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
                <SelectItemHaveIcon
                  disabled={
                    listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true
                  }
                  options={listProductType}
                />
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
                <MultiLanguageInput
                  maxLength={501}
                  disabled={
                    listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true
                  }
                />
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
                <MultiLanguageInput
                  maxLength={5001}
                  row={10}
                  disabled={
                    listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true
                  }
                />
              </Form.Item>
            </div>

            <div className="col-span-12">
              <FormFloatInput
                disabled={listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true}
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

            <div className="col-span-12 lg:col-span-4">
              <FormFloatSelect
                disabled={listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true}
                name={['location', 'province']}
                label={t('EcomPropertyListingDetailPageLocationCityProvince')}
                required
                showSearch={true}
                onChange={(value) => handleChangeValueFilter('city', value)}
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
            <div className="col-span-12 lg:col-span-4">
              <FormFloatSelect
                disabled={listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true}
                name={['location', 'district']}
                label={t('EcomPropertyListingDetailPageLocationDistrict')}
                required
                onChange={(value) => handleChangeValueFilter('district', value)}
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
            <div className="col-span-12 lg:col-span-4">
              <FormFloatSelect
                disabled={listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true}
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
                disabled={listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true}
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
                  getLatAndLng={(lat, lng, draggable) =>
                    listingDetail?.status == PropertyStatus.Draft || isAddNew
                      ? getLocation(lat, lng, draggable)
                      : undefined
                  }
                ></GoogleMapComponent>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4">
              <FormRadioAdmin
                disabled={listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true}
                label={t('EcomPropertyListingDetailPagePropertyInformationBeds')}
                name="bedrooms"
                options={beds.map((item) => ({
                  id: item,
                  name: item < 5 ? item.toString() : '>4',
                }))}
              />
            </div>
            <div className="col-span-12 lg:col-span-4">
              <FormRadioAdmin
                disabled={listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true}
                label={t('EcomPropertyListingDetailPagePropertyInformationBaths')}
                name="bathrooms"
                options={baths.map((item) => ({
                  id: item,
                  name: item < 5 ? item.toString() : '>4',
                }))}
              />
            </div>
            <div className="col-span-12 lg:col-span-4">
              <FormFloatNumber
                maxNum={10000}
                name="size"
                disabled={listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true}
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
                <div className="col-span-12 lg:col-span-6">
                  <FormRadioAdmin
                    disabled={
                      listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true
                    }
                    label={t('EcomPropertyListingDetailPagePropertyInformationLegalStatus')}
                    name="legalStatus"
                    options={legalStatuses.map((item) => ({
                      id: item.id,
                      name: t(item.name),
                    }))}
                  />
                </div>
                <div className="col-span-12 lg:col-span-6">
                  <FormRadioAdmin
                    disabled={
                      listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true
                    }
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
                <div className="col-span-12 lg:col-span-6">
                  <FormRadioAdmin
                    disabled={
                      listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true
                    }
                    label={t('EcomPropertyListingDetailPagePropertyInformationLeaseTerm')}
                    name="leaseTerm"
                    options={listingRentLeaseTerm.map((item) => ({
                      id: item.id,
                      name: comm(item.name),
                    }))}
                  />
                </div>
                <div className="col-span-12 lg:col-span-6">
                  <FormRadioAdmin
                    disabled={
                      listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true
                    }
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
                disabled={listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true}
                label={t('EcomPropertyListingDetailPagePropertyInformationGeneralFurniture')}
                name="interiorId"
                options={listInterior.map((item) => ({
                  id: item?.id,
                  name: item?.interiorName,
                }))}
              />
            </div>
            <div className="col-span-12">
              <FormSelectChip
                disabled={listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true}
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
                  disabled={
                    listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true
                  }
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
                disabled={listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true}
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
            <div className="col-span-12 lg:col-span-6">
              <FormFloatSelect
                disabled={listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true}
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

            <div className="col-span-12 lg:col-span-6">
              <FormFloatInput
                disabled={listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true}
                rules={[{ max: 250, message: `${eForm('maxlength')} 250` }]}
                name="blockTower"
                label={t('EcomPropertyListingDetailPagePropertyInformationBlock')}
              />
            </div>
            <div className="col-span-12 lg:col-span-6">
              <FormFloatInput
                rules={[{ max: 250, message: `${eForm('maxlength')} 250` }]}
                disabled={listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true}
                name="floor"
                label={t('EcomPropertyListingDetailPagePropertyInformationFloor')}
              />
            </div>
            <div className="col-span-12 lg:col-span-6">
              <FormFloatSelect
                onKeyDown={onCheckKeyEnter}
                disabled={listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true}
                rules={[
                  {
                    required: true,
                    message: `${eForm('pleaseSelect')} ${t('EcomPageListingDetailOtherUnitCode')}`,
                  },
                ]}
                label={t('EcomPageListingDetailOtherUnitCode')}
                name="unitId"
                showSearch
                onSearch={(keyword) => {
                  setUnitCodeTemp(keyword);
                  // getListUnit(listingForm.getFieldValue('projectId'), keyword, false);
                }}
                filterOption={true}
                options={listUnit?.map((x) => ({
                  value: x.id,
                  label: x.unitNo,
                  id: x.id,
                  disabled: x?.status ? (x?.status === statusItem.INACTIVE ? true : false) : false,
                }))}
              />
            </div>
            <div className="hidden lg:col-span-6"></div>
            <div className="col-span-12 lg:col-span-6">
              <Form.Item name="isShowUnitCode" valuePropName="checked" className="mt-[-20px]">
                <Checkbox
                  disabled={
                    listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true
                  }
                  type="checkbox"
                >
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
                <div className="col-span-12 lg:col-span-6">
                  <FormFloatNumber
                    disabled={
                      listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true
                    }
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
                <div className="col-span-12 lg:col-span-6">
                  <div className="flex justify-between">
                    <label>
                      {t('EcomPropertyListingDetailPagePriceExpectedPublishingDate')}{' '}
                      <span className="text-[14px] text-danger"> *</span>
                    </label>

                    <Popover
                      overlayStyle={{
                        width: '400px',
                        fontWeight: 400,
                      }}
                      content={t('contentNoteMarkListingCreate')}
                    >
                      <label>{noteMarkIcon}</label>
                    </Popover>
                  </div>
                  <FormFloatDate
                    disabled={
                      listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true
                    }
                    showTime
                    format="DD/MM/YYYY HH:mm"
                    disabledDate={disabledDate}
                    name="expectedPublishingDate"
                    minuteStep={15}
                    onChange={(values) => {
                      if (values < dayjs()) {
                        listingForm.setFieldValue('expectedPublishingDate', null);

                        notify('error', errorNoti('khongChoChonBeHonHienTai'));
                      }

                      listingForm.setFieldValue('dateAutoPush', undefined);
                    }}
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
                    <Form.Item name="isAutoPush" valuePropName="checked" className="mt-[-20px]">
                      <Checkbox
                        disabled={
                          listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true
                        }
                        type="checkbox"
                        onChange={(value) => handleBlockPush(value.target.checked)}
                      >
                        {t('EcomPropertyListingDetailPagePropertyisAutoPush')}
                      </Checkbox>
                    </Form.Item>
                  </div>
                )}
                {isPlantinum && (
                  <div className="col-span-12 lg:col-span-6">
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
                      showTime
                      format="DD/MM/YYYY HH:mm"
                      disabled={
                        (listingDetail?.status == PropertyStatus.Draft || isAddNew) && unBlockPush
                          ? false
                          : true
                      }
                      disabledDate={disabledDate}
                      onChange={checkDateAutoPush}
                      name="dateAutoPush"
                      rules={[
                        {
                          required: unBlockPush ? true : false,
                          message: `${eForm('pleaseSelect')} ${t('noteSelectAutoPush')}`,
                        },
                      ]}
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="col-span-12 lg:col-span-6">
                  <FormFloatNumber
                    disabled={
                      listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true
                    }
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
                <div className="col-span-12 lg:col-span-6">
                  <div className="flex justify-between">
                    <label>
                      {t('EcomPropertyListingDetailPagePriceExpectedPublishingDate')}{' '}
                      <span className="text-[14px] text-danger"> *</span>
                    </label>

                    <Popover
                      overlayStyle={{
                        width: '400px',
                        fontWeight: 400,
                      }}
                      content={t('contentNoteMarkListingCreate')}
                    >
                      <label>{noteMarkIcon}</label>
                    </Popover>
                  </div>
                  <FormFloatDate
                    disabled={
                      listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true
                    }
                    showTime
                    format="DD/MM/YYYY HH:mm"
                    disabledDate={disabledDate}
                    name="expectedPublishingDate"
                    minuteStep={15}
                    onChange={() => {
                      listingForm.setFieldValue('dateAutoPush', undefined);
                    }}
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
                <div className="col-span-12 lg:col-span-6">
                  <Form.Item
                    name="isIncludeManagementFee"
                    valuePropName="checked"
                    className="mt-[-20px]"
                  >
                    <Checkbox
                      disabled={
                        listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true
                      }
                      type="checkbox"
                    >
                      {t('EcomPropertyListingDetailPagePropertyInformationIncludeManagementFee')}
                    </Checkbox>
                  </Form.Item>
                </div>
                {isPlantinum && (
                  <div className="col-span-12 lg:col-span-6">
                    <Form.Item name="isAutoPush" valuePropName="checked" className="mt-[-20px]">
                      <Checkbox
                        disabled={
                          listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true
                        }
                        type="checkbox"
                        onChange={(value) => handleBlockPush(value.target.checked)}
                      >
                        {t('EcomPropertyListingDetailPagePropertyisAutoPush')}
                      </Checkbox>
                    </Form.Item>
                  </div>
                )}
                <div className="col-span-12 lg:col-span-6">
                  <FormFloatNumber
                    disabled={
                      listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true
                    }
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
                  <div className="col-span-12 lg:col-span-6">
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
                      showTime
                      format="DD/MM/YYYY HH:mm"
                      disabled={
                        (listingDetail?.status == PropertyStatus.Draft || isAddNew) && unBlockPush
                          ? false
                          : true
                      }
                      disabledDate={disabledDate}
                      onChange={checkDateAutoPush}
                      name="dateAutoPush"
                      rules={[
                        {
                          required: unBlockPush ? true : false,
                          message: `${eForm('pleaseSelect')} ${t('noteSelectAutoPush')}`,
                        },
                      ]}
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
            <div className="col-span-12" id="imageIds">
              <Form.Item
                name="imageIds"
                rules={[
                  {
                    required: !isAddNew
                      ? countGalleryImages > 0
                        ? false
                        : true
                      : listingDetail?.images?.length > 1
                        ? false
                        : true,
                    message: `${eForm('pleaseSelect')} ${t(
                      'EcomPropertyListingDetailPageGalleryVideosGallery',
                    )}`,
                  },
                ]}
              >
                <UploadGalleryRealTime
                  disabled={
                    listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true
                  }
                  maxFile={numberImageUpload}
                  multiple={true}
                  noteBeforeUpload={t('maxNumberFile', { number: numberImageUpload })}
                  required
                  initImages={listingDetail?.imageUrls}
                  title={t('EcomPropertyListingDetailPageGalleryVideosGallery')}
                  uploadButtonLabel={comm('uploadFiles')}
                  onChange={async (fileAfterUpload, idRemove, isActionDelete) =>
                    onUploadGallery(fileAfterUpload, idRemove, isActionDelete)
                  }
                ></UploadGalleryRealTime>
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
                disabled={listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true}
                name="inDoorAmenities"
                amenityEnum={amenityType.In}
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
                amenityEnum={amenityType.Out}
                disabled={listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true}
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
              <FormTagInputShap
                name="nearBy"
                disabled={listingDetail?.status == PropertyStatus.Draft || isAddNew ? false : true}
              />
            </div>
          </div>
        </Form>
      </div>

      <PreviewListingModal
        isVisible={isShowPreview}
        closeModal={closePreview}
        dataShowPreview={dataShowPreview}
        locale={locale}
        handleOke={handleOkePreview}
      />

      <ModalAcctionListtingExpired
        closeModal={() => setIsShowNotiExpired(false)}
        open={isShowNotiExpired}
        onRepostWithoutRepost={(isChange) => handleListingExpired(isChange)}
      />

      <ModalReplyDeal
        property={listingDetail}
        open={isShowPopupReplyDeal}
        closeModal={() => setIsShowPopupReplyDeal(false)}
      />
    </WrapPageScroll>
  ) : (
    <WaringPermission />
  );
};

export default ListingDetailPageClient;
