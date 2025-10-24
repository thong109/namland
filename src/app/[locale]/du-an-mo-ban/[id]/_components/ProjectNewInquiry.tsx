'use client';
import newHomeApiService from '@/apiServices/externalApiServices/apiNewHomeService';
import Label from '@/components/Label';
import useKeywordBaned from '@/hooks/useKeywordBaned';
import { checkValidText } from '@/libs/appconst';
import { convertPhoneNumber84To0 } from '@/libs/helper';
import InputBorder from '@/shared/InputBoder';
import useGlobalStore from '@/stores/useGlobalStore';
import { Button, Form, Input, Modal, Spin } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import React, { useEffect, useState, useTransition } from 'react';
import { TypeOptions, toast } from 'react-toastify';
import './style.css';
const { TextArea } = Input;

interface Props {
  projectDetail: any;
}
const ProjectNewInquiry: React.FC<Props> = ({ projectDetail }) => {
  const [formContact] = Form.useForm();
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);
  const locale = useLocale();
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  const messageError = useTranslations('Message_Required');
  const success = useTranslations('successNotifi');
  const error = useTranslations('errorNotifi');

  const { keyword } = useKeywordBaned();
  const { userInfo } = useGlobalStore();
  const [btnLoading, setBtnLoading] = useState(false);
  const [isShowMobile, setIsShowMobile] = useState(false);

  const [isPending, startTransition] = useTransition();

  const resetFields = () => {
    if (userInfo?.id) {
      setFormContactData({
        name: userInfo?.firstName + ' ' + userInfo?.lastName,
        phone: formatPhone(userInfo?.phone),
        email: userInfo?.email,
        message: '',
        valueCheckBox: false,
      });
      formContact.setFieldsValue({
        name: userInfo?.firstName + ' ' + userInfo?.lastName,
        phone: formatPhone(userInfo?.phone),
        email: userInfo?.email,
        message: '',
      });
    } else {
      setFormContactData({
        name: '',
        phone: '',
        email: '',
        message: '',
        valueCheckBox: false,
      });
      formContact.resetFields();
    }
  };

  const [formContactData, setFormContactData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    valueCheckBox: false,
  });
  const handleChangeValueContact = (key: any, value: any) => {
    let preValue = { ...formContactData };
    preValue[key] = value;
    setFormContactData({ ...preValue });
  };
  const formatPhone = (str: string) => {
    if (str) {
      return str.replace(/^84/, '0');
    }
    return '';
  };

  useEffect(() => {
    if (userInfo) {
      setFormContactData({
        name: userInfo?.firstName + ' ' + userInfo?.lastName,
        phone: formatPhone(userInfo?.phone),
        email: userInfo?.email,
        message: '',
        valueCheckBox: false,
      });
      formContact.setFieldsValue({
        name: userInfo?.firstName + ' ' + userInfo?.lastName,
        phone: formatPhone(userInfo?.phone),
        email: userInfo?.email,
        message: '',
      });
    }
  }, [userInfo]);

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

  const onContactFailed = async () => {};

  const contact = async () => {
    try {
      if (formContactData.valueCheckBox) {
        setBtnLoading(true);

        //đã chát từ trước thì dùng inquiryId
        let response;
        if (projectDetail?.inquiryId) {
          startTransition(async () => {
            try {
              response = await newHomeApiService.createInquiryChat({
                inquiryId: projectDetail?.inquiryId,
                message: formContactData.message,
              });
              notify('success', comm('sentSuccess'));
            } catch (e) {
              notify('error', e.response?.data?.message);
            }
          });
        }
        //chat lần đầu dùng newHomeID
        else {
          startTransition(async () => {
            try {
              response = await newHomeApiService.createInquiryChat({
                newHomesId: projectDetail?.id,
                message: formContactData.message,
              });
              notify('success', comm('sentSuccess'));
            } catch (e) {
              notify('error', e.response?.data?.message);
            }
          });
        }

        if (await response.success) {
          setBtnLoading(false);
          notify('success', success('createAPI'));
          resetFields();
        } else {
          setBtnLoading(false);
          notify('error', error('createAPI'));
        }
      } else {
        setBtnLoading(false);
        notify('error', error('checkBoxRequired'));
      }
    } catch (e) {
      setBtnLoading(false);
    }
  };

  const openLink = () => {
    window.open(`${window.location.origin}/${locale}/quy-che-hoat-dong`, '_blank');
  };

  const openLinkDieukhoandieukien = () => {
    window.open(`${window.location.origin}/${locale}/dieu-khoan-dieu-kien`, '_blank');
  };

  return (
    <>
      {/* UI Inquiry Mobile */}
      <div className="fixed bottom-0 left-0 grid w-full grid-cols-4 bg-portal-primaryButtonAdmin p-4 text-white lg:hidden">
        <div className="col-span-1 flex items-center justify-center">
          <svg
            width="61"
            height="61"
            viewBox="0 0 61 61"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M59.855 30.5111C59.855 46.7448 46.6947 59.9033 30.4619 59.9033C14.2282 59.9033 1.06696 46.7448 1.06696 30.5111C1.06696 14.2774 14.2282 1.11801 30.4619 1.11801C46.6947 1.11801 59.855 14.2774 59.855 30.5111Z"
              fill="#FFFFFF"
            />
            <path
              d="M1.06696 30.5112C1.06696 14.2778 14.2271 1.11808 30.461 1.11808C46.6948 1.11808 59.855 14.2778 59.855 30.5112C59.855 46.7446 46.6948 59.9043 30.461 59.9043C14.2271 59.9043 1.06696 46.7446 1.06696 30.5112Z"
              stroke="#343B57"
              stroke-width="0.679348"
              stroke-miterlimit="10"
            />
            <path
              d="M30.4613 20.1467L33.0337 28.0634H41.3571L34.6234 32.9556L37.195 40.8723L30.4613 35.9792L23.7276 40.8723L26.2991 32.9556L19.5654 28.0634H27.8888L30.4613 20.1467Z"
              stroke="#343B57"
              stroke-width="0.905797"
              stroke-miterlimit="10"
            />
            <path
              d="M30.4613 40.8735L27.8888 32.9568H19.5654L26.2991 28.0646L23.7276 20.1479L30.4613 25.0411L37.195 20.1479L34.6234 28.0646L41.3571 32.9568H33.0337L30.4613 40.8735Z"
              stroke="#343B57"
              stroke-width="0.905797"
              stroke-miterlimit="10"
            />
          </svg>
        </div>
        <div className="col-span-2 grid grid-cols-1">
          <div className="col-span-1 line-clamp-1 font-semibold text-black">
            {projectDetail?.picUser?.fullName}
          </div>
          <div className="col-span-1 line-clamp-1 text-xs font-semibold text-black">
            {convertPhoneNumber84To0(projectDetail?.picUser?.phone)}
          </div>
          <div className="col-span-1 line-clamp-1 text-xs font-semibold text-black">
            {projectDetail?.picUser?.email}
          </div>
        </div>
        <div className="col-span-1 grid grid-cols-1 gap-y-1">
          <div className="col-span-1 flex items-center justify-center">
            <Button
              onClick={() => setIsShowMobile(true)}
              className="rounded-xl !border !border-black !bg-transparent font-semibold !text-black"
            >
              {comm('InquiryChat')}
            </Button>
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <Button
              onClick={() => window.open(`tel:${projectDetail?.picUser?.phone}`)}
              className="rounded-xl !border !border-black font-semibold"
            >
              {comm('InquiryCall')}
            </Button>
          </div>
        </div>
      </div>

      {/*  Form create Inquiry DeskTop*/}
      <div className="col-span-3 mb-8 mt-4 hidden pl-2 lg:block">
        <div className="text-center text-lg font-bold text-portal-primaryLiving">
          {t('EcomPropertyDetailPageNewHomeInquiryRequest')}
        </div>
        <div className="mx-[20%] mt-[20px] rounded-lg border border-neutral-100 px-[30px] py-5 shadow-md">
          <Form
            autoComplete="off"
            form={formContact}
            onFinish={contact}
            onFinishFailed={onContactFailed}
          >
            <div>
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
                name={'name'}
              >
                <InputBorder
                  label={t('EcomPropertyDetailPageTicketName')}
                  type={'text'}
                  name={'name'}
                  value={formContactData.name}
                  onChange={(text) => {
                    handleChangeValueContact('name', text);
                  }}
                ></InputBorder>
              </Form.Item>
            </div>
            <div>
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
              >
                <InputBorder
                  label={t('EcomPropertyDetailPageTicketEmail')}
                  type={'text'}
                  name={'email'}
                  value={formContactData.email}
                  onChange={(text) => {
                    handleChangeValueContact('email', text);
                  }}
                ></InputBorder>
              </Form.Item>
            </div>
            <div>
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
              >
                <InputBorder
                  label={t('EcomPropertyDetailPageTicketPhone')}
                  type={'tel'}
                  name={'phone'}
                  value={formContactData.phone}
                  onChange={(text) => {
                    handleChangeValueContact('phone', text);
                  }}
                ></InputBorder>
              </Form.Item>
            </div>
            <div>
              <label className="block">
                <div>
                  <Label className="text-primaryColor">
                    {t('EcomPropertyDetailPageTicketMessage')}
                  </Label>
                </div>
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
                >
                  <TextArea
                    autoSize={{ minRows: 1, maxRows: 6 }}
                    name="message"
                    value={formContactData.message}
                    onChange={(e) => {
                      handleChangeValueContact('message', e.target.value);
                    }}
                    autoComplete="nope"
                    className="focus:boder-0 mt-1 rounded-none border-0 border-b-2 !bg-transparent focus:!border-portal-primaryLiving focus:ring-0"
                  />
                </Form.Item>
              </label>
            </div>
            <div className="mt-3">
              <div className="mb-4 flex">
                <input
                  id="policy-checkbox"
                  type="checkbox"
                  onChange={() =>
                    handleChangeValueContact('valueCheckBox', !formContactData.valueCheckBox)
                  }
                  // defaultChecked={
                  //   formContactData?.valueCheckBox
                  // }

                  checked={formContactData?.valueCheckBox}
                  className="checkbox-primary mt-[2px] focus:ring-0 focus:ring-offset-0"
                />
                <label
                  htmlFor="policy-checkbox"
                  className="ml-2 text-sm font-medium dark:text-gray-300"
                >
                  <span>
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
                  </span>
                </label>
              </div>
            </div>
            <div className="mt-[30px]">
              <button
                type="submit"
                disabled={isPending}
                className={`btn-primary focus:shadow-outline ] mr-2 uppercase focus:outline-none disabled:!opacity-70 ${
                  !formContactData.valueCheckBox ? '!bg-gray-400' : ''
                }`}
              >
                {isPending ? <Spin></Spin> : t('EcomPropertyDetailPageTicketLeaveAnInquiry')}
              </button>
            </div>
          </Form>
        </div>
      </div>

      {/*  Form create Inquiry Mobile*/}
      <Modal
        open={isShowMobile}
        footer={null}
        closable
        onCancel={() => {
          resetFields();
          setIsShowMobile(false);
        }}
      >
        <div className="mt-[20px] rounded-lg border border-neutral-100 px-[30px] py-5 shadow-md">
          <Form
            autoComplete="off"
            form={formContact}
            onFinish={contact}
            onFinishFailed={onContactFailed}
          >
            <div>
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
                name={'name'}
              >
                <InputBorder
                  disabled
                  label={t('EcomPropertyDetailPageTicketName')}
                  type={'text'}
                  name={'name'}
                  value={formContactData.name}
                  onChange={(text) => {
                    handleChangeValueContact('name', text);
                  }}
                ></InputBorder>
              </Form.Item>
            </div>
            <div>
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
              >
                <InputBorder
                  disabled
                  label={t('EcomPropertyDetailPageTicketEmail')}
                  type={'text'}
                  name={'email'}
                  value={formContactData.email}
                  onChange={(text) => {
                    handleChangeValueContact('email', text);
                  }}
                ></InputBorder>
              </Form.Item>
            </div>
            <div>
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
              >
                <InputBorder
                  disabled
                  label={t('EcomPropertyDetailPageTicketPhone')}
                  type={'tel'}
                  name={'phone'}
                  value={formContactData.phone}
                  onChange={(text) => {
                    handleChangeValueContact('phone', text);
                  }}
                ></InputBorder>
              </Form.Item>
            </div>
            <div>
              <label className="block">
                <div>
                  <Label className="text-primaryColor">
                    {t('EcomPropertyDetailPageTicketMessage')}
                  </Label>
                </div>
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
                >
                  <TextArea
                    autoSize={{ minRows: 1, maxRows: 6 }}
                    name="message"
                    value={formContactData.message}
                    onChange={(e) => {
                      handleChangeValueContact('message', e.target.value);
                    }}
                    autoComplete="nope"
                    className="focus:boder-0 mt-1 rounded-none border-0 border-b-2 !bg-transparent focus:!border-portal-primaryLiving focus:ring-0"
                  />
                </Form.Item>
              </label>
            </div>
            <div className="mt-3">
              <div className="mb-4 flex">
                <input
                  id="policy-checkbox"
                  type="checkbox"
                  onChange={() =>
                    handleChangeValueContact('valueCheckBox', !formContactData.valueCheckBox)
                  }
                  // defaultChecked={
                  //   formContactData?.valueCheckBox
                  // }

                  checked={formContactData?.valueCheckBox}
                  className="checkbox-primary mt-[2px] focus:ring-0 focus:ring-offset-0"
                />
                <label
                  htmlFor="policy-checkbox"
                  className="ml-2 text-sm font-medium dark:text-gray-300"
                >
                  <span>
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
                  </span>
                </label>
              </div>
            </div>
            <div className="mt-[30px]">
              <button
                type="submit"
                disabled={isPending}
                className={`btn-primary focus:shadow-outline ] mr-2 uppercase focus:outline-none disabled:!opacity-70 ${
                  !formContactData.valueCheckBox ? '!bg-gray-400' : ''
                }`}
              >
                {isPending ? <Spin></Spin> : t('EcomPropertyDetailPageTicketLeaveAnInquiry')}
              </button>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ProjectNewInquiry;
