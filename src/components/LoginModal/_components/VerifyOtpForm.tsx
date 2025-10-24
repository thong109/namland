import CoreButton from '@/_components/CoreButton/CoreButton';
import { postEcomMobileV1EcomAccountResendOtp } from '@/ecom-sadec-api-client';
import { Form, Input, Spin } from 'antd';
import { Rule } from 'antd/es/form';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TypeOptions, toast } from 'react-toastify';

type RuleSchema = {
  otp: Rule[];
};

type VerifyOtpFormProps = {
  phone: string;
  handleGoBack: () => void;
  onConfirmOtp: (otp: string) => Promise<void>;
  type: 'registration' | 'login' | 'deleteaccount';
  timeLeftOtp: number;
};

const VerifyOtpForm: React.FC<VerifyOtpFormProps> = ({
  phone,
  handleGoBack,
  type,
  timeLeftOtp = 0,
  ...props
}) => {
  const t = useTranslations('webLabel');
  const [confirmOtpFormRef] = Form.useForm<{ otp: string }>();
  const [timeLeft, setTimeLeft] = useState<number>(180); // Initial time in seconds
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const error = useTranslations('errorNotifi');
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);
  const rules: RuleSchema = useMemo(
    () => ({
      otp: [
        {
          required: true,
          message: t('LoginModalPleaseInputOtp'),
        },
      ],
    }),
    [t],
  );
  useEffect(() => {
    startTimer();
  }, []);

  useEffect(() => {
    if (timeLeft === 0 && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [timeLeft]);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current); // Clear any existing timer

    setTimeLeft(timeLeftOtp); // 3 minutes

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
  };

  const startTimerV2 = (timeLeft) => {
    if (timerRef.current) clearInterval(timerRef.current); // Clear any existing timer

    setTimeLeft(timeLeft); // 3 minutes

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  const formatTime = (seconds: number) => {
    return `${seconds}s`;
  };

  const onGoBack = useCallback(() => {
    handleGoBack();
    if (confirmOtpFormRef) {
      confirmOtpFormRef.resetFields();
    }
  }, [handleGoBack, confirmOtpFormRef]);

  const onConfirmOtp = async (values: { otp: string }) => {
    setIsLoading(true);

    try {
      await props.onConfirmOtp(values.otp);
      setIsLoading(false);
    } catch (e) {
      notify('error', error('OtpInvalid'));
      setIsLoading(false);
    }
  };

  const onResendOtp = debounce(async () => {
    const result = (await postEcomMobileV1EcomAccountResendOtp({
      requestBody: {
        phone,
        typeOtp: type,
      },
    })) as { success?: boolean; data?: any };

    if (result?.success === true) {
      const newTimeLeft = result?.data?.otpDuration; // Reset to 3 minutes
      startTimerV2(newTimeLeft);
    }
  }, 500);

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col gap-3">
        <div className="font-medium">{t('LoginModalEnterFourDigitCodeSentTo')}</div>
        <div className="text-center font-bold">{phone}</div>
      </div>

      <Form
        form={confirmOtpFormRef}
        className="flex w-full flex-col items-center justify-center"
        onFinish={onConfirmOtp}
      >
        <Form.Item name="otp" className="w-full text-center" rules={rules.otp}>
          <Input.OTP autoFocus length={4} />
        </Form.Item>
        <Spin spinning={isLoading}>
          <CoreButton
            className="w-full"
            type="submit"
            label={type === 'registration' ? t('LoginModalRegister') : t('LoginModalLogin')}
          />
        </Spin>
      </Form>

      <div className="flex w-full justify-around">
        <div
          className="cursor-pointer text-neutral-400 underline underline-offset-2"
          onClick={onGoBack}
        >
          ‹ {t('LoginModalReenterPhone')}
        </div>
        <div
          className="cursor-pointer text-neutral-400 underline underline-offset-2"
          onClick={timeLeft > 0 ? undefined : onResendOtp}
        >
          {timeLeft === 0 && t('LoginModalResendCode')}
          {timeLeft > 0 &&
            t.rich('LoginModalResendOtpAfter', {
              timeleft: () => <span className="text-red-500">{formatTime(timeLeft)}</span>,
            })}
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpForm;
