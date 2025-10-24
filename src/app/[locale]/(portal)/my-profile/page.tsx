'use client';
import authApiService from '@/apiServices/externalApiServices/authApiService';
import { firebaseConfig } from '@/app/firebase';
import AppPageMeta from '@/components/AppPageMeta';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import AvatarUpload from '@/components/FileUpload/AvatarUpload';
import FormFloatInput from '@/components/FormInput/formInput';
import FormRadioAdmin from '@/components/FormInput/formRadioAdmin';
import FormFloatSelect from '@/components/FormInput/formSelect/Index';
import FormFloatInputArea from '@/components/FormInput/formTextArea';
import useKeywordBanned from '@/hooks/useKeywordBaned';
import { AppleIcon, GoogleIcon } from '@/libs/appComponents';
import {
  emailRegex,
  listAccountType,
  listEducationLevel,
  listEmploymentStatus,
  listIncomeRange,
  listLivingCost,
  listMaritalStatus,
  listOccupation,
  listReligion,
  phoneRegex,
} from '@/libs/appconst';
import UserAccountTypeConstant from '@/libs/constants/userAccountType';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import { checkValidTextInBlackListForForm } from '@/libs/helper';
import AccountModel from '@/models/accountModel/accountModel';
import useGlobalStore from '@/stores/useGlobalStore';
import { Button, Form, QRCode, Switch, Tabs } from 'antd';
import Modal from 'antd/lib/modal';
import firebase from 'firebase';
import { useTranslations } from 'next-intl';
import React, { FC, useEffect, useRef, useState } from 'react';
import { TypeOptions, toast } from 'react-toastify';
import DomDomReport from './components/DomDomReport';
import ModalChangePassword from './components/ModalChangePassword';
import ModalConfirmRemove from './components/ModalConfirmRemove';

function simpleNormalize(name: string): string {
  return name
    .normalize('NFD') // tách dấu ra khỏi ký tự
    .replace(/[\u0300-\u036f]/g, '') // xóa dấu
    .replace(/Đ/g, 'D')
    .replace(/đ/g, 'd') // xử lý riêng cho Đ/đ
    .replace(/\s+/g, '-'); // thay khoảng trắng bằng "-"
}

const TypeSocial = {
  Google: 'google.com',
  Apple: 'apple.com',
};

const tabKeys = {
  tabProfile: 'TAB_PROFILE',
  tabCorporate: 'TAB_INVOICE',
  tabReport: 'TAB_REPORT',
};
const { TabPane } = Tabs;
const MyProfile: FC = () => {
  const qrRef = useRef<any>(null);
  const [profileForm] = Form.useForm();
  const [corporateForm] = Form.useForm();
  const { keyword } = useKeywordBanned();
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  const error = useTranslations('error');
  const success = useTranslations('successNotifi');
  const [userAvatar, setUserAvatar] = useState<string>();
  const [myProfile, setMyProfile] = useState<any>();
  const { setUserInfo } = useGlobalStore();
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [typeActionSocial, setTypeActionSocial] = useState(undefined);
  const [isShowChangePass, SetIsShowChangePass] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<string>(tabKeys.tabProfile);
  const [dataQR, setDataQR] = useState<string>('');
  const [isShowQR, setIshowQR] = useState<boolean>(false);

  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);

  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (!firebase.apps.length) initFireBase();
  }, []);

  const initFireBase = () => {
    firebase.initializeApp(firebaseConfig);
    firebase.auth().languageCode = 'vi';
  };

  const getProfile = async () => {
    let user: AccountModel | null = null;
    const userResponse = await authApiService.getCurrentUser();
    user = userResponse.data ?? null;
    setMyProfile(user);

    setUserAvatar(user?.avatarUrl);
    profileForm.setFieldsValue({
      ...user,
    });

    corporateForm.setFieldsValue({
      ...user,
    });
  };

  const updateProfile = async () => {
    const formValue = await profileForm.validateFields();

    await setProfileLoading(true);
    const userResponse = await authApiService
      .updateProfile({
        ...formValue,
        // accountType: userInfo?.accountType,
        extraInfo: myProfile?.extraInfo,
      })
      .finally(() => setProfileLoading(false));

    if (userResponse?.success) {
      notify('success', success('updateAPI'));
      const resuUser = await authApiService.getCurrentUser();
      if (resuUser?.data) {
        setUserInfo((resuUser as any)?.data);
      }
    } else {
      notify('error', error(userResponse.errorCode));
    }
  };

  const createQRCode = async () => {
    const currentUrl = window.location.origin;

    setDataQR(
      `${currentUrl}/rating-agent/${simpleNormalize(myProfile?.fullName)}-${myProfile?.id}`,
    );
    setIshowQR(!isShowQR);
  };

  const downloadQR = () => {
    const canvas = qrRef.current.querySelector('canvas');
    const url = canvas.toDataURL('image/png');

    const a = document.createElement('a');
    a.href = url;
    a.download = 'qrcode.png';
    a.click();
  };

  const updateCorporateProfile = async () => {
    const formValue = await corporateForm.validateFields();

    await setProfileLoading(true);
    const userResponse = await authApiService
      .updateCorporate({
        ...formValue,
      })
      .finally(() => setProfileLoading(false));

    if (userResponse?.success) {
      notify('success', success('updateAPI'));
      const resuUser = await authApiService.getCurrentUser();
      if (resuUser?.data) {
        setUserInfo((resuUser as any)?.data);
      }
    } else {
      notify('error', error(userResponse.errorCode));
    }
  };

  const showChangePass = () => {
    SetIsShowChangePass(!isShowChangePass);
  };

  const onRemoveConnect = async () => {
    await authApiService.removeSocial(typeActionSocial).then(() => getProfile());
    notify('success', success('RemoveConnet'));
    setVisible(false);
  };

  const connectGoogle = () => {
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
        try {
          await authApiService.linkSocial(body).then(() => getProfile());

          notify('success', success('LinkGoogle'));
        } catch (error) {
          notify('error', error.response?.data?.message);
        }
      })
      .catch((error) => {});
  };

  const connectApple = () => {
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
        try {
          await authApiService.linkSocial(body).then(() => getProfile());

          notify('success', success('LinkApple'));
        } catch (error) {
          notify('error', error.response?.data?.message);
        }
      })
      .catch((error) => {});
  };

  const onActionConnectGoogle = async (isActive: boolean) => {
    if (isActive === false) {
      //remove connect google

      // Open popup confirm remove
      setVisible(true);
      setTypeActionSocial(TypeSocial.Google);
    } else {
      //connect link google
      connectGoogle();
    }
  };

  const onActionConnectApple = async (isActive: boolean) => {
    if (isActive === false) {
      //remove connect google

      // Open popup confirm remove
      setVisible(true);
      setTypeActionSocial(TypeSocial.Apple);
    } else {
      //connect link google
      connectApple();
    }
  };

  const changTabSelect = (tabKey) => {
    setSelectedIndex(tabKey);
  };
  return (
    <>
      <AppPageMeta title={`${t('EcomTicketManagementInforPageBoardViewTicketId')}`} />

      <div className="p-6">
        <div className="mb-3 flex w-full justify-between">
          <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
            {t('EcomMyProfilePageDetailMyProfile')}
          </h1>
        </div>
        <Tabs className="" activeKey={selectedIndex} onTabClick={changTabSelect} type="card">
          <TabPane tab={t(tabKeys.tabProfile)} key={tabKeys.tabProfile}>
            <div className="grid grid-cols-9 gap-x-4">
              <div className="col-span-12 h-[440px] rounded-lg bg-white px-3 py-6 lg:col-span-3">
                <AvatarUpload
                  label={t('EcomMyProfilePageDetailUploadProfilePhoto')}
                  note={t('EcomMyProfilePageDetailUploadProfilePhotoNoteAvatar')}
                  baseImage={userAvatar}
                />
              </div>
              <div className="col-span-12 grid grid-cols-2 rounded-lg bg-white p-3 lg:col-span-7">
                <div className="col-span-2">
                  <Form form={profileForm} layout="vertical">
                    <div className="grid grid-cols-12 gap-x-2">
                      <div className="col-span-12 py-2">
                        <label className="text-base font-bold text-portal-primaryMainAdmin">
                          {t('EcomMyProfilePageDetailContactInformation')}
                        </label>
                      </div>
                      <div className="col-span-12 lg:col-span-6">
                        <FormFloatInput
                          name="firstName"
                          label={t('EcomMyProfilePageDetailFirstName')}
                          required
                          rules={[
                            {
                              required: true,
                              message: `${error('pleaseInput')} ${t(
                                'EcomMyProfilePageDetailFirstName',
                              )}`,
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

                      <div className="col-span-12 lg:col-span-6">
                        <FormFloatInput
                          name="lastName"
                          label={t('EcomMyProfilePageDetailLastName')}
                          required
                          rules={[
                            {
                              required: true,
                              message: `${error('pleaseInput')} ${t(
                                'EcomMyProfilePageDetailLastName',
                              )}`,
                            },
                            {
                              max: 100,
                              message: `${error('maxlength')} 100`,
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
                          ]}
                        />
                      </div>
                      <div className="col-span-12 lg:col-span-6">
                        <FormFloatInput
                          name="email"
                          label={t('EcomMyProfilePageDetailEmail')}
                          required
                          rules={[
                            {
                              required: true,
                              message: `${error('pleaseInput')} ${t('EcomMyProfilePageDetailEmail')}`,
                            },
                            { min: 6, message: `${error('minLength')} 6` },
                            { max: 256, message: `${error('maxlength')} 256` },
                            {
                              pattern: emailRegex,
                              message: `${error('formatEmailError')}`,
                            },
                          ]}
                        />
                      </div>
                      <div className="col-span-12 lg:col-span-6">
                        <FormFloatInput
                          disabled
                          name="phone"
                          label={t('EcomMyProfilePageDetailMobile')}
                          required
                          rules={[
                            { max: 15, message: `${error('maxlength')} 15` },
                            {
                              required: true,
                              message: `${error('pleaseInput')} ${t('EcomMyProfilePageDetailMobile')}`,
                            },
                            {
                              pattern: phoneRegex,
                              message: `${error('formatPhoneError')}`,
                            },
                          ]}
                        />
                      </div>
                      <div className="col-span-12 lg:col-span-6">
                        <FormFloatInput
                          disabled
                          name="referalCode"
                          label={t('EcomMyProfilePageDetailReferalCode')}
                        />
                      </div>
                      {myProfile?.accountType == UserAccountTypeConstant.Owner && (
                        <div className="col-span-12 lg:col-span-6">
                          <FormFloatInput
                            name="contactNumber"
                            label={t('EcomMyProfilePageDetailContactNumber')}
                            rules={[
                              { max: 15, message: `${error('maxlength')} 15` },
                              {
                                required: false,
                                message: `${error('pleaseInput')} ${t('EcomMyProfilePageDetailContactNumber')}`,
                              },
                              {
                                pattern: phoneRegex,
                                message: `${error('formatPhoneError')}`,
                              },
                            ]}
                          />
                        </div>
                      )}
                      <div className="col-span-12">
                        <FormFloatInputArea
                          row={1}
                          name="description"
                          label={t('EcomMyProfilePageDetailDescription')}
                          required
                          rules={[{ max: 5000, message: `${error('maxlength')} 5000` }]}
                        />
                      </div>
                      <div className="col-span-12">
                        <FormRadioAdmin
                          label={t('EcomPropertyListingIAm')}
                          name="accountType"
                          options={listAccountType.map((item) => ({
                            value: item.value,
                            name: comm(item.name),
                          }))}
                        />
                      </div>
                      <div className="col-span-6">
                        <FormFloatSelect
                          label={t('EcomPropertyListingMaritalStatus')}
                          name="userMaritalStatus"
                          options={listMaritalStatus.map((item) => ({
                            value: item.value,
                            label: comm(item.name),
                          }))}
                        />
                      </div>
                      <div className="col-span-6">
                        <FormFloatSelect
                          label={t('EcomPropertyListingEducationLevel')}
                          name="userEducationLvl"
                          options={listEducationLevel.map((item) => ({
                            value: item.value,
                            label: comm(item.name),
                          }))}
                        />
                      </div>
                      <div className="col-span-6">
                        <FormFloatSelect
                          label={t('EcomPropertyListingEmploymentStatus')}
                          name="userEmploymentStatus"
                          options={listEmploymentStatus.map((item) => ({
                            value: item.value,
                            label: comm(item.name),
                          }))}
                        />
                      </div>
                      <div className="col-span-6">
                        <FormFloatSelect
                          label={t('EcomPropertyListingOccupation')}
                          name="userOccupation"
                          options={listOccupation.map((item) => ({
                            value: item.value,
                            label: comm(item.name),
                          }))}
                        />
                      </div>
                      <div className="col-span-6">
                        <FormFloatSelect
                          label={t('EcomPropertyListingIncomeRange')}
                          name="userIncomeRank"
                          options={listIncomeRange.map((item) => ({
                            value: item.value,
                            label: comm(item.name),
                          }))}
                        />
                      </div>
                      <div className="col-span-6">
                        <FormFloatSelect
                          label={t('EcomPropertyListingLivingCost')}
                          name="userLivingCost"
                          options={listLivingCost.map((item) => ({
                            value: item.value,
                            label: comm(item.name),
                          }))}
                        />
                      </div>
                      <div className="col-span-6">
                        <FormFloatSelect
                          label={t('EcomPropertyListingReligion')}
                          name="userReligion"
                          options={listReligion.map((item) => ({
                            value: item.value,
                            label: comm(item.name),
                          }))}
                        />
                      </div>
                    </div>
                  </Form>
                </div>
                <div className="col-span-2 flex flex-col lg:flex-row lg:items-end">
                  <ButtonPrimary
                    isLoading={profileLoading}
                    className="mr-2 py-4 font-normal"
                    text={t('EcomMyProfilePageDetailUploadProfile')}
                    onClick={() => updateProfile()}
                  />
                  {myProfile?.accountType == UserAccountTypeConstant.Owner && (
                    <ButtonPrimary
                      isLoading={profileLoading}
                      className="mr-2 py-4 font-normal uppercase"
                      text={t('EcomMyProfilePageDetailGenQRRating')}
                      onClick={createQRCode}
                    />
                  )}

                  {myProfile?.type === UserTypeConstant.Salesman && (
                    <ButtonPrimary
                      isLoading={profileLoading}
                      className="py-4 font-normal"
                      text={t('EcomMyProfilePageDetailChangePass')}
                      onClick={showChangePass}
                    />
                  )}
                </div>
              </div>
              {myProfile?.type === UserTypeConstant.Customer && (
                <div className="col-span-10 mt-3 grid grid-cols-12 rounded-lg bg-white p-3">
                  <div className="col-span-12 py-2">
                    <label className="text-base font-bold text-portal-primaryMainAdmin">
                      {t('EcomMyProfilePageDetailLoginInformation')}
                    </label>
                  </div>
                  <div className="col-span-4 flex items-center">
                    {AppleIcon}
                    <span className="ml-1">{myProfile?.appleId}</span>
                    <Switch
                      className="ml-2"
                      value={myProfile?.isLinkApple}
                      onChange={onActionConnectApple}
                    />
                  </div>
                  <div className="col-span-4 flex items-center">
                    {GoogleIcon}
                    <span className="ml-1">{myProfile?.googleId}</span>
                    <Switch
                      className="ml-2"
                      value={myProfile?.isLinkGoogle}
                      onChange={onActionConnectGoogle}
                    />
                  </div>
                </div>
              )}
              <div className="col-span-10 mt-3 grid grid-cols-12 rounded-lg bg-white p-3">
                <div className="col-span-12 py-2">
                  <label className="text-base font-bold text-portal-primaryMainAdmin">
                    {t('EcomMyProfilePageDetailNotifyInformation')}
                  </label>
                </div>
                <div className="col-span-12">
                  <div className="col-span-4 flex items-center">
                    <Switch className="mr-2" />
                    <span>{t('EcomMyProfilePageDetailEmailMeAllActive')}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabPane>
          {myProfile?.type === UserTypeConstant.Customer && (
            <TabPane tab={t(tabKeys.tabCorporate)} key={tabKeys.tabCorporate}>
              <div className="col-span-12 grid grid-cols-2 rounded-lg bg-white p-3 lg:col-span-7">
                <div className="col-span-2">
                  <Form form={corporateForm} layout="vertical">
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-12 lg:col-span-6">
                        <FormFloatInput
                          name="corporateUserName"
                          label={t('EcomMyProfilePageDetailCorporateUserName')}
                          required
                        />
                      </div>

                      <div className="col-span-12 lg:col-span-6">
                        <FormFloatInput
                          name="corporateEmail"
                          label={t('EcomMyProfilePageDetailCorporateEmail')}
                          // required
                          // rules={[
                          //   {
                          //     required: true,
                          //     message: `${error('pleaseInput')} ${t('EcomMyProfilePageDetailEmail')}`,
                          //   },
                          //   { min: 6, message: `${error('minLength')} 6` },
                          //   { max: 256, message: `${error('maxlength')} 256` },
                          //   {
                          //     pattern: emailRegex,
                          //     message: `${error('formatEmailError')}`,
                          //   },
                          // ]}
                        />
                      </div>
                      <div className="col-span-12">
                        <FormFloatInput
                          name="corporateCompanyName"
                          label={t('EcomMyProfilePageDetaiCcorporateCompanyName')}
                          // required
                          // rules={[
                          //   {
                          //     required: true,
                          //     message: `${error('pleaseInput')} ${t('EcomMyProfilePageDetaiCcorporateCompanyName')}`,
                          //   },
                          //   { min: 3, message: `${error('minLength')} 6` },
                          //   { max: 256, message: `${error('maxlength')} 256` },
                          // ]}
                        />
                      </div>
                      <div className="col-span-12">
                        <FormFloatInput
                          name="corporateCode"
                          label={t('EcomMyProfilePageDetailCorporateCode')}
                          // required
                          // rules={[
                          //   {
                          //     required: true,
                          //     message: `${error('pleaseInput')} ${t('EcomMyProfilePageDetailCorporateCode')}`,
                          //   },
                          // ]}
                        />
                      </div>
                      <div className="col-span-12">
                        <FormFloatInput
                          name="corporateAddress"
                          label={t('EcomMyProfilePageDetailCorporateAddress')}
                          // required
                          // rules={[
                          //   {
                          //     required: true,
                          //     message: `${error('pleaseInput')} ${t('EcomMyProfilePageDetailCorporateAddress')}`,
                          //   },
                          // ]}
                        />
                      </div>
                    </div>
                  </Form>
                </div>
                <div className="col-span-2 flex items-end justify-end">
                  <ButtonPrimary
                    isLoading={profileLoading}
                    className="mr-2 py-4 font-normal"
                    text={t('EcomMyProfilePageDetailUploadProfile')}
                    onClick={() => updateCorporateProfile()}
                  />
                </div>
              </div>
            </TabPane>
          )}
          <TabPane tab={t(tabKeys.tabReport)} key={tabKeys.tabReport}>
            <DomDomReport
              tabActive={selectedIndex}
              tabKey={tabKeys.tabReport}
              myProfile={myProfile}
            />
          </TabPane>
        </Tabs>
      </div>

      <ModalConfirmRemove
        phoneShow={myProfile?.phone}
        visible={visible}
        handleOk={onRemoveConnect}
        handleCanncel={() => setVisible(false)}
      />

      <ModalChangePassword visible={isShowChangePass} handleCanncel={showChangePass} />

      <Modal open={isShowQR} footer={false} closable={false}>
        <div className="flex flex-col items-center justify-center p-2 text-center">
          <h2 style={{ marginBottom: '20px' }}>{comm('MODAL_CODE_QR')}</h2>
          <div ref={qrRef}>
            <QRCode size={300} value={dataQR || ''} />
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 p-2 text-center">
          <Button onClick={createQRCode}>{t('EcomForgotPasswordPageGoBack')}</Button>
          <Button size="middle" type="primary" onClick={downloadQR}>
            {comm('FORM_GEN_CODE_QR_DOWNLOAD')}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default MyProfile;
