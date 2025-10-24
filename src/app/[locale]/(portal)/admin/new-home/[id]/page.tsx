'use client';
import apiMasterDataService from '@/apiServices/externalApiServices/apiMasterDataService';
import newHomeApiService from '@/apiServices/externalApiServices/apiNewHomeService';
import locationApiService from '@/apiServices/externalApiServices/locationApiService';
import propertyApiService from '@/apiServices/externalApiServices/propertyApiService';
import ButtonBack from '@/components/Button/ButtonBack/ButtonBack';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import FormSelectIcon from '@/components/FormInput/FormSelectIcon';
import MultiLanguageInput from '@/components/FormInput/MultiLanguageInput';
import MultiLanguageInputFormList from '@/components/FormInput/MultiLanguageInputFormList/MultiLanguageInputFormList';
import MultiLanguageSyncFusion from '@/components/FormInput/MultiLanguageSyncFusion';
import FormFloatNumber from '@/components/FormInput/formNumber';
import FormFloatSelect from '@/components/FormInput/formSelect/Index';
import GoogleMapComponent from '@/components/GoogleMap';
import UploadGalleryRealTimeNewHome from '@/components/UploadGallery/UploadGalleryRealTimeNewHome';
import UploadImageRealtimeWithModule from '@/components/UploadGallery/UploadImageRealtimeWithModule';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import WrapPageScroll from '@/components/WrapPageScoll';
import useKeywordBanned from '@/hooks/useKeywordBaned';
import useProvince from '@/hooks/useProvince';
import {
  amenityType,
  appPermissions,
  listingType,
  moduleUploadFile,
  roleAdminGod,
} from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import {
  checkMultiLanguageMaxLength,
  checkMultiLanguageRequired,
  checkPermissonAcion,
  checkTextMultiLanguageInBlackListForForm,
} from '@/libs/helper';
import useGlobalStore from '@/stores/useGlobalStore';
import { Button, Col, Input, Row, Switch } from 'antd';
import Form from 'antd/es/form';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import React, { useEffect, useState, useTransition } from 'react';
import { TypeOptions, toast } from 'react-toastify';

const NewHomeDetailPage = ({ params }: { params: { id: string } }) => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);

  const [projectInfoForm] = Form.useForm();
  const { keyword } = useKeywordBanned();
  const { userInfo } = useGlobalStore();
  const idAddNew = params.id === 'add-new' ? true : false;
  const { push } = useRouter();
  const t = useTranslations('webLabel');
  const eForm = useTranslations('error');
  const comm = useTranslations('Common');
  const success = useTranslations('successNotifi');
  const errorNoti = useTranslations('errorNotifi');
  const [amenitiesOut, setAmenitiesOut] = useState<any>([] as any);
  const [newHomeDetail, setNewHomeDetail] = useState<any>(undefined);
  const [listIdImageDelete, setListIdImageDelete] = useState<string[]>([]);
  const { listProvince } = useProvince();
  const [listDistrict, setListDistrict] = useState<any[]>([]);
  const [listWard, setListWard] = useState<any[]>([]);
  const [propertyTypesSale, setpropertyTypesSaleale] = useState<any[]>([]);
  const [listLocationSuggest, setListLocationSuggest] = useState<any[]>([]);
  const [coordinate, setCoordinate] = useState({
    lat: 10.7340344,
    lng: 106.7215787,
  }); // default HCM quan 7
  const [isPending, startTransition] = useTransition();
  const isAddNew = params.id === 'add-new' ? true : false;
  const [countGalleryImages, setCountGalleryImages] = useState<number>(0);

  useEffect(() => {
    getDetail();
    getPropertyAmenitiesOut();
    getpropertyTypesSale();
  }, []);
  const [listFileAfterUpload, setListFileAfterUpload] = useState<any[]>([]);
  const getPropertyAmenitiesOut = async () => {
    const amenities = await propertyApiService.getPropertyAmenitiesFilter({
      type: amenityType.Out,
    });

    setAmenitiesOut(amenities.data);
  };

  const getpropertyTypesSale = async () => {
    const res = await propertyApiService.getPropertyTypes({ type: listingType.sale });
    setpropertyTypesSaleale(res.data);
  };

  const getDetail = async () => {
    if (!idAddNew) {
      const newHomeDetail: any = await newHomeApiService.getById(params.id);

      onChangePlace(newHomeDetail?.location?.placeId);
      setNewHomeDetail(newHomeDetail);
      getInfoLocation(newHomeDetail?.location);
      projectInfoForm.setFieldsValue({
        ...newHomeDetail,
      });
      setCountGalleryImages(newHomeDetail?.imageUrls?.length);
    } else {
      await projectInfoForm.resetFields();
      setListFileAfterUpload([]);
      setListIdImageDelete([]);
      projectInfoForm.setFieldValue('status', 1); //init Status 1 = active
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

  const getListWard = async (districId: string) => {
    let dataWard = await apiMasterDataService.getWards(districId);
    setListWard(dataWard);
  };

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
  const onUploadLogo = (images, listIdRemove, isDeleteFileBeforUpdate) => {
    projectInfoForm.setFieldValue('thumbnailId', images[0]?.id);
  };
  const getListDistric = async (provinceId: string) => {
    let dataDistrict = await apiMasterDataService.getDistrictV2(provinceId);

    setListDistrict(dataDistrict);
  };

  const onUploadGallery = (fileAfterUpload: any[], idDelete?: string, isActionDelete?: boolean) => {
    if (isActionDelete) {
      const filesAfterRemove = listFileAfterUpload.filter((item) => item.id !== idDelete);
      setListFileAfterUpload([...filesAfterRemove]);
      projectInfoForm.setFieldValue('imageIds', [...filesAfterRemove]);
      setListIdImageDelete([...listIdImageDelete, idDelete]);
      const newCount = countGalleryImages + 1;
      if (newCount < 1) {
        projectInfoForm.setFieldValue('imageIds', []);
      }
      setCountGalleryImages(newCount);
    } else {
      projectInfoForm.setFieldValue('imageIds', [...listFileAfterUpload, ...fileAfterUpload]);

      setListFileAfterUpload([...listFileAfterUpload, ...fileAfterUpload]);
      const newCount = [...listFileAfterUpload, ...fileAfterUpload].length;
      setCountGalleryImages(newCount);
    }
  };
  const onUploadListImage = (images, idRemove, isDeleteFileBeforUpdate, fieldName) => {
    let listDataImage = projectInfoForm.getFieldValue('layouts');

    const index = fieldName[0];

    // xoá ảnh
    if (idRemove) {
      listDataImage[index].imageIds = listDataImage[index].imageIds
        .filter((item) => item?.id !== idRemove)
        .map((item) => item?.id);

      listDataImage[index].imageIdsDelete = [
        ...(listDataImage[index]?.imageIdsDelete ?? []),
        idRemove,
      ];
    }
    //thêm ảnh
    else {
      listDataImage[index].imageIds = [
        ...(listDataImage[index]?.listImage ?? []),
        ...images.map((item) => item?.id),
      ];
    }

    projectInfoForm.setFieldValue('layouts', listDataImage);
  };

  const onSave = debounce(async () => {
    await projectInfoForm.validateFields();
    const values = projectInfoForm.getFieldsValue();

    if (idAddNew) {
      const body = {
        ...values,
        imageIds: listFileAfterUpload.map((item) => item?.id),
      };
      startTransition(async () => {
        try {
          await newHomeApiService.create(body);
          notify('success', success('createAPI'));
          push(`/admin/new-home`);
        } catch (e) {
          notify('error', e.response?.data?.message);
        }
      });
    } else {
      const body = {
        ...newHomeDetail,
        ...values,
        imageIds: listFileAfterUpload.map((item) => item?.id),
        id: params.id,
        imageIdsDelete: listIdImageDelete,
      };
      startTransition(async () => {
        try {
          await newHomeApiService.update(body);
          notify('success', success('updateAPI'));
          push(`/admin/new-home`);
        } catch (e) {
          notify('error', e.response?.data?.message);
        }
      });
    }
  });

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
      projectInfoForm.setFieldsValue({
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

  const handleChangeValueFilter = async (key: string, value: string) => {
    if (key == 'city') {
      let dataDistrict = await apiMasterDataService.getDistrictV2(value);

      setListDistrict(dataDistrict);
      projectInfoForm.setFieldValue(['location', 'district'], undefined);
      projectInfoForm.setFieldValue(['location', 'ward'], undefined);
    }
    if (key == 'district') {
      let dataWard = await apiMasterDataService.getWards(value);
      setListWard(dataWard);
      projectInfoForm.setFieldValue(['location', 'ward'], undefined);
    }
  };

  const renderAction = () => {
    return (
      <div className="flex justify-end">
        <ButtonBack text={t('goBack')} onClick={() => push(`/admin/new-home`)} />
        {checkPermissonAcion(userInfo?.accesses, [
          roleAdminGod,
          appPermissions.newHomes.update,
          appPermissions.newHomes.insert,
        ]) && (
          <ButtonPrimary
            isLoading={isPending}
            text={t('save')}
            onClick={onSave}
            className="ml-1 rounded-full px-6"
          />
        )}
      </div>
    );
  };

  return userInfo?.type === UserTypeConstant.Salesman &&
    checkPermissonAcion(userInfo?.accesses, [
      roleAdminGod,
      appPermissions.newHomes.view,
      appPermissions.newHomes.insert,
      appPermissions.newHomes.update,
    ]) ? (
    <WrapPageScroll renderActions={renderAction}>
      <div className="p-6">
        <div className="mb-3 flex w-full justify-between">
          <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
            {idAddNew
              ? t('EcomProjectManagementPageNewHomeInfo')
              : t('EcomProjectManagementPageNewHomeInfo')}
          </h1>
        </div>

        <Form form={projectInfoForm} layout="vertical" size="middle">
          <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
            <div className="col-span-12 py-2">
              <label className="text-base font-bold text-portal-primaryMainAdmin">
                {t('EcomProjectManagementPageNewHomeInfo')}
              </label>
            </div>
            <div className="col-span-6">
              <label>{t('EcomProjectManagementPageNewHomeTitle')}</label>
              <span className="text-[14px] text-danger"> *</span>
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
                        `${eForm('pleaseInput')} ${t('EcomProjectManagementPageNewHomeTitle')}`,
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
                <MultiLanguageInput maxLength={501} />
              </Form.Item>
            </div>
            <div className="col-span-6">
              <label>{t('EcomProjectManagementPageNewHomeInvestor')}</label>
              <Form.Item
                name="investor"
                label=""
                rules={[
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
                <MultiLanguageInput maxLength={501} />
              </Form.Item>
            </div>
            <div className="col-span-4">
              <FormFloatNumber
                maxNum={99999999999}
                label={t('EcomProjectManagementPageNewHomeOriginalPrice')}
                name="originalPrice"
              />
            </div>
            <div className="col-span-4">
              <FormFloatNumber
                maxNum={99999999999}
                label={t('EcomProjectManagementPageNewHomePromotionPrice')}
                name="promotionPrice"
              />
            </div>
            <div className="col-span-4">
              <FormFloatSelect
                label={t('EcomProjectManagementPageNewHomeType')}
                name="typeIds"
                multiSelect
                options={propertyTypesSale?.map((x) => ({
                  value: x.id,
                  label: x.name,
                  id: x.id,
                }))}
              />
            </div>
            <div className="col-span-12">
              <label>{t('EcomProjectManagementPageNewHomePromotionDescription')}</label>
              <Form.Item
                name="promotionDescription"
                label=""
                rules={[
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
                <MultiLanguageSyncFusion />
              </Form.Item>
            </div>
            <div className="col-span-12">
              <label>{t('EcomProjectManagementPageNewHomeHighlight')}</label>
              <Form.Item
                name="highlight"
                label=""
                rules={[
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
                <MultiLanguageSyncFusion />
              </Form.Item>
            </div>
            <div className="col-span-12">
              <Form.Item
                name="isActive"
                label={t('EcomTicketManagementInforPageSearchBarStatus')}
                valuePropName="checked"
              >
                <Switch className="mr-2 bg-[#b0b2b8]" />
              </Form.Item>
            </div>
            <div className="col-span-12 py-2">
              <label className="py-2 text-base font-bold text-portal-primaryMainAdmin">
                {t('EcomProjectManagementPageNewHomeThumNail')}
              </label>
            </div>
            <div className="col-span-12">
              <Form.Item name="thumbnailId">
                <UploadImageRealtimeWithModule
                  maxFile={1}
                  multiple={true}
                  noteBeforeUpload={t('maxNumberFile', { number: 1 })}
                  required
                  initImages={newHomeDetail ? [newHomeDetail?.thumbnail] : null}
                  title={t('EcomPropertyListingDetailPageGalleryVideosFeaturedImage(1image)')}
                  uploadButtonLabel={comm('uploadFiles')}
                  onChange={async (images, listIdRemove, isDeleteFileBeforUpdate) =>
                    onUploadLogo(images, listIdRemove, isDeleteFileBeforUpdate)
                  }
                  moduleId={moduleUploadFile.NEW_HOME}
                />
              </Form.Item>
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
                      : newHomeDetail?.images?.length > 1
                        ? false
                        : true,
                    message: `${eForm('pleaseSelect')} ${t(
                      'EcomPropertyListingDetailPageGalleryVideosGallery',
                    )}`,
                  },
                ]}
              >
                <UploadGalleryRealTimeNewHome
                  maxFile={10}
                  multiple={true}
                  noteBeforeUpload={t('maxNumberFile', { number: 10 })}
                  required
                  initImages={newHomeDetail?.imageUrls}
                  title={t('EcomPropertyListingDetailPageGalleryVideosGallery')}
                  uploadButtonLabel={comm('uploadFiles')}
                  onChange={async (fileAfterUpload, idRemove, isActionDelete) =>
                    onUploadGallery(fileAfterUpload, idRemove, isActionDelete)
                  }
                ></UploadGalleryRealTimeNewHome>
              </Form.Item>
            </div>

            <div className="col-span-12 mb-4 rounded-xl border border-gray-300 p-2">
              <label className="py-2 text-base font-bold text-portal-primaryMainAdmin">
                {t('EcomProjectManagementPageNewHomeLDesignLayouts')}
              </label>
              <Form.List name="layouts" initialValue={[{}]}>
                {(fields, { add, remove }) => (
                  <Row gutter={[16, 4]}>
                    {fields.map(({ key, name, ...restField }) => (
                      <Col key={key} span={24}>
                        <Row gutter={[4, 4]} className="flex items-end">
                          <Col sm={{ span: 11, offset: 0 }}>
                            <label>{t('LayoutArea')}</label>
                            <span className="text-[14px] text-danger"> *</span>
                            <Form.Item
                              name={[name, 'area']}
                              label=""
                              rules={[
                                {
                                  required: true,
                                  validator: (rule, value) =>
                                    checkMultiLanguageRequired(
                                      rule,
                                      value,
                                      `${eForm('pleaseInput')} ${t('LayoutArea')}`,
                                    ),
                                },
                                {
                                  max: 500,
                                  validator: (rule, value) =>
                                    checkMultiLanguageMaxLength(
                                      rule,
                                      value,
                                      `${eForm('maxlength')} 500`,
                                    ),
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
                              <MultiLanguageInputFormList maxLength={501} />
                            </Form.Item>
                          </Col>
                          <Col sm={{ span: 11, offset: 0 }}>
                            <label>{t('LayoutName')}</label>
                            <span className="text-[14px] text-danger"> *</span>
                            <Form.Item
                              name={[name, 'name']}
                              label=""
                              rules={[
                                {
                                  required: true,
                                  validator: (rule, value) =>
                                    checkMultiLanguageRequired(
                                      rule,
                                      value,
                                      `${eForm('pleaseInput')} ${t('LayoutName')}`,
                                    ),
                                },
                                {
                                  max: 500,
                                  validator: (rule, value) =>
                                    checkMultiLanguageMaxLength(
                                      rule,
                                      value,
                                      `${eForm('maxlength')} 500`,
                                    ),
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
                              <MultiLanguageInputFormList maxLength={501} />
                            </Form.Item>
                          </Col>

                          <Col span={2}>
                            <Form.Item label={' '}>
                              <Button
                                className="w-full bg-gray-200"
                                size="middle"
                                onClick={() => {
                                  remove(name);
                                }}
                              >
                                {comm('REMOVE')}
                              </Button>
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item name={[name, 'imageIds']}>
                              <UploadImageRealtimeWithModule
                                maxFile={10}
                                multiple={true}
                                noteBeforeUpload={t('maxNumberFile', { number: 10 })}
                                required
                                initImages={newHomeDetail?.layouts[name]?.files}
                                title={t('EcomPropertyListingDetailPageGalleryNewHome')}
                                uploadButtonLabel={comm('uploadFiles')}
                                onChange={async (images, listIdRemove, isDeleteFileBeforUpdate) =>
                                  onUploadListImage(images, listIdRemove, isDeleteFileBeforUpdate, [
                                    name,
                                    'imageIds',
                                  ])
                                }
                                moduleId={moduleUploadFile.NEW_HOME}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                    ))}
                    <Col sm={{ span: 24, offset: 0 }}>
                      <Button
                        className="w-full"
                        size="middle"
                        type="primary"
                        onClick={() => {
                          add();
                        }}
                      >
                        {comm('ADD_NEW_LAYOUT')}
                      </Button>
                    </Col>
                  </Row>
                )}
              </Form.List>
            </div>
            <div className="col-span-12 py-2">
              <label className="text-base font-bold text-portal-primaryMainAdmin">
                {t('EcomProjectManagementPageNewHomeINFORMATION')}
              </label>
            </div>
            <div className="col-span-4">
              <label>{t('EcomProjectManagementPageNewHomeOwnershipType')}</label>
              <Form.Item
                name="ownershipType"
                label=""
                rules={[
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
                <MultiLanguageInput maxLength={501} />
              </Form.Item>
            </div>
            <div className="col-span-4">
              <label>{t('EcomProjectManagementPageNewHomeUnitArea')}</label>
              <Form.Item
                name="unitArea"
                label=""
                rules={[
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
                <MultiLanguageInput maxLength={501} />
              </Form.Item>
            </div>

            <div className="col-span-4">
              <label>{t('EcomProjectManagementPageNewHomeConstructionDensity')}</label>
              <Form.Item
                name="constructionDensity"
                label=""
                rules={[
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
                <MultiLanguageInput maxLength={501} />
              </Form.Item>
            </div>
            <div className="col-span-4">
              <label>{t('EcomProjectManagementPageNewHomeDevelopmentScale')}</label>
              <Form.Item
                name="developmentScale"
                label=""
                rules={[
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
                <MultiLanguageInput maxLength={501} />
              </Form.Item>
            </div>
            <div className="col-span-4">
              <label>{t('EcomProjectManagementPageNewHomeConstructionStartDate')}</label>
              <Form.Item
                name="constructionStartDate"
                label=""
                rules={[
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
                <MultiLanguageInput maxLength={501} />
              </Form.Item>
            </div>

            <div className="col-span-12 lg:col-span-4">
              <label>{t('EcomPropertyListingDetailPageProgress')}</label>
              <Form.Item
                name="progress"
                label=""
                rules={[
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
                <MultiLanguageInput maxLength={501} />
              </Form.Item>
            </div>
            <div className="col-span-4">
              <FormFloatNumber
                label={t('EcomProjectManagementPageNewHomeFromPrice')}
                name="fromPrice"
              />
            </div>

            <div className="col-span-4">
              <FormFloatNumber
                label={t('EcomProjectManagementPageNewHomeToPrice')}
                name="toPrice"
              />
            </div>
            <div className="col-span-12">
              <Form.Item name="brochureUrl" label={t('EcomPropertyListingDetailPageBrochureUrl')}>
                <Input maxLength={501} />
              </Form.Item>
            </div>
            <div className="col-span-12">
              <div className="mb-2">
                {t('EcomTicketManagementDetailPageDetailOutdoorAmenities')}
              </div>
              <FormSelectIcon
                amenityEnum={amenityType.Out}
                name="amenitiesIds"
                options={amenitiesOut?.map((p) => ({
                  name: p.name,
                  value: p.id,
                  imageUrl: p.imageUrl,
                }))}
              />
            </div>

            <div className="col-span-12 mt-2 py-2">
              <label className="text-base font-bold text-portal-primaryMainAdmin">
                {t('EcomTicketManagementDetailPageDetailLocation')}
              </label>
            </div>
            <div className="col-span-12">
              <label>{t('EcomProjectManagementPageNewHomeLocationDescription')}</label>
              <Form.Item
                name="locationDescription"
                label=""
                rules={[
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
                <MultiLanguageSyncFusion />
              </Form.Item>
            </div>
            <div className="col-span-12">
              <FormFloatSelect
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
            <div className="col-span-12 lg:col-span-4">
              <FormFloatSelect
                name={['location', 'province']}
                label={t('EcomPropertyListingDetailPageLocationCityProvince')}
                required
                showSearch={true}
                onChange={(value) => handleChangeValueFilter('city', value)}
                options={listProvince.map((province) => ({
                  value: province.provinceID,
                  label: province.listProvinceName,
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
              <div className="col-span-full mb-5 h-96 w-full">
                <GoogleMapComponent
                  isMarker={true}
                  initCenter={coordinate}
                  listMarker={[coordinate]}
                  getLatAndLng={(lat, lng, draggable) =>
                    !params.id ? getLocation(lat, lng, draggable) : undefined
                  }
                ></GoogleMapComponent>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </WrapPageScroll>
  ) : (
    <WaringPermission />
  );
};

export default NewHomeDetailPage;
