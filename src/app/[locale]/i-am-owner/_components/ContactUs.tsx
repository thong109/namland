// import iamOwnerStore from '@/stores/iamOwnerStore';
'use client';
import ButtonCore from '@/components/ButtonCore/ButtonCore';
import IconClock from '@/assets/icon/icon-clock-us.svg';
import IconLocation from '@/assets/icon/icon-location-us.svg';
import IconPhone from '@/assets/icon/icon-phone-us.svg';
import { postEcomOwnerInquiryCreate } from '@/ecom-sadec-api-client';
import useKeywordBanned from '@/hooks/useKeywordBaned';
import { checkValidText } from '@/libs/appconst';
import useGlobalStore from '@/stores/useGlobalStore';
import { Checkbox, Input, Spin, Typography } from 'antd';
import Form from 'antd/es/form';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
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
const info: Info[] = [
  {
    title: 'IamOwnerPageAddress',
    desc: [
      {
        name: '329 Queensberry Street, North Melbourne VIC 3051, Australia.',
        type: '',
      },
    ],
    icon: IconLocation,
  },
  {
    title: 'IamOwnerPageContact',
    desc: [
      {
        name: 'Mobile: 090 665 1055',
        type: 'phone',
      },
      {
        name: 'Mail: support@ht-tech.vn',
        type: 'email',
      },
    ],
    icon: IconPhone,
  },
  {
    title: 'IamOwnerPageHourOfOperation',
    desc: [
      {
        name: 'IamOwnerPageHourOfOperationMonToFri',
        type: 'translate',
      },
      {
        name: 'IamOwnerPageHourOfOperationSunAndSat',
        type: 'translate',
      },
    ],
    icon: IconClock,
  },
];

const ContactUs: React.FC<IProps> = ({ data, ...props }) => {
  const t = useTranslations('webLabel');
  const { userInfo } = useGlobalStore();
  // const { contactUsContent } = iamOwnerStore();
  const locale = useLocale();
  const success = useTranslations('successNotifi');
  const messageError = useTranslations('Message_Required');
  const { keyword } = useKeywordBanned();
  const error = useTranslations('Error');
  const [formSubmit] = Form.useForm();
  const [didAceeptTerms, setDidAceeptTerms] = React.useState<boolean>(false);
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
    try {
      setBtnLoading(true);
      const formData = formSubmit.getFieldsValue();
      const response = await postEcomOwnerInquiryCreate({ requestBody: { ...formData } });

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

  const submitFormFail = async () => {};
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
    <div className="flex max-w-[100%] flex-col items-center justify-center gap-8 px-2">
      <Typography className="w-full text-left text-3xl font-bold text-portal-primaryLiving lg:text-center">
        {t('EcomIAmOwnerContactUs')}
      </Typography>
      <p className="text-left lg:text-center">{data?.content}</p>

      <div className="mt-[10px] grid grid-cols-1 gap-6 lg:mt-[30px] lg:grid-cols-3">
        {info.map((item, index) => {
          return (
            <div
              className="mt-[10px] flex items-center justify-center lg:mt-[0px] lg:items-start"
              key={index + 1}
            >
              <div className="flex !h-[45px] !w-[45px] items-center justify-center rounded-full bg-[#ebebeb] lg:!h-[70px] lg:!w-[70px]">
                <Image
                  alt=""
                  src={item.icon}
                  className="h-[25px] w-[25px] lg:h-[35px] lg:w-[35px]"
                ></Image>
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
                      {item2?.name}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* send inquiry */}
      <div className="mt-[20px] flex w-full flex-col items-center lg:mb-[70px] lg:mt-[30px] lg:px-[120px]">
        <Form
          className="w-full lg:max-w-[700px]"
          autoComplete="off"
          layout={'vertical'}
          form={formSubmit}
          onFinish={submitForm}
          onFinishFailed={submitFormFail}
        >
          <Typography className="w-full text-left text-[20px] text-portal-primaryLiving lg:text-[30px]">
            {t('EcomIAmOwnerPageSendUsYourInquiry')}
          </Typography>
          <br />
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
            <Input />
          </Form.Item>
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
            <Input />
          </Form.Item>
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
            <Input />
          </Form.Item>

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
              <ButtonCore
                disabled={!didAceeptTerms}
                className="w-full"
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

export default ContactUs;
