// https://www.youtube.com/watch?v=4Ra293cHkdU
'use-client';
import Pagination from '@/components/PaginationComponent/Pagination';
import { Form, Input, Spin } from 'antd';
import * as _ from 'lodash';
import { useLocale, useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

import contactAnonymousService from '@/apiServices/externalApiServices/apiAnonymousContact';
import apiListingCategorriesServices from '@/apiServices/externalApiServices/apiListingCategorriesServices';
import Label from '@/components/Label';
import useKeywordBaned from '@/hooks/useKeywordBaned';
import { checkValidText } from '@/libs/appconst';
import ReviewModel from '@/models/inqueryModel/ReviewModel';
import ReviewModelListing from '@/models/reviewModel/ReviewModelListing';
import InputBorder from '@/shared/InputBoder';
import useGlobalStore from '@/stores/useGlobalStore';
import moment from 'moment';
import 'moment/locale/ko';
import 'moment/locale/vi';
import { TypeOptions, toast } from 'react-toastify';
import './styles.scss';
const { TextArea } = Input;
const ReviewComponent = ({ data }: any) => {
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
  const [sumariesTotal, setSumariesTotal] = useState(0);
  const [dataReviewListing, setDataReviewListing] = useState<ReviewModelListing[]>(
    [] as ReviewModelListing[],
  );
  const [total, setTotal] = useState(0);
  const handleChangePage = async (value) => {
    setFrom(value?.current);
    getDataReview(value?.current - 1);
  };
  const [dataReview, setDataReview] = useState([]);
  const [valueStar, setValueStar] = useState({
    cleanliness: 5,
    communication: 5,
    checkIn: 5,
    accuracy: 5,
    location: 5,
    value: 5,
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
  const submidReview = async () => {
    try {
      setBtnLoading(true);
      await formReview.validateFields();
      let values: ReviewModel = formReview.getFieldsValue();
      values.scoreDetail = { ...valueStar };
      values.applyId = data?.id;
      let response = await contactAnonymousService.submitReviewListing(values);
      if (response && response?.success) {
        setBtnLoading(false);
        notify('success', success('createAPI'));
        resetFields();
        await getSumaryListingReview();
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
      notify('error', e);
      setBtnLoading(false);
    }
  };
  const submidReviewFail = async () => {
    let values: ReviewModel = formReview.getFieldsValue();
  };
  useEffect(() => {
    if (userInfo) {
      formReview.setFieldValue('name', userInfo?.firstName + ' ' + userInfo?.lastName);
      formReview.setFieldValue('email', userInfo?.email);
    }
  }, [userInfo]);
  useEffect(() => {
    // getSumaryListingReview();
    getDataReview(0);
  }, []);
  const getSumaryListingReview = async () => {
    try {
      let response = await apiListingCategorriesServices.getSumaryListing(data?.id);

      let dataArray = [];
      if (response) {
        for (const [key, value] of Object.entries(response)) {
          let objectTemp = {};
          objectTemp[`title`] = key;
          objectTemp[`name`] = getTitle(key);
          objectTemp[`point`] = value;
          dataArray.push(objectTemp);
        }
        setSumariesTotal(response?.total);
        setDataReview(
          _.filter(dataArray, (e) => {
            return e.title != 'total';
          }),
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getDataReview = async (value: number) => {
    try {
      let response = await apiListingCategorriesServices.getReviewListing({
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
      console.log(error);
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
      cleanliness: 5,
      communication: 5,
      checkIn: 5,
      accuracy: 5,
      location: 5,
      value: 5,
    });
  };
  const getTitle = (key) => {
    switch (key) {
      case 'cleanliness':
        return 'EcomPropertyDetailPageReviewCleanliness';
      case 'communication':
        return 'EcomPropertyDetailPageReviewCommunication';
      case 'checkIn':
        return 'EcomPropertyDetailPageReviewCheck-in';
      case 'accuracy':
        return 'EcomPropertyDetailPageReviewAccuracy';
      case 'location':
        return 'EcomPropertyDetailPageReviewLocation';
      case 'value':
        return 'EcomPropertyDetailPageReviewValue';
      default:
        return 'EcomPropertyDetailPageReviewCleanliness';
    }
  };
  return (
    <>
      {/* <div className="flex flex-col">
        <div className="text-primaryColor  font-semibold text-[18px] mb-[30px] lowercase ">
          {sumariesTotal}{' '}
          {`(${total>0?total:0} ${t('EcomPropertyDetailPageReviewReviews')})`}
        </div>
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-10 gap-y-1">
          {dataReview.map((item, index) => {
            return (
              <div className="flex justify-between custom-progress" key={(index+1)}>
                <div className="text-[14px]">{t(item.name)}</div>
                <Progress
                  strokeColor={'#FFD14B'}
                  trailColor={'#E6E9EC'}
                  success={{ strokeColor: '#FFD14B' }}
                  className="!w-[50%] !text-primaryColor"
                  format={percent => {
                    return item.point;
                  }}
                  percent={(item?.point / 5) * 100}
                ></Progress>
              </div>
            );
          })}
        </div>
      </div> */}

      <div className={`grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-5`}>
        {dataReviewListing && dataReviewListing.length ? (
          _.map(dataReviewListing, (item, index) => {
            return (
              <div key={index + 1} className="min-h-[100px]">
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
        <>
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
          <div className="boder-t border"></div>
        </>
      ) : null}

      <div className="mt-[15px] font-semibold text-primaryColor">
        {t('EcomPropertyDetailPageReviewWriteAReview')}
      </div>
      {/* <div className="flex">
        <div className="grid lg:grid-cols-2  star-container grid-cols-1 lg:gap-x-5">
          <div className="">
            <div className="flex justify-between items-center text-[12px] lg:text-[14px] gap-3">
              {t('EcomPropertyDetailPageReviewCleanliness')}

              <Rate
                allowHalf
                defaultValue={5}
                value={valueStar?.cleanliness}
                style={{ color: '#CAB877' }}
                className="text-[12px] lg:text-[14px]   "
                onChange={value => {
                  handleChangeValueStar('cleanliness', value);
                }}
              />
            </div>
            <div className="flex justify-between items-center text-[12px] lg:text-[14px] gap-3">
              {t('EcomPropertyDetailPageReviewCommunication')}
              <Rate
                allowHalf
                defaultValue={5}
                value={valueStar?.communication}
                style={{ color: '#CAB877' }}
                className="text-[12px] lg:text-[14px] "
                onChange={value => {
                  handleChangeValueStar('communication', value);
                }}
              />
            </div>
            <div className="flex justify-between items-center text-[12px] lg:text-[14px] gap-3">
              {t('EcomPropertyDetailPageReviewCheck-in')}
              <Rate
                allowHalf
                defaultValue={5}
                value={valueStar?.checkIn}
                className="text-[12px] lg:text-[14px] "
                style={{ color: '#CAB877' }}
                onChange={value => {
                  handleChangeValueStar('checkIn', value);
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-[12px] lg:text-[14px]  gap-3">
              {t('EcomPropertyDetailPageReviewAccuracy')}
              <Rate
                allowHalf
                defaultValue={5}
                value={valueStar?.accuracy}
                className="text-[12px] lg:text-[14px] "
                style={{ color: '#CAB877' }}
                onChange={value => {
                  handleChangeValueStar('accuracy', value);
                }}
              />
            </div>
            <div className="flex justify-between items-center text-[12px] lg:text-[14px]   gap-3">
              {t('EcomPropertyDetailPageReviewLocation')}
              <Rate
                allowHalf
                defaultValue={5}
                value={valueStar?.location}
                style={{ color: '#CAB877' }}
                className="text-[12px] lg:text-[14px] "
                onChange={value => {
                  handleChangeValueStar('location', value);
                }}
              />
            </div>
            <div className="flex justify-between items-center text-[12px] lg:text-[14px] gap-3">
              {t('EcomPropertyDetailPageReviewValue')}
              <Rate
                allowHalf
                defaultValue={5}
                value={valueStar?.value}
                style={{ color: '#CAB877' }}
                className="text-[12px] lg:text-[14px] "
                onChange={value => {
                  handleChangeValueStar('value', value);
                }}
              />
            </div>
          </div>
        </div>
      </div> */}
      <div>
        <Form
          autoComplete="off"
          form={formReview}
          onFinish={submidReview}
          onFinishFailed={submidReviewFail}
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
                  <Label className="font-normal">
                    {t('EcomPropertyDetailPageReviewEnterYourMessage')}
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
                    className="focus:boder-0 mt-1 rounded-none border-0 !border-b-2 !bg-transparent focus:!border-portal-primaryLiving focus:ring-0"
                  />
                </Form.Item>
              </label>
            </div>
          </div>
          <div className="flex justify-center lg:block">
            <button
              type="submit"
              disabled={btnLoading}
              className="btn-primary focus:shadow-outline ma mr-2 h-[55px] !w-[250px] uppercase focus:outline-none disabled:!opacity-70 disabled:hover:!bg-[#FFD14B]"
            >
              {btnLoading ? <Spin></Spin> : t('EcomPropertyDetailPageReviewSendYourReview')}
            </button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default ReviewComponent;
