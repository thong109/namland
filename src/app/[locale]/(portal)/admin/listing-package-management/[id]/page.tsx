'use client';
import listingApiPackageService from '@/apiServices/externalApiServices/apilistingPackageService';
import AppPageMeta from '@/components/AppPageMeta';
import ButtonBack from '@/components/Button/ButtonBack/ButtonBack';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import FormFloatNumber from '@/components/FormInput/formNumber';
import FormFloatSelect from '@/components/FormInput/formSelect/Index';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import WrapPageScroll from '@/components/WrapPageScoll';
import {
  appPermissions,
  listPackage,
  listPackageEnum,
  listStatusPackage,
  listStatusProject,
  roleAdminGod,
} from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import { checkPermissonAcion } from '@/libs/helper';
import useGlobalStore from '@/stores/useGlobalStore';
import Form from 'antd/es/form';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import React, { FC, useEffect, useState, useTransition } from 'react';
import { TypeOptions, toast } from 'react-toastify';

export interface Props {
  params: any;
}
const ListingPackagePageDetail: FC<Props> = ({ params }) => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);

  const isAddNew = params.id === 'add-new' ? true : false;
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  const success = useTranslations('successNotifi');
  const errorNoti = useTranslations('errorNotifi');

  const { back } = useRouter();

  const [isPending, startTransition] = useTransition();

  const { userInfo } = useGlobalStore();
  const [formPackage] = Form.useForm();

  const [percentDecrease, setPercentDecrease] = useState<number>(0);

  useEffect(() => {
    getDetail(params.id);
  }, []);

  const getDetail = async (id: string) => {
    if (!isAddNew) {
      try {
        const data = await listingApiPackageService.getById(id);
        setPercentDecrease(data?.percentDecrease);
        formPackage.setFieldsValue(data);
      } catch {}
    } else {
      formPackage.resetFields();
    }
  };

  const onSave = async () => {
    await formPackage.validateFields();
    const values = formPackage.getFieldsValue();

    if (isAddNew) {
      startTransition(async () => {
        try {
          delete values.discountedPoint;
          await listingApiPackageService.createPackage(values);
          notify('success', success('createAPI'));
          back();
        } catch {
          notify('error', errorNoti('createAPI'));
        }
      });
    } else {
      startTransition(async () => {
        try {
          delete values.discountedPoint;
          await listingApiPackageService.updatePackage({ ...values, id: params.id });
          notify('success', success('createAPI'));
          back();
        } catch (e) {
          notify('error', e?.response?.data?.message);
        }
      });
    }
  };

  const handleCaculatePoint = async () => {
    const point = formPackage.getFieldValue('point');
    const percentDecrease = formPackage.getFieldValue('percentDecrease');

    if (point && percentDecrease) {
      setPercentDecrease(percentDecrease);
      const caculateValue = point - (percentDecrease / 100) * point;
      formPackage.setFieldValue('discountedPoint', caculateValue);
    } else {
      formPackage.setFieldValue('discountedPoint', null);
    }
  };

  const renderActions = () => {
    return (
      <div className="flex justify-end">
        <ButtonBack text={t('goBack')} onClick={back} />

        {checkPermissonAcion(userInfo?.accesses, [
          roleAdminGod,
          appPermissions.portal_listing_package.update,
          appPermissions.portal_listing_package.insert,
          appPermissions.portal_banner.admin,
        ]) && (
          <ButtonPrimary
            text={t('save')}
            onClick={() => onSave()}
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
      appPermissions.portal_listing_package.view,
      appPermissions.portal_listing_package.insert,
      appPermissions.portal_listing_package.update,
      appPermissions.portal_listing_package.admin,
    ]) ? (
    <>
      <AppPageMeta title={`${t('EcomListPackageDetailEdit')}`} />
      <WrapPageScroll renderActions={renderActions}>
        <div className="p-6">
          <div className="mb-3 flex w-full justify-between">
            <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
              {isAddNew ? t('EcomListPackageDetailEdit') : t('EcomListPackageDetailNew')}
            </h1>
          </div>

          <Form form={formPackage} layout="vertical">
            <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
              <div className="col-span-12 py-2">
                <label className="text-base font-bold text-portal-primaryMainAdmin">
                  {t('EcomListPackageDetailListingPackeInfo')}
                </label>
              </div>
              <div className="col-span-4">
                <FormFloatSelect
                  showSearch
                  label={t('EcomListPackageDetailListingType')}
                  name="type"
                  filterOption={true}
                  options={listStatusProject?.map((x) => ({
                    value: x.id,
                    label: comm(x.name),
                    id: x.id,
                  }))}
                />
              </div>
              <div className="col-span-4">
                <FormFloatSelect
                  showSearch
                  label={t('EcomListPackageDetailListingPackageType')}
                  name="packageType"
                  filterOption={true}
                  options={listPackage?.map((x) => ({
                    value: x.id,
                    label: comm(x.name),
                    id: x.id,
                  }))}
                />
              </div>

              <div className="col-span-4">
                <FormFloatSelect
                  showSearch
                  label={t('EcomListPackageDetailListingPackageTypeNumber')}
                  name="package"
                  filterOption={true}
                  options={listPackageEnum?.map((x) => ({
                    value: x.id,
                    label: comm(x.name, { percentDecrease: percentDecrease }),
                    id: x.id,
                  }))}
                />
              </div>
              <div className="col-span-4">
                <FormFloatNumber
                  onChange={handleCaculatePoint}
                  label={t('EcomListPackageDetailListingPoint')}
                  name="point"
                />
              </div>
              <div className="col-span-4">
                <FormFloatNumber
                  onChange={handleCaculatePoint}
                  label={t('EcomListPackageDetailListingPercentDecrease')}
                  name="percentDecrease"
                  maxNum={100}
                />
              </div>
              <div className="col-span-4">
                <FormFloatNumber
                  disabled
                  label={t('EcomListPackageDetailListingDiscountedPoint')}
                  name="discountedPoint"
                />
              </div>
              <div className="col-span-4">
                <FormFloatSelect
                  showSearch
                  label={t('EcomListPackageDetailListingPackageStatus')}
                  name="status"
                  filterOption={true}
                  options={listStatusPackage?.map((x) => ({
                    value: x.id,
                    label: comm(x.name),
                    id: x.id,
                  }))}
                />
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

export default ListingPackagePageDetail;
