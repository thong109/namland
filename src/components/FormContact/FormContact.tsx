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

export default function FormContact() {
  const t = useTranslations('webLabel');
  const success = useTranslations('successNotifi');
  const messageError = useTranslations('Message_Required');
  const errorMessage = useTranslations('Error');
  const { keyword } = useKeywordBanned();
  const { userInfo } = useGlobalStore();
  const locale = useLocale();

  const [formSubmit] = Form.useForm();
  const [btnLoading, setBtnLoading] = useState(false);

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
      setBtnLoading(true);
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
      setBtnLoading(false);
    }
  };

  return (
    <div className="bg-portal-gray/60">
      <div className="container">
        <div className="flex w-full flex-col desktop:pt-12 desktop:pb-16">
          <Typography className="text-center text-[20px] font-bold text-portal-red-3 lg:text-[35px] mb-3 uppercase">
            {t('EcomContactUsPageDetailPageSendUsAnEmail')}
          </Typography>
          <Typography className="text-center text-lg font-normal text-portal-portal-6 desktop:max-w-[1172px] mx-auto">
            {t('EcomContactUsPageDetailPageNote')}
          </Typography>

          <Form
            className="w-full grid grid-cols-1 lg:grid-cols-2 gap-x-[30px] desktop:max-w-[1084px] mx-auto mt-[10px]"
            autoComplete="off"
            layout="vertical"
            form={formSubmit}
            size="large"
            onFinish={handleSubmit}
          >
            <Form.Item
              className="!mb-0"
              name="clientName"
              rules={[
                { required: true, message: messageError('nameRequired') },
                { max: 100, message: `${messageError('maxlength', { number: 100 })}` },
                { validator: validatorCustom, message: messageError('validText') },
              ]}
            >
              <Input placeholder={t('EcomPropertyDetailPageTicketName')} className='text-lg border-0 border-b border-portal-gray-3 placeholder-portal-gray-7 focus:bg-transparent focus:border-portal-gray-3 bg-transparent rounded-none p-0' />
            </Form.Item>

            <Form.Item
              className="!mb-0"
              name="phone"
              rules={[
                { required: true, message: messageError('phoneRequired') },
                {
                  pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                  message: messageError('formatPhone'),
                },
              ]}
            >
              <Input placeholder={t('EcomPropertyDetailPageTicketPhone')} className='text-lg border-0 border-b border-portal-gray-3 placeholder-portal-gray-7 focus:bg-transparent focus:border-portal-gray-3 bg-transparent rounded-none p-0' />
            </Form.Item>

            <Form.Item
              className="!mb-0"
              name="email"
              rules={[
                { required: true, message: messageError('emailRequired') },
                { type: 'email', message: messageError('formatEmail') },
                { max: 256, message: `${messageError('maxlength', { number: 256 })}` },
              ]}
            >
              <Input placeholder={t('EcomPropertyDetailPageTicketEmail')} className='text-lg border-0 border-b border-portal-gray-3 placeholder-portal-gray-7 focus:bg-transparent focus:border-portal-gray-3 bg-transparent rounded-none p-0' />
            </Form.Item>

            <Form.Item
              className="!mb-0"
              name="message"
              rules={[
                { required: true, message: messageError('messageRequired') },
                { max: 2000, message: `${messageError('maxlength', { number: 2000 })}` },
                { validator: validatorCustom, message: messageError('validText') },
              ]}
            >
              <Input placeholder={t('EcomPropertyDetailPageTicketMessage')} className='text-lg border-0 border-b border-portal-gray-3 placeholder-portal-gray-7 focus:bg-transparent focus:border-portal-gray-3 bg-transparent rounded-none p-0' />
            </Form.Item>

            <div className="col-span-1 lg:col-span-2 flex justify-center mt-[45px]">
              <Spin spinning={btnLoading}>
                <CoreButton
                  className="bg-portal-primaryLiving mx-auto min-w-auto !rounded-[4px] w-[136px] !min-w-auto min-h-[35px] text-white text-base !p-[3px_10px]"
                  type="submit"
                  label={t('HomePageContactUsPageSubmit')}
                />
              </Spin>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
