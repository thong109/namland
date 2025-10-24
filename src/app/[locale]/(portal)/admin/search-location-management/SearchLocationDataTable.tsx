'use client';
import FormButton from '@/components/Button/FormButton';
import DataTable from '@/components/DataTable';
import SelectFilter from '@/components/FilterComponents/SelectCompoment/SelectFilter';
import { align, listMaterialPlace } from '@/libs/appconst';
import PageResultModel from '@/models/reponseModel/pageResultModel';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Form, Modal, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

import apiMasterDataService from '@/apiServices/externalApiServices/apiMasterDataService';
import SearchLocationApiService from '@/apiServices/externalApiServices/searchLocationApiService';
import useProvince from '@/hooks/useProvince';
import { clearFilterIcon } from '@/libs/appComponents';
import { blockKeyEnter, rhythmSlowForCallApi } from '@/libs/helper';
import { SearchLocationListModel } from '@/models/propertyModel/searchLoticationModal';
import { useRouter } from 'next-intl/client';
import './style.scss';

export interface IPropertyDataTableProps {}

const SearchLocationDataTable: React.FunctionComponent<IPropertyDataTableProps> = ({}) => {
  const comm = useTranslations('Common');
  const { listProvince } = useProvince();
  const t = useTranslations('webLabel');
  const { push } = useRouter();

  const [filter, setFilter] = useState<any>({
    from: 0,
    size: 5,
    district: undefined,
    province: undefined,
    type: undefined,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pageResult, setPageResult] = useState<PageResultModel<any>>();
  const [materialPlaceList, setMaterialPlaceList] = useState<any[]>([]);
  const [formFilter] = Form.useForm();
  const [districts, setDistricts] = useState<any[]>([]);

  const initDataFilter = async () => {
    setMaterialPlaceList([{ id: 'all', name: 'All' }, ...listMaterialPlace]);
  };

  const getListData = async () => {
    let responseData: any;
    setIsLoading(true);
    const response = await SearchLocationApiService.getList(filter);

    responseData = response ?? undefined;
    setPageResult(responseData);
    setIsLoading(false);
  };

  const resetFilter = async () => {
    formFilter.resetFields();
    let responseData: any;
    setIsLoading(true);
    const newFilter = {
      from: filter.from,
      size: filter.size,
      position: undefined,
      createdAt: undefined,
      createdBy: undefined,
    };
    setFilter(newFilter);
    const response = await SearchLocationApiService.getList({
      from: filter.from,
      size: filter.size,
    });

    responseData = response ?? undefined;
    setPageResult(responseData);
    setIsLoading(false);
  };

  const handleChangePage = (pagination: any) => {
    filter.from = (pagination.current - 1) * filter.size!;
    setFilter(filter);
    getListData();
  };

  const onfilterTable = async (keyword, value) => {
    if (value === 'all' || value == null || value == undefined) {
      const newFilter = { ...filter, ...{ [keyword]: undefined }, from: 0 };

      setFilter(newFilter);
    } else {
      const newFilter = { ...filter, ...{ [keyword]: value }, from: 0 };

      setFilter(newFilter);
    }
  };

  const onRemoveFormPlaceList = async (id, placeId) => {
    const params = { id: id, placeId: placeId };

    Modal.confirm({
      // icon: <ExclamationCircleOutlined />,
      content: t('EcomSearchLocationDeletePlaceItemContent'),
      title: t('EcomSearchLocationDeletePlaceItemTitle'),
      okText: t('YES'),
      cancelText: t('NO'),
      centered: true,
      okType: 'default',
      onOk() {
        deletePlaceItem(params);
        rhythmSlowForCallApi(getListData);
      },
      onCancel() {},
    });
  };
  const deletePlaceItem = async (params) => {
    await SearchLocationApiService.deleteMaterialPlaceItem(params);
  };
  const getDistrict = async (provinceId: string) => {
    const dataDistrict = await apiMasterDataService.getDistrictV2(provinceId);
    setDistricts(dataDistrict);
  };
  const changeProvince = async (provinceId: string) => {
    formFilter.setFieldValue('district', undefined);
    getDistrict(provinceId);
  };
  useEffect(() => {
    getListData();
  }, [filter]);
  useEffect(() => {
    initDataFilter();
  }, []);

  const columns: ColumnsType<SearchLocationListModel> = [
    {
      title: t('EcomSearchLocationProvinceDistrict'),
      dataIndex: 'title',
      key: 'title',
      width: '15%',
      render: (text: string, item: SearchLocationListModel) => (
        <div>
          <a onClick={() => onEdit(item.id)} className="ml-3 line-clamp-3 self-center text-sm">
            {
              listProvince.find((province: any) => province?.provinceID === item?.province)
                ?.listProvinceName
            }
            / {item?.districtName}
          </a>
        </div>
      ),
    },

    {
      title: t('EcomSearchLocationMaterialPlacesType'),
      dataIndex: 'type',
      key: 'type',
      width: '15%',
      align: align.left,
      render: (text: string) => <div> {t(text) ?? '--'}</div>,
    },
    {
      title: t('EcomSearchLocationPlacesList'),
      dataIndex: 'materialPlaces',
      key: 'materialPlaces',
      width: '15%',
      align: align.left,
      render: (materialPlaces: any, item: SearchLocationListModel) => (
        <div className="cusstom-tag w-full space-y-1">
          {materialPlaces.map((place) => (
            <Tag
              // onClose={() => onRemoveFormPlaceList(item?.id, place?.placeId)}
              // closeIcon={<CloseCircleOutlined />}
              className="tag-hover-effect w-fit rounded-lg"
            >
              <div className="space-x-1">
                <span>{place?.name}</span>
                <CloseCircleOutlined
                  onClick={() => onRemoveFormPlaceList(item?.id, place?.placeId)}
                />
              </div>
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: t('EcomSearchLocationListViewStatus'),
      dataIndex: 'status',
      key: 'status',
      width: '12%',
      align: align.center,
      render: (status) => (
        <div>
          <label
            className={`p-1.5 text-xs ${
              status
                ? 'border-portal-blue50 bg-portal-blue50 text-[#1178F5]'
                : 'border-portal-rejectColor50 bg-portal-rejectColor50 text-portal-rejectColor100'
            } text-s rounded-lg border border-solid font-semibold`}
          >
            {status ? comm('active') : comm('inActive')}
          </label>
        </div>
      ),
    },
  ];

  const onEdit = (id: string) => {
    push(`/admin/search-location-management/${id}`);
  };

  const renderFilter = () => {
    return (
      <>
        <Form
          form={formFilter}
          layout="vertical"
          onKeyDown={(e) => (blockKeyEnter(e) ? e.preventDefault() : undefined)}
        >
          <div className="mt-2 hidden md:hidden lg:flex lg:w-full">
            <div className="mr-7 grid w-[85%] grid-cols-12 gap-x-5 gap-y-3">
              <div className="col-span-3">
                <Form.Item name="province" className="mb-0">
                  <SelectFilter
                    onChange={(value) => {
                      changeProvince(value);
                      onfilterTable('province', value);
                    }}
                    placeholder={t('EcomPropertyListingPageSearchBarAll')}
                    label={t('EcomSearchLocationDetailProvince')}
                    options={listProvince.map((province) => ({
                      value: province.provinceID,
                      label: province.listProvinceName,
                    }))}
                    className="flex w-[100%] items-end"
                  />
                </Form.Item>
              </div>

              <div className="col-span-3">
                <Form.Item name="district" className="mb-0">
                  <SelectFilter
                    onChange={(value) => onfilterTable('district', value)}
                    placeholder={t('EcomPropertyListingPageSearchBarAll')}
                    label={t('EcomSearchLocationDetailDistrict')}
                    options={districts.map((district) => ({
                      value: district.listDistrictID,
                      label: district.nameDisplay,
                    }))}
                    className="flex w-[100%] items-end"
                  />
                </Form.Item>
              </div>

              <div className="col-span-3">
                <Form.Item name="type" className="mb-0">
                  <SelectFilter
                    onChange={(value) => onfilterTable('type', value)}
                    placeholder={t('EcomPropertyListingPageSearchBarAll')}
                    label={t('EcomSearchLocationMaterialPlaces')}
                    options={materialPlaceList?.map((x) => ({
                      value: x.id,
                      label: t(x.name),
                    }))}
                    className="flex w-[100%] items-end"
                  />
                </Form.Item>
              </div>

              <div className="col-span-1">
                <div className="flex w-fit min-w-[5%] flex-col justify-center text-neutral-700 dark:text-neutral-200">
                  <button
                    onClick={resetFilter}
                    className="h-hit w-fit rounded bg-portal-primaryMainAdmin p-2 text-white drop-shadow hover:bg-portal-primaryMainAdmin"
                  >
                    {clearFilterIcon}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex w-[15%] justify-end">
              <FormButton
                children={t('EcomSearchLocationListViewCreateNew')}
                href={`/admin/search-location-management/${'add-new'}`}
                sizeClass={'py-2 px-5'}
              />
            </div>
          </div>
        </Form>
      </>
    );
  };

  return (
    <div className="col-span-12 grid grid-cols-12 items-end gap-y-5">
      <div className="col-span-12">{renderFilter()}</div>

      {/* DeskTop */}
      <div className="hidden lg:col-span-12 lg:block">
        <DataTable
          pagination={{
            current: Math.floor(filter.from / filter.size) + 1,
            total: pageResult?.total ?? 0,
          }}
          onChangePagination={handleChangePage}
          columns={columns}
          dataSource={pageResult ? pageResult?.data : []}
          loading={isLoading}
        />
      </div>
    </div>
  );
};

export default SearchLocationDataTable;
