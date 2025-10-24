import IconCloseRed from '@/assets/icon/icon-close-red.svg';
import { Spin } from 'antd';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { useState } from 'react';
import Countdown, { zeroPad } from 'react-countdown';
import { isMobile } from 'react-device-detect';
import OtpInput from 'react-otp-input';
interface OTPInputProps {
  onOtpSubmit: (otp: string) => void;
  reSendOTP: () => Promise<boolean>;
  phoneNumber: string;
  validOTP: Boolean;
  duration?: number;
  disabled: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({
  onOtpSubmit,
  reSendOTP,
  phoneNumber,
  validOTP,
  duration,
  disabled,
}) => {
  const [otp, setOtp] = useState('');
  const t = useTranslations('webLabel');
  const [showCountDown, setShowCountDown] = useState(true);
  const handleOtpSubmit = () => {
    if (otp.length == 4) {
      onOtpSubmit(otp);
    }
  };
  const renderer = ({ hours, minutes, seconds, completed }: any) => {
    return (
      <span>
        {' '}
        {zeroPad(minutes)}:{zeroPad(seconds)}
      </span>
    );
  };
  const reSendOTPFunction = async () => {
    let res = await reSendOTP();
    if (res) {
      setShowCountDown(true);
      setOtp('');
    } else {
      setShowCountDown(false);
    }
  };
  return (
    <div className="flex w-full flex-col justify-center text-primaryColor">
      <div className="text-center">
        <div className="mt-4 text-lg font-bold text-primaryColor">
          {t('EcomRegisterPageVerificationOtpVerification')}
        </div>
        <div className="my-4">
          {t('EcomRegisterPageVerificationPleaseInput4-digitOtpSentTo')}{' '}
          <span className="font-bold">{phoneNumber}</span>
        </div>
      </div>
      <div>
        <OtpInput
          containerStyle={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
          value={otp}
          onChange={setOtp}
          numInputs={4}
          inputType={'tel'}
          renderSeparator={<span className="px-4 font-bold"></span>}
          inputStyle={{
            color: 'black',
            width: isMobile ? '40px' : '60px',
            height: '60px',
            fontSize: '20px',
            fontWeight: 'bold',
            borderRadius: '10px',
            borderColor: '#E8E8E8',
          }}
          renderInput={(props) => <input {...props} className="text-black" />}
        />
      </div>
      {validOTP ? null : (
        <div className="text--portal-primaryLiving mt-2 flex items-center justify-center">
          <Image alt="" src={IconCloseRed} className="mr-2 h-4 w-4"></Image>
          {t('EcomRegisterPageVerificationInvalidOTP')}
        </div>
      )}

      <div className="mt-28 flex items-center justify-center text-center">
        <div className="flex">
          {showCountDown ? (
            <>
              {t('EcomForgotPasswordPageVerificationResendOtpAfter')}{' '}
              <span className="text--portal-primaryLiving ml-1">
                <Countdown
                  date={duration}
                  renderer={renderer}
                  onComplete={() => {
                    setShowCountDown(false);
                  }}
                />
              </span>
            </>
          ) : (
            <div
              onClick={() => {
                reSendOTPFunction();
              }}
              className="text--portal-primaryLiving cursor-pointer"
            >
              {t('EcomForgotPasswordPageVerificationResendOtp')}
            </div>
          )}
        </div>
      </div>
      <button
        disabled={otp.length < 4 || disabled}
        className="btn-primary focus:shadow-outline mt-4 !bg-[#FFD14B] focus:outline-none disabled:opacity-75"
        onClick={handleOtpSubmit}
      >
        {disabled ? <Spin></Spin> : t('EcomRegisterPageVerificationNext')}
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

export default OTPInput;
