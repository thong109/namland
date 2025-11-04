'use client';

import ButtonCore from '@/components/ButtonCore/ButtonCore';
import useCheckScreenSize from '@/components/CheckScreenSize/CheckScreenSize';
import { ModalLoginOpen } from '@/components/Header/ultil/ModalLoginOpen';
import MobiDatePicker from '@/components/MobiDatePicker/MobiDatePicker';
import { postEcomEcomInquiryCreate } from '@/ecom-sadec-api-client';
import { InquiryStatusEnum } from '@/libs/enums/InquiryStatusEnum';
import listingPropertyModel from '@/models/listingModel/listingPropertyModel';
import { useAuthStore } from '@/stores/useAuthStore';
import { Checkbox, DatePicker, Input } from 'antd';
import Form, { Rule } from 'antd/es/form';
import dayjs from 'dayjs';
import { useLocale, useTranslations } from 'next-intl';
import React, { useMemo, useTransition } from 'react';
import { TypeOptions, toast } from 'react-toastify';

interface Props {
  locale: string;
  listingDetail: listingPropertyModel;
  closeModal: () => void;
}

type RuleSchema = {
  name?: Rule[];
  phone?: Rule[];
  email?: Rule[];
  message?: Rule[];
  visitDate?: Rule[];
};

export type FormSchema = {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  visitDate?: dayjs.Dayjs;
};

const BookATourForm: React.FC<Props> = (props) => {
  const t = useTranslations('webLabel');
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);
  const success = useTranslations('successNotifi');
  const [_, setIsModalOpen] = ModalLoginOpen();
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const [didAceeptTerms, setDidAceeptTerms] = React.useState<boolean>(false);
  const { userInfo } = useAuthStore();
  const [formRef] = Form.useForm<FormSchema>();
  const isMobile = useCheckScreenSize();
  const rules: RuleSchema = useMemo(
    () => ({
      visitDate: [
        {
          required: true,
          message: t('EcomPropertyDetailPageLeaveAnInquiryRequired'),
        },
      ],
      name: [
        {
          required: true,
          message: t('EcomPropertyDetailPageLeaveAnInquiryRequired'),
        },
      ],
      phone: [
        {
          required: true,
          message: t('EcomPropertyDetailPageLeaveAnInquiryRequired'),
        },
      ],
      email: [
        {
          required: true,
          message: t('EcomPropertyDetailPageLeaveAnInquiryRequired'),
        },
        {
          type: 'email',
          message: t('EcomPropertyDetailPageLeaveAnInquiryEmailIsInvalid'),
        },
      ],
    }),
    [t],
  );

  const initValues: FormSchema = useMemo(() => {
    return {
      visitDate: dayjs(),
      name: userInfo?.fullName || '',
      phone: userInfo?.phone || '',
      email: userInfo?.email || '',
      message: '',
    };
  }, [userInfo]);

  const onSubmitBookATour = async (values) => {
    startTransition(async () => {
      if (!userInfo) {
        setIsModalOpen(true);
        return;
      }
      await postEcomEcomInquiryCreate({
        requestBody: {
          listingId: props.listingDetail.id,
          clientName: values.name,
          phone: values.phone,
          email: values.email,
          message: values.message,
          visitDate: dayjs(values.visitDate).toJSON(),
          ticketStatus: InquiryStatusEnum.SiteVisit,
        },
      });

      notify('success', success('createAPI'));
      formRef.resetFields();
      props.closeModal();
    });
  };

  const openLink = () => {
    window.open(`${window.location.origin}/${locale}/quy-che-hoat-dong`, '_blank');
  };

  const openLinkDieukhoandieukien = () => {
    window.open(`${window.location.origin}/${locale}/dieu-khoan-dieu-kien`, '_blank');
  };

  return (
    <>
      <div className="my-2 font-semibold text-center text-xl mobile:text-lg">{t('EcomIAmOwnerPageSendUsYourInquiry')}</div>
      <Form
        form={formRef}
        className="flex w-full flex-col items-center justify-center"
        onFinish={() => onSubmitBookATour(formRef.getFieldsValue())}
        layout="vertical"
        initialValues={initValues}
      >
        {isMobile ? (
          <Form.Item
            name="visitDate"
            className="w-full"
            rules={rules.visitDate}
            label={t('EcomPropertyDetailPageLeaveAnInquirySelectDateAndTime')}
          >
            <MobiDatePicker />
          </Form.Item>
        ) : (
          <Form.Item
            name="visitDate"
            rules={rules.visitDate}
            className="w-full"
            label={t('EcomPropertyDetailPageLeaveAnInquirySelectDateAndTime')}
          >
            <DatePicker
              minDate={dayjs()}
              showTime
              showSecond={false}
              className="w-full"
              needConfirm={false}
            />
          </Form.Item>
        )}

        <Form.Item
          name="name"
          rules={rules.name}
          className="w-full"
          label={t('EcomPropertyDetailPageLeaveAnInquiryName')}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phone"
          rules={rules.phone}
          className="w-full"
          label={t('EcomPropertyDetailPageLeaveAnInquiryPhone')}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          rules={rules.email}
          className="w-full"
          label={t('EcomPropertyDetailPageLeaveAnInquiryEmail')}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="message"
          rules={rules.message}
          className="w-full"
          label={t('EcomPropertyDetailPageLeaveAnInquiryMessage')}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
        <Checkbox className="self-start" onChange={(e) => setDidAceeptTerms(e.target.checked)}>
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
        <div className="flex w-full gap-4">
          <ButtonCore
            disabled={!didAceeptTerms || isPending}
            className="mt-4 !w-full !min-w-full"
            type="submit"
            label={t('EcomPropertyDetailPageLeaveAnInquiryLeaveInquiry')}
          />
        </div>
      </Form>
    </>
  );
};

export default BookATourForm;
