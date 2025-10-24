'use client';
import BannerApiService from '@/apiServices/externalApiServices/bannerApiService';
import AppPageMeta from '@/components/AppPageMeta';
import ButtonBack from '@/components/Button/ButtonBack/ButtonBack';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import BannerUpload from '@/components/FileUpload/BannerUpload';
import FormFloatDate from '@/components/FormInput/formDatePicker';
import FormFloatInput from '@/components/FormInput/formInput';
import FormFloatNumber from '@/components/FormInput/formNumber';
import FormFloatSelect from '@/components/FormInput/formSelect/Index';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import WrapPageScroll from '@/components/WrapPageScoll';
import {
  activeStatus,
  appPermissions,
  bannerImageAspect,
  listPositionBanner,
  roleAdminGod,
  typePositionBanner,
} from '@/libs/appconst';
import { checkPermissonAcion, formatDate } from '@/libs/helper';
import useGlobalStore from '@/stores/useGlobalStore';
import { Modal } from 'antd';
import Form from 'antd/es/form';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import React, { FC, useEffect, useState } from 'react';
import { TypeOptions, toast } from 'react-toastify';
import './style.scss';
export interface Props {
  params: any;
}
const disabledDate = (current) => {
  return current < dayjs().subtract(1, 'day') ? true : false;
};
const BannerDetail: FC<Props> = ({ params }) => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);
  const { push } = useRouter();
  const { userInfo } = useGlobalStore();
  const t = useTranslations('webLabel');
  const error = useTranslations('error');
  const success = useTranslations('successNotifi');
  const idAddNew = params.id === 'add-new' ? true : false;
  const [formRef] = Form.useForm();
  const router = useRouter();
  const [bannerInfo, setbannerInfo] = useState(undefined);
  const [bannerImageInfo, setBannerImageInfo] = useState<any>(undefined);
  const [listIdImageDelete, setListIdImageDelete] = useState<string[]>(undefined);
  const [positionBanner, setPositionBanner] = useState<string>(typePositionBanner.horizontal);
  const [showNotiChangeAspect, setShowNotiChangeAspect] = useState<boolean>(false);
  const [positionOld, setPositionOld] = useState<number>(undefined);
  useEffect(() => {
    getDetail();
  }, []);

  const getDetail = async () => {
    if (!idAddNew) {
      const bannerRespone = await BannerApiService.getByid(params.id);

      await initPositionBanner(bannerRespone?.data);

      formRef.setFieldsValue({
        ...bannerRespone.data,
        startDate: bannerRespone.data?.startDate ? dayjs(bannerRespone.data?.startDate) : null,
        endDate: bannerRespone.data?.endDate ? dayjs(bannerRespone.data?.endDate) : null,
      });
    } else {
      formRef.resetFields();
    }
  };

  const initPositionBanner = (bannerInfo) => {
    const position =
      listPositionBanner.find((item) => item.id === bannerInfo?.position)?.type ??
      typePositionBanner.horizontal;

    setPositionBanner(position);
    setbannerInfo(bannerInfo ?? undefined);
    setPositionOld(bannerInfo?.position);
  };

  const bannerChange = async (value) => {
    setBannerImageInfo(value.attachments);
    setListIdImageDelete(value.listImageDelete);
  };

  const handelOk = async () => {
    const bannerInfoValue = await formRef.validateFields();
    const model = {
      ...bannerInfoValue,
      attachments: bannerImageInfo,
      id: idAddNew ? undefined : params.id,
      imageIdsDelete: listIdImageDelete,
    };
    const newFile = bannerImageInfo.filter((item) => item.newFile);

    if (idAddNew) {
      try {
        const bannerRespone = await BannerApiService.createBanner(model, newFile);
        if (bannerRespone.success) {
          notify('success', success('updateAPI'));
          router.push('/admin/banner-management');
        }
      } catch (e) {
        notify('warning', e?.response?.data?.message);
      }
    } else {
      try {
        const bannerRespone = await BannerApiService.updateBanner(model, newFile);
        if (bannerRespone.success) {
          notify('success', success('updateAPI'));
          router.push('/admin/banner-management');
        }
      } catch (e) {
        notify('warning', e?.response?.data?.message);
      }
    }
  };

  const onChangePosition = (value: number) => {
    const position = listPositionBanner.find((item) => item.id === value).type;

    if (positionOld === undefined) {
      setPositionOld(value);
    }

    if (positionOld !== value && position !== positionBanner) {
      setPositionBanner(position);
      setShowNotiChangeAspect(true);
    } else {
      setPositionOld(value);
    }
  };

  const handleOkChangePosition = () => {
    positionBanner === typePositionBanner.horizontal
      ? setPositionBanner(typePositionBanner.horizontal)
      : setPositionBanner(typePositionBanner.newHome);
    setPositionOld(formRef.getFieldValue('position'));
    setShowNotiChangeAspect(false);
  };

  const handleCancelChangePosition = () => {
    formRef.setFieldValue('position', positionOld);
    setShowNotiChangeAspect(false);
  };

  const renderActions = () => {
    return (
      <div className="flex justify-end">
        <ButtonBack text={t('goBack')} onClick={() => push('/admin/banner-management')} />

        {checkPermissonAcion(userInfo?.accesses, [
          roleAdminGod,
          appPermissions.portal_banner.insert,
          appPermissions.portal_banner.update,
          appPermissions.portal_banner.admin,
        ]) && (
          <ButtonPrimary text={t('save')} onClick={handelOk} className="ml-1 rounded-full px-6" />
        )}
      </div>
    );
  };

  return checkPermissonAcion(userInfo?.accesses, [
    roleAdminGod,
    appPermissions.portal_banner.view,
    appPermissions.portal_banner.update,
    appPermissions.portal_banner.admin,
  ]) ? (
    <>
      <AppPageMeta
        title={`${idAddNew ? t('EcomBannerManagementPageCreateBannerAddNew') : t('EcomBannerManagementPageCreateCampaignInfomation')}`}
      />
      <WrapPageScroll renderActions={renderActions}>
        <div className="p-6">
          <div className="mb-3 flex w-full justify-between">
            <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
              {params.id
                ? t('EcomBannerManagementPageCreateCampaignInfomation')
                : t('EcomBannerManagementPageCreateBannerAddNew')}
            </h1>
          </div>
          <Form form={formRef} layout="vertical">
            <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
              <div className="col-span-12 py-2">
                <label className="text-base font-bold text-portal-primaryMainAdmin">
                  {t('EcomBannerManagementPageCreateCampaignInfomation')}
                </label>
              </div>
              <div className="col-span-6">
                <FormFloatInput
                  rules={[
                    {
                      required: true,
                      message: `${error('pleaseInput')} ${t(
                        'EcomBannerManagementPageCreateCampaignTitle',
                      )}`,
                    },
                    { max: 250, message: `${error('maxlength')} 250` },
                  ]}
                  name="title"
                  required
                  label={t('EcomBannerManagementPageCreateCampaignTitle')}
                />
              </div>
              <div className="col-span-6">
                <FormFloatSelect
                  required
                  rules={[
                    {
                      required: true,
                      message: `${error('pleaseInput')} ${t(
                        'EcomBannerManagementPageCreatePosition',
                      )}`,
                    },
                  ]}
                  onChange={onChangePosition}
                  label={t('EcomBannerManagementPageCreatePosition')}
                  name="position"
                  options={listPositionBanner.map((x) => ({
                    value: x.id,
                    label: t(x.name),
                    id: x.id,
                  }))}
                />
              </div>
            </div>

            <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
              <div className="col-span-12 py-2">
                <label className="text-base font-bold text-portal-primaryMainAdmin">
                  {t('EcomBannerManagementPageCreateLogoDuration')}
                </label>
              </div>

              <div className="col-span-6">
                <FormFloatDate
                  disabledDate={disabledDate}
                  name="startDate"
                  format={formatDate}
                  label={t('EcomBannerManagementPageCreateStartDate')}
                  required
                  rules={[
                    {
                      required: true,
                      message: `${error('pleaseSelect')} ${t(
                        'EcomBannerManagementPageCreateStartDate',
                      )}`,
                    },
                  ]}
                />
              </div>
              <div className="col-span-6">
                <FormFloatDate
                  disabledDate={disabledDate}
                  format={formatDate}
                  name="endDate"
                  label={t('EcomBannerManagementPageCreateEndDate')}
                  required
                  rules={[
                    {
                      required: true,
                      message: `${error('pleaseSelect')} ${t(
                        'EcomBannerManagementPageCreateEndDate',
                      )}`,
                    },
                  ]}
                />
              </div>
            </div>

            <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
              <div className="col-span-12 py-2">
                <label className="text-base font-bold text-portal-primaryMainAdmin">
                  {t('EcomBannerManagementPageCreateBannerConfiguration')}
                </label>
              </div>

              <div className="col-span-6">
                <FormFloatNumber
                  name="switchAfterSeconds"
                  label={t('EcomBannerManagementPageCreateSwitchAfterSeconds')}
                  required
                  rules={[
                    {
                      required: true,
                      message: `${error('pleaseSelect')} ${t(
                        'EcomBannerManagementPageCreateSwitchAfterSeconds',
                      )}`,
                    },
                    {
                      pattern: /^\d{1,3}$/,
                      message: `${error('maximunSecondIs999')} `,
                    },
                  ]}
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

            <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
              <div className="col-span-12 py-2">
                <label className="text-base font-bold text-portal-primaryMainAdmin">
                  {t('EcomBannerManagementAttachment')}
                </label>
              </div>

              <div className="col-span-12">
                <BannerUpload
                  aspectImage={
                    positionBanner === typePositionBanner.horizontal
                      ? bannerImageAspect.horizontal
                      : bannerImageAspect.newHome
                  }
                  form={formRef}
                  baseValue={bannerInfo?.attachments}
                  bannerChangeValue={bannerChange}
                  label={
                    positionBanner === typePositionBanner.horizontal
                      ? t('EcomBannerManagementPageCreateUploadFiles(horizontal)')
                      : t('EcomBannerManagementPageCreateUploadFiles(newHome)')
                  }
                />
              </div>
            </div>
          </Form>
        </div>
      </WrapPageScroll>
      <Modal
        open={showNotiChangeAspect}
        onOk={handleOkChangePosition}
        onCancel={handleCancelChangePosition}
        title={t('EcomBannerPopupConfirmChangePositionTitle')}
      >
        <span>{t('EcomBannerPopupConfirmChangePositionContent')}</span>
      </Modal>
    </>
  ) : (
    <WaringPermission />
  );
};

export default BannerDetail;
