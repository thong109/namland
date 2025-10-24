// https://www.youtube.com/watch?v=4Ra293cHkdU
'use-client';
import Pagination from '@/components/PaginationComponent/Pagination';
import { Form, Input, Rate, Spin } from 'antd';
import * as _ from 'lodash';
import { useLocale, useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

import contactAnonymousService from '@/apiServices/externalApiServices/apiAnonymousContact';
import apiListingCategorriesServices from '@/apiServices/externalApiServices/apiListingCategorriesServices';
import Label from '@/components/Label';
import useKeywordBaned from '@/hooks/useKeywordBaned';
import { checkValidText } from '@/libs/appconst';
import ReviewModelAgency from '@/models/inqueryModel/ReviewAgencyModel';
import ReviewModelListing from '@/models/reviewModel/ReviewModelListing';
import InputBorder from '@/shared/InputBoder';
import useGlobalStore from '@/stores/useGlobalStore';
import moment from 'moment';
import 'moment/locale/ko';
import 'moment/locale/vi';
import { TypeOptions, toast } from 'react-toastify';
const { TextArea } = Input;
const ReviewAgencyComponent = ({ data }: any) => {
  const locale = useLocale();
  const t = useTranslations('webLabel');

  const success = useTranslations('successNotifi');
  const error = useTranslations('errorNotifi');
  const messageError = useTranslations('Message_Required');
  const { userInfo } = useGlobalStore();
  const { keyword } = useKeywordBaned();
  const [formReview] = Form.useForm();
  const [btnLoading, setBtnLoading] = useState(false);
  const size = 2;
  const [from, setFrom] = useState(1);
  const [dataReviewListing, setDataReviewListing] = useState<ReviewModelListing[]>(
    [] as ReviewModelListing[],
  );
  const [total, setTotal] = useState(0);
  const handleChangePage = async (value) => {
    setFrom(value?.current);
    getDataReview(value?.current - 1);
  };
  const [valueStar, setValueStar] = useState({
    rating: 5,
  });
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
  const handleChangeValueStar = (key, value) => {
    let preValue = { ...valueStar };
    preValue[key] = value;
    setValueStar(preValue);
  };
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);
  const submidReviewAgency = async () => {
    try {
      setBtnLoading(true);
      await formReview.validateFields();
      let values: ReviewModelAgency = formReview.getFieldsValue();
      values.rating = valueStar.rating;
      values.applyId = data?.id;
      let response = await contactAnonymousService.submitReviewAgency(values);
      if (response && response?.success) {
        setBtnLoading(false);
        notify('success', success('createAPI'));
        resetFields();
        setTimeout(async () => {
          await getDataReview(from - 1);
        }, 500);
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
  const submidReviewAgencyFail = async () => {
    let values: ReviewModelAgency = formReview.getFieldsValue();
  };
  useEffect(() => {
    if (userInfo) {
      formReview.setFieldValue('name', userInfo?.firstName + ' ' + userInfo?.lastName);
      formReview.setFieldValue('email', userInfo?.email);
    }
  }, [userInfo]);
  useEffect(() => {
    getDataReview(0);
  }, []);

  const getDataReview = async (value: number) => {
    try {
      let response = await apiListingCategorriesServices.getReviewAgency({
        size: 2 || size,
        from: value * 2,
        id: data?.id,
      });
      if (response && response.success) {
        let data = response.data;
        setTotal(data?.total);
        setDataReviewListing(data?.data);
      }
    } catch (error) {
      // console.log(error);
    }
  };
  const resetFields = () => {
    if (userInfo) {
      formReview.resetFields();
      formReview.setFieldValue('name', userInfo?.firstName + ' ' + userInfo?.lastName);
      formReview.setFieldValue('email', userInfo?.email);
    } else {
      formReview.resetFields();
    }
    setValueStar({
      rating: 5,
    });
  };
  return (
    <>
      <div className="flex flex-col">
        <div className="mb-[30px] text-[18px] font-semibold lowercase text-primaryColor">
          {`${total > 0 ? total : 0} ${t('EcomAgencyDetailEvalute')}`}
        </div>
      </div>

      <div className={`mt-[30px] grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-5`}>
        {dataReviewListing && dataReviewListing.length ? (
          _.map(dataReviewListing, (item, index) => {
            return (
              <div key={item?.id} className="min-h-[100px]">
                <div className="flex justify-between">
                  <div className="text-[16px] font-semibold capitalize text-primaryColor">
                    {item?.name}
                  </div>
                  <div className="text-[14px] capitalize">
                    {moment(item?.createdAt)
                      .locale(locale)
                      .format(`MMMM DD, YYYY  [${t('at')}] HH:mm A`)}
                  </div>
                </div>

                <div className="mt-[15px] text-[14px]">{item?.message}</div>
              </div>
            );
          })
        ) : (
          <>{t('noData')}</>
        )}
      </div>
      {dataReviewListing && dataReviewListing.length ? (
        <div className="flex">
          <div className="mt-3 flex w-full justify-center pb-3">
            <Pagination
              pagination={{
                current: from,
                total: total ?? 0,
                pageSize: 2,
              }}
              onChange={(value: any) => handleChangePage(value)}
            />
          </div>
        </div>
      ) : null}
      <div className="mt-[15px] font-semibold text-primaryColor">
        {t('EcomAgentDetailPageWriteReview')}
      </div>
      <div className="mt-[20px] flex">
        <div className="grid grid-cols-1 gap-x-5 lg:grid-cols-2">
          <div>
            <div className="flex items-center justify-between gap-5">
              {t('EcomAgentDetailPageRating')}
              <Rate
                allowHalf
                defaultValue={5}
                value={valueStar?.rating}
                style={{ color: '#CAB877', fontSize: 14 }}
                onChange={(value) => {
                  handleChangeValueStar('rating', value);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <Form
          autoComplete="off"
          form={formReview}
          onFinish={submidReviewAgency}
          onFinishFailed={submidReviewAgencyFail}
          className="w-full"
        >
          <div className="grid grid-cols-1 gap-x-5 lg:grid-cols-2">
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
                name={'name'}
              >
                <InputBorder
                  label={t('EcomPropertyDetailPageReviewName')}
                  type={'text'}
                  name={'name'}
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
                  label={t('EcomPropertyDetailPageReviewEmail')}
                  type={'text'}
                  name={'email'}
                ></InputBorder>
              </Form.Item>
            </div>
          </div>
          <div className="grid grid-cols-1">
            <div>
              <label className="block">
                <div>
                  <Label className="font-normal">{t('EcomAgencyDetailSendMessage')}</Label>
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
                    className="focus:boder-0 mt-1 rounded-none border-0 !border-b-2 !bg-transparent focus:!border-portal-primaryLiving focus:ring-0"
                  />
                </Form.Item>
              </label>
            </div>
          </div>
          <div className="flex w-full justify-center lg:block">
            <button
              type="submit"
              disabled={btnLoading}
              className="btn-primary focus:shadow-outline ma mr-2 !w-[250px] max-w-[200px] uppercase focus:outline-none disabled:!opacity-70 disabled:hover:!bg-[#FFD14B] lg:h-[55px]"
            >
              {btnLoading ? <Spin></Spin> : t('EcomAgencyDetailSendEvalute')}
            </button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default ReviewAgencyComponent;
