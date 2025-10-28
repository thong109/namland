'use client';

import ButtonCore from '@/components/ButtonCore/ButtonCore';
import { postEcomEcomContactContactUs } from '@/ecom-sadec-api-client';
import { useMutation } from '@tanstack/react-query';
import { Form, Input, Spin } from 'antd';
import { Rule } from 'antd/es/form';
import { useTranslations } from 'next-intl';
import React, { FC, useMemo } from 'react';
import { TypeOptions, toast } from 'react-toastify';

export interface IProps {}

export type FormSchema = {
  clientName?: string;
  phone?: string;
  email?: string;
  message?: string;
};

type RuleSchema = {
  clientName?: Rule[];
  phone?: Rule[];
  email?: Rule[];
  message?: Rule[];
};

const FooterContactForm: FC<IProps> = () => {
  const success = useTranslations('successNotifi');
  const messageError = useTranslations('Message_Required');
  const error = useTranslations('Error');
  const t = useTranslations('webLabel');
  const [formSubmit] = Form.useForm();

  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);

  const rules: RuleSchema = useMemo(
    () => ({
      clientName: [
        {
          required: true,
          message: messageError('nameRequired'),
        },
      ],
      phone: [
        {
          required: true,
          message: messageError('phoneRequired'),
        },
        {
          pattern: /(84|0|3|5|7|8|9)+([0-9]{8})\b/g,
          message: messageError('formatPhone'),
        },
      ],
      email: [
        {
          required: true,
          message: messageError('emailRequired'),
        },
        {
          type: 'email',
          message: messageError('formatEmail'),
        },
      ],
      message: [
        {
          required: true,
          message: messageError('messageRequired'),
        },
      ],
    }),
    [t],
  );

  const contactUsMutation = useMutation({
    mutationKey: ['homepage-contact-us'],
    mutationFn: async (values: FormSchema) => {
      await postEcomEcomContactContactUs({
        requestBody: {
          clientName: values.clientName,
          phone: values.phone,
          email: values.email,
          message: values.message,
        },
      });
    },
  });

  const submitForm = async (values: FormSchema) => {
    try {
      await contactUsMutation.mutateAsync(values);
      notify('success', success('createAPI'));
      formSubmit.resetFields();
    } catch (err) {
      notify('error', error(err));
    }
  };

  return (
    <div className="bg-green py-8 lg:py-16">
      <div className="container w-full">
        <h2 className="mb-8 text-center text-2xl text-portal-yellow">
          {t('HomePageContactUsSendToOurEmail')}
        </h2>
        <Form
          className="grid w-full grid-cols-6 gap-x-16 lg:grid-cols-12"
          autoComplete="off"
          layout={'horizontal'}
          form={formSubmit}
          onFinish={submitForm}
          requiredMark={false}
        >
          <div className="col-span-6 grid grid-cols-12 gap-4">
            <label className="col-span-full flex items-center uppercase text-neutral-0 lg:col-span-4">
              {t('EcomContactUsPageDetailPageName')}
            </label>
            <Form.Item
              className="col-span-full mb-0 lg:col-span-8"
              name={'clientName'}
              rules={rules.clientName}
            >
              <Input maxLength={100} className="!rounded-none" />
            </Form.Item>
            <label className="col-span-full flex items-center uppercase text-neutral-0 lg:col-span-4">
              {t('EcomPropertyDetailPageTicketPhone')}
            </label>
            <Form.Item
              className="col-span-full mb-0 lg:col-span-8"
              name={'phone'}
              rules={rules.phone}
            >
              <Input className="!rounded-none" />
            </Form.Item>
          </div>

          <div className="col-span-6 grid grid-cols-12 gap-4">
            <label className="col-span-full flex items-center uppercase text-neutral-0 lg:col-span-4">
              {t('EcomContactUsPageDetailPageEmail')}
            </label>
            <Form.Item
              className="col-span-full mb-0 lg:col-span-8"
              name={'email'}
              rules={rules.email}
            >
              <Input maxLength={256} className="!rounded-none" />
            </Form.Item>

            <label className="col-span-full flex items-center uppercase text-neutral-0 lg:col-span-4">
              {t('EcomContactUsPageDetailPageEnterYourMessage')}
            </label>
            <Form.Item
              className="area-custom col-span-full mb-0 lg:col-span-8"
              name={'message'}
              rules={rules.message}
            >
              <Input maxLength={256} className="!rounded-none" />
            </Form.Item>
          </div>
          <div className="col-span-full mt-[30px]">
            <Spin spinning={contactUsMutation.isPending}>
              <ButtonCore
                disabled={contactUsMutation.isPending}
                className="w-full !rounded-none bg-portal-yellow py-4 text-lg !text-green"
                type="submit"
                label={t('HomePageContactUsPageSubmit')}
              />
            </Spin>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default React.memo(FooterContactForm);
