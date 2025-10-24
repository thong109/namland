'use client';
import paymeConfigService from '@/apiServices/externalApiServices/pamymeConfigService';
import SystemConfigFeeService from '@/apiServices/externalApiServices/systemConfigFeeServices';
import AppPageMeta from '@/components/AppPageMeta';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import { buildEditableCell, EditableCell } from '@/components/TableEditRow/EditableCell';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import { align, appPermissions, renderDateTime, roleAdminGod } from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import { checkPermissonAcion, formatNumber } from '@/libs/helper';

import useGlobalStore from '@/stores/useGlobalStore';
import {
  CheckCircleFilled,
  CloseCircleFilled,
  DeleteOutlined,
  EditFilled,
} from '@ant-design/icons';
import { Button, Form, Modal, Table, Tabs } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { toast, TypeOptions } from 'react-toastify';
import { v4 as uuid } from 'uuid';

const { TabPane } = Tabs;

const tabKeys = {
  TAB_PAYME_CONFIG: 'EcomMemberPageListSystemConfigManagement',
  TAB_PAYME_CONFIG_LOGS: 'TAB_PAYME_CONFIG_LOGS',
};

const SystemConfigPage: React.FC = () => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);
  const success = useTranslations('successNotifi');
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  const [formItem] = Form.useForm();

  const { userInfo } = useGlobalStore();
  const [listConfig, setListConfig] = useState([] as any);
  const [uniqueId, setUniqueId] = useState<string>('');
  const [visibleAction, setVisibleAction] = useState<boolean>(false);
  const [previousDataRow, setPreviousDataRow] = useState<any>(undefined);
  const [tabActive, setTabActive] = useState(tabKeys.TAB_PAYME_CONFIG);
  const [listAuditlog, setListAuditlog] = useState([] as any);

  const getListAuditlog = async () => {
    const list = await paymeConfigService.GetAllAuditLog('CONFIGURATION_FEE');

    setListAuditlog(list.data ?? undefined);
  };

  useEffect(() => {
    getListConfig();
  }, []);

  const getListConfig = async () => {
    const list = await SystemConfigFeeService.GetAll();

    setListConfig(list.data ?? undefined);
  };

  const isEditing = (record: any) => record.id === uniqueId;

  const changTabSelect = (tabKey) => {
    setTabActive(tabKey);
    if (tabKey === tabKeys.TAB_PAYME_CONFIG) {
      getListConfig();
    }
    if (tabKey === tabKeys.TAB_PAYME_CONFIG_LOGS) {
      getListAuditlog();
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: t('EcomConfigFeeName'),
      dataIndex: 'name',
      key: 'name',
      width: 180,
      render: (name) => name,
      onCell: (record) =>
        buildEditableCell(record, 'text', 'name', 'EcomConfigFeeName', isEditing, '', true),
    },
    {
      title: t('EcomConfigFeeNameVATAmount'),
      dataIndex: 'vatAmount',
      key: 'vatAmount',
      width: 100,
      align: align.center,
      render: (vatAmount) => formatNumber(vatAmount),
      onCell: (record) =>
        buildEditableCell(
          record,
          'number',
          'vatAmount',
          'EcomConfigFeeNameVATAmount',
          isEditing,
          '',
          true,
        ),
    },
    {
      title: t('EcomConfigFeeNameIsDefault'),
      dataIndex: 'isDefault',
      key: 'isDefault',
      width: 100,
      align: align.center,
      render: (isDefault) => (isDefault ? t('YES') : t('NO')),
    },
    {
      title: t('EcomConfigFeeFromDate'),
      dataIndex: 'fromDate',
      key: 'fromDate',
      width: 100,
      align: align.center,
      render: (fromDate) => renderDateTime(fromDate),
      onCell: (record) =>
        buildEditableCell(
          record,
          'datetime',
          'fromDate',
          'EcomConfigFeeFromDate',
          isEditing,
          '',
          true,
        ),
    },
    {
      title: t('EcomConfigFeeToDate'),
      dataIndex: 'toDate',
      key: 'toDate',
      width: 100,
      align: align.center,
      render: (toDate) => renderDateTime(toDate),
      onCell: (record) =>
        buildEditableCell(record, 'datetime', 'toDate', 'EcomConfigFeeToDate', isEditing, '', true),
    },
    {
      title: comm('EditRowAction'),
      dataIndex: 'action',
      key: 'action',
      fixed: align.right,
      align: align.center,
      width: 70,
      render: (action, row) => {
        return uniqueId === row.id ? (
          <div className="d-flex justify-content-center w-100">
            <Button type="text" icon={<CheckCircleFilled />} onClick={() => saveRow(row)} />
            <Button
              type="text"
              icon={<CloseCircleFilled />}
              onClick={() => handleCancleRow(row.id)}
            />
          </div>
        ) : (
          <div className="d-flex justify-content-center w-100">
            {!visibleAction && (
              <>
                {checkPermissonAcion(userInfo?.accesses, [
                  roleAdminGod,
                  appPermissions.systemFeeConfig.update,
                ]) && (
                  <Button
                    size="small"
                    shape="circle"
                    className="mr-1"
                    icon={<EditFilled />}
                    onClick={() => {
                      formItem.setFieldsValue({
                        ...row,
                        fromDate: row.fromDate ? dayjs(row.fromDate) : null,
                        toDate: row.toDate ? dayjs(row.toDate) : null,
                      });

                      setUniqueId(row?.id), setVisibleAction(true), setPreviousDataRow({ ...row });
                    }}
                  />
                )}

                {checkPermissonAcion(userInfo?.accesses, [
                  roleAdminGod,
                  appPermissions.systemFeeConfig.delete,
                ]) &&
                  !row?.isDefault && (
                    <Button
                      size="small"
                      shape="circle"
                      className="mr-1"
                      icon={<DeleteOutlined />}
                      onClick={() => onDeleteRow(row?.id)}
                    />
                  )}
              </>
            )}
          </div>
        );
      },
    },
  ];

  const saveRow = async (row: any) => {
    const values = await formItem.validateFields();

    const foundItem = listConfig.find((item) => item.id === uniqueId);
    if (row.key) {
      if (foundItem) {
        // Merge the found item with the object
        Object.assign(foundItem, values);
        const body = {
          ...Object.assign(foundItem, values),
        };
        delete body.id;

        try {
          await SystemConfigFeeService.create(body);
          notify('success', success('updateAPI'));
        } catch (e) {
          notify('error', e.response?.data?.message);
          getListConfig();
        }
      }
    } else {
      values.id = row.id;

      if (foundItem) {
        // Merge the found item with the object
        Object.assign(foundItem, values);
        const body = {
          ...Object.assign(foundItem, values),
        };
        try {
          await SystemConfigFeeService.update(body);
          notify('success', success('updateAPI'));
        } catch (e) {
          notify('error', e.response?.data?.message);
          getListConfig();
        }
      }
    }

    setVisibleAction(false);
    setUniqueId('');
    setPreviousDataRow(undefined);
  };

  const handleAddRow = () => {
    setVisibleAction(true);
    formItem.resetFields();
    const newRow = { id: uuid(), key: 'new' };

    const newData = [...listConfig];

    newData.unshift(newRow);
    setListConfig(newData);
    setUniqueId(newRow?.id);
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

  const onDeleteRow = (id) => {
    setVisibleAction(true);
    Modal.confirm({
      content: t('EcomMemberConfigVATDeleteContent'),
      title: t('EcomMemberConfigVATDeleteTitle'),
      okText: t('YES'),
      cancelText: t('NO'),
      centered: true,
      okType: 'default',
      async onOk() {
        await SystemConfigFeeService.deleteConfig(id);
        getListConfig();
        notify('success', success('deleteAPI'));
        setVisibleAction(false);
      },
      onCancel() {
        setVisibleAction(false);
      },
    });
  };

  const renderFilter = () => {
    return (
      <div className="mb-2 grid grid-cols-12">
        <div className="col-span-10"></div>
        <div className="col-span-2 flex justify-end">
          {checkPermissonAcion(userInfo?.accesses, [
            roleAdminGod,
            appPermissions.systemFeeConfig.update,
          ]) && (
            <ButtonPrimary disabled={visibleAction} text={comm('AddNew')} onClick={handleAddRow} />
          )}
        </div>
      </div>
    );
  };

  return userInfo?.type === UserTypeConstant.Salesman &&
    checkPermissonAcion(userInfo?.accesses, [roleAdminGod, appPermissions.paymeConfig.view]) ? (
    <>
      <AppPageMeta title={t('EcomMemberPageListSystemConfigManagement')} />
      <div className="w-full bg-transparent px-5">
        <div className="align-items-center mb-4 mt-7 flex justify-between">
          <div className="align-items-center mt-7 flex justify-between">
            <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
              {t('EcomMemberPageListSystemConfigManagement')}
            </h1>
          </div>
        </div>
        <Tabs activeKey={tabActive} onTabClick={changTabSelect} type="card">
          <TabPane tab={t(tabKeys.TAB_PAYME_CONFIG)} key={tabKeys.TAB_PAYME_CONFIG}>
            <div>{renderFilter()}</div>
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

export default SystemConfigPage;
