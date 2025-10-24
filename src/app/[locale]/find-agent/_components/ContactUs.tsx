// import iamOwnerStore from '@/stores/iamOwnerStore';
'use client';
import { Input, Spin, Typography } from 'antd';
import { useTranslations } from 'next-intl';

import CoreButton from '@/_components/CoreButton/CoreButton';
import { postEcomOwnerInquiryCreate } from '@/ecom-sadec-api-client';
import useKeywordBanned from '@/hooks/useKeywordBaned';
import { checkValidText } from '@/libs/appconst';
import useGlobalStore from '@/stores/useGlobalStore';
import Form from 'antd/es/form';
import React, { useEffect, useState } from 'react';
import { TypeOptions, toast } from 'react-toastify';

type IProps = { data };
export interface dest {
  name: string;
  type: string;
  value?: string;
}
export interface Info {
  title: string;
  icon: any;
  desc: dest[];
}

export default function ContactUsComponent({ data, ...props }) {
  return <ContactUs data={{ data, ...props }} />;
}

const ContactUs: React.FC<IProps> = ({ data, ...props }) => {
  const t = useTranslations('webLabel');
  const { userInfo } = useGlobalStore();
  // const { contactUsContent } = iamOwnerStore();
  const success = useTranslations('successNotifi');
  const messageError = useTranslations('Message_Required');
  const { keyword } = useKeywordBanned();
  const error = useTranslations('Error');
  const [formSubmit] = Form.useForm();
  const [btnLoading, setBtnLoading] = useState(false);
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);

  const formatPhone = (str: string) => {
    return str.replace(/^84/, '0');
  };

  useEffect(() => {
    resetFields();
  }, [userInfo]);

  const resetFields = async () => {
    if (userInfo?.id) {
      formSubmit.setFieldsValue({
        clientName: userInfo?.firstName + ' ' + userInfo?.lastName,
        email: userInfo?.email,
        message: '',
        phone: formatPhone(userInfo?.phone),
      });
    } else {
      formSubmit.resetFields();
    }
  };

  const submitForm = async () => {
    handleSubmit();
  };

  const handleSubmit = async () => {
    try {
      setBtnLoading(true);
      const formData = formSubmit.getFieldsValue();
      const response = await postEcomOwnerInquiryCreate({
        requestBody: { ...formData },
      });

      if ((response as any).success) {
        setBtnLoading(false);
        notify('success', success('createAPI'));
        resetFields();
      } else {
        setBtnLoading(false);
        notify('error', error('createAPI'));
      }
    } catch (error) {
      setBtnLoading(false);
      notify('error', error(error));
    }
  };

  const validatorCustom = async (rule, value, callback) => {
    try {
      if (value) {
        let stringValid = checkValidText(value, keyword);
        if (stringValid && stringValid.length) {
          rule.message = rule.message + ' ' + stringValid.toString();
          return Promise.reject();
        } else {
          return Promise.resolve();
        }
      } else {
        return Promise.resolve();
      }
    } catch (error) {
      callback(error);
      return Promise.reject('Some message here');
    }
  };
  return (
    <div className="mb-16 max-w-full flex-col rounded-2xl bg-portal-yellow-1 p-7">
      <Typography className="text-3xl font-bold uppercase text-portal-primaryLiving">
        {t('EcomEntrustFindAgents')}
      </Typography>

      {/* send inquiry */}
      <div className="mt-[20px] flex w-full flex-col lg:mb-[70px] lg:mt-[30px]">
        <Form
          className="form-bold w-full"
          autoComplete="off"
          size="large"
          layout={'vertical'}
          form={formSubmit}
          onFinish={submitForm}
        >
          <div className="grid grid-cols-12 gap-x-4">
            <div className="col-span-12">
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: messageError('nameRequired'),
                  },
                  {
                    max: 100,
                    message: `${messageError('maxlength', {
                      number: 100,
                    })} `,
                  },
                  {
                    message: `${messageError('validText')}`,
                    validator: validatorCustom,
                  },
                ]}
                name={'clientName'}
                label={t('EcomPropertyDetailPageTicketName')}
              >
                <Input size="large" className="!rounded-3xl !border-neutral-500 !bg-transparent" />
              </Form.Item>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: messageError('phoneRequired'),
                  },
                  {
                    pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                    message: messageError('formatPhone'),
                  },
                ]}
                name={'phone'}
                label={t('EcomPropertyDetailPageTicketPhone')}
              >
                <Input size="large" className="!rounded-3xl !border-neutral-500 !bg-transparent" />
              </Form.Item>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: messageError('emailRequired'),
                  },
                  {
                    type: 'email',
                    message: messageError('formatEmail'),
                  },
                  {
                    max: 256,
                    message: `${messageError('maxlength', {
                      number: 256,
                    })} `,
                  },
                ]}
                name={'email'}
                label={t('EcomPropertyDetailPageTicketEmail')}
              >
                <Input size="large" className="!rounded-3xl !border-neutral-500 !bg-transparent" />
              </Form.Item>
            </div>
            <div className="col-span-12">
              <Form.Item
                className="area-custom"
                rules={[
                  {
                    required: true,
                    message: messageError('messageRequired'),
                  },
                  {
                    max: 2000,
                    message: `${messageError('maxlength', {
                      number: 2000,
                    })} `,
                  },
                  {
                    message: `${messageError('validText')}`,
                    validator: validatorCustom,
                  },
                ]}
                name={'message'}
                label={t('EcomPropertyDetailPageTicketMessage')}
              >
                <Input.TextArea
                  size="large"
                  rows={3}
                  className="!rounded-3xl !border-neutral-500 !bg-transparent"
                />
              </Form.Item>
            </div>
          </div>
          <div className="mt-[10px] lg:mt-[30px]">
            <Spin spinning={btnLoading}>
              <CoreButton
                className="w-full border border-neutral-500 px-6 !text-pmh-text"
                type="submit"
                label={t('EcomIamOwnerPageSubmit')}
              />
            </Spin>
          </div>
        </Form>
      </div>
    </div>
  );
};
