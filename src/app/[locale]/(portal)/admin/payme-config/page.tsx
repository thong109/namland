'use client';
import paymeConfigService from '@/apiServices/externalApiServices/pamymeConfigService';
import ATMIcon from '@/assets/icon/atmIcon.svg';
import CreditCardIcon from '@/assets/icon/creditIcon.svg';
import PaymeIcon from '@/assets/icon/paymeIcon.svg';
import QRcode from '@/assets/icon/qrIcon.svg';
import AppPageMeta from '@/components/AppPageMeta';
import { buildEditableCell, EditableCell } from '@/components/TableEditRow/EditableCell';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import {
  align,
  appPermissions,
  listPaymentMethod,
  paymentMethodEnum,
  renderDateTime,
  roleAdminGod,
} from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import { checkPermissonAcion, formatNumber } from '@/libs/helper';
import useGlobalStore from '@/stores/useGlobalStore';
import { CheckCircleFilled, CloseCircleFilled, EditFilled } from '@ant-design/icons';
import { Button, Form, Table, Tabs } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { toast, TypeOptions } from 'react-toastify';

const { TabPane } = Tabs;

const tabKeys = {
  TAB_PAYME_CONFIG: 'TAB_PAYME_CONFIG',
  TAB_PAYME_CONFIG_LOGS: 'TAB_PAYME_CONFIG_LOGS',
};

const PaymeConfigPage: React.FC = () => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);
  const success = useTranslations('successNotifi');
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  const [formItem] = Form.useForm();

  const { userInfo } = useGlobalStore();
  const [listConfig, setListConfig] = useState([] as any);
  const [listAuditlog, setListAuditlog] = useState([] as any);
  const [uniqueId, setUniqueId] = useState<string>('');
  const [visibleAction, setVisibleAction] = useState<boolean>(false);
  const [previousDataRow, setPreviousDataRow] = useState<any>(undefined);

  const [tabActive, setTabActive] = useState(tabKeys.TAB_PAYME_CONFIG);

  useEffect(() => {
    getListConfig();
  }, []);

  const getListConfig = async () => {
    const list = await paymeConfigService.GetAll();

    setListConfig(list.data ?? undefined);
  };

  const getListAuditlog = async () => {
    const list = await paymeConfigService.GetAllAuditLog('CONFIGURATION_PAYME');

    setListAuditlog(list.data ?? undefined);
  };

  const isEditing = (record: any) => record.id === uniqueId;

  const renderStatusListing = (paymentEnum, isInternational) => {
    let paymentItem = listPaymentMethod.find((x) => x.name === paymentEnum);

    let icon;
    let text;
    switch (paymentEnum) {
      case paymentMethodEnum.ATMCARD: {
        icon = ATMIcon;
        text = paymentItem?.name;
        break;
      }
      case paymentMethodEnum.PAYME: {
        icon = PaymeIcon;
        text = paymentItem?.name;
        break;
      }
      case paymentMethodEnum.QRCode: {
        icon = QRcode;
        text = paymentItem?.name;
        break;
      }
      case paymentMethodEnum.CREDITCARD: {
        icon = CreditCardIcon;
        if (isInternational) {
          text = 'CREDITCARD_INTERNATIONAL';
        } else {
          text = 'CREDITCARD_VN';
        }
        break;
      }

      default: {
        break;
      }
    }

    return (
      <label className="flex items-center">
        <Image
          className="mr-2 object-contain"
          src={icon}
          alt="Payment method"
          width={20}
          height={20}
        />
        {comm(text)}
      </label>
    );
  };
  const columns: ColumnsType<any> = [
    {
      title: t('EcomTransactionPagePaymentMethod'),
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 180,
      render: (paymentMethod, item) => renderStatusListing(paymentMethod, item?.isInternational),
    },
    {
      title: t('paymeFeeTransaction'),
      dataIndex: 'feeTransactionPercent',
      key: 'feeTransactionPercent',
      width: 120,
      align: align.center,
      render: (name) => formatNumber(name),
      onCell: (record) =>
        buildEditableCell(
          record,
          'number',
          'feeTransactionPercent',
          'paymeFeeTransaction',
          isEditing,
          '',
          true,
        ),
    },

    {
      title: t('PaymeFixFee'),
      dataIndex: 'fixFee',
      key: 'fixFee',
      width: 110,
      align: align.center,
      render: (fixFee) => formatNumber(fixFee),
      onCell: (record) =>
        buildEditableCell(record, 'number', 'fixFee', 'PaymeFixFee', isEditing, '', true),
    },
    {
      title: comm('EditRowAction'),
      dataIndex: 'action',
      key: 'action',
      fixed: align.right,
      align: align.center,
      width: 40,
      render: (action, row) => {
        return uniqueId === row.id ? (
          <div className="d-flex justify-content-center w-100">
            <Button type="text" icon={<CheckCircleFilled />} onClick={() => saveRow(row.id)} />
            <Button
              type="text"
              icon={<CloseCircleFilled />}
              onClick={() => handleCancleRow(row.id)}
            />
          </div>
        ) : (
          <div className="d-flex justify-content-center w-100">
            {checkPermissonAcion(userInfo?.accesses, [
              roleAdminGod,
              appPermissions.paymeConfig.view,
            ]) ? (
              <Button
                size="small"
                shape="circle"
                className="mr-1"
                icon={<EditFilled />}
                onClick={() => {
                  formItem.setFieldsValue({
                    ...row,
                  });

                  setUniqueId(row?.id), setVisibleAction(true), setPreviousDataRow({ ...row });
                }}
              />
            ) : (
              <></>
            )}
          </div>
        );
      },
    },
  ];

  const columnAuditLog: ColumnsType<any> = [
    {
      title: t('EcomTransactionPageColumnName'),
      dataIndex: 'columnName',
      key: 'columnName',
      width: 180,
      render: (columnName) => <>{columnName}</>,
    },
    {
      title: t('EcomTransactionPageOldValue'),
      dataIndex: 'oldValue',
      key: 'oldValue',
      width: 180,
      render: (oldValue) => <>{oldValue}</>,
    },
    {
      title: t('EcomTransactionPageNewValue'),
      dataIndex: 'newValue',
      key: 'newValue',
      width: 180,
      render: (newValue) => <>{newValue}</>,
    },
    {
      title: t('EcomTransactionPageCreatedAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: renderDateTime,
    },
    {
      title: t('EcomTransactionPageUser'),
      dataIndex: 'user',
      key: 'user',
      width: 180,
      render: (user) => <>{user?.fullName}</>,
    },
  ];

  const saveRow = async (id: any) => {
    const values = await formItem.validateFields();

    const foundItem = listConfig.find((item) => item.id === uniqueId);
    if (id === undefined) {
      if (foundItem) {
        // Merge the found item with the object
        Object.assign(foundItem, values);
        const body = {
          ...Object.assign(foundItem, values),
        };
      }
    } else {
      values.id = id;

      if (foundItem) {
        // Merge the found item with the object
        Object.assign(foundItem, values);
        const body = {
          ...Object.assign(foundItem, values),
        };
        try {
          await paymeConfigService.update(body);
          notify('success', success('updateAPI'));
        } catch (e) {
          notify('error', e.response?.data?.message);
        }
      }
    }

    setVisibleAction(false);
    setUniqueId('');
    setPreviousDataRow(undefined);
  };

  const handleCancleRow = async (id) => {
    // check nếu k có data record trước khi edit đó thì xoá row luôn=> do khi tạo
    // mới thì chắc chắn không có data dòng trước đó
    if (previousDataRow === undefined) {
      const newStaff = listConfig.filter((item) => item.id !== id);

      setListConfig(newStaff);
    }
    setVisibleAction(false);
    setUniqueId('');
    setPreviousDataRow(undefined);
  };

  const changTabSelect = (tabKey) => {
    setTabActive(tabKey);
    if (tabKey === tabKeys.TAB_PAYME_CONFIG) {
      getListConfig();
    }
    if (tabKey === tabKeys.TAB_PAYME_CONFIG_LOGS) {
      getListAuditlog();
    }
  };

  return userInfo?.type === UserTypeConstant.Salesman &&
    checkPermissonAcion(userInfo?.accesses, [roleAdminGod, appPermissions.paymeConfig.view]) ? (
    <>
      <AppPageMeta title={t('EcomMemberPageListPaymeConfigManagement')} />
      <div className="w-full bg-transparent px-5">
        <div className="align-items-center mb-4 mt-7 flex justify-between">
          <div className="align-items-center mt-7 flex justify-between">
            <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
              {t('EcomMemberPageListPaymeConfigManagement')}
            </h1>
          </div>
        </div>
        <Tabs activeKey={tabActive} onTabClick={changTabSelect} type="card">
          <TabPane tab={t(tabKeys.TAB_PAYME_CONFIG)} key={tabKeys.TAB_PAYME_CONFIG}>
            <div className="w-full sm:rounded-lg">
              <Form form={formItem} layout={'vertical'} size="middle">
                <Table
                  pagination={false}
                  size="small"
                  components={{
                    body: {
                      cell: EditableCell,
                    },
                  }}
                  bordered
                  dataSource={listConfig}
                  columns={columns}
                  rowKey={(record) => record.id}
                  scroll={{ x: 900, scrollToFirstRowOnChange: true }}
                />
              </Form>
            </div>
          </TabPane>

          <TabPane tab={t(tabKeys.TAB_PAYME_CONFIG_LOGS)} key={tabKeys.TAB_PAYME_CONFIG_LOGS}>
            <div className="w-full sm:rounded-lg">
              <Table
                pagination={false}
                size="small"
                components={{
                  body: {
                    cell: EditableCell,
                  },
                }}
                bordered
                dataSource={listAuditlog}
                columns={columnAuditLog}
                rowKey={(record) => record.id}
                scroll={{ x: 900, scrollToFirstRowOnChange: true }}
              />
            </div>
          </TabPane>
        </Tabs>
      </div>
    </>
  ) : (
    <WaringPermission />
  );
};

export default PaymeConfigPage;
