'use client';
import iamOwnerApiInAdmin from '@/apiServices/externalApiServices/apiIAmOwner';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import MultiLanguageInput from '@/components/FormInput/MultiLanguageInput';
import FormFloatInput from '@/components/FormInput/formInput';
import UploadFile from '@/components/UploadFile/UploadFile';
import UploadGallery from '@/components/UploadGallery/UploadGalley';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import WrapPageScroll from '@/components/WrapPageScoll';
import useKeywordBanned from '@/hooks/useKeywordBaned';
import { appPermissions, roleAdminGod, typeIamOwner } from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import {
  checkMultiLanguageMaxLength,
  checkMultiLanguageRequired,
  checkPermissonAcion,
  checkTextMultiLanguageInBlackListForForm,
} from '@/libs/helper';
import useGlobalStore from '@/stores/useGlobalStore';
import Form from 'antd/es/form';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { TypeOptions, toast } from 'react-toastify';

const IamOwnerPage = ({ params }: { params: { id: string } }) => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);
  const [formRef] = Form.useForm();

  const { keyword } = useKeywordBanned();
  const { userInfo } = useGlobalStore();
  const t = useTranslations('webLabel');
  const success = useTranslations('successNotifi');
  const eForm = useTranslations('error');
  const comm = useTranslations('Common');

  const [dataIamOwner, setDataIamOwner] = useState<any>(undefined);
  const [listBanner, setListBanner] = useState([] as any);
  const [isAddImgService1, setIsAddImgService1] = useState<boolean>(false);
  const [isAddImgService2, setIsAddImgService2] = useState<boolean>(false);
  const [isAddImgService3, setIsAddImgService3] = useState<boolean>(false);
  const [countGalleryImages, setCountGalleryImages] = useState<number>(0);
  const [listIdImageDelete, setListIdImageDelete] = useState<string[]>([]);
  const [isAddNew, setIsAddNew] = useState<boolean>(false);
  useEffect(() => {
    getDetail();
  }, []);

  const getDetail = async () => {
    const dataIamOwnervaluesIamOwner: any = await iamOwnerApiInAdmin.getDetailEdit();
    if (dataIamOwnervaluesIamOwner) {
      setIsAddNew(false);
    } else {
      setIsAddNew(true);
    }
    await formRef.setFieldsValue({
      ...dataIamOwnervaluesIamOwner,
    });

    if (dataIamOwnervaluesIamOwner?.service1?.imageUrl) {
      setIsAddImgService1(true);
    }
    if (dataIamOwnervaluesIamOwner?.service2?.imageUrl) {
      setIsAddImgService2(true);
    }
    if (dataIamOwnervaluesIamOwner?.service3?.imageUrl) {
      setIsAddImgService3(true);
    }
    setCountGalleryImages(dataIamOwnervaluesIamOwner?.imageBanner.length ?? 0);
    setDataIamOwner(dataIamOwnervaluesIamOwner);
    setListBanner(dataIamOwnervaluesIamOwner?.imageBanner || []);
  };

  const onSave = async () => {
    await formRef.validateFields();

    const values = formRef.getFieldsValue();
    if (!isAddNew) {
      const body = {
        id: dataIamOwner?.id,
        ownerContentDetails: [
          {
            ...dataIamOwner?.service1,
            title: values.service1.title,
            content: values.service1.content.filter((item) => item.value?.length > 0),
          },
          {
            ...dataIamOwner?.service2,
            title: values.service2.title,
            content: values.service2.content.filter((item) => item.value?.length > 0),
          },
          {
            ...dataIamOwner?.service3,
            title: values.service3.title,
            content: values.service3.content.filter((item) => item.value?.length > 0),
          },
          {
            ...dataIamOwner?.contactUs,

            content: values.contactUs.content.filter((item) => item.value?.length > 0),
          },
        ],
        imageIdsDelete: listIdImageDelete,
      };
      await iamOwnerApiInAdmin.createOrUpdate(body, values);
      notify('success', success('updateAPI'));
    } else {
      const body = {
        ownerContentDetails: [
          {
            title: values.service1.title,
            type: typeIamOwner.service1,
            isShow: true,
            order: 0,
            content: values.service1.content.filter((item) => item.value?.length > 0),
          },
          {
            title: values.service2.title,
            type: typeIamOwner.service2,
            isShow: true,
            order: 1,
            content: values.service2.content.filter((item) => item.value?.length > 0),
          },
          {
            title: values.service3.title,
            type: typeIamOwner.service3,
            isShow: true,
            order: 2,
            content: values.service3.content.filter((item) => item.value?.length > 0),
          },
          {
            type: typeIamOwner.contactUs,
            isShow: true,
            order: 3,
            content: values.contactUs.content.filter((item) => item.value?.length > 0),
          },
        ],
        imageIdsDelete: listIdImageDelete,
      };
      await iamOwnerApiInAdmin.createOrUpdate(body, values);
      notify('success', success('updateAPI'));
    }
  };

  const onUploadImageService1 = (file: File) => {
    if (file == undefined) {
      setIsAddImgService1(false);
    } else {
      setIsAddImgService1(true);
    }
  };
  const onUploadImageService2 = (file: File) => {
    if (file == undefined) {
      setIsAddImgService2(false);
    } else {
      setIsAddImgService2(true);
    }
  };
  const onUploadImageService3 = (file: File) => {
    if (file == undefined) {
      setIsAddImgService3(false);
    } else {
      setIsAddImgService3(true);
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
        formRef.setFieldValue('projectImage', undefined);
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
        {<ButtonPrimary text={t('save')} onClick={onSave} className="ml-1 rounded-full px-6" />}
      </div>
    );
  };

  return userInfo?.type === UserTypeConstant.Salesman &&
    checkPermissonAcion(userInfo?.accesses, [
      roleAdminGod,
      appPermissions.portal_setting.view,
      appPermissions.portal_setting.update,
      appPermissions.portal_banner.admin,
    ]) ? (
    <WrapPageScroll renderActions={renderAction}>
      <div className="p-6">
        <div className="mb-3 flex w-full justify-between">
          <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
            {t('EcomBannerManagementPageIamOwnerDetail')}
          </h1>
        </div>

        <Form form={formRef} layout="vertical" size="middle">
          <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
            <div className="col-span-12 py-2">
              <label className="text-base font-bold text-portal-primaryMainAdmin">
                {t('EcomBannerManagementPageIamOwnerBanner')}
              </label>
            </div>

            <div className="col-span-12">
              <Form.Item
                name="imageBanner"
                rules={[
                  {
                    required: !isAddNew
                      ? countGalleryImages > 0
                        ? false
                        : true
                      : dataIamOwner?.imageBanner?.length > 1
                        ? false
                        : true,
                    message: `${eForm('pleaseSelect')} ${t(
                      'EcomBannerManagementPageIamOwnerBanner',
                    )}`,
                  },
                ]}
              >
                <UploadGallery
                  maxFile={10}
                  multiple={true}
                  required
                  initImages={listBanner}
                  title={t('maxNumberFile', { number: 10 })}
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
                {t('EcomBannerManagementPageIamOwnerService_1')}
              </label>
            </div>

            <div className="col-span-12">
              <Form.Item
                rules={[
                  {
                    required: !isAddNew
                      ? isAddImgService1 == true
                        ? false
                        : true
                      : dataIamOwner?.service1
                        ? false
                        : true,
                    message: `${eForm('pleaseSelect')} ${t(
                      'EcomBannerManagementPageIamOwnerImgService_1',
                    )}`,
                  },
                ]}
                name="imageService1"
              >
                <UploadFile
                  required
                  urlInit={dataIamOwner?.service1?.imageUrl}
                  onChange={onUploadImageService1}
                  title={comm('maxImage(1image)')}
                  uploadButtonLabel={comm('uploadFiles')}
                ></UploadFile>
              </Form.Item>
            </div>
            <div className="col-span-12">
              <FormFloatInput
                rules={[
                  {
                    required: true,
                    message: `${eForm('pleaseInput')} ${t(
                      'EcomBannerManagementPageCreateCampaignTitle',
                    )}`,
                  },
                  { max: 250, message: `${eForm('maxlength')} 250` },
                ]}
                name={['service1', 'title']}
                required
                label={t('EcomBannerManagementPageCreateCampaignTitle')}
              />
            </div>
            <div className="col-span-12">
              <label>{t('EcomBannerManagementPageIamOwnercontentService_1')}</label>
              <span className="text-[14px] text-danger">*</span>
              <Form.Item
                name={['service1', 'content']}
                label=""
                rules={[
                  {
                    required: true,
                    validator: (rule, value) =>
                      checkMultiLanguageRequired(
                        rule,
                        value,
                        `${eForm('pleaseInput')} ${t(
                          'EcomBannerManagementPageIamOwnercontentService_1',
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
                ]}
              >
                <MultiLanguageInput row={5} maxLength={5001} />
              </Form.Item>
            </div>
          </div>

          <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
            <div className="col-span-12 py-2">
              <label className="text-base font-bold text-portal-primaryMainAdmin">
                {t('EcomBannerManagementPageIamOwnerService_2')}
              </label>
            </div>

            <div className="col-span-12">
              <Form.Item
                rules={[
                  {
                    required: !isAddNew
                      ? isAddImgService2 == true
                        ? false
                        : true
                      : dataIamOwner?.service2
                        ? false
                        : true,
                    message: `${eForm('pleaseSelect')} ${t(
                      'EcomBannerManagementPageIamOwnerImgService_2',
                    )}`,
                  },
                ]}
                name="imageService2"
              >
                <UploadFile
                  required
                  urlInit={dataIamOwner?.service2?.imageUrl}
                  onChange={onUploadImageService2}
                  title={comm('maxImage(1image)')}
                  uploadButtonLabel={comm('uploadFiles')}
                ></UploadFile>
              </Form.Item>
            </div>
            <div className="col-span-12">
              <FormFloatInput
                rules={[
                  {
                    required: true,
                    message: `${eForm('pleaseInput')} ${t(
                      'EcomBannerManagementPageCreateCampaignTitle',
                    )}`,
                  },
                  { max: 250, message: `${eForm('maxlength')} 250` },
                ]}
                name={['service2', 'title']}
                required
                label={t('EcomBannerManagementPageCreateCampaignTitle')}
              />
            </div>
            <div className="col-span-12">
              <label>{t('EcomBannerManagementPageIamOwnercontentService_2')}</label>
              <span className="text-[14px] text-danger">*</span>
              <Form.Item
                name={['service2', 'content']}
                label=""
                rules={[
                  {
                    required: true,
                    validator: (rule, value) =>
                      checkMultiLanguageRequired(
                        rule,
                        value,
                        `${eForm('pleaseInput')} ${t(
                          'EcomBannerManagementPageIamOwnercontentService_2',
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
                ]}
              >
                <MultiLanguageInput row={5} maxLength={5001} />
              </Form.Item>
            </div>
          </div>

          <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
            <div className="col-span-12 py-2">
              <label className="text-base font-bold text-portal-primaryMainAdmin">
                {t('EcomBannerManagementPageIamOwnerService_3')}
              </label>
            </div>

            <div className="col-span-12">
              <Form.Item
                rules={[
                  {
                    required: !isAddNew
                      ? isAddImgService3 == true
                        ? false
                        : true
                      : dataIamOwner?.service3
                        ? false
                        : true,
                    message: `${eForm('pleaseSelect')} ${t(
                      'EcomBannerManagementPageIamOwnerImgService_3',
                    )}`,
                  },
                ]}
                name="imageService3"
              >
                <UploadFile
                  required
                  urlInit={dataIamOwner?.service3?.imageUrl}
                  onChange={onUploadImageService3}
                  title={comm('maxImage(1image)')}
                  uploadButtonLabel={comm('uploadFiles')}
                ></UploadFile>
              </Form.Item>
            </div>
            <div className="col-span-12">
              <FormFloatInput
                rules={[
                  {
                    required: true,
                    message: `${eForm('pleaseInput')} ${t(
                      'EcomBannerManagementPageCreateCampaignTitle',
                    )}`,
                  },
                  { max: 250, message: `${eForm('maxlength')} 250` },
                ]}
                name={['service3', 'title']}
                required
                label={t('EcomBannerManagementPageCreateCampaignTitle')}
              />
            </div>
            <div className="col-span-12">
              <label>{t('EcomBannerManagementPageIamOwnercontentService_3')}</label>
              <span className="text-[14px] text-danger">*</span>
              <Form.Item
                name={['service3', 'content']}
                label=""
                rules={[
                  {
                    required: true,
                    validator: (rule, value) =>
                      checkMultiLanguageRequired(
                        rule,
                        value,
                        `${eForm('pleaseInput')} ${t(
                          'EcomBannerManagementPageIamOwnercontentService_3',
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
                ]}
              >
                <MultiLanguageInput row={5} maxLength={5001} />
              </Form.Item>
            </div>
          </div>

          <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
            <div className="col-span-12 py-2">
              <label className="text-base font-bold text-portal-primaryMainAdmin">
                {t('EcomBannerManagementPageIamOwnerContactUs')}
              </label>
            </div>

            <div className="col-span-12">
              <label>{t('EcomBannerManagementPageIamOwnercontentContactUs')}</label>
              <span className="text-[14px] text-danger">*</span>
              <Form.Item
                name={['contactUs', 'content']}
                label=""
                rules={[
                  {
                    required: true,
                    validator: (rule, value) =>
                      checkMultiLanguageRequired(
                        rule,
                        value,
                        `${eForm('pleaseInput')} ${t(
                          'EcomBannerManagementPageIamOwnercontentService_3',
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
                ]}
              >
                <MultiLanguageInput row={5} maxLength={5001} />
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>
    </WrapPageScroll>
  ) : (
    <WaringPermission />
  );
};

export default IamOwnerPage;
