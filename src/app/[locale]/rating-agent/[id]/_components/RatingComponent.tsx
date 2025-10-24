'use client';
import ratingApiService from '@/apiServices/externalApiServices/apiRatingService';
import AvatarDefault from '@/assets/images/avarta-default.svg';
import backToHome from '@/assets/images/backToHome.png';
import { ModalLoginOpen } from '@/components/Header/ultil/ModalLoginOpen';
import useKeywordBanned from '@/hooks/useKeywordBaned';
import { checkValidTextInBlackListForForm } from '@/libs/helper';
import { UserInfo } from '@/models/userModel/userInfoModel';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button, Form, Input, Rate } from 'antd';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import Image from 'next/image';

import React, { useEffect, useState, useTransition } from 'react';
import { TypeOptions, toast } from 'react-toastify';

interface Props {
  broker: UserInfo;
}
const RatingComponent: React.FC<Props> = ({ broker }) => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);
  const { push } = useRouter();
  const success = useTranslations('successNotifi');

  const [formRate] = Form.useForm();
  const t = useTranslations('webLabel');
  const eForm = useTranslations('error');
  const { keyword } = useKeywordBanned();
  const [_, setIsModalOpen] = ModalLoginOpen();
  const { status } = useAuthStore();
  const { userInfo } = useAuthStore();
  const [isSubmited, setIsSubmited] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    formRate.setFieldsValue({
      professionalism: 5,
      serviceAttitude: 5,
      viewingExperience: 5,
      responseSpeed: 5,
      listingAccuracyComparedToVisit: 5,
      serviceValueRating: 5,
      agentServiceExperienceRating: 5,
    });
    setIsSubmited(false);
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      setIsModalOpen(true);
      return;
    }
  }, []);

  const onSend = async () => {
    await formRate.validateFields();
    const values = formRate.getFieldsValue();
    if (!userInfo) {
      setIsModalOpen(true);
      return;
    }
    const body = {
      ...values,
      userId: broker?.id,
    };

    startTransition(async () => {
      try {
        await ratingApiService.submitRating(body);
        notify('success', success('createAPI'));
        formRate.resetFields();
        setIsSubmited(true);
      } catch (e) {
        notify('error', e?.response?.data?.message);
        setIsSubmited(false);
      }
    });
  };

  return isSubmited ? (
    <div className="flex h-fit min-h-[800px] flex-col items-center bg-gray-100 lg:min-h-[1300px]">
      <div className="relative flex h-[200px] w-[100vw] flex-col items-center justify-center bg-yellow-400 py-8 lg:h-[300px]">
        <h2 className="text-lg font-semibold uppercase">{broker?.fullName}</h2>
      </div>

      <div className="absolute top-[200px] z-20 w-[100vw] lg:top-[300px]">
        <div className="relative flex w-full flex-col items-center">
          {/* Avatar */}
          <div className="z-[22] size-40 rounded-full bg-neutral-0">
            <div className="relative size-full overflow-hidden rounded-full">
              <Image
                src={broker?.avatarUrl ?? AvatarDefault?.src}
                alt={broker?.fullName}
                layout="fill"
                className="rounded-full"
              />
            </div>
          </div>

          {/* Text content below avatar */}
          <div className="mt-6 text-center">
            <h2 className="my-3 text-lg font-semibold uppercase lg:my-6">
              {t('TitleThankSubmitLandingPages')}
            </h2>
            <div className="text-sm lg:text-base">{t('Content1ThankSubmitLandingPages')}</div>
            <br />
            <div className="text-sm lg:text-base">{t('Content2ThankSubmitLandingPages')}</div>
            <div className="mt-[40px] uppercase lg:mt-[180px]">
              <a
                className="flex cursor-pointer items-center justify-center transition duration-300"
                onClick={() => push('/')}
              >
                {t('CONTINUE_TO_BROWSING_LISTING')}
                <Image
                  src={backToHome}
                  alt={broker?.fullName}
                  height={40}
                  width={40}
                  className="ml-3 rounded-full"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex h-fit min-h-[1400px] flex-col items-center bg-gray-100">
      <div className="relative flex h-[350px] w-[100vw] flex-col items-center justify-center bg-yellow-400 py-8 pb-10 text-center">
        <h2 className="text-base font-semibold uppercase">{t('TitleRatingLandingPage')}</h2>
        <p className="mb-10 mt-1 text-sm">{t('RatingLandingPage')}</p>
      </div>

      <div className="absolute top-[350px] z-20 w-[95%] rounded-lg bg-white p-6 shadow-md lg:w-[60%]">
        <div className="absolute left-1/2 top-[-70px] z-[22] -translate-x-1/2">
          <div className="size-40 rounded-full bg-neutral-0">
            <div className="relative size-full rounded-full">
              <Image
                src={broker?.avatarUrl ?? AvatarDefault?.src}
                alt={broker?.fullName}
                layout="fill"
                className="rounded-full"
              />
            </div>
          </div>

          <p className="mb-10 text-center text-xl font-semibold">{broker?.fullName}</p>
        </div>

        <div className="mt-28">
          <div className="mb-[50px] mt-[140px] flex w-[100%] justify-center">
            <div className="w-[100%] border lg:w-[50%]"></div>
          </div>
          <Form form={formRate} layout="vertical" size="middle">
            <div className="grid grid-cols-3">
              <div className="col-span-3 flex justify-center">
                <div className="flex flex-col items-center">
                  <label>{t('rateProfessionalism')}</label>
                  <Form.Item name="professionalism">
                    <Rate className="lg:text-3xl" allowHalf />
                  </Form.Item>
                </div>
              </div>
              <div className="col-span-3 flex justify-center">
                <div className="flex flex-col items-center">
                  <label>{t('rateAttltude')}</label>
                  <Form.Item name="serviceAttitude">
                    <Rate className="lg:text-3xl" allowHalf />
                  </Form.Item>
                </div>
              </div>
              <div className="col-span-3 flex justify-center">
                <div className="flex flex-col items-center">
                  <label>{t('rateExperience')}</label>
                  <Form.Item name="viewingExperience">
                    <Rate className="lg:text-3xl" allowHalf />
                  </Form.Item>
                </div>
              </div>
              <div className="col-span-3 flex justify-center">
                <div className="flex flex-col items-center">
                  <label>{t('rateSpeed')}</label>
                  <Form.Item name="responseSpeed">
                    <Rate className="lg:text-3xl" allowHalf />
                  </Form.Item>
                </div>
              </div>
              <div className="col-span-3 flex justify-center">
                <div className="flex flex-col items-center">
                  <label>{t('rateActualVisits')}</label>
                  <Form.Item name="listingAccuracyComparedToVisit">
                    <Rate className="lg:text-3xl" allowHalf />
                  </Form.Item>
                </div>
              </div>
              <div className="col-span-3 flex justify-center">
                <div className="flex flex-col items-center">
                  <label>{t('rateReceived')}</label>
                  <Form.Item name="serviceValueRating">
                    <Rate className="lg:text-3xl" allowHalf />
                  </Form.Item>
                </div>
              </div>
              <div className="col-span-3 flex justify-center">
                <div className="flex flex-col items-center">
                  <label>{t('rateFeedback')}</label>
                  <Form.Item name="agentServiceExperienceRating">
                    <Rate className="lg:text-3xl" allowHalf />
                  </Form.Item>
                </div>
              </div>

              <div className="col-span-3 lg:px-[15%]">
                <Form.Item
                  name="note"
                  rules={[
                    {
                      required: true,
                      message: `${eForm('pleaseInput')} ${t('placeholderRateInput')}`,
                    },

                    {
                      max: 1000,
                    },

                    {
                      validator: (rule, value) =>
                        checkValidTextInBlackListForForm(
                          value,
                          keyword,
                          `${eForm('keywordInBlackList')}`,
                        ),
                    },
                  ]}
                >
                  <Input.TextArea rows={5} placeholder={t('placeholderRateInput')} />
                </Form.Item>
              </div>
            </div>
          </Form>

          <div className="text-center">
            <Button
              disabled={isPending}
              onClick={onSend}
              className="rounded bg-yellow-400 px-6 py-2 font-semibold text-white hover:bg-yellow-500"
            >
              {t('sentNow')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingComponent;
