import authApiService from '@/apiServices/externalApiServices/authApiService';
import FormFloatInputPassword from '@/components/FormInput/formInputPassword';
import useKeywordBanned from '@/hooks/useKeywordBaned';
import AuthConstant from '@/libs/constants/authConstant';
import { checkValidTextInBlackListForForm } from '@/libs/helper';
import useGlobalStore from '@/stores/useGlobalStore';
import { Form } from 'antd';
import Modal from 'antd/es/modal';
import Cookies from 'js-cookie';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import React, { useEffect } from 'react';
import { toast, TypeOptions } from 'react-toastify';
import './style.scss';

export interface IProps {
  visible: boolean;
  handleCanncel: () => void;
}

const ModalChangePassword = ({ visible, handleCanncel }: any) => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);
  const router = useRouter();
  const success = useTranslations('successNotifi');
  const { setToken, setUserInfo, setUserPackage } = useGlobalStore();
  const t = useTranslations('webLabel');
  const error = useTranslations('error');
  const { keyword } = useKeywordBanned();

  const [formPassword] = Form.useForm();

  useEffect(() => {
    if (visible) {
      formPassword.resetFields();
    }
  }, [visible]);

  const handleChangePassword = async () => {
    const formValue = await formPassword.validateFields();

    if (formValue?.newPassword !== formValue?.confirmPassword) {
      formPassword.setFields([
        {
          name: 'newPassword', // required
          errors: [error('notTheSam')],
        },
        {
          name: 'confirmPassword', // required
          errors: [error('notTheSam')],
        },
      ]);
    } else {
      const res = await authApiService.changePassword(formValue);
      if (res?.errorCode === null) {
        notify('success', success('updateAPI'));
        setTimeout(() => {
          signOut({ redirect: false }).then(() => {
            Cookies.remove(AuthConstant.AccessTokenCookieName);
            setToken(null);
            setUserPackage(null);
            setUserInfo(null);

            router.push('/account/login-admin');
            handleCanncel();
          });
        }, 1000);
      } else {
        notify('error', res?.message);
      }
    }
  };

  return (
    <Modal
      width="30%"
      open={visible}
      onOk={handleChangePassword}
      onCancel={handleCanncel}
      closeIcon={false}
      footer={[
        <div className="j mt-16 flex justify-center" key="Na">
          <button
            key="back"
            className="mr-2 rounded-xl border-x bg-[#FFD14B] px-10 py-2 font-medium text-[#ffffff]"
            onClick={handleCanncel}
          >
            <label>{t('goBack')}</label>
          </button>

          <button
            key="submit"
            className="rounded-xl border border-[#FFD14B] bg-[#ffffff] px-10 py-2 font-medium text-[#FFD14B]"
            onClick={handleChangePassword}
          >
            <label>{t('EcomMyProfilePageDetailChangePassword')}</label>
          </button>
        </div>,
      ]}
    >
      <div className="h-60">
        <Form form={formPassword} layout="vertical">
          <div className="col-span-12 py-2">
            <label className="text-base font-bold text-portal-primaryMainAdmin">
              {t('EcomMyProfilePageDetailChangePassword')}
            </label>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <FormFloatInputPassword
              name="oldPassword"
              label={t('EcomMyProfilePageDetailOldPassword')}
              required
              rules={[
                {
                  required: true,
                  message: `${error('pleaseInput')} ${t('EcomMyProfilePageDetailOldPassword')}`,
                },
                {
                  min: 0,
                  validator: (rule, value) =>
                    checkValidTextInBlackListForForm(
                      value,
                      keyword,
                      `${error('keywordInBlackList')} `,
                    ),
                },
                {
                  max: 36,
                  message: `${error('maxlength')} 36`,
                },
              ]}
            />
            <FormFloatInputPassword
              name="newPassword"
              label={t('EcomMyProfilePageDetailNewPassword')}
              required
              rules={[
                {
                  required: true,
                  message: `${error('pleaseInput')} ${t('EcomMyProfilePageDetailNewPassword')}`,
                },
                {
                  min: 0,
                  validator: (rule, value) =>
                    checkValidTextInBlackListForForm(
                      value,
                      keyword,
                      `${error('keywordInBlackList')} `,
                    ),
                },
                {
                  max: 36,
                  message: `${error('maxlength')} 36`,
                },
              ]}
            />
            <FormFloatInputPassword
              name="confirmPassword"
              label={t('EcomMyProfilePageDetailConfirmPassword')}
              required
              rules={[
                {
                  required: true,
                  message: `${error('pleaseInput')} ${t('EcomMyProfilePageDetailConfirmPassword')}`,
                },
                {
                  min: 0,
                  validator: (rule, value) =>
                    checkValidTextInBlackListForForm(
                      value,
                      keyword,
                      `${error('keywordInBlackList')} `,
                    ),
                },
                {
                  max: 36,
                  message: `${error('maxlength')} 36`,
                },
              ]}
            />
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default ModalChangePassword;
