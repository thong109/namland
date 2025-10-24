import agentApiService from '@/apiServices/externalApiServices/findAgentService';
import ButtonBack from '@/components/Button/ButtonBack/ButtonBack';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import UploadFile from '@/components/UploadFile/UploadFile';
import { Spin, Switch } from 'antd';
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

const AgentDetailModal: React.FC<ModalDetailProps> = ({ idDetail, open, closeModal }) => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);

  const [agentForm] = Form.useForm();

  const t = useTranslations('webLabel');
  const success = useTranslations('successNotifi');
  const errorNoti = useTranslations('errorNotifi');
  const eForm = useTranslations('error');
  const comm = useTranslations('Common');
  const [agentInfo, setAgentInfo] = useState<any>(undefined);
  const [isRequiredIcon, setIsRequiredIcon] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    if (open === true) {
      getDetail();
    }
  }, [open]);

  const getDetail = async () => {
    if (idDetail) {
      const data = await agentApiService.getById(idDetail);
      setIsLoading(false);
      setAgentInfo(data);

      agentForm.setFieldsValue({
        ...data,
      });

      if (data?.imageUrl) {
        setIsRequiredIcon(false);
      }
    } else {
      agentForm.resetFields();
      setIsLoading(false);
      setAgentInfo(undefined);
      setIsRequiredIcon(true);
    }
  };

  const handleOk = async () => {
    await agentForm.validateFields();
    const values = agentForm.getFieldsValue();

    if (idDetail) {
      try {
        const body = {
          ...values,
          id: idDetail,
          isActive: values?.isActive,
        };
        await agentApiService.updateAgent(body);
        notify('success', success('updateAPI'));
      } catch {
        notify('success', success('updateAPI'));
      }
    } else {
      try {
        const body = {
          ...values,
        };
        await agentApiService.createAgent(body);
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
    agentForm.resetFields();
    setAgentInfo(undefined);

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
        <span className="text-xl font-semibold">{t('EcomBannerManagementPageAgentInfo')}</span>
      </div>
      <Form form={agentForm} layout="vertical">
        <div className="mb-5 grid grid-cols-12 gap-x-2">
          {isLoading ? (
            <div className="flex h-[300px] w-full items-center justify-center">
              <Spin />
            </div>
          ) : (
            <div className="col-span-12">
              <label>{t('EcomBannerManagementPageAgentImage')}</label>
              <Form.Item
                rules={[
                  {
                    required: isRequiredIcon,
                    message: `${eForm('pleaseSelect')} ${t('EcomBannerManagementPageAgentImage')}`,
                  },
                ]}
                name="image"
              >
                <UploadFile
                  onChange={onUploadIcon}
                  required
                  urlInit={agentInfo?.imageUrl}
                  title={comm('UploadImage(1image)')}
                  uploadButtonLabel={comm('uploadFiles')}
                ></UploadFile>
              </Form.Item>
            </div>
          )}

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

export default AgentDetailModal;
