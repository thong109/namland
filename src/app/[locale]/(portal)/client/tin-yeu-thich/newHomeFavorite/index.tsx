'use client';
import favoriteApiService from '@/apiServices/externalApiServices/favoriteApiService';
import AppSearchFilter from '@/components/AppFormFilter/AppSearchFilter/AppSearchFilter';
import DataTableAdvanced from '@/components/DataTableAdvanced';
import { isLikeIcon } from '@/libs/appComponents';
import { align } from '@/libs/appconst';
import { blockKeyEnter, renderStatusActive } from '@/libs/helper';
import { getNewHomeDetailUrl } from '@/utils/urlUtil';
import { Table } from 'antd';
import Form from 'antd/es/form';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import React, { useEffect, useState } from 'react';
import { TypeOptions, toast } from 'react-toastify';

type IProps = {
  activeKey: string;
  tabKey: string;
};

const NewHomeFavorite = (props: IProps) => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);
  const success = useTranslations('successNotifi');

  const t = useTranslations('webLabel');

  const { push } = useRouter();
  const [formFilter] = Form.useForm();
  const [favorites, setFavorites] = useState<any>();
  const [filter, setFilter] = useState<any>({
    from: 0,
    size: 10,
  });

  useEffect(() => {
    if (props.activeKey === props.tabKey) {
      getListFavorite();
    }
  }, [props.activeKey, props.tabKey]);

  const getListFavorite = async () => {
    const favoriteResponse = await favoriteApiService.getListFarvoriteNewHome(filter);

    setFavorites(favoriteResponse ?? undefined);
  };

  const handleChangePage = (pagination: any) => {
    const valuesFilter = {
      from: (pagination.current - 1) * pagination.pageSize,
      size: pagination.pageSize,
    };
    setFilter({ ...valuesFilter });
  };

  const gotoDetail = (id, title) => {
    const projectDetailUrl = getNewHomeDetailUrl(id, title);
    push(projectDetailUrl);
  };

  const unFavorite = async (id) => {
    await favoriteApiService.unFavoriteNewHome({
      newHomeId: id,
      isFavorite: false,
    });
    notify('success', success('updateAPI'));
    getListFavorite();
  };

  const columns = [
    {
      title: t('EcomProjectManagementPageNewHomeTitle'),
      dataIndex: 'title',
      key: 'title',
      width: 150,
      render: (title, item) => (
        <a className="line-clamp-3 text-xs" onClick={() => gotoDetail(item?.id, item?.title)}>
          {title}
        </a>
      ),
    },
    {
      title: t('EcomProjectManagementPageNewHomeInvestor'),
      dataIndex: 'investor',
      key: 'investor',
      width: 130,
      align: align.center,
      ellipsis: true,
      render: (investor) => {
        return <div className="text-xs">{investor ?? '--'}</div>;
      },
    },
    {
      title: t('EcomProjectManagementPageNewHomeTotalPrice'),
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 130,
      align: align.center,
      ellipsis: true,
      render: (totalPrice) => {
        return <div className="text-xs">{totalPrice ?? '--'}</div>;
      },
    },

    {
      title: t('EcomTicketManagementInforPageSearchBarStatus'),
      dataIndex: 'isActive',
      key: 'isActive',
      width: 140,
      align: align.center,
      render: (isActive) => renderStatusActive(isActive, t('Active'), t('InActive')),
    },
    {
      title: t('EcomMemberPageListViewStaffAction'),
      dataIndex: 'id',
      key: 'id',
      width: '10%',
      align: align.center,
      render: (id) => (
        <div className="flex w-full items-center justify-center">
          <button onClick={() => unFavorite(id)}>{isLikeIcon}</button>
        </div>
      ),
    },
  ];

  const renderFilter = () => {
    return (
      <div className="grid grid-cols-12">
        <div className="col-span-10">
          <Form
            form={formFilter}
            layout="horizontal"
            size="middle"
            onKeyDown={(e) => (blockKeyEnter(e) ? e.preventDefault() : undefined)}
          >
            <div className="w-full lg:flex lg:justify-between">
              <div className="grid w-full grid-cols-12 gap-x-2 lg:w-[95%]">
                <div className="col-span-12 lg:col-span-4">
                  <AppSearchFilter
                    name="keyword"
                    label={t('EcomNewHomesPageSearchBarSearch')}
                    placeholder={t('EcomNewHomesPageSearchBarSearch')}
                  />
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    );
  };

  return (
    <div className="h-fit w-full bg-transparent px-5">
      <div>{renderFilter()}</div>

      <div className="w-full sm:rounded-lg">
        <DataTableAdvanced
          showChangePageSize
          pagination={{
            pageSize: filter?.size,
            current: filter?.from / filter.size + 1,
            total: favorites?.total ?? 0,
            onChange: handleChangePage,
          }}
        >
          <Table
            size={'middle'}
            pagination={false}
            columns={columns}
            className="overflow-x-auto"
            dataSource={favorites?.data}
            scroll={{ y: '65vh', scrollToFirstRowOnChange: true }}
          />
        </DataTableAdvanced>
      </div>
    </div>
  );
};

export default NewHomeFavorite;
