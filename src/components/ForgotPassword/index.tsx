import registerApiService from '@/apiServices/externalApiServices/resgisterApiService';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { toast, TypeOptions } from 'react-toastify';
import OTPInput from './OTPInput';
import PasswordInput from './PasswordInput';
import PhoneInput from './PhoneInput';
interface ForgotPasswordComponentProps {
  onSubmit: (password: string) => void;
}

const ForgotPasswordComponent: React.FC<ForgotPasswordComponentProps> = ({ onSubmit }) => {
  const t = useTranslations('webLabel');
  const errorTranslation = useTranslations('errorNotifi');
  const success = useTranslations('successNotifi');
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [vertifyCode, setVertifyCode] = useState('');
  const [validOTP, setValidOTP] = useState(true);
  const [loading, setLoading] = useState(false);
  const [durationOtp, setDurationOtp] = useState<number>(0);
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);
  const handlePhoneNext = async (phone: string) => {
    setPhone(phone);
    setLoading(true);
    let res = await registerApiService.requestOTP({
      phone: phone,
      requestType: 'forgotpassword',
    });
    if (res.success) {
      notify('success', errorTranslation(res.errorCode));
      if (res.data) {
        setDurationOtp(Date.now() + res.data.duration * 1000);
      }

      setStep(2);
    } else {
      notify('error', errorTranslation(res.errorCode));
    }
    setLoading(false);
  };

  const handleOtpSubmit = async (otp: string) => {
    setLoading(true);
    if (otp.length >= 4) {
      let response = await registerApiService.submitOTP({
        phone: phone,
        otp: otp,
        verifyFor: 'forgotpassword',
      });
      if (response?.success) {
        if (response.data) {
          setVertifyCode(response.data.verifyCode);
        }
        setValidOTP(true);
        setStep(3);
      } else {
        setValidOTP(false);
        notify('error', errorTranslation(response.errorCode));
      }
      setLoading(false);
    }
  };
  const handlePasswordSubmit = async (password: string) => {
    setLoading(true);
    setPassword(password);
    let response = await registerApiService.forgotPassword({
      phone: phone,
      password: password,
      verifyCode: vertifyCode,
    });
    if (response.success) {
      notify('success', success('changePasswordSuccess'));
      onSubmit(password);
    } else {
      notify('error', errorTranslation(response.errorCode));
    }
    setLoading(false);
  };
  const handleResendOTP = async (): Promise<boolean> => {
    let res = await registerApiService.requestOTP({
      phone: phone,
      requestType: 'forgotpassword',
    });
    if (res.success) {
      if (res.data) {
        setValidOTP(true);
        setDurationOtp(Date.now() + res.data.duration * 1000);
      }
      notify('success', errorTranslation(res.errorCode));
      return true;
    } else {
      notify('error', errorTranslation(res.errorCode));
      return false;
    }
  };
  return (
    <div className="w-full justify-start px-5 pb-6 pt-4">
      <h1 className="text-xl font-bold text-primaryColor">
        {t('EcomForgotPasswordPageForgotPassword')}
      </h1>
      {step === 1 && <PhoneInput disabled={loading} onNext={handlePhoneNext} />}
      {step === 2 && (
        <OTPInput
          disabled={loading}
          reSendOTP={handleResendOTP}
          duration={durationOtp}
          onOtpSubmit={handleOtpSubmit}
          validOTP={validOTP}
          phoneNumber={phone}
        />
      )}
      {step === 3 && <PasswordInput disabled={loading} onPasswordSubmit={handlePasswordSubmit} />}
    </div>
  );
};

export default ForgotPasswordComponent;
