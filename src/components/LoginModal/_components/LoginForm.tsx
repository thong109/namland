import CoreButton from '@/_components/CoreButton/CoreButton';
import FloatLabel from '@/_components/FloatLabel';
import appleSvg from '@/images/Apple-White.svg';
import googleSvg from '@/images/Google.svg';
import { typeTextBlock } from '@/libs/appconst';
import PhoneLoginResponseModel from '@/models/accountV1Model/phoneLoginResponseModel';
import { Button, Form, Input, Modal, Spin } from 'antd';
import { Rule } from 'antd/es/form';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { useEffect, useMemo, useRef } from 'react';
import { TypeOptions, toast } from 'react-toastify';

type RuleSchema = {
  phone: Rule[];
};

type FormSchema = {
  phone?: string;
};

type LoginFormProps = {
  onLogin: (phone: string) => Promise<PhoneLoginResponseModel>;
  onGoogleLogin: () => void;
  onAppleLogin: () => void;
  initValues?: FormSchema;
  openRegisterTab: () => void;
  blockLogin: boolean;
  onCloseBlock: () => void;
  textBlock: number;
};

const LoginForm: React.FC<LoginFormProps> = ({ ...props }) => {
  const t = useTranslations('webLabel');
  const error = useTranslations('errorNotifi');
  const [loginFormRef] = Form.useForm<FormSchema>();
  const inputTagRef = useRef(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isShowBlock, setIsShowBlock] = React.useState(false);

  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);
  useEffect(() => {
    if (inputTagRef.current) {
      inputTagRef.current.focus();
    }
  }, [inputTagRef.current]);

  useEffect(() => {
    console.log(props.blockLogin);
    setIsShowBlock(props.blockLogin);
  }, [props.blockLogin]);

  const rules: RuleSchema = useMemo(
    () => ({
      phone: [
        {
          required: true,
          message: t('LoginModalPleaseInputYourPhoneNumber'),
        },
        {
          pattern: /^[0-9]{10,11}$/,
          message: t('LoginModalPhoneNumberIsInvalid'),
        },
      ],
    }),
    [t],
  );

  const onLogin = async (values: FormSchema) => {
    setIsLoading(true);
    try {
      await props.onLogin(values.phone);
      setIsLoading(false);
    } catch (e) {
      notify('error', e?.body?.message);
      setIsLoading(false);
    }
  };

  const renderTextBlock = (type) => {
    switch (type) {
      case typeTextBlock.LOGIN:
        return (
          <div>
            <label className="text-xs">{t('contentBlockLogin')}</label>
            <br />
            <label className="text-xs">{t('contentBlockLogin1')}</label>
            <br />
            <label className="text-xs">{t('contentBlockLogin2')}</label>
          </div>
        );
      case typeTextBlock.REGISER_WITH_PHONE:
        return <div>{t('contentBlockRegisterWhenUsePhone')}</div>;
      case typeTextBlock.REGISTER_CLICK:
        return <div> {t('contentBlockRegister')}</div>;
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-6">
        {/* <div className="text-lg font-medium">{t('LoginModalLoginToExploreMore')}</div> */}

        {/* <div className="w-1/2 border-b border-b-portal-yellow"></div> */}

        <div className="flex flex-col gap-3">
          <div className="text-lg font-medium">{t('LoginModalLoginAsSocialAccount')}</div>
          <div className="bg-neu flex items-center justify-center gap-5">
            <div className="flex size-11 cursor-pointer justify-center rounded-full bg-neutral-900 shadow-md">
              <Image
                onClick={props.onAppleLogin}
                className="flex-shrink-0"
                width={17}
                height={20}
                src={appleSvg}
                alt={'apple'}
              />
            </div>
            <div className="flex size-11 cursor-pointer justify-center rounded-full bg-neutral-0 shadow-md">
              <Image
                className="flex-shrink-0"
                onClick={props.onGoogleLogin}
                width={30}
                height={30}
                src={googleSvg}
                alt={'google'}
              />
            </div>
          </div>
        </div>
        <div className="w-1/2 border-b border-b-portal-yellow"></div>
        <div className="text-lg font-medium">{t('LoginModalUsingPhoneNumber')}</div>

        <Form
          form={loginFormRef}
          className="flex w-full flex-col items-center justify-center"
          onFinish={onLogin}
          initialValues={props.initValues}
        >
          <FloatLabel
            label={t('LoginModalYourPhoneNumber')}
            name="phone"
            className="w-full"
            rules={rules.phone}
            form={loginFormRef}
          >
            <Input
              ref={inputTagRef}
              autoFocus
              maxLength={11}
              className="h-12 pt-4 text-portal-primaryLiving"
            />
          </FloatLabel>
          <Spin spinning={isLoading}>
            <CoreButton className="w-full" type="submit" label={t('LoginModalLogin')} />
          </Spin>
        </Form>

        <div>
          {t.rich('LoginModalDontHaveAnAccount', {
            register: () => (
              <span
                className="cursor-pointer text-portal-primaryLiving"
                onClick={() => props.openRegisterTab()}
              >
                {t('LoginModalRegister')}
              </span>
            ),
          })}
        </div>
      </div>

      <Modal
        className="top-44"
        width={350}
        zIndex={3333}
        open={isShowBlock}
        onCancel={() => {
          setIsShowBlock(false);
          props.onCloseBlock();
        }}
        footer={false}
        closable={false}
      >
        <div className="flex flex-col justify-center text-center">
          <div className="flex w-full justify-center">
            {/* <Image src={BlockRegister} alt={'block register'} width={100} /> */}
          </div>
          {renderTextBlock(props.textBlock)}
        </div>

        <div className="mt-2 flex w-full justify-center">
          <Button
            onClick={() => {
              setIsShowBlock(false);
              props.onCloseBlock();
            }}
            type="primary"
            className="w-[80%] rounded-none border-black font-semibold text-black"
            size="large"
          >
            {t('goBack')}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default LoginForm;
