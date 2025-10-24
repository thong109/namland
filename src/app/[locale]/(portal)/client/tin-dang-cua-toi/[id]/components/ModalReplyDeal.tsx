import propertyApiService from '@/apiServices/externalApiServices/propertyApiService';
import { IconModalReplyDeal } from '@/libs/appComponents';
import { inputNumberFormatter } from '@/libs/helper';
import { PropertyStatus } from '@/models/propertyModel/propertyDetailModel';
import { Button, Col, Form, Input, InputNumber, Row } from 'antd';
import Modal from 'antd/es/modal';
import { useTranslations } from 'next-intl';
import React from 'react';
import { TypeOptions, toast } from 'react-toastify';

interface ModalReplyDealProps {
  closeModal: () => void;
  open: boolean;
  property: any;
}

const ModalReplyDeal: React.FC<ModalReplyDealProps> = ({ property, open, closeModal }) => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);
  const success = useTranslations('successNotifi');
  const t = useTranslations('Common');
  const error = useTranslations('error');
  const [formData] = Form.useForm();

  const handleCanncel = () => {
    closeModal();
  };

  const sendReplyDeal = async (isApproval) => {
    if (isApproval) {
      await formData.validateFields();
      const values = formData.getFieldsValue();
      const body = {
        listingId: property?.id,
        ...values,
      };

      await propertyApiService.updateActualPrice(body);
      notify('success', success('updateAPI'));
    } else {
      await formData.validateFields();
      const values = formData.getFieldsValue();
      const body = {
        listingId: property?.id,
        ...values,
      };

      await propertyApiService.updateActualPrice(body);
      notify('success', success('updateAPI'));
    }
    formData.resetFields();
    closeModal();
  };

  return (
    <Modal
      onCancel={handleCanncel}
      mask={false}
      open={open}
      maskClosable={false}
      closeIcon={false}
      footer={[
        <div className="flex justify-center">
          <Button size="large" className="mr-1 rounded-xl text-sm" onClick={handleCanncel}>
            <span> {t('goBack')}</span>
          </Button>

          <Button
            size="large"
            className="rounded-xl !bg-[#FFD14B] text-sm !text-white"
            onClick={() => sendReplyDeal(true)}
          >
            <span> {t('MarkSold')}</span>
          </Button>
        </div>,
      ]}
    >
      <div className="h-100">
        <Form form={formData} layout="vertical">
          <Row gutter={[4, 2]}>
            <Col span={24} className="my-4 flex justify-center">
              {IconModalReplyDeal}
            </Col>

            <Col span={24} className="mt-2 flex justify-center">
              <label className="mt-2 text-xl font-bold text-portal-primaryLiving">
                {property?.status === PropertyStatus.Expired
                  ? t('titleListingNotReplyDealExpired')
                  : t('titleListingNotReplyDealMarkDone')}
              </label>
            </Col>
            <Col span={24}>
              <p className="my-2 text-sm">
                {' '}
                {property?.status === PropertyStatus.Expired
                  ? t('noteListingNotReplyDeal')
                  : t('titleListingNotReplyDealMarkDone1')}
              </p>
              {property?.status !== PropertyStatus.Expired && (
                <p className="my-2 text-sm">{t('noteListingNotReplyDealMarkDone2')}</p>
              )}
            </Col>
            <Col span={24}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: `${error('pleaseInput')} ${t('inputReplyDetail')}`,
                  },
                ]}
                name={'actualPrice'}
                label={''}
              >
                <InputNumber
                  min={0}
                  size="middle"
                  formatter={(value) => inputNumberFormatter(value)}
                  className="w-full"
                  placeholder={t('inputReplyDetail')}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: `${error('pleaseInput')} ${t('inputReplyClientName')}`,
                  },
                ]}
                name={'clientName'}
                label={''}
              >
                <Input size="middle" className="w-full" placeholder={t('inputReplyClientName')} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: `${error('pleaseInput')} ${t('inputReplyClientPhone')}`,
                  },
                ]}
                name={'clientPhone'}
                label={''}
              >
                <Input
                  min={0}
                  size="middle"
                  className="w-full"
                  placeholder={t('inputReplyClientPhone')}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: `${error('pleaseInput')} ${t('inputReplyClientEmail')}`,
                  },
                ]}
                name={'clientEmail'}
                label={''}
              >
                <Input
                  min={0}
                  size="middle"
                  className="w-full"
                  placeholder={t('inputReplyClientEmail')}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <p className="mt-2 text-sm">
                {property?.status === PropertyStatus.Expired
                  ? t('noteListingNotReplyDeal2')
                  : t('noteThankyouMarkDone3')}
              </p>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
};

export default ModalReplyDeal;
