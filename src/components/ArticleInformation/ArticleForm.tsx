'use client';
import AvatarDefault from '@/assets/images/avarta-default.svg';
import { ModalLoginOpen } from '@/components/Header/ultil/ModalLoginOpen';
import {
  getEcomV1EcomInquiryGetConversation,
  postEcomV1EcomInquiryCreate,
} from '@/ecom-sadec-api-client';
import listingPropertyModel from '@/models/listingModel/listingPropertyModel';
import { useAuthStore } from '@/stores/useAuthStore';
import { getPosterDetailUrl } from '@/utils/urlUtil';
import { Checkbox, Form, Input, Modal } from 'antd';
import { Rule } from 'antd/es/form';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next-intl/link';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import React, { useEffect, useMemo, useTransition } from 'react';
import { TypeOptions, toast } from 'react-toastify';
import ChatInput from './ChatComponent/ChatInput';
import ChatMessages from './ChatComponent/ChatMessages';
import ButtonCore from '../ButtonCore/ButtonCore';

interface InquiryFormProps {
  locale: string;
  listingDetail: listingPropertyModel;
}

type RuleSchema = {
  name?: Rule[];
  phone?: Rule[];
  email?: Rule[];
  message?: Rule[];
};

const BookATourForm = dynamic(() => import('./BookATourForm'), { ssr: false });

export type FormSchema = {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
};

export default function InquiryForm(props) {
  return <ArticleForm props={props} />;
}

const ArticleForm = ({ props }) => {
  const t = useTranslations('webLabel');
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);

  const [_, setIsModalOpen] = ModalLoginOpen();
  const success = useTranslations('successNotifi');
  const locale = useLocale();
  const [bookATourVisible, setBookATourVisible] = React.useState<boolean>(false);
  const [listMessage, setLisMessage] = React.useState<any>([]);
  const [didAceeptTerms, setDidAceeptTerms] = React.useState<boolean>(false);
  const { userInfo } = useAuthStore();
  const [formRef] = Form.useForm<FormSchema>();
  const listingUserInfo = props.listingDetail.userInfo;
  const [isPending, startTransition] = useTransition();
  const [inquiryIdChat, setInquiryIdChat] = React.useState<string>(null);
  const rules: RuleSchema = useMemo(
    () => ({
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
          message: t('EcomPropertyDTjCwKyJPGNTUnrna9ZUP24AkC6cZQRSYRid'),
        },
      ],
    }),
    [t],
  );
  const openLink = () => {
    window.open(`${window.location.origin}/${locale}/quy-che-hoat-dong`, '_blank');
  };

  const openLinkDieukhoandieukien = () => {
    window.open(`${window.location.origin}/${locale}/dieu-khoan-dieu-kien`, '_blank');
  };

  const initValues = useMemo(() => {
    return {
      name: userInfo?.fullName || '',
      phone: userInfo?.phone || '',
      email: userInfo?.email || '',
      message: '',
    };
  }, [userInfo]);
  useEffect(() => {
    formRef.setFieldsValue({
      name: userInfo?.fullName || '',
      phone: userInfo?.phone || '',
      email: userInfo?.email || '',
    });
  }, [userInfo]);
  useEffect(() => {}, [props.listingDetail?.id, userInfo]);

  useEffect(() => {
    if (props.listingDetail?.inquiryId) {
      getDataMessage(props.listingDetail?.inquiryId);

      setInquiryIdChat(props.listingDetail?.inquiryId);
    } else {
      setInquiryIdChat(null);
    }
  }, [props.listingDetail]);

  const onSubmitInquiry = async (values) => {
    //Lần đầu chat
    if (!userInfo) {
      handleNeedLoggin();
    } else {
      startTransition(async () => {
        const reponse: any = await postEcomV1EcomInquiryCreate({
          requestBody: {
            listingId: props.listingDetail.id,
            message: values.message,
          },
          authorization: null,
        });

        setInquiryIdChat(reponse?.data?.id);
        getDataMessage(reponse?.data?.id);

        notify('success', success('createAPI'));
        formRef.resetFields();
      });
    }
  };

  const handleNeedLoggin = () => {
    setIsModalOpen(true);
    return;
  };

  const submitForm = async () => {
    onSubmitInquiry({ ...formRef.getFieldsValue() });
  };

  const getDataMessage = async (id) => {
    const res: any = await getEcomV1EcomInquiryGetConversation({
      from: 0,
      referenceId: id,
      size: 100,
      authorization: null,
    });
    setLisMessage(res?.data?.data);
  };
  const handleSendMessage = async (val) => {
    await postEcomV1EcomInquiryCreate({
      requestBody: {
        listingId: props.listingDetail.id,
        message: val,
        inquiryId: inquiryIdChat,
      },
      authorization: null,
    }).finally(() => {
      getDataMessage(inquiryIdChat);
    });
  };
  return (
    <div className="sticky top-24 w-full rounded-3xl border border-neutral-200 px-2 py-5">
      <div className="flex justify-center gap-4">
        <div className="relative size-[4.5rem] overflow-hidden rounded-full border-4 border-neutral-0 bg-portal-yellow shadow-xl">
          <Image
            src={listingUserInfo.avatarUrl ?? AvatarDefault?.src}
            alt="avatar"
            fill
            className={`${listingUserInfo.avatarUrl ? '' : 'scale-75'}object-cover`}
          />
        </div>
        <div className="flex flex-col">
          <div className="text-base font-medium">{listingUserInfo.fullName}</div>
          <div className="text-sm text-neutral-500">
            {listingUserInfo.contactNumber ?? listingUserInfo.userName}
          </div>
          <Link
            href={getPosterDetailUrl(listingUserInfo.id, null)}
            className="cursor-pointer text-sm text-neutral-500 underline"
          >
            {t('EcomPropertyDetailPageViewListings')}
          </Link>
        </div>
      </div>
      <div className="my-2 text-center text-xl font-medium text-portal-primaryLiving">
        {t(
          inquiryIdChat !== null
            ? 'EcomPropertyDetailChat'
            : 'EcomPropertyDetailPageSendUsYourInquiry',
        )}
      </div>

      {inquiryIdChat !== null ? (
        <>
          <div className="flex flex-col gap-2">
            <ChatMessages messages={listMessage} />
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
        </>
      ) : (
        <Form
          size="large"
          form={formRef}
          className="flex w-full flex-col items-center justify-center px-8 lg:px-1"
          onFinish={submitForm}
          layout="vertical"
          initialValues={initValues}
        >
          <Form.Item
            name="name"
            rules={rules.name}
            className="w-full"
            label={t('EcomPropertyDetailPageLeaveAnInquiryName')}
          >
            <Input disabled={userInfo ? true : false} />
          </Form.Item>
          <Form.Item
            name="phone"
            rules={rules.phone}
            className="w-full"
            label={t('EcomPropertyDetailPageLeaveAnInquiryPhone')}
          >
            <Input disabled={userInfo ? true : false} />
          </Form.Item>
          <Form.Item
            name="email"
            rules={rules.email}
            className="w-full"
            label={t('EcomPropertyDetailPageLeaveAnInquiryEmail')}
          >
            <Input disabled={userInfo ? true : false} />
          </Form.Item>
          <Form.Item
            name="message"
            rules={rules.message}
            className="w-full"
            label={t('EcomPropertyDetailPageLeaveAnInquiryMessage')}
          >
            <Input.TextArea rows={3} />
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
          <ButtonCore
            disabled={!didAceeptTerms || isPending}
            className="mt-4 w-full"
            type="submit"
            label={t('EcomPropertyD72xEKG7u1AL1ERQ1oVNVVQ1obGBtquGWb')}
          />
          <ButtonCore
            disabled={isPending}
            className="mt-4 w-full border border-neutral-500"
            type="button"
            preset="secondary"
            label={t('EcomPropertyDGAwTLfXFvia47eaLhdeXr5V7dWomAcVtT')}
            onClick={() => setBookATourVisible(true)}
          />
        </Form>
      )}

      {bookATourVisible && (
        <Modal
          open={bookATourVisible}
          onCancel={() => setBookATourVisible(false)}
          styles={{
            wrapper: {
              background: 'none',
            },
            content: {
              background: 'none',
              boxShadow: 'none',
            },
          }}
          closable={false}
          footer={null}
        >
          <BookATourForm
            listingDetail={props.listingDetail}
            locale={props.locale}
            closeModal={() => setBookATourVisible(false)}
          />
        </Modal>
      )}
    </div>
  );
};
