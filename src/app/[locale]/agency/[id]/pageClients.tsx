'use client';
import apiHomePageService from '@/apiServices/externalApiServices/apiHomePageServices';
import memberApiService from '@/apiServices/externalApiServices/memberApiService';
import CardItemProperties from '@/components/Cards/CardItemProperties';
import InputBorder from '@/shared/InputBoder';
import { useTranslations } from 'next-intl';
import React, { FC, useEffect, useState } from 'react';

import contactAnonymousService from '@/apiServices/externalApiServices/apiAnonymousContact';
import apiListingCategorriesServices from '@/apiServices/externalApiServices/apiListingCategorriesServices';
import Label from '@/components/Label';
import useAllSettingLandingPage from '@/hooks/useAllSettingLandingPage';
import useKeywordBaned from '@/hooks/useKeywordBaned';
import { checkValidText, listingType } from '@/libs/appconst';
import { MemberAnonymousModel } from '@/models/memberModel/memberAnonymousModel';
import useGlobalStore from '@/stores/useGlobalStore';
import { Form, Input, Rate, Spin } from 'antd';
import * as _ from 'lodash';
import { useRouter } from 'next-intl/client';
import { isDesktop } from 'react-device-detect';
import { TypeOptions, toast } from 'react-toastify';
import NotFound from '../../not-found';
import ReviewAgencyComponent from './(components)/ReviewAgencyComponents';

const { TextArea } = Input;
export interface PageAgencyDetailClientProps {
  params: any;
}
const PageDetailAgencyClient: FC<PageAgencyDetailClientProps> = ({ params }) => {
  const t = useTranslations('webLabel');
  const success = useTranslations('successNotifi');

  const error = useTranslations('errorNotifi');
  const messageError = useTranslations('Message_Required');
  const [agency, setAgency] = useState<MemberAnonymousModel>({} as MemberAnonymousModel);
  const [listSaleProperty, setListSaleProperty] = useState<any>([] as any);
  const [listRentProperty, setListRentProperty] = useState<any>([] as any);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [showReviewAgency, setShowReviewAgency] = useState(false);
  const [isNotFoundError, setIsNotFoundError] = useState<boolean>(false);
  const { userInfo } = useGlobalStore();
  const { keyword } = useKeywordBaned();
  const { allSettingLandingPage } = useAllSettingLandingPage();
  const [sumariesTotal, setSumariesTotal] = useState(0);
  const getSumaryListingReview = async () => {
    try {
      let response = await apiListingCategorriesServices.getSumaryListing(params?.id);
      if (response) {
        setSumariesTotal(response?.total);
      }
    } catch (error) {
      // console.log(error);
    }
  };
  useEffect(() => {
    if (allSettingLandingPage) {
      let findReviewAgency = _.find(allSettingLandingPage, {
        key: 'ZONE_REVIEW_AGENCY',
      });
      if (findReviewAgency) {
        setShowReviewAgency(findReviewAgency?.value);
      }
    }
  }, [allSettingLandingPage]);
  const router = useRouter();
  useEffect(() => {
    getDetail();
    getSaleListing(params.id);
    getRentListing(params.id);
    getSumaryListingReview();
  }, []);
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
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);
  const [formContact] = Form.useForm();
  const getDetail = async () => {
    if (params.id) {
      let data: any;
      try {
        const response = await memberApiService.getMemberByAnonymous(params.id);

        if (response.success) {
          data = response.data ?? null;
        }
        setAgency(data);
      } catch {
        setIsNotFoundError(true);
      }
    }
    setLoading(false);
  };
  const getSaleListing = async (id) => {
    let response = await apiHomePageService.getListByQuery({
      size: 3,
      userId: id,
      type: listingType.sale,
    });
    if (response?.success) {
      setListSaleProperty(response?.data.data);
    }
  };
  const getRentListing = async (id) => {
    let response = await apiHomePageService.getListByQuery({
      size: 3,
      userId: id,
      type: listingType.rent,
    });
    if (response?.success) {
      setListRentProperty(response?.data.data);
    }
  };
  const [selectedIndex, setSelectedIndex] = useState(0);
  const sendEmail = () => {
    window.open(`mailto:${agency?.email}`);
  };
  const callPhone = () => {
    window.open(`tel:${agency?.phone}`);
  };
  const contact = async () => {
    try {
      if (formContactData.valueCheckBox) {
        setBtnLoading(true);
        const response = await contactAnonymousService.createContactMe({
          clientName: formContactData.name,
          phone: formContactData.phone,
          email: formContactData.email,
          message: formContactData.message,
          submitTo: agency.id,
        });
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
      // console.log(e);
    }
  };
  const onContactFailed = async () => {};
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
  return (
    <>
      {loading ? (
        <div className="flex h-[80vh] items-center justify-center">
          <Spin></Spin>
        </div>
      ) : isNotFoundError ? (
        <NotFound />
      ) : (
        <div className="nc-PageAgency custom-spin relative overflow-hidden">
          {isDesktop ? (
            <div className="container mt-[100px] lg:block">
              <div className="grid grid-cols-12">
                <div className="col-span-9 pr-3">
                  <div className="grid grid-cols-5">
                    <div className="col-span-1 min-h-[200px]">
                      <img
                        src={agency?.avatarUrl}
                        loading="lazy"
                        alt=""
                        width={200}
                        height={200}
                        className="imgCustom h-[200px] w-[200px] object-cover"
                      />
                    </div>
                    <div className="col-span-4 flex min-h-[200px] flex-col justify-between px-10">
                      <div className=" ">
                        <div className="flex justify-between text-[24px] font-bold text-primaryColor">
                          <div>{agency?.fullName}</div>
                          <div className="flex items-center gap-2 text-[14px]">
                            <Rate
                              allowHalf
                              disabled
                              value={sumariesTotal}
                              style={{ color: '#CAB877', fontSize: 14 }}
                            />
                            ({sumariesTotal})
                          </div>
                        </div>
                        <div className="mt-[10px] grid grid-cols-4">
                          <div className="col-span-1 mt-2 text-[14px] font-semibold text-primaryColor">
                            {t('EcomAgentDetailPageMobile')}
                          </div>
                          <div className="text-gray col-span-3 mt-2 overflow-clip font-normal">
                            {formatPhone(agency?.phone)}
                          </div>
                          <div className="col-span-1 mt-2 text-[14px] font-semibold text-primaryColor">
                            {t('EcomAgentDetailPageEmail')}
                          </div>
                          <div className="text-gray col-span-3 mt-2 overflow-clip font-normal">
                            {agency?.email}
                          </div>
                        </div>
                      </div>

                      <div className="flex">
                        <button
                          onClick={sendEmail}
                          className="btn-primary focus:shadow-outline mr-2 max-w-[200px] !font-normal uppercase focus:outline-none"
                        >
                          {t('EcomAgentDetailPageSendEmail')}
                        </button>
                        <button
                          onClick={callPhone}
                          className="btn-outline-primary focus:shadow-outline max-w-[200px] bg-white !font-normal uppercase outline outline-1 focus:outline-none"
                        >
                          {t('EcomAgentDetailPageCall')}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h2 className="mt-5 text-[18px] font-semibold capitalize text-primaryColor">
                      {t('EcomAgentDetailPageAboutMe')}
                    </h2>
                  </div>
                  <div className="text-gray mt-3 font-normal">{agency?.aboutMe}</div>
                  <div className="my-4 border-t-[1px]"></div>
                  <div>
                    <div className="flex items-center justify-between">
                      <h2 className="text-[18px] font-semibold capitalize text-primaryColor">
                        {t('EcomAgentDetailPageMyListingSale')}
                      </h2>
                      <div
                        className="cursor-pointer text-base text-portal-primaryLiving underline"
                        onClick={() => {
                          router.push(`/tin-dang-ban?agencyId=${agency.id}`);
                        }}
                      >
                        {t('EcomPropertyDetailPageProjectViewMore')}
                      </div>
                    </div>
                    <div className="mt-[30px] grid grid-cols-3">
                      {listSaleProperty && listSaleProperty.length ? (
                        listSaleProperty?.map((item, index) => {
                          return (
                            <div key={index + item.id} className="cursor-pointer">
                              <CardItemProperties data={item} className="mx-1"></CardItemProperties>
                            </div>
                          );
                        })
                      ) : (
                        <div></div>
                      )}
                    </div>
                    <div className="mt-[20px] flex items-center justify-between">
                      <h2 className="text-[18px] font-semibold capitalize text-primaryColor">
                        {t('EcomAgentDetailPageMyListingRent')}
                      </h2>
                      <div
                        className="text--portal-primaryLiving cursor-pointer text-base underline"
                        onClick={() => {
                          router.push(`/tin-dang-cho-thue?agencyId=${agency.id}`);
                        }}
                      >
                        {t('EcomPropertyDetailPageProjectViewMore')}
                      </div>
                    </div>
                    <div className="mt-[30px] grid grid-cols-3">
                      {listRentProperty && listRentProperty.length ? (
                        listRentProperty?.map((item, index) => {
                          return (
                            <div key={index + item.id} className="cursor-pointer">
                              <CardItemProperties data={item} className="mx-1"></CardItemProperties>
                            </div>
                          );
                        })
                      ) : (
                        <div></div>
                      )}
                    </div>
                    {showReviewAgency ? (
                      <>
                        {' '}
                        <div className="my-[50px] border-t-[1px]"></div>
                        <div className="mb-[15px] text-lg font-semibold capitalize text-primaryColor">
                          {t('EcomAgencyDetailEvaluateAgency')}
                        </div>
                        <div className="mb-[50px]">
                          <ReviewAgencyComponent data={agency}></ReviewAgencyComponent>
                        </div>
                      </>
                    ) : (
                      <div className="mb-[50px]"></div>
                    )}
                  </div>
                </div>
                <div className="col-span-3">
                  <div className="border-1 flex flex-col rounded-lg border border-neutral-300 p-4">
                    <div className="font-semibold text-primaryColor">
                      {t('EcomAgentDetailPageContactMe')}
                    </div>
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
                              max: 100,
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
                        <Form.Item
                          rules={[
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
                          <label className="block">
                            <div>
                              <Label className="text-primaryColor">
                                {t('EcomPropertyDetailPageTicketMessage')}
                              </Label>
                            </div>
                            <TextArea
                              autoSize={{ minRows: 1, maxRows: 6 }}
                              name="message"
                              value={formContactData.message}
                              onChange={(e) => {
                                handleChangeValueContact('message', e.target.value);
                              }}
                              autoComplete="nope"
                              className="focus:boder-0 mt-1 rounded-none border-0 border-b-2 focus:!border-portal-primaryLiving focus:ring-0"
                              rows={4}
                            />
                          </label>
                        </Form.Item>
                      </div>
                      <div className="mt-3">
                        <div className="flex">
                          <input
                            id="policy-checkbox"
                            type="checkbox"
                            onChange={() =>
                              handleChangeValueContact(
                                'valueCheckBox',
                                !formContactData.valueCheckBox,
                              )
                            }
                            checked={formContactData?.valueCheckBox}
                            // defaultChecked={formContactData?.valueCheckBox}
                            className="checkbox-primary mt-[2px] focus:ring-0 focus:ring-offset-0"
                          />
                          <label htmlFor="policy-checkbox" className="ml-2 text-sm font-medium">
                            <span>
                              {t(
                                'EcomPropertyDetailPageTicketBySubmittingThisFormIAgreeToTermOfUse',
                              )}
                              <a className="underline" target="_blank">
                                {t('termOfUse')}
                              </a>
                            </span>
                          </label>
                        </div>
                      </div>
                      <div className="mt-[30px]">
                        <button
                          type="submit"
                          disabled={btnLoading}
                          className={`btn-primary focus:shadow-outline uppercase focus:outline-none disabled:opacity-80 ${
                            !formContactData.valueCheckBox ? '!bg-gray-400' : ''
                          }`}
                        >
                          {btnLoading ? (
                            <Spin></Spin>
                          ) : (
                            t('EcomPropertyDetailPageTicketLeaveAnInquiry')
                          )}
                        </button>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-[30px] px-4 lg:hidden">
              <div className="flex flex-col items-center">
                <div className="flex h-[90px] w-[90px] items-center justify-center overflow-hidden rounded-full border-2 border-yellow-100">
                  <img
                    src={agency?.avatarUrl}
                    loading="lazy"
                    alt=""
                    width={100}
                    height={100}
                    className="h-[85px] w-[85px] rounded-full"
                  />
                </div>
                <div className="mt-3 flex justify-between gap-2 text-xl font-bold text-primaryColor">
                  <div>{agency?.fullName}</div>
                </div>
                <div className="flex items-center gap-2 text-[14px] text-primaryColor">
                  <Rate
                    allowHalf
                    disabled
                    value={sumariesTotal}
                    style={{ color: '#CAB877', fontSize: 14 }}
                  />
                  ( {sumariesTotal} )
                </div>
              </div>
              <div className="mt-5 grid grid-cols-8">
                <div className="col-span-2 mt-2 font-semibold text-primaryColor">
                  {t('EcomAgentDetailPageMobile')}
                </div>
                <div className="col-span-6 ml-2 mt-2 overflow-clip text-[16px]">
                  {formatPhone(agency?.phone)}
                </div>
                {/* <div className="col-span-1 text-primaryColor mt-2">Fax</div>
                  <div className="col-span-3 mt-2 overflow-clip">test</div> */}
                <div className="col-span-2 mt-2 text-[16px] font-semibold text-primaryColor">
                  {t('EcomAgentDetailPageEmail')}
                </div>
                <div className="col-span-6 ml-2 mt-2 overflow-clip">{agency?.email}</div>
              </div>
              <div>
                <div>
                  <h2 className="mt-5 text-[16px] font-semibold capitalize text-primaryColor">
                    {t('EcomAgentDetailPageAboutMe')}
                  </h2>
                </div>
                <div className="mt-3">{agency?.aboutMe}</div>
              </div>
              <div className="mt-3 flex">
                <button
                  onClick={sendEmail}
                  className="btn-primary focus:shadow-outline mr-2 max-w-[200px] !font-normal uppercase focus:outline-none"
                >
                  {t('EcomAgentDetailPageSendEmail')}
                </button>
                <button
                  onClick={callPhone}
                  className="btn-outline-primary focus:shadow-outline max-w-[200px] bg-white !font-normal outline outline-1 focus:outline-none"
                >
                  {t('EcomAgentDetailPageCall')}
                </button>
              </div>
              <hr className="mx-auto my-4 h-[1px] w-full rounded border-0 bg-gray-200 dark:bg-gray-700 md:my-10" />
              <div className="mt-5 flex items-center justify-between">
                <h2 className="text-[16px] font-semibold capitalize text-primaryColor">
                  {t('EcomAgentDetailPageMyListingSale')}
                </h2>
                <div
                  className="text--portal-primaryLiving cursor-pointer text-base underline"
                  onClick={() => {
                    router.push(`/tin-dang-ban?agencyId=${agency.id}`);
                  }}
                >
                  {t('EcomPropertyDetailPageProjectViewMore')}
                </div>
              </div>
              <div className="mt-3 grid grid-cols-1">
                {listSaleProperty && listSaleProperty.length ? (
                  listSaleProperty?.map((item, index) => {
                    return (
                      <div key={index + item.id} className="cursor-pointer">
                        <CardItemProperties data={item} className="mt-3"></CardItemProperties>
                      </div>
                    );
                  })
                ) : (
                  <div>{t('noData')}</div>
                )}
              </div>
              <hr className="mx-auto my-4 h-[1px] w-full rounded border-0 bg-gray-200 dark:bg-gray-700 md:my-10" />
              <div className="mt-5 flex items-center justify-between">
                <h2 className="text-[16px] font-semibold capitalize text-primaryColor">
                  {t('EcomAgentDetailPageMyListingRent')}
                </h2>
                <div
                  className="text--portal-primaryLiving cursor-pointer text-base underline"
                  onClick={() => {
                    router.push(`/tin-dang-cho-thue?agencyId=${agency.id}`);
                  }}
                >
                  {t('EcomPropertyDetailPageProjectViewMore')}
                </div>
              </div>
              <div className="mt-3 grid grid-cols-1">
                {listRentProperty && listRentProperty.length ? (
                  listRentProperty?.map((item, index) => {
                    return (
                      <div key={index + item.id} className="cursor-pointer">
                        <CardItemProperties data={item} className="mt-3"></CardItemProperties>
                      </div>
                    );
                  })
                ) : (
                  <div>{t('noData')}</div>
                )}
              </div>
              <hr className="mx-auto my-4 h-[1px] w-full rounded border-0 bg-gray-200 dark:bg-gray-700 md:my-10" />
              {showReviewAgency ? (
                <>
                  {' '}
                  <div className="mt-3">
                    <div className="mb-[15px] font-semibold capitalize text-primaryColor">
                      {t('EcomAgencyDetailEvaluateAgency')}
                    </div>
                    <ReviewAgencyComponent data={agency}></ReviewAgencyComponent>
                  </div>
                </>
              ) : null}

              <div className="mt-3 pb-[60px]">
                <div className="font-semibold text-primaryColor">
                  {t('EcomAgentDetailPageContactMe')}
                </div>
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
                        { type: 'email', message: messageError('formatEmail') },
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
                    <Form.Item
                      rules={[
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
                      <label className="block">
                        <div>
                          <Label className="text-primaryColor">
                            {t('EcomPropertyDetailPageTicketMessage')}
                          </Label>
                        </div>
                        <TextArea
                          autoSize={{ minRows: 1, maxRows: 6 }}
                          name="message"
                          autoComplete="nope"
                          className="focus:boder-0 mt-1 rounded-none border-0 border-b-2 focus:!border-portal-primaryLiving focus:ring-0"
                          rows={4}
                        />
                      </label>
                    </Form.Item>
                  </div>
                  <div className="mt-3">
                    <div className="flex">
                      <input
                        id="policy-checkbox"
                        type="checkbox"
                        onChange={() =>
                          handleChangeValueContact('valueCheckBox', !formContactData.valueCheckBox)
                        }
                        checked={formContactData?.valueCheckBox}
                        // defaultChecked={formContactData?.valueCheckBox}
                        className="checkbox-primary mt-[2px] focus:ring-0 focus:ring-offset-0"
                      />
                      <label
                        htmlFor="policy-checkbox"
                        className="ml-2 text-sm font-medium dark:text-gray-300"
                      >
                        <span>
                          {t('EcomPropertyDetailPageTicketBySubmittingThisFormIAgreeToTermOfUse')}
                          <a
                            className="underline"
                            target="_blank"
                            onClick={() => {
                              router.push('/dieu-khoan-dieu-kien');
                            }}
                          >
                            {t('termOfUse')}
                          </a>
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="mt-[30px] flex justify-center">
                    <button
                      type="submit"
                      disabled={btnLoading}
                      className={`btn-primary focus:shadow-outline uppercase focus:outline-none disabled:opacity-80 ${
                        !formContactData.valueCheckBox ? '!bg-gray-400' : ''
                      }`}
                    >
                      {btnLoading ? <Spin></Spin> : 'Submit'}
                    </button>
                  </div>
                </Form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default PageDetailAgencyClient;
