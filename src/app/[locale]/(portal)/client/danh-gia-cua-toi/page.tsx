'use client';
import ratingApiService from '@/apiServices/externalApiServices/apiRatingService';
import AppSearchFilter from '@/components/AppFormFilter/AppSearchFilter/AppSearchFilter';
import AppSelectFilter from '@/components/AppFormFilter/AppSelectFilter/AppSelectFilter';
import AppPageMeta from '@/components/AppPageMeta';
import DataTableAdvanced from '@/components/DataTableAdvanced';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import { align, listStatusRating } from '@/libs/appconst';
import UserTypeConstant from '@/libs/constants/userTypeConstant';
import { blockKeyEnter, convertFilterDate, convertPhoneNumber84To0 } from '@/libs/helper';
import useGlobalStore from '@/stores/useGlobalStore';
import { Form, Table } from 'antd';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

const RatingMe: React.FC = () => {
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  const [formFilterProject] = Form.useForm();
  const { userInfo } = useGlobalStore();
  const [listRating, setListRating] = useState([] as any);
  const [filter, setFilter] = useState<any>({
    from: 0,
    size: 10,
  });

  useEffect(() => {
    getAllRatingAgent(filter);
  }, []);

  const getAllRatingAgent = async (dataFilter) => {
    const responseData: any = await ratingApiService.getAllRatingAgent(dataFilter);
    setListRating(responseData);
  };

  const handleSearch = async (name, value) => {
    if (name === 'publishedDate') {
      setFilter(convertFilterDate(filter, value));
      getAllRatingAgent(convertFilterDate(filter, value, 'fromDate', 'toDate'));
    } else if (name === 'expiredDate') {
      setFilter(convertFilterDate(filter, value));
      getAllRatingAgent(convertFilterDate(filter, value, 'fromExpiredDate', 'toExpiredDate'));
    } else {
      const newFilter = { ...filter };

      newFilter[name] = value;
      setFilter(newFilter);
      getAllRatingAgent(newFilter);
    }
  };

  const handleTableChange = (pagination: any) => {
    const newFilter = {
      ...filter,
      size: pagination?.pageSize,
      from: (pagination.current - 1) * pagination.pageSize,
    };

    getAllRatingAgent(newFilter);
    setFilter(newFilter);
  };
  const renderFilter = () => {
    return (
      <div className="grid grid-cols-12">
        <div className="col-span-12">
          <Form
            form={formFilterProject}
            layout="horizontal"
            size="middle"
            onKeyDown={(e) => (blockKeyEnter(e) ? e.preventDefault() : undefined)}
          >
            <div className="w-full lg:flex lg:justify-between">
              <div className="grid w-full grid-cols-12 gap-x-2">
                <div className="col-span-12 lg:col-span-6">
                  <AppSearchFilter
                    name="keyword"
                    label={t('EcomRatingUser')}
                    placeholder={t('EcomRatingUser')}
                    onChange={debounce(
                      (value) => handleSearch('keyword', value?.target?.value),
                      300,
                    )}
                  />
                </div>

                {/* <div className="col-span-12 lg:col-span-6">
                  <Form.Item name="publishedDate">
                    <RangeDateFilter
                      placeholders={
                        [t('fromPublishedDate'), t('toPublishedDate')] as [string, string]
                      }
                      label={t('EcomTransactiongPageSearchBarDate')}
                      onChange={(dates) => handleSearch('publishedDate', dates)}
                      className="flex w-[100%] items-end"
                    />
                  </Form.Item>
                </div> */}

                <div className="col-span-12 lg:col-span-3">
                  <AppSelectFilter
                    name="isShow"
                    label={t('EcomRatingStatus')}
                    options={listStatusRating.map((x) => ({
                      value: x.id,
                      label: comm(x.name),
                      id: x.id,
                    }))}
                    onChange={(value) => handleSearch('isShow', value)}
                    placeholder={t('EcomRatingStatus')}
                  />
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    );
  };

  const columnTopup = [
    {
      title: t('EcomRatingUser'),
      dataIndex: 'userCreated',
      key: 'userCreated',
      width: 145,

      render: (userCreated) => {
        return (
          <div className="text-xs">
            {userCreated?.fullName}
            <br />
            {userCreated?.email}
            <br />
            {convertPhoneNumber84To0(userCreated?.phone)}
          </div>
        );
      },
    },
    {
      title: t('EcomRatingStart'),
      dataIndex: 'id',
      key: 'id',
      width: 160,
      render: (id, row) => (
        <div className="text-xs">
          <div>
            {t('professionalism')}: {row?.professionalism}
          </div>
          <div>
            {t('agentServiceExperienceRating')}: {row?.agentServiceExperienceRating}
          </div>
          <div>
            {t('responseSpeed')}: {row?.responseSpeed}
          </div>
          <div>
            {t('listingAccuracyComparedToVisit')}: {row?.listingAccuracyComparedToVisit}
          </div>
          <div>
            {t('serviceAttitude')}: {row?.serviceAttitude}
          </div>
          <div>
            {t('serviceValueRating')}: {row?.serviceValueRating}
          </div>
        </div>
      ),
    },
    {
      title: t('EcomRatingNote'),
      dataIndex: 'note',
      key: 'note',
      width: 170,

      render: (note) => {
        return <div className="line-clamp-6 text-xs">{note}</div>;
      },
    },

    {
      title: t('EcomRatingStatus'),
      dataIndex: 'isShow',
      key: 'isShow',
      width: 110,
      align: align.center,
      render: (isShow) => <span>{isShow ? t('show') : t('unShow')}</span>,
    },
  ];

  return userInfo?.type === UserTypeConstant.Customer ? (
    <>
      <AppPageMeta title={t('EcomLeftMenuBarRatingMe')} />

      <div className="h-fit w-full bg-transparent px-5">
        <div className="align-items-center mb-4 mt-7 flex justify-between">
          <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
            {t('EcomLeftMenuBarRatingMe')}
          </h1>
        </div>

        <div>{renderFilter()}</div>

        <div className="w-full sm:rounded-lg">
          <DataTableAdvanced
            showChangePageSize
            pagination={{
              pageSize: filter?.size,
              current: filter?.from / filter.size + 1,
              total: listRating?.total ?? 0,
              onChange: handleTableChange,
            }}
          >
            <Table
              size={'middle'}
              pagination={false}
              columns={columnTopup}
              className="overflow-x-auto"
              dataSource={listRating?.data}
              scroll={{ x: 900, y: '65vh', scrollToFirstRowOnChange: true }}
            />
          </DataTableAdvanced>
        </div>
      </div>
    </>
  ) : (
    <WaringPermission />
  );
};

export default RatingMe;
