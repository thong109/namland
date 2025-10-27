'use client';
import {
  MemberRegisterDto,
  postEcomV1EcomAccountLogin,
  postEcomV1EcomAccountLoginSocial,
  postEcomV1EcomAccountVerifyOtp,
  postEcomV2EcomAccountRegister,
  postEcomV2EcomAccountRequestOtpRegister,
} from '@/ecom-sadec-api-client';
import useAllSettingLandingPage from '@/hooks/useAllSettingLandingPage';
import { appAccountRegisterStatusEnum, typeTextBlock } from '@/libs/appconst';
import AccountType from '@/libs/constants/accountConstant';
import { useAuthStore } from '@/stores/useAuthStore';
import * as pixel from '@/utils/pixel';
import Modal from 'antd/es/modal';
import clsx from 'clsx';
import firebase from 'firebase/app';
import 'firebase/auth';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import React, { useCallback, useEffect, useState } from 'react';
import { TypeOptions, toast } from 'react-toastify';
import LoginForm from './_components/LoginForm';
import RegisterForm, {
  FormSchema as RegisterFormSchema,
  RegisterInfoModel,
} from './_components/RegisterForm';
import VerifyOtpForm from './_components/VerifyOtpForm';

interface LoginModalProps {
  closeModal: () => void;
  isVisible: boolean;
  handleOk: () => void;
}

type TabsType = 'login' | 'register';
type RequestOtpFromForm = 'login' | 'register';

const LoginModal: React.FC<LoginModalProps> = ({ isVisible, closeModal, handleOk }) => {
  const t = useTranslations('webLabel');
  const errorTranslation = useTranslations('error');
  const [tab, setTab] = React.useState<TabsType>('login');
  const [verifyingOtp, setVerifyingOtp] = React.useState<boolean>(false);
  const [phone, setPhone] = React.useState<string>('');
  const { setToken } = useAuthStore();
  const [requestOtpFrom, setRequestOtpFrom] = React.useState<RequestOtpFromForm>('login');
  const [registerFormData, setRegisterFormData] = React.useState<MemberRegisterDto | null>(null);
  const [verifyOtpFormType, setVerifyOtpFormType] = React.useState<
    'registration' | 'login' | 'deleteaccount'
  >('login');
  const [timeLeftOtp, setTimeLeftOtp] = React.useState<number>(0);
  const [registerInfo, setRegisterInfo] = useState<RegisterInfoModel>(undefined);
  const { allSettingLandingPage } = useAllSettingLandingPage();
  const [allowRegister, setAllowRegister] = useState<boolean>(true);
  const [blockLogin, setBlockLogin] = useState<boolean>(false);
  const [textBlock, setTextBlock] = useState<number>(typeTextBlock.REGISTER_CLICK);

  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);

  useEffect(() => {
    if (allSettingLandingPage) {
      const allowRegister = allSettingLandingPage?.find((item) => item.key === 'ZONE_REGISTER');

      // const blockLogin = allSettingLandingPage?.find((item) => item.key === 'ZONE_DISABLE_LOGIN');
      if (allowRegister.value === true) {
        setAllowRegister(true);
      } else {
        setAllowRegister(false);
        setTextBlock(typeTextBlock.REGISTER_CLICK);
      }

      // if (blockLogin.value === true) {
      //   setBlockLogin(true);
      //   setTextBlock(typeTextBlock.LOGIN);
      // } else {
      //   setBlockLogin(false);
      // }
    }
  }, [allSettingLandingPage, isVisible]);

  useEffect(() => {
    return () => {
      setVerifyingOtp(false);
      setTab('login');
    };
  }, [isVisible]);

  const onLogin = async (phone: string) => {
    const result = await postEcomV1EcomAccountLogin({ requestBody: { phoneNumber: phone } });
    setPhone(phone);
    notify('success', (result as any)?.message);
    console.log((result as any)?.data?.status);
    // status == 1 : login
    // status == 0 : register
    // status == 0 : block register
    // status == 3 : block login
    if ((result as any)?.data?.status === 1) {
      setTimeLeftOtp((result as any)?.data?.otpDuration ?? 0);
      setVerifyingOtp(true);
      setVerifyOtpFormType('login');
      setRequestOtpFrom('login');
    } else if ((result as any)?.data?.status === 0) {
      setTab('register');
    } else if ((result as any)?.data?.status === 2) {
      setTab('register');
      setTextBlock(typeTextBlock.REGISER_WITH_PHONE);
    } else if ((result as any)?.data?.status === 3) {
      setBlockLogin(true);
      setTextBlock(typeTextBlock.LOGIN);
    }

    return (result as any).data;
  };

  const onRegister = async (values: RegisterFormSchema) => {
    let data = {} as MemberRegisterDto;

    // đăng ký với social
    if (registerInfo) {
      data = {
        phone: values.phone,
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        accountType: values.accountType,
        extraInfo: null,
      };

      if (values.accountType === AccountType.owner) {
        data.extraInfo = {};
        data.extraInfo.address = values.address;
        data.extraInfo.taxCode = values.taxCode;
        data.extraInfo.taxCodeDateOfIssue = moment(values.taxCodeDateOfIssue).format();
        data.extraInfo.taxCodePlaceOfIssue = values.taxCodePlaceOfIssue;
      }

      data.authProvider = registerInfo?.authProvider;
      data.providerKey = registerInfo?.providerKey;
      data.providerAccessCode = registerInfo?.providerAccessCode;
    }
    // đăng ký không dùng socical
    else {
      setPhone(values.phone);
      data = {
        phone: values.phone,
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        accountType: values.accountType,
        extraInfo: null,
      };

      if (values.accountType === AccountType.owner) {
        data.extraInfo = {};
        data.extraInfo.address = values.address;
        data.extraInfo.taxCode = values.taxCode;
        data.extraInfo.taxCodeDateOfIssue = moment(values.taxCodeDateOfIssue).format();
        data.extraInfo.taxCodePlaceOfIssue = values.taxCodePlaceOfIssue;
      }
    }
    try {
      const otpRequestResponse = (await postEcomV2EcomAccountRequestOtpRegister({
        requestBody: {
          phone: values.phone,
        },
      })) as any;

      if (otpRequestResponse.success) {
        setRegisterFormData(data);
        notify('success', (otpRequestResponse as any)?.message);
        setTimeLeftOtp((otpRequestResponse as any)?.data?.otpDuration ?? 0);
        setVerifyingOtp(true);
        setRequestOtpFrom('register');
        setVerifyOtpFormType('registration');
      }
    } catch (e) {
      const errorText = e?.body?.message;
      notify('error', errorText);
    }
  };

  const onConfirmOtp = async (otp: string) => {
    if (requestOtpFrom === 'login') {
      await confirmLoginOtp(otp);
    } else if (requestOtpFrom === 'register') {
      await confirmRegisterOtp(otp);
    }
  };

  const confirmLoginOtp = async (otp: string) => {
    const response = await postEcomV1EcomAccountVerifyOtp({
      requestBody: {
        phone: phone,
        verifyCode: otp,
      },
    });

    if ((response as any).success) {
      setToken((response as any).data.token);
    }
  };

  const confirmRegisterOtp = async (otp: string) => {
    try {
      const response = await postEcomV2EcomAccountRegister({
        requestBody: {
          ...registerFormData,
          verifyCode: otp,
        },
      });

      if ((response as any).success) {
        setToken((response as any).data.token);
        pixel.register();
      }
    } catch (e) {
      const errorText = errorTranslation(e?.body?.message) ?? errorTranslation('OtpInvalid');
      notify('error', errorText);
    }
  };

  const googleSignIn = () => {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(googleProvider)
      .then(async (result: any) => {
        const body = {
          authProvider: result.credential.signInMethod,
          providerKey: result.user.uid,
          providerAccessCode: result.user.Aa,
        };

        await handleLoginGoogle(body);
      })
      .catch((error) => {});
  };

  const handleLoginGoogle = async (valuesCheck) => {
    const checkSocialRequestResponse = (await postEcomV1EcomAccountLoginSocial({
      requestBody: {
        ...valuesCheck,
      },
    })) as any;

    if (checkSocialRequestResponse.success) {
      switch (checkSocialRequestResponse.data.status) {
        case appAccountRegisterStatusEnum.NewAccount:
          // Tiến hành đăng ký tài khoản
          setRegisterInfo(checkSocialRequestResponse.data?.registerInfo);
          setTab('register');
          break;
        case appAccountRegisterStatusEnum.LoginSuccess:
          //set Token r login bth vô

          setToken((checkSocialRequestResponse as any).data.token);
          break;
        case appAccountRegisterStatusEnum.BLockLogin:
          setBlockLogin(true);
          break;

        default:
          setBlockLogin(false);
      }
    }
  };

  const AppleSignIn = () => {
    const appleProvider = new firebase.auth.OAuthProvider('apple.com');
    appleProvider.addScope('email');
    appleProvider.addScope('name');

    firebase
      .auth()
      .signInWithPopup(appleProvider)
      .then(async (result: any) => {
        const body = {
          authProvider: result.credential.signInMethod,
          providerKey: result.user.uid,
          providerAccessCode: result.user.Aa,
        };
        await handleLoginApple(body);
      })
      .catch((error) => {});
  };

  const handleLoginApple = async (valuesCheck) => {
    const checkSocialRequestResponse = (await postEcomV1EcomAccountLoginSocial({
      requestBody: {
        ...valuesCheck,
      },
    })) as any;

    if (checkSocialRequestResponse.success) {
      switch (checkSocialRequestResponse.data.status) {
        case appAccountRegisterStatusEnum.NewAccount:
          // Tiến hành đăng ký tài khoản
          setRegisterInfo(checkSocialRequestResponse.data?.registerInfo);
          setTab('register');
          break;
        case appAccountRegisterStatusEnum.LoginSuccess:
          //set Token r login bth vô
          setToken((checkSocialRequestResponse as any).data.token);
          break;
        case appAccountRegisterStatusEnum.BLockLogin:
          setBlockLogin(true);
          break;

        default:
          setBlockLogin(false);
      }
    }
  };

  const onCloseModel = () => {
    setRegisterInfo(undefined);
    setBlockLogin(false);
    closeModal();
  };

  const renderTabItem = useCallback(
    (item: TabsType, label: string) => {
      return (
        <div
          className={clsx('cursor-pointer rounded-t-xl px-8 py-2 text-lg font-bold', {
            'bg-neutral-0 text-portal-primaryLiving': tab === item,
            'text-neutral-0': tab !== item,
          })}
          onClick={() => tab !== item && setTab(item)}
        >
          {t(label)}
        </div>
      );
    },
    [tab, setTab],
  );

  const handleGoBack = useCallback(() => {
    setVerifyingOtp(false);
  }, [setVerifyingOtp]);

  return (
    <Modal
      style={{ borderRadius: '0px' }}
      styles={{
        wrapper: {
          background: 'none',
          zIndex: 9999999,
        },
        content: {
          background: 'none',
          boxShadow: 'none',
        },
        mask: {
          zIndex: 999999,
        },
      }}
      open={isVisible}
      onCancel={onCloseModel}
      closable={false}
      footer={null}
      width={'420px'}
    >
      <div className="relative rounded-3xl bg-neutral-0 p-5">
        {/* allowRegister == false => k cho hiện đăng ký */}
        {allowRegister && (
          <div className="absolute -top-11 left-0 flex h-11 w-full justify-center">
            {renderTabItem('login', 'Login')}
            {renderTabItem('register', 'Register')}
          </div>
        )}
        {tab === 'login' && !verifyingOtp && (
          <LoginForm
            initValues={{ phone: phone }}
            onLogin={onLogin}
            onGoogleLogin={googleSignIn}
            onAppleLogin={AppleSignIn}
            openRegisterTab={() => {
              setTab('register');
              setTextBlock(typeTextBlock.REGISTER_CLICK);
            }}
            blockLogin={blockLogin}
            onCloseBlock={onCloseModel}
            textBlock={textBlock}
          />
        )}
        {tab === 'register' && !verifyingOtp && (
          <RegisterForm
            onGoogleLogin={googleSignIn}
            onAppleLogin={AppleSignIn}
            initValues={
              registerInfo
                ? {
                    phone: registerInfo?.phoneNumber,
                    firstName: registerInfo?.name,
                    email: registerInfo?.emailAddress,
                  }
                : { phone: phone }
            }
            onRegister={onRegister}
            popupBlock={allowRegister == true ? false : true}
            onCloseBlock={onCloseModel}
            textBlock={textBlock}
          />
        )}
        {verifyingOtp && (
          <VerifyOtpForm
            phone={phone}
            type={verifyOtpFormType}
            handleGoBack={handleGoBack}
            onConfirmOtp={onConfirmOtp}
            timeLeftOtp={timeLeftOtp}
          />
        )}
      </div>
    </Modal>
  );
};

export default LoginModal;
