'use client';
import favoriteApiService from '@/apiServices/externalApiServices/favoriteApiService';
import propertyApiService from '@/apiServices/externalApiServices/propertyApiService';
import AppSearchFilter from '@/components/AppFormFilter/AppSearchFilter/AppSearchFilter';
import AppSelectFilter from '@/components/AppFormFilter/AppSelectFilter/AppSelectFilter';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import DataTableAdvanced from '@/components/DataTableAdvanced';
import NumberFormatPrice from '@/components/NumberFormatPrice/NumberFormatPrice';
import { isLikeIcon, locationIconFavoriteIcon } from '@/libs/appComponents';
import { activeStatus, align, listingType } from '@/libs/appconst';
import { blockKeyEnter, convertFilterDate } from '@/libs/helper';
import { Checkbox, Table } from 'antd';
import Form from 'antd/es/form';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import React, { useEffect, useState } from 'react';
import { TypeOptions, toast } from 'react-toastify';
import CompareProperties from './components/CompareProperties';

type IProps = {
  activeKey: string;
  tabKey: string;
  listProvince: any[];
  listDistrict: any[];
  listWard: any[];
};

const SaleFavorite = (props: IProps) => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);
  const success = useTranslations('successNotifi');

  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');

  const { push } = useRouter();
  const [formFilter] = Form.useForm();
  const [favorites, setFavorites] = useState<any>();
  const [filter, setFilter] = useState<any>({
    from: 0,
    size: 10,
    type: listingType.sale,
  });
  const [listIdCompare, setListIdCompare] = useState([]);
  const [listItemCompare, setListItemCompare] = useState([] as any);
  const [isBlockCompare, setIsBlockCompare] = useState<boolean>(false);
  const [isshowCompare, setIsShowCompare] = useState<boolean>(false);
  const [amenities, setAmenities] = useState<any>([] as any);

  useEffect(() => {
    if (props.activeKey === props.tabKey) {
      getListFavorite(filter);
      setIsBlockCompare(true);
      resetState();
    }
    if (props.activeKey !== props.tabKey) {
      setIsShowCompare(false);
    }
  }, [filter, props.activeKey, props.tabKey]);

  const resetState = () => {
    setListIdCompare([]);
    setListItemCompare([]);
    setIsShowCompare(false);
  };

  const getListFavorite = async (dataFilter) => {
    const favoriteResponse = await favoriteApiService.getListFarvorite(dataFilter);

    setFavorites(favoriteResponse ?? undefined);
  };

  const handleChangePage = (pagination: any) => {
    const valuesFilter = {
      from: (pagination.current - 1) * pagination.pageSize,
      size: pagination.pageSize,
    };
    setFilter({ ...valuesFilter });
  };

  const handleSearch = debounce(async (name, value) => {
    if (name === 'date') {
      setFilter(convertFilterDate(filter, value));
      getListFavorite(convertFilterDate(filter, value));
    } else {
      const newFilter = { ...filter, [name]: value };
      setFilter(newFilter);
      getListFavorite(newFilter);
    }
  }, 300);

  const onCheckCompare = (id, isCheck) => {
    let listIsCompare = [...listIdCompare];

    if (listIsCompare.includes(id) && isCheck === false) {
      listIsCompare = listIsCompare.filter((item: number) => item !== id);
    } else {
      listIsCompare.push(id);
    }
    setListIdCompare(listIsCompare);

    if (listIsCompare.length > 3 || listIsCompare.length <= 1) {
      setIsBlockCompare(true);
    } else {
      setIsBlockCompare(false);
    }
  };

  const compareProperties = async () => {
    const amenities = await propertyApiService.getPropertyAmenities();

    setAmenities(amenities.data);

    const favoritesCompare = await favoriteApiService.compareFavorite(listIdCompare);
    setListItemCompare(favoritesCompare);
    setIsShowCompare(true);
    setIsBlockCompare(true);
  };

  const gotoDetail = (id) => {
    push(`/property/listing-${id}`);
  };

  const unFavorite = async (id) => {
    await favoriteApiService.unFavorite({
      listingId: id,
      isFavorite: false,
    });
    notify('success', success('updateAPI'));
    getListFavorite(filter);
  };

  const closeCompare = () => {
    resetState();
  };

  const columns = [
    {
      title: t('EcomFavoritesPageListViewAction'),
      dataIndex: 'id',
      key: 'id',
      width: '10%',
      align: align.center,
      render: (id, item: any) => (
        <div className="flex w-full items-center justify-center">
          <Checkbox
            checked={listIdCompare.find((item) => item === id) ? true : false}
            onChange={(e) => onCheckCompare(item?.id, e.target.checked)}
          />
        </div>
      ),
    },
    {
      title: t('EcomFavoritesPageListViewProperties'),
      dataIndex: 'imageThumbnailUrls',
      key: 'imageThumbnailUrls',
      width: '80%',
      render: (imageThumbnailUrls, item) => {
        return (
          <div className="group flex w-full items-center justify-between">
            <div className="flex w-full">
              <div className="flex w-full items-center truncate">
                <div className="mr-2 w-[30%]">
                  <img
                    style={{ height: '136px', width: '200px' }}
                    src={`${imageThumbnailUrls[0]?.url}`}
                  />
                </div>
                <div className="w-[70%] flex-col items-start justify-center">
                  <div
                    className="text-base font-medium"
                    style={{ whiteSpace: 'normal' }}
                    onClick={() => gotoDetail(item?.id)}
                  >
                    {item?.title}
                  </div>
                  <div className="line-clamp-3 flex h-[35%] w-full items-center py-3">
                    {locationIconFavoriteIcon}
                    <span className="pl-2 text-xs text-[#62686B]">
                      {item?.location?.formattedAddress}
                    </span>
                  </div>
                  <div className="line-clamp-2 h-[30%] w-full">
                    <label className="font-medium text-[#A80707]">
                      VNĐ <NumberFormatPrice value={item?.priceVnd}></NumberFormatPrice>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      },
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
                    label={t('EcomPropertyListingPageSearchBarSearch')}
                    placeholder={t('EcomPropertyListingPageSearchBarPlaceholder')}
                    onChange={(value) => handleSearch('keyword', value?.target?.value)}
                  />
                </div>

                <div className="col-span-12 lg:col-span-3">
                  <AppSelectFilter
                    name="isActive"
                    label={t('EcomPropertyListingPageSearchBarStatus')}
                    options={activeStatus.map((x) => ({
                      value: x.id,
                      label: t(x.name),
                      id: x.id,
                    }))}
                    onChange={(value) => handleSearch('isActive', value)}
                    placeholder={t('EcomPropertyListingPageSearchBarAll')}
                  />
                </div>
              </div>
            </div>
          </Form>
        </div>
        <div className="col-span-2 flex justify-end">
          <div className="w-fit">
            <ButtonPrimary
              disabled={isBlockCompare}
              text={comm('CompareProperties')}
              onClick={compareProperties}
            />
          </div>
        </div>
      </div>
    );
  };

  return isshowCompare ? (
    <CompareProperties
      amenities={amenities}
      listProperties={listItemCompare}
      visible={isshowCompare}
      onClose={closeCompare}
      listProvince={props.listProvince}
      listDistrict={props.listDistrict}
      listWard={props.listWard}
    />
  ) : (
    <>
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
    </>
  );
};

export default SaleFavorite;
