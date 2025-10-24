'use-client';
import { checkValidText } from '@/libs/appconst';
import { Form, Input, Spin } from 'antd';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

import apiAnonymousContact from '@/apiServices/externalApiServices/apiAnonymousContact';
import FloatLabel from '@/components/FloatLabel';
import Label from '@/components/Label';
import useKeywordBaned from '@/hooks/useKeywordBaned';
import TourModel from '@/models/inqueryModel/TourModel';
import InputBorder from '@/shared/InputBoder';
import useGlobalStore from '@/stores/useGlobalStore';
import { DatePicker, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { TypeOptions, toast } from 'react-toastify';
import './styles.scss';
const { TextArea } = Input;
const TourSubmitComponent = ({ data }: any) => {
  const t = useTranslations('webLabel');
  const messageError = useTranslations('Message_Required');

  const success = useTranslations('successNotifi');
  const error = useTranslations('errorNotifi');
  const [formTour] = Form.useForm();
  const { userInfo } = useGlobalStore();
  const { keyword } = useKeywordBaned();
  const [changeValue, setChangeValue] = useState(false);
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
  const [btnLoading, setBtnLoading] = useState(false);
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);
  const submitTour = async () => {
    try {
      setBtnLoading(true);
      await formTour.validateFields();
      let values: TourModel = formTour.getFieldsValue();
      if (values.date && values.time) {
        const yourDate = dayjs(values.date).format('YYYY-MM-DD');
        const yourTime = dayjs(values.time).format('HH:mm:ss');
        values.visitDate = `${yourDate}T${yourTime}Z`;
      }

      values.title = data?.title;
      values.listingId = data?.id;
      values.ticketStatus = 1;

      let response = await apiAnonymousContact.submitInquiry(values);
      if (response && response?.success) {
        setBtnLoading(false);
        notify('success', success('createAPI'));
        resetFields();
      } else {
        setBtnLoading(false);

        notify(
          'error',
          response?.errorCode != null ? error(response?.errorCode) : response?.message,
        );
      }
    } catch (e) {
      setBtnLoading(false);
    }
  };
  const submitTourFail = async () => {
    let values: TourModel = formTour.getFieldsValue();
  };
  useEffect(() => {
    if (userInfo) {
      formTour.setFieldValue('clientName', userInfo?.firstName + ' ' + userInfo?.lastName);
      formTour.setFieldValue('phone', formatPhone(userInfo?.phone));
      formTour.setFieldValue('email', userInfo?.email);
    }
  }, [userInfo]);
  const resetFields = () => {
    if (userInfo) {
      formTour.resetFields();
      formTour.setFieldValue('clientName', userInfo?.firstName + ' ' + userInfo?.lastName);
      formTour.setFieldValue('phone', formatPhone(userInfo?.phone));
      formTour.setFieldValue('email', userInfo?.email);
    } else {
      formTour.resetFields();
    }
    setChangeValue(!changeValue);
  };
  const formatPhone = (str: string) => {
    return str.replace(/^84/, '0');
  };
  return (
    <>
      {/* <div className="text-primaryColor font-semibold">
        {t('EcomPropertyDetailPageTourScheduleATour')}
      </div> */}
      <div className="flex w-full">
        <Form
          autoComplete="off"
          form={formTour}
          onFinish={submitTour}
          onFinishFailed={submitTourFail}
          className="w-full"
        >
          <div className="grid grid-cols-2">
            <div></div>
          </div>
          <div className="mt-2 grid grid-cols-1 lg:grid-cols-2 lg:gap-5">
            <div>
              <FloatLabel
                label={t('EcomPropertyDetailPageTourDate')}
                form={formTour}
                name={'date'}
                changeValue={changeValue}
              >
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: messageError('dateRequired'),
                    },
                  ]}
                  name={'date'}
                >
                  <DatePicker
                    placeholder=""
                    format={'DD/MM/YYYY'}
                    allowClear={true}
                    className="date-picker-form h-9 w-full rounded-none border-0 border-b-2 bg-transparent !p-0 text-base !shadow-none hover:!border-portal-primaryLiving focus:!border-portal-primaryLiving focus:bg-transparent focus:outline-none focus:ring-0"
                  ></DatePicker>
                </Form.Item>
              </FloatLabel>
            </div>
            <div>
              <FloatLabel
                form={formTour}
                name={'time'}
                label={t('EcomPropertyDetailPageTourTime')}
                changeValue={changeValue}
              >
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: messageError('timeRequired'),
                    },
                  ]}
                  name={'time'}
                >
                  <TimePicker
                    placeholder=""
                    use12Hours
                    format="h:mm a"
                    allowClear={true}
                    className="custom-btn-date date-picker-form h-9 w-full rounded-none border-0 border-b-2 !p-0 text-base !shadow-none hover:!border-portal-primaryLiving focus:!border-portal-primaryLiving focus:outline-none focus:ring-0"
                  ></TimePicker>
                </Form.Item>
              </FloatLabel>
            </div>
          </div>
          <div className="font-semibold text-primaryColor">
            {t('EcomPropertyDetailPageTourYourInfomation')}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-5">
            <div>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: messageError('nameRequired'),
                  },
                  {
                    message: `${messageError('validText')}`,
                    validator: validatorCustom,
                  },
                ]}
                name={'clientName'}
              >
                <InputBorder
                  label={t('EcomPropertyDetailPageTourName')}
                  type={'text'}
                  name={'clientName'}
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
                  label={t('EcomPropertyDetailPageTourEmail')}
                  type={'text'}
                  name={'email'}
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
                  label={t('EcomPropertyDetailPageTourPhone')}
                  type={'tel'}
                  name={'phone'}
                ></InputBorder>
              </Form.Item>
            </div>
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
                  autoComplete="nope"
                  className="focus:boder-0 mt-1 rounded-none border-0 border-b-2 !bg-transparent focus:!border-portal-primaryLiving focus:ring-0"
                />
              </Form.Item>
            </label>
          </div>
          <div className="mt-[30px] flex items-center justify-center lg:block">
            <button
              type="submit"
              disabled={btnLoading}
              className="btn-primary focus:shadow-outline ma mr-2 h-[55px] !w-[250px] uppercase focus:outline-none disabled:!opacity-70 disabled:hover:!bg-[#FFD14B]"
            >
              {btnLoading ? <Spin></Spin> : t('EcomPropertyDetailPageTourSubmitATourRequest')}
            </button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default TourSubmitComponent;
