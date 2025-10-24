'use client';
import memberApiService from '@/apiServices/externalApiServices/memberApiService';
import AppPageMeta from '@/components/AppPageMeta';
import ButtonBack from '@/components/Button/ButtonBack/ButtonBack';
import FormFloatDate from '@/components/FormInput/formDatePicker';
import FormFloatInput from '@/components/FormInput/formInput';
import FormFloatSelect from '@/components/FormInput/formSelect/Index';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import WrapPageScroll from '@/components/WrapPageScoll';
import {
  OwnershipTypeList,
  accountTypeFilterMember,
  appPermissions,
  roleAdminGod,
} from '@/libs/appconst';
import { checkPermissonAcion } from '@/libs/helper';
import useGlobalStore from '@/stores/useGlobalStore';
import { Tabs } from 'antd';
import Form from 'antd/es/form';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import { useEffect, useState } from 'react';

const { TabPane } = Tabs;
const tabKeys = {
  tabInfoMember: 'AMENITY_TAB_INFO_MEMBER',
  tabCorporate: 'TAB_INVOICE',
};

const ViewDetailMember = ({ params }: { params: { id: string } }) => {
  const { back } = useRouter();
  const t = useTranslations('webLabel');
  const eForm = useTranslations('error');
  const { userInfo } = useGlobalStore();
  const [profileForm] = Form.useForm();
  const [corporateForm] = Form.useForm();
  const [memberInfo, setMemberInfo] = useState<any>({} as any);
  const [paramContent, setParamContent] = useState<any>(undefined);
  const [selectedIndex, setSelectedIndex] = useState<string>(tabKeys.tabInfoMember);

  useEffect(() => {
    getParams();
  }, []);

  useEffect(() => {
    if (paramContent?.memberId) {
      getDetail();
    }
  }, [paramContent]);

  const getParams = () => {
    if (params.id) {
      const decodedString = decodeURIComponent(params.id);
      const urlParams = new URLSearchParams(decodedString);
      const paramsObject = {};
      for (const [key, value] of urlParams.entries()) {
        paramsObject[key] = value;
      }
      setParamContent(paramsObject);
    } else {
      setParamContent(undefined);
    }
  };

  const getDetail = async () => {
    if (paramContent?.memberId) {
      let member: any;
      const memberResponse = await memberApiService.getByid(paramContent?.memberId);
      member = memberResponse ?? null;
      setMemberInfo(member);
      profileForm.setFieldsValue({ ...member });
      corporateForm.setFieldsValue({
        ...member,
      });
    }
  };

  const changTabSelect = (tabKey) => {
    setSelectedIndex(tabKey);
  };

  const renderAction = () => {
    return (
      <div>
        <ButtonBack text={t('goBack')} onClick={() => back()} />
      </div>
    );
  };

  return checkPermissonAcion(userInfo?.accesses, [
    roleAdminGod,
    appPermissions.portal_member.update,
    appPermissions.portal_member.view,
    appPermissions.portal_member.admin,
  ]) ? (
    <>
      <AppPageMeta
        title={t('EcomMemberPageDetailName', {
          fullName: memberInfo?.fullName,
        })}
      />
      <WrapPageScroll renderActions={renderAction}>
        <div className="p-6">
          <div className="mb-3 flex w-full justify-between">
            <div className="mb-5 text-xl font-semibold">
              <h1>{t('EcomMemberManagementPageDetail')}</h1>
            </div>
          </div>
          <Tabs activeKey={selectedIndex} onTabClick={changTabSelect} type="card">
            <TabPane tab={t('EcomPropertyListingDetailPageStaffInfo')} key={tabKeys.tabInfoMember}>
              <Form form={profileForm} layout="vertical">
                <div className="mb-2 grid grid-cols-12 gap-x-4 rounded-lg bg-portal-card px-4 py-2">
                  <div className="col-span-12 py-1">
                    <label className="font-bold">{t('EcomMemberDetailPageDetailTabInfo')}</label>
                  </div>

                  <div className="col-span-6">
                    <FormFloatInput
                      disabled
                      rules={[{ max: 500, message: `${eForm('maxlength')} 500` }]}
                      name="firstName"
                      label={t('EcomMemberDetailPageDetailFirstNames')}
                    />
                  </div>

                  <div className="col-span-6">
                    <FormFloatInput
                      disabled
                      rules={[{ max: 500, message: `${eForm('maxlength')} 500` }]}
                      name="lastName"
                      label={t('EcomMemberDetailPageDetailLastName')}
                    />
                  </div>
                  <div className="col-span-6">
                    <FormFloatInput
                      disabled
                      rules={[{ max: 500, message: `${eForm('maxlength')} 500` }]}
                      name="email"
                      label={t('EcomContactListDetailPageDetailEmail')}
                    />
                  </div>
                  <div className="col-span-6">
                    <FormFloatInput
                      disabled
                      rules={[{ max: 500, message: `${eForm('maxlength')} 500` }]}
                      name="phone"
                      label={t('EcomContactListDetailPageDetailPhone')}
                    />
                  </div>
                  <div className="col-span-6">
                    <FormFloatSelect
                      disabled={true}
                      required
                      rules={[
                        {
                          required: true,
                          message: `${eForm('pleaseSelect')} ${t(
                            'EcomContactListDetailPageDetailSelectRole',
                          )}`,
                        },
                      ]}
                      label={t('EcomContactListDetailPageDetailSelectRole')}
                      name="accountType"
                      options={accountTypeFilterMember?.map((x) => ({
                        value: x.value,
                        label: t(x.label),
                      }))}
                    />
                  </div>
                  <div className="col-span-6">
                    <FormFloatSelect
                      disabled={true}
                      required
                      rules={[
                        {
                          required: true,
                          message: `${eForm('pleaseSelect')} ${t(
                            'EcomContactListDetailPageDetailTypeMember',
                          )}`,
                        },
                      ]}
                      label={t('EcomContactListDetailPageDetailTypeMember')}
                      name="ownershipType"
                      options={OwnershipTypeList?.map((x) => ({
                        value: x.value,
                        label: t(x.label),
                      }))}
                    />
                  </div>
                  <div className="col-span-6">
                    <FormFloatInput
                      disabled
                      rules={[{ max: 500, message: `${eForm('maxlength')} 500` }]}
                      name={['extraInfo', 'address']}
                      label={t('EcomContactListDetailPageDetailAddress')}
                    />
                  </div>
                  <div className="col-span-6">
                    <FormFloatInput
                      disabled
                      rules={[{ max: 500, message: `${eForm('maxlength')} 500` }]}
                      name={['extraInfo', 'taxCode']}
                      label={t('EcomContactListDetailPageDetailTaxCode')}
                    />
                  </div>
                  <div className="col-span-6">
                    <FormFloatDate
                      required
                      disabled={true}
                      rules={[
                        {
                          required: true,
                          message: `${eForm('pleaseSelect')} ${t(
                            'EcomPropertyListingDetailPagePriceExpectedPublishingDate',
                          )}`,
                        },
                      ]}
                      name={['extraInfo', 'taxCodeDateOfIssue']}
                      label={t('EcomContactListDetailPageDetailCodeTaxDate')}
                    />
                  </div>
                  <div className="col-span-6">
                    <FormFloatInput
                      disabled
                      rules={[{ max: 500, message: `${eForm('maxlength')} 500` }]}
                      name={['extraInfo', 'taxCodePlaceOfIssue']}
                      label={t('EcomContactListDetailPageDetailIssuanceOfTaxCode')}
                    />
                  </div>
                </div>
              </Form>
            </TabPane>
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
                          disabled
                        />
                      </div>

                      <div className="col-span-12 lg:col-span-6">
                        <FormFloatInput
                          name="corporateEmail"
                          label={t('EcomMyProfilePageDetailCorporateEmail')}
                          required
                          disabled
                        />
                      </div>
                      <div className="col-span-12">
                        <FormFloatInput
                          name="corporateCompanyName"
                          label={t('EcomMyProfilePageDetaiCcorporateCompanyName')}
                          required
                          disabled
                        />
                      </div>
                      <div className="col-span-12">
                        <FormFloatInput
                          name="corporateCode"
                          label={t('EcomMyProfilePageDetailCorporateCode')}
                          required
                          disabled
                        />
                      </div>
                      <div className="col-span-12">
                        <FormFloatInput
                          name="corporateAddress"
                          label={t('EcomMyProfilePageDetailCorporateAddress')}
                          required
                          disabled
                        />
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </WrapPageScroll>
    </>
  ) : (
    <WaringPermission />
  );
};

export default ViewDetailMember;
