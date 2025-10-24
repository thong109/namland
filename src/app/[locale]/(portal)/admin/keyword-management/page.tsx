'use client';
import apikeywordBlackListService from '@/apiServices/externalApiServices/keywordBlackListServices';
import AppPageMeta from '@/components/AppPageMeta';
import ButtonBack from '@/components/Button/ButtonBack/ButtonBack';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import FormFloatInput from '@/components/FormInput/formInput';
import ModalConfirm from '@/components/ModalConfirm/ModalConfirm';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import { appPermissions, filterObjDuplicateInArray, roleAdminGod } from '@/libs/appconst';
import { checkPermissonAcion } from '@/libs/helper';
import { keywordBlackListModel } from '@/models/keywordBlackListModel/keywordBlackListModel';
import useGlobalStore from '@/stores/useGlobalStore';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Form, Tag } from 'antd';
import { useTranslations } from 'next-intl';
import React, { FC, useEffect, useState } from 'react';
import { TypeOptions, toast } from 'react-toastify';

const MyPropoperties: FC = () => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);

  const { userInfo } = useGlobalStore();
  const success = useTranslations('successNotifi');
  const errorNotifi = useTranslations('errorNotifi');
  const eForm = useTranslations('error');
  const t = useTranslations('webLabel');
  const [keywordForm] = Form.useForm();

  const [listKeyword, setListKeyWord] = useState<keywordBlackListModel[]>([]);
  const [isLoading, setIsLoanding] = useState<boolean>(false);
  const [isShowModalConfirm, setIsShowModalConfirm] = useState<boolean>(false);

  useEffect(() => {
    getListKeywordBlackList();
  }, []);

  const getListKeywordBlackList = async () => {
    if (
      checkPermissonAcion(userInfo?.accesses, [
        roleAdminGod,
        appPermissions.portal_keyword.view,
        appPermissions.portal_keyword.admin,
      ])
    ) {
      const data = await apikeywordBlackListService.getAllKeywordBlacklist();
      setListKeyWord(data || []);
    }
  };

  const checkKeyEnter = async (e) => {
    if (e.code === 'Enter') {
      const key = keywordForm.getFieldValue('keyword');
      if (key) {
        try {
          setIsLoanding(true);
          const objKeyword = await apikeywordBlackListService.createOrUpdateKeyBlack(key);
          const newListKey = filterObjDuplicateInArray(objKeyword, listKeyword);
          setListKeyWord(newListKey);
          keywordForm.resetFields();

          setIsLoanding(false);
        } catch {
          setIsLoanding(false);
          notify('error', errorNotifi('createAPI'));
        }
      }
    }
  };

  const onSave = async () => {
    const key = keywordForm.getFieldValue('keyword');
    if (key) {
      try {
        setIsLoanding(true);
        const objKeyword = await apikeywordBlackListService.createOrUpdateKeyBlack(key);
        const newListKey = filterObjDuplicateInArray(objKeyword, listKeyword);
        setListKeyWord(newListKey);
        keywordForm.resetFields();
        setIsLoanding(false);
      } catch {
        setIsLoanding(false);
        notify('error', errorNotifi('createAPI'));
      }
    }
  };

  const onRemoveFormList = async (id: string) => {
    try {
      setIsLoanding(true);
      await apikeywordBlackListService.deleteById(id);
      notify('success', success('deleteAPI'));
      const newListKeyword = listKeyword.filter((item) => item.id !== id);
      setListKeyWord(newListKeyword);
      setIsLoanding(false);
    } catch {
      setIsLoanding(false);
      notify('error', errorNotifi('deleteAPI'));
    }
  };

  const onShowConfirm = () => {
    setIsShowModalConfirm(!isShowModalConfirm);
  };

  const onDeleteAll = async () => {
    try {
      setIsLoanding(true);
      await apikeywordBlackListService.deleteAllKeyword();
      notify('success', success('deleteAPI'));
      setListKeyWord([]);
      setIsLoanding(false);
      setIsShowModalConfirm(false);
    } catch {
      notify('error', errorNotifi('deleteAPI'));
      setIsLoanding(false);
      setIsShowModalConfirm(false);
    }
  };

  return checkPermissonAcion(userInfo?.accesses, [
    roleAdminGod,
    appPermissions.portal_keyword.view,
    appPermissions.portal_keyword.admin,
  ]) ? (
    <>
      <AppPageMeta title={t('EcomKeywordsManagementKeywordsManagement')} />
      <div className="h-fit w-full bg-transparent px-5">
        <div className="align-items-center mb-4 mt-7 flex justify-between">
          <div className="align-items-center mt-7 flex justify-between">
            <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
              {t('EcomKeywordsManagementKeywordsManagement')}
            </h1>
          </div>
        </div>

        <div className="min-h-[250px] w-full bg-white p-3 sm:rounded-lg">
          <Form form={keywordForm} layout="vertical" onKeyDown={(e) => checkKeyEnter(e)}>
            <div className="lg:grid lg:grid-cols-12">
              <div className="col-span-12 py-2">
                <label className="text-base font-bold text-portal-primaryMainAdmin">
                  {t('EcomKeywordsManagementKeywordsManagementListProhibitedkeywords')}
                </label>
              </div>
              <div className="col-span-12">
                <FormFloatInput
                  name="keyword"
                  label={t('EcomPropertyListingPageKeywordInput')}
                  rules={[{ max: 250, message: `${eForm('maxlength')} 250` }]}
                />
              </div>
            </div>
          </Form>
          <div className="flex w-full flex-wrap gap-y-2">
            {listKeyword.map((item, index) => (
              <Tag
                closeIcon={<CloseCircleOutlined />}
                onClose={() => onRemoveFormList(item?.id)}
                key={index}
                className="h-[27px] w-fit items-center justify-between rounded-xl bg-portal-gray-2 px-2 text-black"
              >
                <span className="truncate text-sm">{item?.value}</span>
              </Tag>
            ))}
          </div>
          <div className="mt-6 w-full justify-end sm:grid sm:grid-cols-12 lg:mt-4 lg:flex">
            <ButtonBack
              isLoading={isLoading}
              text={t('EcomKeywordsManagementDeleteAll')}
              onClick={onShowConfirm}
            />
            <ButtonPrimary
              className="ml-1 rounded-full px-6"
              text={t('save')}
              isLoading={isLoading}
              onClick={onSave}
            />
          </div>
        </div>
      </div>

      <ModalConfirm
        visible={isShowModalConfirm}
        handleCanncel={() => setIsShowModalConfirm(false)}
        title={t('EcomKeywordsManagementDeleteAllTitle')}
        content={t('EcomKeywordsManagementDeleteAllContent')}
        handleOk={onDeleteAll}
      />
    </>
  ) : (
    <WaringPermission />
  );
};

export default MyPropoperties;
