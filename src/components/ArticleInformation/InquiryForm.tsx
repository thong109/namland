'use client';
import ButtonCore from '@/components/ButtonCore/ButtonCore';
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
  return <InquiryFormComponent props={props} />;
}

const InquiryFormComponent = ({ props }) => {
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
          message: t('EcomPropertyDetailPageLeaveAnInquiryEmailIsInvalid'),
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
  useEffect(() => { }, [props.listingDetail?.id, userInfo]);

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
    <div className="w-full">
      <ButtonCore
        disabled={isPending}
        className="mt-4 w-full"
        type="button"
        preset="secondary"
        label="Tư vấn ngay"
        onClick={() => setBookATourVisible(true)}
      />
      {bookATourVisible && (
        <Modal
          open={bookATourVisible}
          onCancel={() => setBookATourVisible(false)}
          styles={{
            wrapper: {
              background: 'none',
              zIndex: 9999,
            },
            content: {
              background: 'none',
              boxShadow: 'none',
            },
          }}
          closable={true}
          footer={null}
        >
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
