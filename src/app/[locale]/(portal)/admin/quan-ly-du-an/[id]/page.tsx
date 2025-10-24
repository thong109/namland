'use client';
import apiMasterDataService from '@/apiServices/externalApiServices/apiMasterDataService';
import projectApiInAdmin from '@/apiServices/externalApiServices/apiProjectInAdmin';
import locationApiService from '@/apiServices/externalApiServices/locationApiService';
import propertyApiService from '@/apiServices/externalApiServices/propertyApiService';
import ButtonBack from '@/components/Button/ButtonBack/ButtonBack';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import FormSelectIcon from '@/components/FormInput/FormSelectIcon';
import FormTagInputShap from '@/components/FormInput/FormTagInput';
import MultiLanguageInput from '@/components/FormInput/MultiLanguageInput';
import FormFloatDate from '@/components/FormInput/formDatePicker';
import FormFloatInput from '@/components/FormInput/formInput';
import FormFloatNumber from '@/components/FormInput/formNumber';
import FormFloatSelect from '@/components/FormInput/formSelect/Index';
import GoogleMapComponent from '@/components/GoogleMap';
import UploadImageProjectRealTime from '@/components/UploadGallery/UploadImageProjectRealTime';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import WrapPageScroll from '@/components/WrapPageScoll';
import useKeywordBanned from '@/hooks/useKeywordBaned';
import useProvince from '@/hooks/useProvince';
import { amenityType, appPermissions, listingType, roleAdminGod } from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import {
  checkMultiLanguageMaxLength,
  checkPermissonAcion,
  checkTextMultiLanguageInBlackListForForm,
} from '@/libs/helper';
import useGlobalStore from '@/stores/useGlobalStore';
import { Switch, Tabs } from 'antd';
import Form from 'antd/es/form';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import React, { useEffect, useState, useTransition } from 'react';
import { TypeOptions, toast } from 'react-toastify';

const tabKeys = {
  tabOverView: 'TAB_OVER_VIEW',
};
const { TabPane } = Tabs;

const ProjectDetailPage = ({ params }: { params: { id: string } }) => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);

  const [isPending, startTransition] = useTransition();

  const [projectInfoForm] = Form.useForm();

  const { keyword } = useKeywordBanned();
  const { userInfo } = useGlobalStore();
  const isAddNew = params.id === 'add-new' ? true : false;
  const { push } = useRouter();
  const t = useTranslations('webLabel');
  const success = useTranslations('successNotifi');
  const errorNoti = useTranslations('errorNotifi');
  const eForm = useTranslations('error');
  const comm = useTranslations('Common');
  const [countGalleryImages, setCountGalleryImages] = useState<number>(0);

  const [coordinate, setCoordinate] = useState({
    lat: 10.7340344,
    lng: 106.7215787,
  });
  const { listProvince } = useProvince();
  const [listLocationSuggest, setListLocationSuggest] = useState<any[]>([]);

  const [selectedIndex, setSelectedIndex] = useState<string>(tabKeys.tabOverView);

  const [projectDetai, setProjectDetai] = useState<any>(undefined);

  const [listDistrict, setListDistrict] = useState<any[]>([]);
  const [listWard, setListWard] = useState<any[]>([]);
  const [propertyTypesSale, setpropertyTypesSaleale] = useState<any[]>([]);
  const [propertyTypesRent, setpropertyTypesRent] = useState<any[]>([]);
  const [amenitiesIn, setAmenitiesIn] = useState<any>([] as any);
  const [amenitiesOut, setAmenitiesOut] = useState<any>([] as any);
  const [logoId, setLogoId] = useState<string>(undefined);
  const [listIdImageDelete, setListIdImageDelete] = useState<string[]>([]);
  const [listFileAfterUpload, setListFileAfterUpload] = useState<any[]>([]);
  const [isAddLogo, setIsAddLogo] = useState<boolean>(false);
  const [logoProject, setLogoProject] = useState(undefined);

  useEffect(() => {
    getPropertyAmenitiesIn();
    getPropertyAmenitiesOut();
    getpropertyTypesSale();
    getpropertyTypesRent();
    getDetail();
  }, []);

  const getDetail = async () => {
    if (!isAddNew) {
      const projectDetai: any = await projectApiInAdmin.getById(params.id);

      setLogoProject([{ id: null, url: projectDetai.imageUrl }]);
      setListFileAfterUpload(projectDetai?.images);
      setProjectDetai(projectDetai);
      setCountGalleryImages(2);
      getInfoLocation(projectDetai?.location);
      await projectInfoForm.setFieldsValue({
        ...projectDetai,
      });
    } else {
      projectInfoForm.resetFields();
      projectInfoForm.setFieldValue('isActive', true);
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

  const onSave = async () => {
    await projectInfoForm.validateFields();

    const values = projectInfoForm.getFieldsValue();

    if (isAddNew) {
      startTransition(async () => {
        await projectApiInAdmin.createProjectV1({
          ...values,
          descriptions: values.descriptions.filter((item) => item.value?.length > 0),
          imageIds: listFileAfterUpload.map((item) => item?.id),
          imageLogoId: logoId,
        });
        notify('success', success('createAPI'));
        push(`/admin/quan-ly-du-an?tabActive=TAB_PROJECT`);
      });
    } else {
      startTransition(async () => {
        await projectApiInAdmin.updateProjectV1({
          ...projectDetai,
          ...values,
          descriptions: values.descriptions.filter((item) => item.value?.length > 0),
          id: params.id,
          imageIdsDelete: listIdImageDelete,
          imageIds: listFileAfterUpload.map((item) => item?.id),
          imageLogoId: logoId,
        });
        notify('success', success('updateAPI'));
        push(`/admin/quan-ly-du-an`);
      });
    }
  };

  const changTabSelect = (tabKey) => {
    setSelectedIndex(tabKey);
  };

  const getpropertyTypesSale = async () => {
    const res = await propertyApiService.getPropertyTypes({ type: listingType.sale });
    setpropertyTypesSaleale(res.data);
  };

  const getpropertyTypesRent = async () => {
    const res = await propertyApiService.getPropertyTypes({ type: listingType.rent });
    setpropertyTypesRent(res.data);
  };

  const getListDistric = async (provinceId: string) => {
    let dataDistrict = await apiMasterDataService.getDistrictV2(provinceId);

    setListDistrict(dataDistrict);
  };

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

  const onSearchGooleMap = debounce(async (keyword: string) => {
    if (keyword) {
      await locationApiService.getListLocation(keyword).then((x) => setListLocationSuggest(x.data));
    }
  }, 200);

  const onChangePlace = async (placeId: string) => {
    if (placeId) {
      const dataResult = await locationApiService.getLocationDetail(placeId);

      setCoordinate({
        lat: dataResult.data.geometry.location?.lat,
        lng: dataResult.data.geometry.location?.lng,
      });
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

  const onUploadLogo = (fileAfterUpload: any[], idDelete?: string, isActionDelete?: boolean) => {
    if (isActionDelete) {
      projectInfoForm.setFieldValue('imageLogoId', null);
      setLogoId(null);
      setIsAddLogo(true);
      setLogoProject(undefined);
    } else {
      projectInfoForm.setFieldValue('imageLogoId', fileAfterUpload[0]?.id);
      setLogoProject(fileAfterUpload);
      setLogoId(fileAfterUpload[0]?.id);
    }
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

  const renderAction = () => {
    return (
      <div className="flex justify-end">
        <ButtonBack
          text={t('goBack')}
          onClick={() => push(`/admin/quan-ly-du-an`)}
          isLoading={isPending}
        />
        {checkPermissonAcion(userInfo?.accesses, [
          roleAdminGod,
          appPermissions.portal_project.update,
          appPermissions.portal_project.insert,
          appPermissions.portal_project.admin,
        ]) && (
          <ButtonPrimary
            text={t('save')}
            onClick={onSave}
            className="ml-1 rounded-full px-6"
            isLoading={isPending}
          />
        )}
      </div>
    );
  };

  return userInfo?.type === UserTypeConstant.Salesman &&
    checkPermissonAcion(userInfo?.accesses, [
      roleAdminGod,
      appPermissions.portal_project.view,
      appPermissions.portal_project.admin,
    ]) ? (
    <WrapPageScroll renderActions={renderAction}>
      <div className="p-6">
        <div className="mb-3 flex w-full justify-between">
          <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
            {isAddNew
              ? t('EcomBannerManagementPageCreateProject')
              : t('EcomBannerManagementPageEditProject')}
          </h1>
        </div>

        <Tabs activeKey={selectedIndex} onTabClick={changTabSelect} type="card">
          <TabPane tab={t(tabKeys.tabOverView)} key={tabKeys.tabOverView}>
            <Form form={projectInfoForm} layout="vertical" size="middle">
              <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
                <div className="col-span-12 py-2">
                  <label className="text-base font-bold text-portal-primaryMainAdmin">
                    {t('EcomBannerManagementPageProjectInfo')}
                  </label>
                </div>

                <div className="col-span-4">
                  <FormFloatInput
                    required
                    rules={[
                      {
                        required: true,
                        message: `${eForm('pleaseInput')} ${t(
                          'EcomBannerManagementPageCreateProjectName',
                        )}`,
                      },
                      { max: 250, message: `${eForm('maxlength')} 250` },
                    ]}
                    label={t('EcomBannerManagementPageCreateProjectName')}
                    name="name"
                  />
                </div>
                <div className="col-span-4">
                  <FormFloatInput
                    rules={[
                      { max: 250, message: `${eForm('maxlength')} 250` },
                      {
                        required: true,
                        message: `${eForm('pleaseInput')} ${t(
                          'EcomBannerManagementPageCreateProjectCode',
                        )}`,
                      },
                    ]}
                    label={t('EcomBannerManagementPageCreateProjectCode')}
                    name="code"
                  />
                </div>
                <div className="col-span-4">
                  <FormFloatDate
                    label={t('EcomBannerManagementPageCreateYearBuited')}
                    name="yearBuited"
                  />
                </div>

                <div className="col-span-4">
                  <FormFloatInput
                    rules={[{ max: 250, message: `${eForm('maxlength')} 250` }]}
                    label={t('EcomBannerManagementPageCreateProjectOwner')}
                    name="owner"
                  />
                </div>
                <div className="col-span-4">
                  <FormFloatInput
                    rules={[{ max: 250, message: `${eForm('maxlength')} 250` }]}
                    label={t('EcomBannerManagementPageCreateProjecManagedBy')}
                    name="managedBy"
                  />
                </div>
                <div className="col-span-4">
                  <FormFloatNumber
                    showFormat={false}
                    maxNum={999999999}
                    label={t('EcomBannerManagementPageCreateProjectHandoverYear')}
                    name="handOverYear"
                  />
                </div>

                <div className="col-span-4">
                  <FormFloatNumber
                    maxNum={99999999}
                    label={t('EcomBannerManagementPageCreateProjectTotalArea')}
                    name="totalArea"
                  />
                </div>
                <div className="col-span-4">
                  <FormFloatNumber
                    maxNum={99999999}
                    label={t('EcomBannerManagementPageCreateProjectNumberOfUnit')}
                    name="numberOfUnit"
                  />
                </div>
                <div className="col-span-4">
                  <FormFloatNumber
                    maxNum={99999999}
                    label={t('EcomBannerManagementPageCreateProjectNumberOfFloor')}
                    name="numberOfFloor"
                  />
                </div>

                <div className="col-span-12">
                  <FormFloatSelect
                    label={t('EcomBannerManagementPageProductTypeSale')}
                    name="unitTypeSellIds"
                    multiSelect
                    filterOption={true}
                    options={propertyTypesSale?.map((x) => ({
                      value: x.id,
                      label: x.name,
                      id: x.id,
                    }))}
                  />
                </div>
                <div className="col-span-12">
                  <FormFloatSelect
                    label={t('EcomBannerManagementPageProductTypeRent')}
                    name="unitTypeRentIds"
                    multiSelect
                    filterOption={true}
                    options={propertyTypesRent?.map((x) => ({
                      value: x.id,
                      label: x.name,
                      id: x.id,
                    }))}
                  />
                </div>

                <div className="col-span-12">
                  <Form.Item
                    name="isActive"
                    label={t('EcomBannerManagementPageDetailIsActive')}
                    valuePropName="checked"
                  >
                    <Switch className="mr-2 bg-[#b0b2b8]" />
                  </Form.Item>
                </div>
                <div className="col-span-12">
                  <FormFloatInput
                    required
                    rules={[
                      {
                        required: true,
                        message: `${eForm('pleaseInput')} ${t(
                          'EcomBannerManagementPageCreateProjectAddress',
                        )}`,
                      },
                      { max: 250, message: `${eForm('maxlength')} 250` },
                    ]}
                    label={t('EcomBannerManagementPageCreateProjectAddress')}
                    name="address"
                  />
                </div>

                <div className="col-span-12">
                  <label>
                    {t('EcomPropertyListingDetailPageContactInformationPropertyDescription')}
                  </label>

                  <Form.Item
                    name="descriptions"
                    label=""
                    rules={[
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
                    <MultiLanguageInput row={5} maxLength={5001} />
                  </Form.Item>
                </div>
              </div>
              <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
                <div className="col-span-12 py-2">
                  <label className="text-base font-bold text-portal-primaryMainAdmin">
                    {t('EcomTicketManagementDetailPageDetailLocation')}
                  </label>
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
                  <FormFloatSelect
                    placeholder={t('EcomPropertyListingDetailPageLocationAddressPlaceholder')}
                    name={['location', 'placeId']}
                    label={t('EcomPropertyListingDetailPageLocationAddress')}
                    required
                    filterOption={false}
                    showSearch={true}
                    onChange={(value) => onChangePlace(value)}
                    onSearch={(value) => onSearchGooleMap(value)}
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
                      getLatAndLng={(lat, lng, draggable) => getLocation(lat, lng, draggable)}
                    ></GoogleMapComponent>
                  </div>
                </div>
              </div>

              <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
                <div className="col-span-12 py-2">
                  <label className="text-base font-bold text-portal-primaryMainAdmin">
                    {t('EcomTicketManagementDetailPageDetailRenderAndAttavhments')}
                  </label>
                </div>

                <div className="col-span-12">
                  <Form.Item
                    rules={[
                      {
                        required: logoId || logoProject ? false : true,
                        message: `${eForm('pleaseSelect')} ${t(
                          'EcomPropertyListingDetailPageGalleryVideosFeaturedImage(1image)',
                        )}`,
                      },
                    ]}
                    name="imageLogoId"
                  >
                    <UploadImageProjectRealTime
                      maxFile={1}
                      multiple={true}
                      noteBeforeUpload={t('maxNumberFile', { number: 1 })}
                      required
                      initImages={logoProject}
                      title={t('EcomPropertyListingDetailPageGalleryVideosFeaturedImage(1image)')}
                      uploadButtonLabel={comm('uploadFiles')}
                      onChange={async (images, listIdRemove, isDeleteFileBeforUpdate) =>
                        onUploadLogo(images, listIdRemove, isDeleteFileBeforUpdate)
                      }
                    ></UploadImageProjectRealTime>
                  </Form.Item>
                </div>
                <div className="col-span-12">
                  <Form.Item
                    name="imageIds"
                    rules={[
                      {
                        required: !isAddNew
                          ? countGalleryImages > 0
                            ? false
                            : true
                          : projectDetai?.images?.length > 1
                            ? false
                            : true,
                        message: `${eForm('pleaseSelect')} ${t(
                          'EcomPropertyListingDetailPageGalleryVideosGallery',
                        )}`,
                      },
                    ]}
                  >
                    <UploadImageProjectRealTime
                      maxFile={10}
                      multiple={true}
                      noteBeforeUpload={t('maxNumberFile', { number: 10 })}
                      required
                      initImages={projectDetai?.images}
                      title={t('EcomPropertyListingDetailPageGalleryVideosGallery')}
                      uploadButtonLabel={comm('uploadFiles')}
                      onChange={async (images, listIdRemove, isDeleteFileBeforUpdate) =>
                        onUploadGallery(images, listIdRemove, isDeleteFileBeforUpdate)
                      }
                    ></UploadImageProjectRealTime>
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
                    name="indoorAmenities"
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
                    name="outdoorAmenities"
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
                  <FormTagInputShap name="nearBy" />
                </div>
              </div>
            </Form>
          </TabPane>
        </Tabs>
      </div>
    </WrapPageScroll>
  ) : (
    <WaringPermission />
  );
};

export default ProjectDetailPage;
