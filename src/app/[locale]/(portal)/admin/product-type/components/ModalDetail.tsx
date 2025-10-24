import listingCategoriApiService from '@/apiServices/externalApiServices/apiListingCategoryService';
import ButtonBack from '@/components/Button/ButtonBack/ButtonBack';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import MultiLanguageInput from '@/components/FormInput/MultiLanguageInput';
import UploadFile from '@/components/UploadFile/UploadFile';
import useKeywordBanned from '@/hooks/useKeywordBaned';
import { listStatusProject } from '@/libs/appconst';
import {
  checkMultiLanguageMaxLength,
  checkMultiLanguageRequired,
  checkTextMultiLanguageInBlackListForForm,
} from '@/libs/helper';
import { Radio, Spin, Switch } from 'antd';
import Form from 'antd/es/form';
import Modal from 'antd/es/modal';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { TypeOptions, toast } from 'react-toastify';

interface ModalDetailProps {
  closeModal: (isReload) => void;
  open: boolean;
  idDetail?: string;
}

const ModalDetail: React.FC<ModalDetailProps> = ({ idDetail, open, closeModal }) => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);

  const [productTypeForm] = Form.useForm();

  const { keyword } = useKeywordBanned();

  const t = useTranslations('webLabel');
  const success = useTranslations('successNotifi');
  const errorNoti = useTranslations('errorNotifi');
  const eForm = useTranslations('error');
  const comm = useTranslations('Common');
  const [productType, setProductType] = useState<any>(undefined);
  const [isRequiredIcon, setIsRequiredIcon] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    if (open === true) {
      getDetail();
    }
  }, [open]);

  const getDetail = async () => {
    if (idDetail) {
      const data = await listingCategoriApiService.getById(idDetail);
      setIsLoading(false);
      setProductType(data);
      productTypeForm.setFieldsValue({
        ...data,
      });

      if (data?.iconUrl) {
        setIsRequiredIcon(false);
      }
    } else {
      productTypeForm.resetFields();
      setIsLoading(false);
      setProductType(undefined);
      setIsRequiredIcon(true);
    }
  };

  const handleOk = async () => {
    await productTypeForm.validateFields();
    const values = productTypeForm.getFieldsValue();

    if (idDetail) {
      try {
        const body = {
          ...productType,
          ...values,
          id: idDetail ?? undefined,
          listingCategoryTranslation: values.listingCategoryTranslation.filter(
            (item) => item?.value?.length > 0,
          ),
          iconUrl: values?.productIcon ?? productType?.iconUrl,
        };
        await listingCategoriApiService.update(body);
        notify('success', success('updateAPI'));
      } catch {
        notify('success', success('updateAPI'));
      }
    } else {
      try {
        const body = {
          ...values,
          id: undefined,
          listingCategoryTranslation: values.listingCategoryTranslation.filter(
            (item) => item?.value?.length > 0,
          ),
          iconUrl: undefined,
        };
        await listingCategoriApiService.create(body);
        notify('success', success('createAPI'));
      } catch {
        notify('error', errorNoti('createAPI'));
      }
    }
    closeModal(true);
  };

  const onUploadIcon = (file: File) => {
    if (file == undefined) {
      setIsRequiredIcon(true);
    } else {
      setIsRequiredIcon(false);
    }
  };

  const handleCanncel = () => {
    productTypeForm.resetFields();
    setProductType(undefined);

    closeModal(false);
  };

  return (
    <Modal
      onCancel={handleCanncel}
      mask={false}
      open={open}
      maskClosable={false}
      closeIcon={false}
      footer={[
        <div className="flex justify-end">
          <ButtonBack text={t('goBack')} onClick={handleCanncel} />
          <ButtonPrimary text={comm('confirm')} onClick={handleOk} className="ml-1 rounded-full" />
        </div>,
      ]}
    >
      <div className="w-full text-center">
        <span className="text-xl font-semibold">
          {t('EcomBannerManagementPageProductTypeInfo')}
        </span>
      </div>
      <Form form={productTypeForm} layout="vertical">
        <div className="mb-5 grid grid-cols-12 gap-x-2">
          <div className="col-span-12">
            <span>{t('EcomMemberPageListProductTypeName')}</span>
            <Form.Item
              name="listingCategoryTranslation"
              rules={[
                {
                  required: true,
                  validator: (rule, value) =>
                    checkMultiLanguageRequired(
                      rule,
                      value,
                      `${eForm('pleaseInput')} ${t('EcomMemberPageListProductTypeName')}`,
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
          {isLoading ? (
            <div className="flex h-[300px] w-full items-center justify-center">
              <Spin />
            </div>
          ) : (
            <div className="col-span-12">
              <label>{t('EcomBannerManagementPageProductTypeIcon')}</label>
              <Form.Item
                rules={[
                  {
                    required: isRequiredIcon,
                    message: `${eForm('pleaseSelect')} ${t('EcomMemberPageListAmenityIcon')}`,
                  },
                ]}
                name="productIcon"
              >
                <UploadFile
                  onChange={onUploadIcon}
                  required
                  urlInit={productType?.iconUrl}
                  title={comm('UploadIcon(1image)')}
                  uploadButtonLabel={comm('uploadFiles')}
                ></UploadFile>
              </Form.Item>
            </div>
          )}
          <div className="col-span-12">
            <Form.Item
              rules={[
                {
                  required: true,
                  message: `${eForm('pleaseSelect')} ${t(
                    'EcomBannerManagementPageProductTypeType',
                  )}`,
                },
              ]}
              name="type"
              label={t('EcomBannerManagementPageProductTypeType')}
            >
              <Radio.Group className="grid w-full grid-cols-2">
                {listStatusProject.map((item) => (
                  <Radio className="col-span-1" value={item?.id}>
                    {t(item?.name)}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          </div>

          <div className="col-span-12">
            <Form.Item
              name="isCommercial"
              valuePropName="checked"
              label={t('EcomBannerManagementPageCreateNewIsCommercial')}
            >
              <Switch className="mr-2 bg-[#b0b2b8]" />
            </Form.Item>
          </div>
          <div className="col-span-12">
            <Form.Item
              name="isActive"
              valuePropName="checked"
              label={t('EcomBannerManagementPageCreateNewIsActive')}
            >
              <Switch className="mr-2 bg-[#b0b2b8]" />
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalDetail;
