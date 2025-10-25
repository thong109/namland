'use client';
import contactAnonymousService from '@/apiServices/externalApiServices/apiAnonymousContact';
import BG1FindHome from '@/assets/images/bg-1-find-home.webp';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { ModalLoginOpen } from '@/components/Header/ultil/ModalLoginOpen';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button, Checkbox, Form, Input } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import React, { useTransition } from 'react';
import { TypeOptions, toast } from 'react-toastify';

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
      <Breadcrumb
        additionalClass="bg-transparent"
        breadcrumbItems={[
          { path: '/', title: 'Trang chủ' },
          { path: '/nhu-cau-cua-toi', title: 'Tìm môi giới' },
          { path: '', title: 'Tìm nhà' },
        ]}
        hasBanner={true}
      />
      <div className="flex">
        <div
          style={{ backgroundImage: `url(${BG1FindHome.src})` }}
          className="bg-cover bg-center bg-no-repeat lg:w-[360px]"
        />
        <div className="grid h-fit w-full grid-flow-col grid-rows-7 gap-4 lg:grid-rows-4">
          <div className="row-span-1 flex flex-col items-center justify-center">
            <span className="mb-2 font-semibold">{t('FindHomeTitle')}</span>
            <span className="px-2 text-center">{t('FindHomecontent')}</span>
          </div>
          {/* <div className="row-span-6 bg-[#EAEBEE] p-[3%] lg:row-span-3 lg:p-[3vw]">
          <Form
            form={formInquiry}
            layout="vertical"
            className="[&_.ant-input:focus]:border-[#C2C4CC] [&_.ant-input:focus]:shadow-none [&_.ant-input:focus]:ring-0 [&_.ant-input]:rounded-none [&_.ant-input]:border-0 [&_.ant-input]:border-b [&_.ant-input]:border-[#C2C4CC] [&_.ant-input]:shadow-none"
          >
            <div className="grid grid-cols-2 gap-x-6 bg-white p-14">
              <div className="col-span-2 lg:col-span-1 lg:px-5">
                <Form.Item
                  name="name"
                  label={t('FindHoneRequestName')}
                  rules={[{ required: true, max: 250 }]}
                >
                  <Input placeholder={t('FindHoneRequestNamePlacehoder')} />
                </Form.Item>
                <Form.Item
                  rules={[{ max: 250 }]}
                  name="numberOfOccupants"
                  label={t('FindHoneRequestMemberOfOcc')}
                >
                  <Input placeholder={t('FindHoneRequestMemberOfOccPlacehoder')} />
                </Form.Item>
                <Form.Item
                  name="preferredLocation"
                  label={t('FindHoneRequestPreferredLocation')}
                  rules={[{ required: true, max: 250 }]}
                >
                  <Input placeholder={t('FindHoneRequestPreferredLocationPlacehoder')} />
                </Form.Item>
                <Form.Item
                  rules={[{ max: 250 }]}
                  name="layoutPreference"
                  label={t('FindHoneRequestLayoutPreferrence')}
                >
                  <Input placeholder={t('FindHoneRequestLayoutPreferrencePlacehoder')} />
                </Form.Item>
                <Form.Item
                  rules={[{ max: 250 }]}
                  name="leaseTerm"
                  label={t('FindHoneRequesLeaseTerm')}
                >
                  <Input placeholder={t('FindHoneRequesLeaseTermPlacehoder')} />
                </Form.Item>
              </div>
              <div className="col-span-2 lg:col-span-1 lg:px-5">
                <Form.Item
                  name="contactInfomation"
                  label={t('FindHoneRequestContactInfoMation')}
                  rules={[{ required: true, max: 250 }]}
                >
                  <Input placeholder={t('FindHoneRequestContactInfoMationPlacehoder')} />
                </Form.Item>
                <Form.Item
                  name="typeOfProperty"
                  label={t('FindHoneRequestTypeOfProperty')}
                  rules={[{ required: true, max: 250 }]}
                >
                  <Input placeholder={t('FindHoneRequestTypeOfPropertyPlacehoder')} />
                </Form.Item>
                <Form.Item
                  name="budget"
                  label={t('FindHoneRequestBudgetRendRange')}
                  rules={[{ required: true, max: 250 }]}
                >
                  <Input placeholder={t('FindHoneRequestBudgetRendRamgePlacehoder')} />
                </Form.Item>
                <Form.Item
                  name="moveInDate"
                  label={t('FindHoneRequestMoveInDate')}
                  rules={[{ required: true, max: 250 }]}
                >
                  <Input placeholder={t('FindHoneRequestMoveInDatePlacehoder')} />
                </Form.Item>
                <Form.Item
                  rules={[{ max: 250 }]}
                  name="aboutYou"
                  label={t('FindHoneRequestAboutYou')}
                >
                  <Input placeholder={t('FindHoneRequestAboutYouPlacehoder')} />
                </Form.Item>
              </div>

              <div className="col-span-2 text-red-500">{t('requiredFields')}</div>

              <div className="col-span-2">
                <Form.Item name="isAllow" valuePropName="checked">
                  <Checkbox>
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
                </Form.Item>
              </div>
              <div className="col-span-2 flex justify-center">
                <Button
                  loading={isPending}
                  onClick={handleSend}
                  size="large"
                  type="primary"
                  className="rounded-none font-semibold lg:px-32"
                >
                  {t('INQUIRY_NOW_I')}
                </Button>
              </div>
            </div>
          </Form>
        </div> */}
        </div>
      </div>
    </>
  );
};

export default PageClient;
