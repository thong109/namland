import { setAuthCookie } from '@/app/api/auth/[...nextauth]/cookieAuth';
import InputBorder from '@/shared/InputBoder';
import Modal from 'antd/es/modal';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { TypeOptions, toast } from 'react-toastify';

export interface Props {
  isVisible: boolean;
  loginResult?: (value) => void;
}

const LoginReport: React.FC<Props> = ({ isVisible, loginResult }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const t = useTranslations('report');
  const errorTranslation = useTranslations('errorNotifi');
  const successTranslation = useTranslations('successNotifi');

  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);

  const authenticateUser = async (username, password) => {
    const trueUserName = 'BaocaoTMDT';
    const truePassword = 'BaocaoTMDT@112233';
    if (username === trueUserName && password === truePassword) {
      return {
        success: true,
        token: {
          username,
          password,
        },
      };
    } else {
      return { success: false, message: 'Authentication failed' };
    }
  };
  const handleLogin = async () => {
    const response = await authenticateUser(username, password);
    loginResult(response);
    if (response.success) {
      setAuthCookie(response.token);
      notify('success', successTranslation('loginSuccess'));
    } else {
      notify('error', errorTranslation('accountWrongPwd'));
    }
  };

  return (
    <>
      <Modal maskClosable={false} closable={false} width="600px" open={isVisible} footer={null}>
        <div className="px-5 py-5">
          <div className={`text-center text-xl font-bold uppercase text-primaryColor`}>
            {t('EcomLoginReportPageSignIn')}
          </div>

          <div>
            <InputBorder
              label={t('EcomLoginReportPageUserName')}
              type={'text'}
              name={'userName'}
              onChange={(e) => setUsername(e)}
            ></InputBorder>
          </div>
          <div>
            <InputBorder
              label={t('EcomLoginReportPagePassword')}
              name={'rePassword'}
              type={'password'}
              onChange={(e) => setPassword(e)}
            ></InputBorder>
          </div>

          <div className="flex">
            <button
              onClick={handleLogin}
              className="btn-primary focus:shadow-outline uppercase focus:outline-none"
            >
              {t('EcomLoginReportPageLogin')}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default LoginReport;
