import ButtonCore from '@/components/ButtonCore/ButtonCore';
import FloatLabel from '@/_components/FloatLabel';
import BlockRegister from '@/assets/images/BlockRegistor.svg';
import appleSvg from '@/images/Apple-White.svg';
import googleSvg from '@/images/Google.svg';
import { typeTextBlock } from '@/libs/appconst';
import AccountType from '@/libs/constants/accountConstant';
import { Button, Checkbox, DatePicker, Form, Input, Modal, Select, Spin } from 'antd';
import { Rule } from 'antd/es/form';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { useEffect, useMemo, useRef } from 'react';

type RuleSchema = {
  firstName?: Rule[];
  lastName?: Rule[];
  email?: Rule[];
  accountType?: Rule[];
  phone?: Rule[];

  //extra
  address?: Rule[];
  taxCode?: Rule[];
  taxCodeDateOfIssue?: Rule[];
  taxCodePlaceOfIssue?: Rule[];
};

export type FormSchema = {
  firstName?: string;
  lastName?: string;
  email?: string;
  accountType?: string;
  phone?: string;

  //extra
  address?: string;
  taxCode?: string;
  taxCodeDateOfIssue?: Date;
  taxCodePlaceOfIssue?: string;
};

export type RegisterInfoModel = {
  authProvider?: string;
  emailAddress?: string;
  name?: string;
  phoneNumber?: string;
  providerAccessCode?: string;
  providerKey?: string;
};

type RegisterFormProps = {
  onRegister: (values: FormSchema) => Promise<void>;
  initValues?: FormSchema;
  registerInfo?: RegisterInfoModel;
  onGoogleLogin: () => void;
  onAppleLogin: () => void;
  popupBlock: boolean;
  onCloseBlock: () => void;
  textBlock: number;
};

const NAME_MAX_LENGTH = 25;

const RegisterForm: React.FC<RegisterFormProps> = ({
  initValues,
  popupBlock,
  onCloseBlock,
  ...props
}) => {
  const t = useTranslations('webLabel');
  const [registerFormRef] = Form.useForm<FormSchema>();
  const accountType = Form.useWatch<string>('accountType', registerFormRef);
  const [didAceeptTerms, setDidAceeptTerms] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isShowBlock, setIsShowBlock] = React.useState(false);
  const inputTagRef = useRef(null);
  const locale = useLocale();
  useEffect(() => {
    if (inputTagRef.current) {
      inputTagRef.current.focus();
    }
  }, [inputTagRef.current]);

  useEffect(() => {
    console.log(popupBlock);
    setIsShowBlock(popupBlock);
  }, [popupBlock]);

  const accountTypes = useMemo(() => {
    return [
      { label: t('LoginModalAccountTypeVisitor'), value: AccountType.visitor },
      { label: t('LoginModalAccountTypeOwner'), value: AccountType.owner },
    ];
  }, [t]);

  const rules: RuleSchema = useMemo(
    () => ({
      firstName: [{ required: true, message: t('LoginModalFirstNameIsRequired') }],
      lastName: [{ required: true, message: t('LoginModalLastNameIsRequired') }],
      email: [
        { required: true, message: t('LoginModalEmailIsRequired') },
        { type: 'email', message: t('LoginModalEmailIsInvalid') },
      ],
      phone: [
        { required: true, message: t('LoginModalPhoneIsRequired') },
        { pattern: /^[0-9]{10,11}$/, message: t('LoginModalPhoneNumberIsInvalid') },
      ],
      accountType: [{ required: true, message: t('LoginModalAccountTypeIsRequired') }],
      //extra
      // address: [
      //   {
      //     required: accountType === AccountType.owner,
      //     message: t('LoginModalRequired'),
      //   },
      // ],
      // taxCode: [
      //   {
      //     required: accountType === AccountType.owner,
      //     message: t('LoginModalRequired'),
      //   },
      // ],
      // taxCodeDateOfIssue: [
      //   {
      //     required: accountType === AccountType.owner,
      //     message: t('LoginModalRequired'),
      //   },
      // ],
      // taxCodePlaceOfIssue: [
      //   {
      //     required: accountType === AccountType.owner,
      //     message: t('LoginModalRequired'),
      //   },
      // ],
    }),
    [t, accountType],
  );

  const onRegister = async (values: FormSchema) => {
    setIsLoading(true);

    try {
      await props.onRegister(values);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const openLink = () => {
    window.open(`${window.location.origin}/${locale}/quy-che-hoat-dong`, '_blank');
  };

  const openLinkDieukhoandieukien = () => {
    window.open(`${window.location.origin}/${locale}/dieu-khoan-dieu-kien`, '_blank');
  };

  const renderTextBlock = (type) => {
    switch (type) {
      case typeTextBlock.LOGIN:
        return (
          <div>
            <label>{t('contentBlockLogin')}</label>
            <label>{t('contentBlockLogin1')}</label>
            <label>{t('contentBlockLogin2')}</label>
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
        {!props.registerInfo && (
          <>
            <div className="flex flex-col gap-3">
              <div className="text-lg font-medium">{t('LoginModalRegisterUsingSocialAccount')}</div>
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
                    width={30}
                    onClick={props.onGoogleLogin}
                    height={30}
                    src={googleSvg}
                    alt={'google'}
                  />
                </div>
              </div>
            </div>
            <div className="w-1/2 border-b border-b-portal-yellow"></div>
          </>
        )}
        <Form
          form={registerFormRef}
          className="flex w-full flex-col items-center justify-center"
          onFinish={onRegister}
          initialValues={initValues}
        >
          <div className="mb-2 text-lg font-medium">{t('LoginModalRegisterUsingPhoneNumber')}</div>

          <FloatLabel
            label={t('LoginModalYourFirstName')}
            name="firstName"
            className="w-full"
            rules={rules.firstName}
            form={registerFormRef}
          >
            <Input
              ref={inputTagRef}
              maxLength={NAME_MAX_LENGTH}
              className="h-12 pt-4 text-portal-primaryLiving"
            />
          </FloatLabel>
          <FloatLabel
            label={t('LoginModalYourLastName')}
            name="lastName"
            className="w-full"
            rules={rules.lastName}
            form={registerFormRef}
          >
            <Input maxLength={NAME_MAX_LENGTH} className="h-12 pt-4 text-portal-primaryLiving" />
          </FloatLabel>
          <FloatLabel
            label={t('LoginModalPhone')}
            name="phone"
            className="w-full"
            rules={rules.phone}
            form={registerFormRef}
          >
            <Input maxLength={11} className="h-12 pt-4 text-portal-primaryLiving" />
          </FloatLabel>
          <FloatLabel
            label={t('LoginModalEmail')}
            name="email"
            className="w-full"
            rules={rules.email}
            form={registerFormRef}
          >
            <Input className="h-12 pt-4 text-portal-primaryLiving" />
          </FloatLabel>
          <FloatLabel
            label={t('LoginModalAccountType')}
            name="accountType"
            className="w-full"
            rules={rules.accountType}
            form={registerFormRef}
          >
            <Select
              dropdownStyle={{ zIndex: 9999 }}
              className="h-12 text-portal-primaryLiving"
              options={accountTypes.map((item) => ({ label: item.label, value: item.value }))}
            />
          </FloatLabel>

          {/* extra */}
          {accountType === AccountType.owner && (
            <>
              <FloatLabel
                label={t('LoginModalAddress')}
                name="address"
                className="w-full"
                rules={rules.address}
                form={registerFormRef}
              >
                <Input className="h-12 pt-4 text-portal-primaryLiving" />
              </FloatLabel>
              <FloatLabel
                label={t('LoginModalTaxCode')}
                name="taxCode"
                className="w-full"
                rules={rules.taxCode}
                form={registerFormRef}
              >
                <Input className="h-12 pt-4 text-portal-primaryLiving" />
              </FloatLabel>
              <FloatLabel
                label={t('LoginModalDateOfIssuance')}
                name="taxCodeDateOfIssue"
                className="w-full"
                rules={rules.taxCodeDateOfIssue}
                form={registerFormRef}
              >
                <DatePicker className="h-12 w-full pt-4 text-portal-primaryLiving" placeholder="" />
              </FloatLabel>
              <FloatLabel
                label={t('LoginModalPlaceOfIssuance')}
                name="taxCodePlaceOfIssue"
                className="w-full"
                rules={rules.taxCodePlaceOfIssue}
                form={registerFormRef}
              >
                <Input className="h-12 pt-4 text-portal-primaryLiving" />
              </FloatLabel>
            </>
          )}
          <Spin spinning={isLoading}>
            <ButtonCore
              disabled={!didAceeptTerms || popupBlock}
              className="w-full"
              type="submit"
              label={t('LoginModalRegister')}
            />
          </Spin>
        </Form>
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

        <style scoped>
          {`
  .ant-picker-dropdown {
    z-index: 2000 !important;
  }
`}
        </style>
      </div>

      <Modal
        className="top-44"
        width={350}
        zIndex={3333}
        open={isShowBlock}
        onCancel={() => {
          setIsShowBlock(false);
          onCloseBlock();
        }}
        footer={false}
        closable={false}
      >
        <div className="flex flex-col justify-center text-center">
          <div className="flex w-full justify-center">
            <Image src={BlockRegister} alt={'block register'} width={100} />
          </div>
          {renderTextBlock(props.textBlock)}
        </div>

        <div className="mt-2 flex w-full justify-center">
          <Button
            onClick={() => {
              setIsShowBlock(false);
              onCloseBlock();
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

export default RegisterForm;
