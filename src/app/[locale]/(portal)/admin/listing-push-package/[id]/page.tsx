'use client';
import pushlistingApiPackageService from '@/apiServices/externalApiServices/apilistingPushPackageService';
import AppPageMeta from '@/components/AppPageMeta';
import ButtonBack from '@/components/Button/ButtonBack/ButtonBack';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import FormFloatNumber from '@/components/FormInput/formNumber';
import FormFloatSelect from '@/components/FormInput/formSelect/Index';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import WrapPageScroll from '@/components/WrapPageScoll';
import { appPermissions, listPackage, listingType, roleAdminGod } from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import { checkPermissonAcion } from '@/libs/helper';
import useGlobalStore from '@/stores/useGlobalStore';
import Form from 'antd/es/form';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import React, { FC, useEffect, useTransition } from 'react';
import { TypeOptions, toast } from 'react-toastify';

export interface Props {
  params: any;
}
const ListingPushPackagePageDetail: FC<Props> = ({ params }) => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);

  const isAddNew = params.id === 'add-new' ? true : false;
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  const success = useTranslations('successNotifi');
  const errorNoti = useTranslations('errorNotifi');
  const error = useTranslations('error');

  const { back } = useRouter();

  const [isPending, startTransition] = useTransition();

  const { userInfo } = useGlobalStore();
  const [formPackage] = Form.useForm();

  useEffect(() => {
    getDetail(params.id);
  }, []);

  const getDetail = async (id: string) => {
    if (!isAddNew) {
      try {
        const data = await pushlistingApiPackageService.getById(params?.id);

        formPackage.setFieldsValue(data);
      } catch {}
    } else {
      formPackage.resetFields();
    }
  };

  const onSave = async () => {
    await formPackage.validateFields();
    const values = formPackage.getFieldsValue();

    if (!isAddNew) {
      try {
        const body = {
          ...values,
          type: listingType.sale, //type = sale hay rent đều đường, sai chung,
          status: 1, // luôn bật active
          id: params.id,
        };
        startTransition(async () => {
          await pushlistingApiPackageService.updatePushPackage(body);
          notify('success', success('createAPI'));
          back();
        });
      } catch {
        notify('error', errorNoti('updateAPI'));
      }
    }
  };

  const renderActions = () => {
    return (
      <div className="flex justify-end">
        <ButtonBack text={t('goBack')} onClick={back} />

        {userInfo?.type === UserTypeConstant.Salesman && (
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
      appPermissions.portal_listing_push.view,
      appPermissions.portal_listing_push.update,
      appPermissions.portal_listing_push.admin,
    ]) ? (
    <>
      <AppPageMeta title={`${t('EcomListPackageDetailPushPackageEdit')}`} />
      <WrapPageScroll renderActions={renderActions}>
        <div className="p-6">
          <div className="mb-3 flex w-full justify-between">
            <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
              {params.id
                ? t('EcomListPackageDetailPushPackageEdit')
                : t('EcomListPackageDetailPushPackageEditNew')}
            </h1>
          </div>

          <Form form={formPackage} layout="vertical">
            <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
              <div className="col-span-12 py-2">
                <label className="text-base font-bold text-portal-primaryMainAdmin">
                  {t('EcomListPackageDetailListingPackePushInfo')}
                </label>
              </div>
              <div className="col-span-4">
                <FormFloatNumber
                  label={t('EcomListPackageDetailListingPushNumberOfPush')}
                  name="numberOfPush"
                />
              </div>
              {/* <div className="col-span-4">
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
              </div> */}
              <div className="col-span-4">
                <FormFloatSelect
                  disabled
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
                <FormFloatNumber label={t('EcomListPackageDetailListingPoint')} name="point" />
              </div>
              {/* <div className="col-span-4">
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
              </div> */}
            </div>
          </Form>
        </div>
      </WrapPageScroll>
    </>
  ) : (
    <WaringPermission />
  );
};

export default ListingPushPackagePageDetail;
