'use client';
import apiMasterDataService from '@/apiServices/externalApiServices/apiMasterDataService';
import SearchLocationApiService from '@/apiServices/externalApiServices/searchLocationApiService';
import AppPageMeta from '@/components/AppPageMeta';
import FormFloatSelect from '@/components/FormInput/formSelect/Index';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import WrapPageScroll from '@/components/WrapPageScoll';
import SelectLocation from '@/components/selectLocation/Index';
import useProvince from '@/hooks/useProvince';
import { activeStatus, appPermissions, listMaterialPlace, roleAdminGod } from '@/libs/appconst';
import { checkPermissonAcion } from '@/libs/helper';
import { SearchLocationDetailModel } from '@/models/propertyModel/searchLoticationModal';
import useGlobalStore from '@/stores/useGlobalStore';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Tag } from 'antd';
import Form from 'antd/es/form';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import React, { FC, useEffect, useState } from 'react';
import { TypeOptions, toast } from 'react-toastify';
import '../style.scss';
export interface Props {
  params: any;
}

const SearchLocationDetail: FC<Props> = ({ params }) => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);
  const { userInfo } = useGlobalStore();
  const { push } = useRouter();
  const { listProvince } = useProvince();
  const idAddNew = params.id === 'add-new' ? true : false;

  const t = useTranslations('webLabel');
  const error = useTranslations('error');
  const success = useTranslations('successNotifi');
  const [formRef] = Form.useForm();
  const [districts, setDistricts] = useState<any[]>([]);
  const [listPlace, setListPlace] = useState<any[]>([]);
  const [dataDetail, setDataDetail] = useState<any>([]);

  const [listLocationSuggest, setListLocationSuggest] = useState<any[]>([]);

  const router = useRouter();
  useEffect(() => {
    getDetail();
  }, []);

  const getDetail = async () => {
    if (!idAddNew) {
      const dataResponse: any = await SearchLocationApiService.getByid(params.id);
      setDataDetail(dataResponse);
      formRef.setFieldsValue({
        ...dataResponse,
      });
      if (dataResponse.province) {
        getDistrict(dataResponse.province);
      }
      setListPlace(dataResponse.materialPlaces);
    }
  };

  const getDistrict = async (provinceId: string) => {
    const dataDistrict = await apiMasterDataService.getDistrictV2(provinceId);
    setDistricts(dataDistrict);
  };
  const changeProvince = async (provinceId: string) => {
    formRef.setFieldValue('district', undefined);
    getDistrict(provinceId);
  };
  const onRemoveFormList = async (id) => {
    const listPlaceAfterRemove = listPlace.filter((item) => item.placeId !== id);
    setListPlace(listPlaceAfterRemove);
  };
  const onChangePlace = async (placeId: string) => {
    // const dataResult = await locationApiService.getLocationDetail(placeId);
    const checkDuplicate = listPlace.findIndex((place) => place.placeId === placeId);

    if (checkDuplicate > -1) {
      notify('error', t('EcomSearchLocationErrorDuplicate'));
    } else {
      const planceChoose = listLocationSuggest.find((item) => item.place_id === placeId);
      const newPlace = {
        placeId: planceChoose?.place_id,
        name: planceChoose?.description,
      };
      setListPlace([newPlace, ...listPlace]);
    }
  };
  const onSearchGooleMap = debounce(async (keyword: string) => {
    if (keyword) {
      await SearchLocationApiService.getListLocation(keyword).then((x) =>
        setListLocationSuggest(x.data),
      );
    }
  }, 200);
  const compareArrPlace = async (initList, newList) => {
    let listPlaceForUpdate = [] as any;
    initList.map((init) => {
      const isKeep = newList.findIndex((place) => init.id === place.id);
      if (isKeep > -1) {
      } else {
        listPlaceForUpdate.push({ ...init, isDeleted: true });
      }
    });

    newList.map((item) => {
      if (!item.id) {
        listPlaceForUpdate.push({ ...item });
      }
    });
    return listPlaceForUpdate;
  };
  const handelOk = async () => {
    const contactInfoValue = await formRef.validateFields();

    if (idAddNew) {
      const paramsCreate: SearchLocationDetailModel = {
        ...contactInfoValue,
        materialPlaces: [...listPlace],
      };

      try {
        await SearchLocationApiService.create(paramsCreate);
        notify('success', success('createAPI'));
        router.push('/admin/search-location-management');
      } catch (e) {
        notify('error', e?.response?.data?.message);
      }
    } else {
      const materialPlaces = await compareArrPlace(dataDetail.materialPlaces, listPlace);
      const paramsUpdate: SearchLocationDetailModel = {
        ...contactInfoValue,
        materialPlaces: materialPlaces,
        id: params.id,
      };

      try {
        await SearchLocationApiService.update(paramsUpdate);
        notify('success', success('updateAPI'));
        router.push('/admin/search-location-management');
      } catch (e) {
        notify('error', e?.response?.data?.message);
      }
    }
  };
  const renderActions = () => {
    return (
      <>
        <div className="flex w-full flex-col justify-end lg:flex-row">
          <Button
            onClick={() => push('/admin/search-location-management')}
            size="large"
            className="z-0 mb-1 w-full !rounded border border-portal-blackGray bg-white px-5 py-2 text-lg uppercase text-portal-blackGray lg:mb-0 lg:mr-2 lg:w-fit"
          >
            {t('goBack')}
          </Button>

          <Button
            size="large"
            onClick={handelOk}
            className="z-0 mb-1 w-full !rounded border !border-portal-primaryMainAdmin !bg-portal-primaryMainAdmin px-5 py-2 text-lg uppercase !text-white lg:mb-0 lg:w-fit"
          >
            <label>{t('save')}</label>
          </Button>
        </div>
      </>
    );
  };
  return checkPermissonAcion(userInfo?.accesses, [
    roleAdminGod,
    appPermissions.portal_searchlocation.admin,
  ]) ? (
    <>
      <AppPageMeta
        title={
          idAddNew
            ? t('EcomSearchLocationAddNewSearchLocation')
            : ` ${t('EcomSearchLocationSearchLocationFor')} ${
                listProvince.find((item: any) => item?.provinceID === dataDetail.province)
                  ?.listProvinceName
              }/ ${dataDetail?.districtName} - ${dataDetail?.type}`
        }
      />
      <WrapPageScroll renderActions={renderActions} notShowDesktop>
        <div className="px-7 pt-10">
          <div className="grid grid-cols-12 px-3">
            <div className="col-span-6 flex items-center">
              <h1 className="text-xl">
                {idAddNew ? (
                  t('EcomSearchLocationAddNewSearchLocation')
                ) : (
                  <>
                    {t('EcomSearchLocationSearchLocationFor')}{' '}
                    {`${
                      listProvince.find((item: any) => item?.provinceID === dataDetail.province)
                        ?.listProvinceName
                    }/ ${dataDetail?.districtName} - ${dataDetail?.type}`}{' '}
                  </>
                )}
              </h1>
            </div>
            <div className="col-span-6 hidden lg:block">{renderActions()}</div>
          </div>

          <Form form={formRef} layout="vertical">
            <div className="mt-3 grid grid-cols-12 gap-x-3 bg-white px-3">
              <div className="col-span-12 mt-3 pb-6"></div>
              <div className="col-span-6">
                <FormFloatSelect
                  label={t('EcomSearchLocationDetailProvince')}
                  rules={[
                    {
                      required: true,
                      message: `${t('EcomSearchLocationDetailProvinceRequired')}`,
                    },
                  ]}
                  onChange={changeProvince}
                  name="province"
                  showSearch={true}
                  options={listProvince.map((province) => ({
                    value: province.provinceID,
                    label: province.listProvinceName,
                  }))}
                />
              </div>
              <div className="col-span-6">
                <FormFloatSelect
                  disabled={false}
                  showSearch
                  label={t('EcomSearchLocationDetailDistrict')}
                  required
                  rules={[
                    {
                      required: true,
                      message: `${t('EcomSearchLocationDetailDistrictRequired')}`,
                    },
                  ]}
                  name="district"
                  options={districts.map((district) => ({
                    value: district.listDistrictID,
                    label: district.nameDisplay,
                  }))}
                />
              </div>
              <div className="col-span-6">
                <FormFloatSelect
                  disabled={false}
                  label={t('EcomSearchLocationMaterialPlacesType')}
                  required
                  rules={[
                    {
                      required: true,
                      message: `${t('EcomSearchLocationDetailPlacesTypeRequired')}`,
                    },
                  ]}
                  name="type"
                  options={listMaterialPlace.map((item) => ({
                    value: item.name,
                    label: t(item.name),
                  }))}
                />
              </div>
              <div className="col-span-6">
                <FormFloatSelect
                  label={t('EcomTicketManagementInforPageListViewStatus')}
                  name="status"
                  options={activeStatus.map((x) => ({
                    value: x.id,
                    label: t(x.name),
                    id: x.id,
                  }))}
                  required
                  rules={[
                    {
                      required: true,
                      message: `${error('pleaseSelect')} ${t(
                        'EcomTicketManagementInforPageListViewStatus',
                      )}`,
                    },
                  ]}
                />
              </div>
            </div>
            <div className="mt-5 grid grid-cols-12 gap-x-3 bg-white p-3">
              <div className="col-span-12 mt-3 pb-6">
                <strong>{t('EcomSearchLocationDetailLocation')}</strong>
              </div>

              <div className="col-span-12">
                <div className="col-span-full sm:col-span-12">
                  <SelectLocation
                    disabled={false}
                    name={['location']}
                    form={formRef}
                    label={t('EcomPropertyListingDetailPageLocationAddress')}
                    filterOption={false}
                    showSearch={true}
                    onChange={(value) => onChangePlace(value)}
                    onSearch={(value) => onSearchGooleMap(value)}
                    options={listLocationSuggest?.map((x) => ({
                      value: x.place_id,
                      label: x.description,
                      id: x.place_id,
                    }))}
                  />
                </div>
                <div className="w-full space-y-1">
                  {listPlace.map((item, index) => (
                    <Tag
                      closeIcon={<CloseCircleOutlined />}
                      closable={true}
                      onClose={() => onRemoveFormList(item?.placeId)}
                      key={index}
                      className="tag-hover-effect flex h-[30px] w-fit items-center justify-between rounded-lg px-2"
                    >
                      <span>{item?.name}</span>
                    </Tag>
                  ))}
                </div>
              </div>
            </div>
          </Form>
        </div>
      </WrapPageScroll>
    </>
  ) : (
    <WaringPermission />
  );
};

export default SearchLocationDetail;
