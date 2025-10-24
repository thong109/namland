import amenityApiService from '@/apiServices/externalApiServices/apiAmenityService';
import ButtonBack from '@/components/Button/ButtonBack/ButtonBack';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import MultiLanguageInput from '@/components/FormInput/MultiLanguageInput';
import UploadFile from '@/components/UploadFile/UploadFile';
import useKeywordBanned from '@/hooks/useKeywordBaned';
import { ListamenityType } from '@/libs/appconst';
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

const AmenitiDetailPopup: React.FC<ModalDetailProps> = ({ idDetail, open, closeModal }) => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);

  const [amenityForm] = Form.useForm();

  const { keyword } = useKeywordBanned();

  const t = useTranslations('webLabel');
  const success = useTranslations('successNotifi');
  const errorNoti = useTranslations('errorNotifi');
  const eForm = useTranslations('error');
  const comm = useTranslations('Common');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRequiredIcon, setIsRequiredIcon] = useState<boolean>(false);
  const [amenityDetail, setAmenityDetail] = useState<any>(undefined);

  useEffect(() => {
    if (open === true) {
      getDetail();
    }
  }, [open]);

  const getDetail = async () => {
    if (idDetail) {
      const data = await amenityApiService.getById(idDetail);
      setIsLoading(false);
      setAmenityDetail(data);
      if (data?.iconUrl) {
        setIsRequiredIcon(false);
      }
      amenityForm.setFieldsValue({
        ...data,
      });
    } else {
      amenityForm.resetFields();
      setAmenityDetail(undefined);
      setIsLoading(false);
      setIsRequiredIcon(true);
    }
  };

  const onUploadProjectLogo = (file: File) => {
    if (file == undefined) {
      setIsRequiredIcon(true);
    } else {
      setIsRequiredIcon(false);
    }
  };

  const handleOk = async () => {
    await amenityForm.validateFields();
    const values = amenityForm.getFieldsValue();

    const body = {
      ...amenityDetail,
      id: idDetail ?? undefined,
      ...values,
      amenitiesTranslation: values.amenitiesTranslation.filter((item) => item.value?.length > 0),
    };

    if (idDetail) {
      try {
        await amenityApiService.update(body);
        notify('success', success('updateAPI'));
      } catch {
        notify('success', success('updateAPI'));
      }
    } else {
      try {
        await amenityApiService.create(body);
        notify('success', success('createAPI'));
      } catch (e) {
        notify('error', errorNoti('createAPI'));
      }
    }
    handleCanncel(true);
  };

  const handleCanncel = (isReloadList: boolean) => {
    amenityForm.resetFields();
    closeModal(isReloadList);
  };

  return (
    <Modal
      onCancel={() => handleCanncel(false)}
      mask={false}
      open={open}
      maskClosable={false}
      closeIcon={false}
      footer={[
        <div className="flex justify-end">
          <ButtonBack text={t('goBack')} onClick={() => handleCanncel(false)} />
          <ButtonPrimary text={comm('confirm')} onClick={handleOk} className="ml-1 rounded-full" />
        </div>,
      ]}
    >
      <div className="w-full text-center">
        <span className="text-xl font-semibold">{t('EcomBannerManagementPageAmenityInfo')}</span>
      </div>

      <Form form={amenityForm} layout="vertical">
        <div className="mb-5 grid grid-cols-12 gap-x-2">
          <div className="col-span-12">
            <span>{t('EcomMemberPageListAmenityTitle')}</span>
            <Form.Item
              name="amenitiesTranslation"
              rules={[
                {
                  required: true,
                  validator: (rule, value) =>
                    checkMultiLanguageRequired(
                      rule,
                      value,
                      `${eForm('pleaseInput')} ${t('EcomMemberPageListAmenityTitle')}`,
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
              <Form.Item
                rules={[
                  {
                    required: isRequiredIcon,
                    message: `${eForm('pleaseSelect')} ${t('EcomMemberPageListAmenityIcon')}`,
                  },
                ]}
                name="amenityIcon"
              >
                <UploadFile
                  required
                  urlInit={amenityDetail?.imageUrl}
                  onChange={onUploadProjectLogo}
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
                {ListamenityType.map((item) => (
                  <Radio className="col-span-1" value={item?.id}>
                    {comm(item?.name)}
                  </Radio>
                ))}
              </Radio.Group>
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

export default AmenitiDetailPopup;
