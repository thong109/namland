'use client';
import authApiService from '@/apiServices/externalApiServices/authApiService';
import logoHT from '@/assets/images/logo-admin-login.png';
import AuthConstant from '@/libs/constants/authConstant';
import userTypeConstant from '@/libs/constants/userTypeConstant';
import useGlobalStore from '@/stores/useGlobalStore';
import { Input, Spin } from 'antd';
import Form from 'antd/es/form';
import Cookies from 'js-cookie';
import { debounce } from 'lodash';
import { getSession, signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import Image from 'next/image';
import React, { FC, useEffect, useState, useTransition } from 'react';
import { isMobile } from 'react-device-detect';
import { TypeOptions, toast } from 'react-toastify';
import './page.scss';

interface FormLogin {
  userName: string;
  password: string;
  valueCheckBox: boolean;
}

export interface Props {
  params: any;
}
const LoginAdminPage: FC<Props> = () => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);
  const { userInfo, setUserInfo, setToken } = useGlobalStore();
  const [formDataLogin, setFormDataLogin] = useState<any>({
    userName: '',
    password: '',
    valueCheckBox: false,
  });

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isPending, startTransition] = useTransition();
  const errorTranslation = useTranslations('errorNotifi');
  const t = useTranslations('webLabel');
  const success = useTranslations('successNotifi');
  const { push } = useRouter();
  const [formLogin] = Form.useForm();
  const messageError = useTranslations('Message_Required');

  useEffect(() => {
    checkUserExit();
  }, [userInfo]);

  const checkUserExit = () => {
    if (userInfo && userInfo.type === userTypeConstant.Customer) {
      push('/');
    } else if (userInfo && userInfo.type === userTypeConstant.Salesman) {
      push('/admin/staff-properties');
    } else {
      formLogin?.resetFields();
    }
  };

  const handleChangeValueLogin = (key: string, value: any) => {
    let preForm = { ...formDataLogin };
    setFormDataLogin({ ...preForm, [key]: value });
  };

  const login = debounce(async (values: FormLogin) => {
    var response = await signIn(AuthConstant.CredentialProviderName, {
      username: values.userName,
      password: values.password,
      redirect: false,
    });

    if (response?.ok) {
      // it's really important to remove this old/fake access token after login successfully
      Cookies.remove(AuthConstant.AccessTokenCookieName);
      //changelang
      setTimeout(async () => {
        const resuUser = await authApiService.getCurrentUser();

        if (resuUser?.data) {
          const session = await getSession();
          startTransition(() => {
            if (session && session['accessToken']) {
              setToken(session['accessToken']);
            }

            setUserInfo((resuUser as any)?.data);
            push('/admin/staff-properties');
          });
        }
        setIsLoggingIn(false);
        notify('success', success('loginSuccess'));
      }, 500);
      //refresh current user in global context
    } else {
      setIsLoggingIn(false);
      notify('error', errorTranslation('accountWrongPwd'));
    }
  }, 400);

  const onLoginFailed = (errorInfo: any) => {
    notify('error', errorTranslation('common'));
  };

  return (
    <div className="flex h-[100vh]">
      {isMobile ? <></> : <div className="background-login w-[70vw]"></div>}
      <div className={`${isMobile ? 'w-[100vw]' : 'lg:w-[30vw]'} px-[50px] pt-[3%]`}>
        <div className="flex w-full justify-center">
          <Image className="object-cover" src={logoHT} alt="logoHT" />
        </div>

        <Form
          autoComplete="off"
          form={formLogin}
          onFinish={(values) => {
            setIsLoggingIn(true);
            login(values);
          }}
          onFinishFailed={onLoginFailed}
          layout="vertical"
        >
          <h1 className="py-4 text-center text-xl font-semibold">{t('loginWithAccountStaff')}</h1>
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
              name={'userName'}
            >
              <Input
                size="large"
                type={'text'}
                placeholder={t('EcomLoginPagePhoneNumber')}
                value={formDataLogin.userName}
                onChange={(text) => {
                  handleChangeValueLogin('userName', text);
                }}
              />
            </Form.Item>
          </div>
          <div>
            <Form.Item
              rules={[
                {
                  message: messageError('passwordRequired'),
                  required: true,
                },
              ]}
              name="password"
            >
              <Input.Password
                size="large"
                placeholder={t('EcomLoginPagePassword')}
                value={formDataLogin.password}
                onChange={(text) => {
                  handleChangeValueLogin('password', text);
                }}
              ></Input.Password>
            </Form.Item>
          </div>
          <div className="flex justify-between">
            <div className="mb-4 flex items-center">
              <input
                id="remember-checkbox"
                onChange={() =>
                  handleChangeValueLogin('valueCheckBox', !formDataLogin.valueCheckBox)
                }
                // defaultChecked={formDataLogin?.valueCheckBox}
                type="checkbox"
                className="checkbox-primary focus:ring-0 focus:ring-offset-0"
              />
              <label htmlFor="remember-checkbox" className="ml-2 text-sm text-gray-900">
                {t('EcomLoginPageKeepMeSignedIn')}
              </label>
            </div>
          </div>

          <div className="flex">
            {isPending || isLoggingIn ? (
              <div className="w-full text-center">
                <Spin />
              </div>
            ) : (
              <button
                disabled={isLoggingIn}
                className="btn-primary bg-portal-primaryLiving uppercase focus:outline-none"
              >
                {t('EcomLoginPageLogin')}
              </button>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginAdminPage;
