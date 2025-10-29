'use client';
import contactAnonymousService from '@/apiServices/externalApiServices/apiAnonymousContact';
import { assetsImages } from '@/assets/images/package';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { ModalLoginOpen } from '@/components/Header/ultil/ModalLoginOpen';
import SectionContact from '@/components/SectionContact/SectionContact';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button, Checkbox, Form, Input } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import React, { useTransition } from 'react';
import { TypeOptions, toast } from 'react-toastify';
import './findHouse.css';

const PageClient = () => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);
  const success = useTranslations('successNotifi');
  const t = useTranslations('webLabel');
  const error = useTranslations('error');
  const [formInquiry] = Form.useForm();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const { userInfo } = useAuthStore();
  const [_, setIsModalOpen] = ModalLoginOpen();

  const openLink = () => {
    window.open(`${window.location.origin}/${locale}/quy-che-hoat-dong`, '_blank');
  };

  const openLinkDieukhoandieukien = () => {
    window.open(`${window.location.origin}/${locale}/dieu-khoan-dieu-kien`, '_blank');
  };

  const handleSend = async () => {
    await formInquiry.validateFields();
    const values = formInquiry.getFieldsValue();

    if (!values?.isAllow) {
      return formInquiry.setFields([
        {
          name: 'isAllow',
          errors: [error('isRequiredPolicy')],
        },
      ]);
    }
    startTransition(async () => {
      if (!userInfo) {
        setIsModalOpen(true);
        return;
      }
      await contactAnonymousService.submitFindAHome({
        ...values,
      });

      notify('success', success('createAPI'));
      formInquiry.resetFields();
    });
  };

  return (
    <>
      <section>
        <Breadcrumb
          additionalClass='breadcrumb-common--style-transparent'
          breadcrumbItems={[
            { path: '/', title: 'Trang chủ' },
            { path: '/nhu-cau-cua-toi', title: 'Tìm môi giới' },
            { path: '', title: 'Tìm nhà' },
          ]}
          hasBanner={true}
        />
        <div className='container pb-12 md:pb-[88px]'>
          <div className="contact__banner" style={{ backgroundImage: `url(${assetsImages.commonImageContact.src})` }}>
            <div className="grid grid-col">
              <h2>Bắt đầu tìm nhà một cách dễ dàng</h2>
              <p>Hãy Cho Chúng Tôi Biết Những Gì Bạn Đang Tìm Kiếm — <br className='hidden md:block'/>Chúng Tôi Sẽ Kết Nối Bạn Với Đúng Đại Lý Bất Động Sản Hoặc Nhà Phát Triển.</p>
            </div>
          </div>
          <div className="contact__form">
            <Form
              form={formInquiry}
              layout="vertical"
              className="contact__form-viewport"
            >
              <div className="contact__form-wrapper">
                <div className="col-span-2 lg:col-span-1 lg:px-5">
                  <Form.Item
                    className='!mb-[22px]'
                    name="name"
                    rules={[{ required: true, max: 250 }]}
                  >
                    <Input placeholder={t('FindHoneRequestName')} className='text-sm md:text-lg border-0 border-b border-portal-gray-3 placeholder-portal-gray-7 focus:bg-transparent focus:border-portal-gray-3 bg-transparent rounded-none p-0' />
                  </Form.Item>
                  <Form.Item
                    className='!mb-[22px]'
                    rules={[{ max: 250 }]}
                    name="numberOfOccupants"
                  >
                    <Input placeholder={t('FindHoneRequestMemberOfOcc')} className='text-sm md:text-lg border-0 border-b border-portal-gray-3 placeholder-portal-gray-7 focus:bg-transparent focus:border-portal-gray-3 bg-transparent rounded-none p-0' />
                  </Form.Item>
                  <Form.Item
                    className='!mb-[22px]'
                    name="preferredLocation"
                    rules={[{ required: true, max: 250 }]}
                  >
                    <Input placeholder={t('FindHoneRequestPreferredLocation')} className='text-sm md:text-lg border-0 border-b border-portal-gray-3 placeholder-portal-gray-7 focus:bg-transparent focus:border-portal-gray-3 bg-transparent rounded-none p-0' />
                  </Form.Item>
                  <Form.Item
                    className='!mb-[22px]'
                    rules={[{ max: 250 }]}
                    name="layoutPreference"
                  >
                    <Input placeholder={t('FindHoneRequestLayoutPreferrence')} className='text-sm md:text-lg border-0 border-b border-portal-gray-3 placeholder-portal-gray-7 focus:bg-transparent focus:border-portal-gray-3 bg-transparent rounded-none p-0' />
                  </Form.Item>
                  <Form.Item
                    className='!mb-[22px]'
                    rules={[{ max: 250 }]}
                    name="leaseTerm"
                  >
                    <Input placeholder={t('FindHoneRequesLeaseTerm')} className='text-sm md:text-lg border-0 border-b border-portal-gray-3 placeholder-portal-gray-7 focus:bg-transparent focus:border-portal-gray-3 bg-transparent rounded-none p-0' />
                  </Form.Item>
                </div>
                <div className="col-span-2 lg:col-span-1 lg:px-5">
                  <Form.Item
                    className='!mb-[22px]'
                    name="contactInfomation"
                    rules={[{ required: true, max: 250 }]}
                  >
                    <Input placeholder={t('FindHoneRequestContactInfoMation')} className='text-sm md:text-lg border-0 border-b border-portal-gray-3 placeholder-portal-gray-7 focus:bg-transparent focus:border-portal-gray-3 bg-transparent rounded-none p-0' />
                  </Form.Item>
                  <Form.Item
                    className='!mb-[22px]'
                    name="typeOfProperty"
                    rules={[{ required: true, max: 250 }]}
                  >
                    <Input placeholder={t('FindHoneRequestTypeOfProperty')} className='text-sm md:text-lg border-0 border-b border-portal-gray-3 placeholder-portal-gray-7 focus:bg-transparent focus:border-portal-gray-3 bg-transparent rounded-none p-0' />
                  </Form.Item>
                  <Form.Item
                    className='!mb-[22px]'
                    name="budget"
                    rules={[{ required: true, max: 250 }]}
                  >
                    <Input placeholder={t('FindHoneRequestBudgetRendRange')} className='text-sm md:text-lg border-0 border-b border-portal-gray-3 placeholder-portal-gray-7 focus:bg-transparent focus:border-portal-gray-3 bg-transparent rounded-none p-0' />
                  </Form.Item>
                  <Form.Item
                    className='!mb-[22px]'
                    name="moveInDate"
                    rules={[{ required: true, max: 250 }]}
                  >
                    <Input placeholder={t('FindHoneRequestMoveInDate')} className='text-sm md:text-lg border-0 border-b border-portal-gray-3 placeholder-portal-gray-7 focus:bg-transparent focus:border-portal-gray-3 bg-transparent rounded-none p-0' />
                  </Form.Item>
                  <Form.Item
                    className='!mb-[22px]'
                    rules={[{ max: 250 }]}
                    name="aboutYou"
                  >
                    <Input placeholder={t('FindHoneRequestAboutYou')} className='text-sm md:text-lg border-0 border-b border-portal-gray-3 placeholder-portal-gray-7 focus:bg-transparent focus:border-portal-gray-3 bg-transparent rounded-none p-0' />
                  </Form.Item>
                </div>

                <div className="col-span-2 text-lg leading-1.5 text-red-500 md:px-4">{t('requiredFields')}</div>

                <div className="col-span-2 md:px-4">
                  <Form.Item name="isAllow" valuePropName="checked" className="!mb-4">
                    <Checkbox
                      className="[&_.ant-checkbox-inner]:w-6 [&_.ant-checkbox-inner]:h-6 [&_.ant-checkbox-inner]:border-1 [&_.ant-checkbox-inner]:border-portal-gray-4 [&_.ant-checkbox-inner]:rounded-sm [&_.ant-checkbox-checked_.ant-checkbox-inner]:bg-portal-red-3 [&_.ant-checkbox-checked_.ant-checkbox-inner]:border-portal-red-3 [&_.ant-checkbox]:align-top">
                      <span className="text-sm md:text-base leading-snug">
                        {t.rich('AgreeWithTermsAndConditions', {
                          quychehoatdong: (chunks) => (
                            <span className="underline cursor-pointer" onClick={openLink}>
                              {chunks}
                            </span>
                          ),
                          dieukhoandieukien: (chunks) => (
                            <span className="underline cursor-pointer" onClick={openLinkDieukhoandieukien}>
                              {chunks}
                            </span>
                          ),
                        })}
                      </span>
                    </Checkbox>
                  </Form.Item>
                </div>
                <div className="col-span-2 flex justify-center mt-4">
                  <Button
                    loading={isPending}
                    onClick={handleSend}
                    size="large"
                    type="primary"
                    className="font-mona rounded-none font-semibold lg:px-32 bg-portal-primaryLiving w-[286px] h-[34px] hover:opacity-80 hover:!bg-portal-primaryLiving"
                  >
                    {t('INQUIRY_NOW_I')}<span className='ml-[10px] block flex-[0_0_auto] bg-center bg-no-repeat bg-cover w-[17px] h-[18px]' style={{ backgroundImage: `url(${assetsImages.commonIconSearchWhite.src})` }}></span>
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </div>
        <SectionContact />
      </section>
    </>
  );
};

export default PageClient;
