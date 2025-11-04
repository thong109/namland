'use client';
import newHomeApiService from '@/apiServices/externalApiServices/apiNewHomeService';
import Label from '@/components/Label';
import useKeywordBaned from '@/hooks/useKeywordBaned';
import { checkValidText } from '@/libs/appconst';
import { convertPhoneNumber84To0 } from '@/libs/helper';
import useGlobalStore from '@/stores/useGlobalStore';
import { Button, Form, Input, Modal, Spin } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import React, { useEffect, useState, useTransition } from 'react';
import { TypeOptions, toast } from 'react-toastify';
import './style.css';
import { assetsImages } from '@/assets/images/package';

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
        valueCheckBox: false,
      });
      formContact.setFieldsValue({
        name: userInfo?.firstName + ' ' + userInfo?.lastName,
        phone: formatPhone(userInfo?.phone),
        email: userInfo?.email,
      });
    } else {
      setFormContactData({
        name: '',
        phone: '',
        email: '',
        valueCheckBox: false,
      });
      formContact.resetFields();
    }
  };

  const [formContactData, setFormContactData] = useState({
    name: '',
    phone: '',
    email: '',
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

  const onContactFailed = async () => { };

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
      <div className="article-common-contact__container">
        <div className="article-common-contact__wrapper">
          <div className="article-common-contact__wrapper-title">
            {t('EcomPropertyDetailPageNewHomeInquiryRequest')}
          </div>
          <ul className='article-common-contact__wrapper-note'>
            <li className='article-common-contact__wrapper-note-item'>{t('EcomPropertyDetailPageTourFAQ')}</li>
            <li className='article-common-contact__wrapper-note-item'>{t('EcomPropertyDetailPageTourPrivacy')}</li>
          </ul>
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
                <Input
                  placeholder={t('EcomPropertyDetailPageReviewName')}
                  type={'text'}
                  name={'name'}
                  value={formContactData.name}
                  onChange={(text) => {
                    handleChangeValueContact('name', text);
                  }}
                ></Input>
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
                <Input
                  placeholder={t('EcomPropertyDetailPageReviewEmail')}
                  type={'text'}
                  name={'email'}
                  value={formContactData.email}
                  onChange={(text) => {
                    handleChangeValueContact('email', text);
                  }}
                ></Input>
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
                <Input
                  placeholder={t('EcomPropertyDetailPageTicketPhone')}
                  type={'tel'}
                  name={'phone'}
                  value={formContactData.phone}
                  onChange={(text) => {
                    handleChangeValueContact('phone', text);
                  }}
                ></Input>
              </Form.Item>
            </div>
            <div className="mt-[18px]">
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
                  className="article-common-contact__checkbox"
                />
                <label
                  htmlFor="policy-checkbox"
                  className="article-common-contact__checkbox-label"
                >
                  <span>
                    {t.rich('AgreeWithTermsAndConditions', {
                      quychehoatdong: (chunks) => (
                        <span className="article-common-contact__checkbox-link" onClick={openLink}>
                          {chunks}
                        </span>
                      ),
                      dieukhoandieukien: (chunks) => (
                        <span className="article-common-contact__checkbox-link" onClick={openLinkDieukhoandieukien}>
                          {chunks}
                        </span>
                      ),
                    })}
                  </span>
                </label>
              </div>
            </div>
            {/* <div className="mt-[30px]">
              <button
                type="submit"
                disabled={isPending}
                className={`btn-primary focus:shadow-outline ] mr-2 uppercase focus:outline-none disabled:!opacity-70 ${!formContactData.valueCheckBox ? '!bg-gray-400' : '!bg-portal-primaryLiving'
                  }`}
              >
                {isPending ? <Spin></Spin> : t('EcomPropertyDetailPageTicketLeaveAnInquiry')}
              </button>
            </div> */}
          </Form>
          <div className="article-common-contact__wrapper-line">
            <div></div>
            <span>{t('EcomPropertyDetailPageTourOr')}</span>
            <div></div>
          </div>
          <div className="article-common-contact__social">
            <a href="tel:19002698">
              <div className="article-common-contact__social-icon" style={{ backgroundImage: `url(${assetsImages.commonIconPhone2.src})` }}>
              </div>
              <div className="text-left text-sm">
                <div className="article-common-contact__social-icon-title">{t('EcomPropertyDetailPageTourCall')}</div>
                <div className="article-common-contact__social-icon-phone">1900 2698</div>
              </div>
            </a>
            <a
              href="https://zalo.me/19002698"
              target="_blank"
              rel="noopener noreferrer">
              <div className="article-common-contact__social-icon" style={{ backgroundImage: `url(${assetsImages.commonIconZalo.src})` }}></div>
              <div className="article-common-contact__social-icon-title">{t('EcomPropertyDetailPageTourChatZalo')}</div>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectNewInquiry;
