import InputBorder from '@/shared/InputBoder';
import { Spin } from 'antd';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
interface PasswordInputProps {
  onPasswordSubmit: (password: string) => void;
  disabled: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ onPasswordSubmit, disabled }) => {
  const [password, setPassword] = useState('');
  const t = useTranslations('webLabel');
  const messageError = useTranslations('Message_Required');
  const handlePasswordSubmit = () => {
    onPasswordSubmit(password);
  };

  return (
    <div>
      <div className="text-center">
        <div className="mt-4 text-lg font-bold text-primaryColor">
          {t('EcomForgotPasswordPageNewPasswordNewPassword')}
        </div>
      </div>
      <InputBorder
        type={'password'}
        onChange={(text) => {
          setPassword(text);
        }}
        placeholder=""
        label={t('EcomForgotPasswordPageNewPasswordNewPassword')}
        value={password}
      />
      <button
        disabled={disabled}
        className="focus:shadow-outline btn-primary mt-40 !bg-[#FFD14B] focus:outline-none"
        onClick={handlePasswordSubmit}
      >
        {' '}
        {disabled ? <Spin></Spin> : t('EcomForgotPasswordPageNewPasswordConfirm')}
      </button>
      <div className="mt-28 flex flex-col items-center justify-center text-center">
        <div className="text--portal-primaryLiving text-lg font-bold">
          {t('EcomForgotPasswordPageVerificationContactSupport')}
        </div>
        <a href="tel:0285411888" className="my-2">
          {' '}
          <span className="text-primaryColor">(028) 5411-8888</span>
        </a>
        <a href="mailto:info@hungthaitech.vn">
          {' '}
          <span className="text-primaryColor">info@hungthaitech.vn</span>
        </a>
      </div>
    </div>
  );
};

export default PasswordInput;
