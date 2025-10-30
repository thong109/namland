// import iamOwnerStore from '@/stores/iamOwnerStore';
'use client';
import { Input, Spin, Typography } from 'antd';
import { useTranslations } from 'next-intl';

import ButtonCore from '@/components/ButtonCore/ButtonCore';
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
        address: userInfo?.address,
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
    <div className="max-w-full flex-col rounded-[10px] bg-white border border-portal-gray-border p-6 md:p-[26px] lg:p-[32px_65px_48px] shadow-soft">
      <Typography className="font-mona text-2xl leading-1.4 font-semibold text-portal-primaryLiving">
        {t('EcomEntrustFindAgents')}
      </Typography>

      {/* send inquiry */}
      <div className="mt-[16px] flex w-full flex-col">
        <Form
          className="form-bold w-full"
          autoComplete="off"
          size="large"
          layout={'vertical'}
          form={formSubmit}
          onFinish={submitForm}
        >
          <div className="grid grid-cols-12 gap-x-2 md:gap-x-[20px] lg:gap-x-[74px] gap-y-[20px] lg:gap-y-[27px] pb-10 md:pb-[52px] border-b border-portal-gray-border">
            <div className="col-span-12 md:col-span-6">
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
            </div>
            <div className="col-span-12 md:col-span-6">
              <Form.Item
                className="input-common-contact"
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
              >
                <Input placeholder={t('EcomPropertyDetailPageTicketPhoneNumber')} className='text-sm md:text-lg border-0 border-b border-portal-gray-3 placeholder-portal-gray-7 focus:bg-transparent focus:border-portal-gray-3 bg-transparent rounded-none p-0' />
              </Form.Item>
            </div>
            <div className="col-span-12 md:col-span-6">
              <Form.Item
                className="input-common-contact"
                rules={[
                  { type: 'email', message: messageError('formatEmail') },
                  { max: 256, message: `${messageError('maxlength', { number: 256 })} ` }
                ]}
                name={'email'}
              >
                <Input placeholder={t('EcomPropertyDetailPageReviewEmail')} className='text-sm md:text-lg border-0 border-b border-portal-gray-3 placeholder-portal-gray-7 focus:bg-transparent focus:border-portal-gray-3 bg-transparent rounded-none p-0' />
              </Form.Item>
            </div>
            <div className="col-span-12 md:col-span-6">
              <Form.Item
                className="input-common-contact"
                rules={[{ message: `${messageError('validText')}`, validator: validatorCustom }]}
                name={'address'}
              >
                <Input placeholder={t('EcomContactUsPageDetailPageAddress')} className='text-sm md:text-lg border-0 border-b border-portal-gray-3 placeholder-portal-gray-7 focus:bg-transparent focus:border-portal-gray-3 bg-transparent rounded-none p-0' />
              </Form.Item>
            </div>
            <div className="col-span-12">
              <Form.Item
                className="area-custom input-common-contact"
                rules={[
                  { max: 2000, message: `${messageError('maxlength', { number: 2000 })} ` },
                  { message: `${messageError('validText')}`, validator: validatorCustom },
                ]}
                name={'message'}
              >
                <Input.TextArea
                  placeholder={t('EcomPropertyDetailPageTicketLeaveATicket')}
                  size="large"
                  rows={1}
                  className='text-sm md:text-lg border-0 border-b border-portal-gray-3 placeholder-portal-gray-7 focus:bg-transparent focus:border-portal-gray-3 bg-transparent rounded-none p-0'
                />
              </Form.Item>
            </div>
          </div>
          <div className="mt-[30px]">
            <Spin spinning={btnLoading}>
              <ButtonCore className="form-common-contact__controller-submit form-common-contact__controller-submit-sm !max-w-[161px]" type="submit" label={t('EcomIamOwnerPageSubmit')} />
            </Spin>
          </div>
        </Form>
      </div>
    </div>
  );
};
