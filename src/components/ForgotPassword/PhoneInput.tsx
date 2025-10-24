import InputBorder from '@/shared/InputBoder';
import { Spin } from 'antd';
import Form from 'antd/es/form';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
interface PhoneInputProps {
  onNext: (phone: string) => void;
  disabled: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ onNext, disabled }) => {
  const [phone, setPhone] = useState('');
  const t = useTranslations('webLabel');
  const messageError = useTranslations('Message_Required');
  const handleNext = () => {
    onNext(phone);
  };
  const handleNextFail = () => {};
  const handleChangePhone = (text: string) => {
    setPhone(text);
  };
  const [formForgot] = Form.useForm();
  return (
    <div>
      <Form
        autoComplete="off"
        form={formForgot}
        onFinish={handleNext}
        onFinishFailed={handleNextFail}
      >
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
          name={'phone'}
        >
          <InputBorder
            type={'text'}
            name={'phone'}
            onChange={handleChangePhone}
            placeholder=""
            label={t('EcomForgotPasswordPagePhoneNumber')}
            value={phone}
          />
        </Form.Item>
        <button
          disabled={disabled}
          type="submit"
          className="focus:shadow-outline btn-primary mt-40 !bg-[#FFD14B] focus:outline-none"
        >
          {' '}
          {disabled ? <Spin></Spin> : t('EcomForgotPasswordPageNext')}
        </button>
      </Form>
    </div>
  );
};

export default PhoneInput;
