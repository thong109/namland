'use client';

import React, { useEffect, useState } from 'react';
import { Form, Input, Spin, Typography } from 'antd';
import CoreButton from '@/_components/CoreButton/CoreButton';
import { useLocale, useTranslations } from 'next-intl';
import { TypeOptions, toast } from 'react-toastify';
import { postEcomEcomContactContactUs } from '@/ecom-sadec-api-client';
import useKeywordBanned from '@/hooks/useKeywordBaned';
import { checkValidText } from '@/libs/appconst';
import useGlobalStore from '@/stores/useGlobalStore';
import * as pixel from '@/utils/pixel';
import './SectionContact.css';

export default function SectionContact() {
  const t = useTranslations('webLabel');
  const success = useTranslations('successNotifi');
  const messageError = useTranslations('Message_Required');
  const errorMessage = useTranslations('errorNotifi');
  const { keyword } = useKeywordBanned();
  const { userInfo } = useGlobalStore();
  const locale = useLocale();
  const [formSubmit] = Form.useForm();
  const [buttonLoading, setButtonLoading] = useState(false);

  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](String(message));
  }, []);
  const formatPhone = (str: string) => str.replace(/^84/, '0');
  useEffect(() => {
    if (userInfo?.id) {
      formSubmit.setFieldsValue({
        clientName: `${userInfo.firstName} ${userInfo.lastName}`,
        email: userInfo.email,
        phone: formatPhone(userInfo.phone),
        message: '',
      });
    } else {
      formSubmit.resetFields();
    }
  }, [userInfo]);
  const validatorCustom = async (_: any, value: string) => {
    if (value) {
      const stringValid = checkValidText(value, keyword);
      if (stringValid?.length) {
        return Promise.reject(new Error(stringValid.toString()));
      }
    }
    return Promise.resolve();
  };
  const handleSubmit = async () => {
    try {
      setButtonLoading(true);
      const formData = formSubmit.getFieldsValue();
      const response = await postEcomEcomContactContactUs({ requestBody: { ...formData } });

      if ((response as any).success) {
        pixel.contact();
        notify('success', success('createAPI'));
        formSubmit.resetFields();
      } else {
        notify('error', errorMessage('createAPI'));
      }
    } catch (err) {
      notify('error', errorMessage('createAPI'));
    } finally {
      setButtonLoading(false);
    }
  };
  return (
    <div className="section-common-contact">
      <div className="container">
        <div className="section-common-contact__wrapper">
          <Typography className="section-common-contact__title">{t('EcomContactUsPageDetailPageSendUsAnEmail')}</Typography>
          <Typography className="section-common-contact__detail">{t('EcomContactUsPageDetailPageNote')}</Typography>
          <Form className="form-common-contact" autoComplete="off" layout="vertical" form={formSubmit} size="large" onFinish={handleSubmit}>
            <div className="form-common-contact__wrapper">
              <Form.Item
                className="input-common-contact"
                name="clientName"
                rules={[
                  { required: true, message: messageError('nameRequired') },
                  { max: 100, message: `${messageError('maxlength', { number: 100 })}` },
                  { validator: validatorCustom, message: messageError('validText') },
                ]}
              >
                <Input placeholder={t('EcomPropertyDetailPageTicketName')} className='text-sm md:text-lg border-0 border-b border-portal-gray-3 placeholder-portal-gray-7 focus:bg-transparent focus:border-portal-gray-3 bg-transparent rounded-none p-0' />
              </Form.Item>
              <Form.Item
                className="input-common-contact"
                name="phone"
                rules={[
                  { required: true, message: messageError('phoneRequired') },
                  {
                    pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                    message: messageError('formatPhone'),
                  },
                ]}
              >
                <Input placeholder={t('EcomPropertyDetailPageTicketPhone')} className='text-sm md:text-lg border-0 border-b border-portal-gray-3 placeholder-portal-gray-7 focus:bg-transparent focus:border-portal-gray-3 bg-transparent rounded-none p-0' />
              </Form.Item>
              <Form.Item
                className="input-common-contact"
                name="email"
                rules={[
                  { required: true, message: messageError('emailRequired') },
                  { type: 'email', message: messageError('formatEmail') },
                  { max: 256, message: `${messageError('maxlength', { number: 256 })}` },
                ]}
              >
                <Input placeholder={t('EcomPropertyDetailPageTicketEmail')} className='text-sm md:text-lg border-0 border-b border-portal-gray-3 placeholder-portal-gray-7 focus:bg-transparent focus:border-portal-gray-3 bg-transparent rounded-none p-0' />
              </Form.Item>
              <Form.Item
                className="input-common-contact"
                name="message"
                rules={[
                  { required: true, message: messageError('messageRequired') },
                  { max: 2000, message: `${messageError('maxlength', { number: 2000 })}` },
                  { validator: validatorCustom, message: messageError('validText') },
                ]}
              >
                <Input placeholder={t('EcomPropertyDetailPageTicketMessage')} className='text-sm md:text-lg border-0 border-b border-portal-gray-3 placeholder-portal-gray-7 focus:bg-transparent focus:border-portal-gray-3 bg-transparent rounded-none p-0' />
              </Form.Item>
            </div>
            <div className="form-common-contact__controller">
              <Spin spinning={buttonLoading}>
                <CoreButton className="form-common-contact__controller-submit" type="submit" label={t('HomePageContactUsPageSubmit')} />
              </Spin>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
