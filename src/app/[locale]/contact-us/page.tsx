'use client';
import CoreButton from '@/_components/CoreButton/CoreButton';
import IconClock from '@/assets/icon/icon-clock-us.svg';
import IconLocation from '@/assets/icon/icon-location-us.svg';
import IconPhone from '@/assets/icon/icon-phone-us.svg';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
// import GoogleMapComponent from '@/components/GoogleMap';
import { postEcomEcomContactContactUs } from '@/ecom-sadec-api-client';
import useKeywordBanned from '@/hooks/useKeywordBaned';
import { checkValidText } from '@/libs/appconst';
import LocaltionConstant from '@/libs/constants/locationConstant';
import useGlobalStore from '@/stores/useGlobalStore';
import * as pixel from '@/utils/pixel';
import { Checkbox, Form, Input, Spin, Typography } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { TypeOptions, toast } from 'react-toastify';

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
const info: Info[] = [
  {
    title: 'EcomContactUsPageDetailPageAddress',
    desc: [{ name: 'EcomContactUsPageDetailAddressLocation', type: 'translate' }],
    icon: IconLocation,
  },
  {
    title: 'EcomContactUsPageDetailPageContact',
    desc: [
      { name: 'MOBILE_CALL', type: 'phone' },
      { name: 'MALL_CALL', type: 'email' },
    ],
    icon: IconPhone,
  },
  {
    title: 'EcomContactUsPageDetailPageHourOfOperation',
    desc: [
      { name: 'EcomContactUsPageDetailPageHourOfOperationDetail1', type: 'translate' },
      // {
      //   name: 'EcomContactUsPageDetailPageHourOfOperationDetail2',
      //   type: 'translate',
      // },
    ],
    icon: IconClock,
  },
];
export interface IProps {
  params: any;
}

export default function ContactUs() {
  return <PageContactUs />;
}

function PageContactUs() {
  const { userInfo } = useGlobalStore();
  const t = useTranslations('webLabel');
  const success = useTranslations('successNotifi');
  const messageError = useTranslations('Message_Required');
  const error = useTranslations('Error');
  const { keyword } = useKeywordBanned();
  const [didAceeptTerms, setDidAceeptTerms] = React.useState<boolean>(false);
  const locale = useLocale();
  const PMHCenter = LocaltionConstant.PMHCoordinate;
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

  const openLink = () => {
    window.open(`${window.location.origin}/${locale}/quy-che-hoat-dong`, '_blank');
  };

  const openLinkDieukhoandieukien = () => {
    window.open(`${window.location.origin}/${locale}/dieu-khoan-dieu-kien`, '_blank');
  };

  const submitForm = async () => {
    handleSubmit();
  };

  const handleSubmit = async () => {
    try {
      setBtnLoading(true);
      const formData = formSubmit.getFieldsValue();
      const response = await postEcomEcomContactContactUs({ requestBody: { ...formData } });

      if ((response as any).success) {
        setBtnLoading(false);
        pixel.contact();
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
    <div className="container px-3 pb-20 xl:px-0">
      <Breadcrumb
        className="mb-4"
        items={[
          { path: '/', title: 'Trang chủ' },
          { path: '', title: 'Liên hệ' }, 
        ]}
      />
      <Typography className="text-center text-3xl font-bold text-portal-primaryLiving">
        {t(`EcomContactUsPageDetailPageWe'reAlwaysEagerToHearFromYou!`)}
      </Typography>
      <Typography className="mb-6 mt-5 text-center text-base lg:mb-10">
        {t('EcomContactUsPageDetailPageLoremIpsum')}
      </Typography>
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 grid grid-cols-1 gap-3 lg:grid-cols-3 lg:px-32">
          {info.map((item, index) => {
            return (
              <div
                className="flex items-center justify-center lg:mt-[0px] lg:items-start"
                key={index + 1}
              >
                <div className="flex !h-[45px] !w-[45px] items-center justify-center rounded-full bg-[#ebebeb] lg:!h-[70px] lg:!w-[70px]">
                  <Image
                    alt=""
                    src={item.icon}
                    className="h-[25px] w-[25px] lg:h-[35px] lg:w-[35px]"
                  />
                </div>
                <div className="ml-[20px] flex-1">
                  <Typography className="text-[16px] font-semibold text-primaryColor">
                    {t(item.title)}
                  </Typography>
                  {item.desc.map((item2, index2) => {
                    return item2.type == 'translate' ? (
                      <div className="text-[14px]" key={index2 + 1}>
                        {t(item2?.name)}
                      </div>
                    ) : (
                      <div className="text-[14px]" key={index2 + 1}>
                        {t(item2?.name)}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* <div className="col-span-12 h-[380px] w-full lg:col-span-8 lg:h-[570px]">
          <GoogleMapComponent
            initCenter={PMHCenter}
            isMarker
            listMarker={[PMHCenter]}
          ></GoogleMapComponent>
        </div> */}

        <div className="col-span-12 w-full lg:col-span-4">
          <div className="mt-[20px] flex w-full flex-col lg:mb-[70px]">
            <Typography className="text-left text-[20px] font-semibold text-primaryColor lg:text-[30px]">
              {t('EcomContactUsPageDetailPageSendUsAnEmail')}
            </Typography>

            <Form
              className="w-full lg:max-w-[700px]"
              autoComplete="off"
              layout={'vertical'}
              form={formSubmit}
              size="large"
              onFinish={submitForm}
            >
              <Form.Item
                rules={[
                  { required: true, message: messageError('nameRequired') },
                  { max: 100, message: `${messageError('maxlength', { number: 100 })} ` },
                  { message: `${messageError('validText')}`, validator: validatorCustom },
                ]}
                name={'clientName'}
                label={t('EcomContactUsPageDetailPageName')}
              >
                <Input />
              </Form.Item>
              <Form.Item
                rules={[
                  { required: true, message: messageError('phoneRequired') },
                  {
                    pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                    message: messageError('formatPhone'),
                  },
                ]}
                name={'phone'}
                label={t('EcomPropertyDetailPageTicketPhone')}
              >
                <Input />
              </Form.Item>
              <Form.Item
                rules={[
                  { required: true, message: messageError('emailRequired') },
                  { type: 'email', message: messageError('formatEmail') },
                  { max: 256, message: `${messageError('maxlength', { number: 256 })} ` },
                ]}
                name={'email'}
                label={t('EcomContactUsPageDetailPageEmail')}
              >
                <Input />
              </Form.Item>

              <Form.Item
                className="area-custom"
                rules={[
                  { required: true, message: messageError('messageRequired') },
                  { max: 2000, message: `${messageError('maxlength', { number: 2000 })} ` },
                  { message: `${messageError('validText')}`, validator: validatorCustom },
                ]}
                name={'message'}
                label={t('EcomContactUsPageDetailPageEnterYourMessage')}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
              <Checkbox onChange={(e) => setDidAceeptTerms(e.target.checked)}>
                {t.rich('AgreeWithTermsAndConditions', {
                  quychehoatdong: (chunks) => (
                    <span className="underline" onClick={openLink}>
                      {chunks}
                    </span>
                  ),
                  dieukhoandieukien: (chunks) => (
                    <span className="underline" onClick={openLinkDieukhoandieukien}>
                      {chunks}
                    </span>
                  ),
                })}
              </Checkbox>

              <div className="mt-[10px] lg:mt-[30px]">
                <Spin spinning={btnLoading}>
                  <CoreButton
                    disabled={!didAceeptTerms}
                    className="w-full"
                    type="submit"
                    label={t('ContactUsPageSubmit')}
                  />
                </Spin>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
