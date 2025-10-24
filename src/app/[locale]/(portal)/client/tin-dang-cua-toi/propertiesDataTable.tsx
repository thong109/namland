'use client';
import apiMasterDataService from '@/apiServices/externalApiServices/apiMasterDataService';
import projectApiService from '@/apiServices/externalApiServices/projectApiService';
import propertyApiService from '@/apiServices/externalApiServices/propertyApiService';
import AppRadioFilter from '@/components/AppFormFilter/AppRadioFilter.tsx/AppRadioFilter';
import AppSearchFilter from '@/components/AppFormFilter/AppSearchFilter/AppSearchFilter';
import AppSelectFilter from '@/components/AppFormFilter/AppSelectFilter/AppSelectFilter';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import { columnCreate } from '@/components/DataTable/columns';
import DataTableAdvanced from '@/components/DataTableAdvanced';
import NumberFormatPrice from '@/components/NumberFormatPrice/NumberFormatPrice';
import Pagination from '@/components/PaginationComponent/Pagination';
import PropetyCardMobile from '@/components/PropetyCard/PropetyCardMobile';
import useProvince from '@/hooks/useProvince';
import {
  deleteIcon,
  editIcon,
  eyeIcon,
  locationIconFavoriteIcon,
  plusIcon,
} from '@/libs/appComponents';
import {
  align,
  listPriotyStatusFilter,
  listStatusProject,
  listingStatus,
  listingType,
  packageListingEnum,
  pageSizeDefault,
} from '@/libs/appconst';
import { blockKeyEnter, formatNumber, validKey } from '@/libs/helper';
import { ProjectLookupModel } from '@/models/projectModel/projectLookupModel';
import { PropertyPortalFilterModel } from '@/models/propertyModel/PropertyPortalFilterModel';
import { PropertyStatus } from '@/models/propertyModel/propertyDetailModel';
import { PropertyListModel } from '@/models/propertyModel/propertyListModel';
import PageResultModel from '@/models/reponseModel/pageResultModel';
import { Form, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { TypeOptions, toast } from 'react-toastify';

const props: (keyof PropertyPortalFilterModel)[] = [
  'keyword',
  'fromDate',
  'toDate',
  'multipleStatusListting',
  'createdBy',
  'type',
  'projectId',
  'from',
  'userApproveOrReject',
];

const PropertiesDataTableForStaff: React.FunctionComponent = () => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);

  let filter: any = {
    multipleStatusListting: [],
    createdBy: null,
    userApproveOrReject: null,
    type: listingType.sale,
    fromDate: null,
    toDate: null,
    from: 0,
    size: pageSizeDefault,
  };
  const locale = useLocale();
  const [formFilter] = Form.useForm();
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pageResult, setPageResult] = useState<PageResultModel<any>>();
  const [currentPage, setCurrentPage] = useState<number>(Math.floor(filter.from / filter.size) + 1);
  const [listPorject, setListPorject] = useState<ProjectLookupModel[]>([]);
  const [listDistrict, setListDistrict] = useState<any[]>([]);
  const [listWard, setListWard] = useState<any[]>([]);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { listProvince } = useProvince();

  useEffect(() => {
    getParamFromUrl();
    getListProject();
    getListData(filter);
  }, []);

  const getListProject = async () => {
    await projectApiService.getProjectByQueryForPortal().then((x) => setListPorject(x.data));
  };

  const setFormFilter = (prop: string) => {
    if (searchParams.get(prop) !== null && typeof searchParams.get(prop) !== 'undefined') {
      switch (prop) {
        case 'fromDate':
          filter[prop] = dayjs(searchParams.get(prop));
          break;
        case 'toDate':
          filter[prop] = dayjs(searchParams.get(prop));
          break;
        case 'multipleStatusListting':
          const multipleStatusListting = searchParams.get(prop).split(',').map(Number);
          filter[prop] = multipleStatusListting;

          break;
        default:
          filter[prop] = searchParams.get(prop);
          break;
      }
    }
    if (filter?.fromDate && filter?.toDate) {
      filter.publishedDate = [filter?.fromDate, filter?.toDate];
    }
    setCurrentPage(Math.floor(filter.from / filter.size) + 1);
  };

  const getParamFromUrl = () => {
    props.forEach((key: keyof PropertyPortalFilterModel) => setFormFilter(key));

    formFilter.setFieldsValue({
      ...filter,
      type: filter?.type && Number(filter?.type),
      multipleStatusListting:
        filter?.multipleStatusListting?.length > 0 ? [...filter?.multipleStatusListting] : [],
      publishedDate: filter.fromDate &&
        filter.toDate && [dayjs(filter.fromDate), dayjs(filter.toDate)],
    });
  };

  const getListData = async (paramsfilter) => {
    let responseData: any;
    setIsLoading(true);
    const response = await propertyApiService.getPropertiesList({
      ...paramsfilter,
      size: filter.size,
    });
    responseData = response ?? undefined;

    setPageResult(responseData);
    setIsLoading(false);
  };

  const handelDelete = debounce(async (id: string) => {
    try {
      setIsLoading(true);
      await propertyApiService.deleteListtingById(id);
      filter.from = (currentPage - 1) * filter.size!;
      setTimeout(() => {
        const paramsQuery = setNewStringQuery();
        getListData(paramsQuery);
      }, 1000);
      setIsLoading(false);
    } catch (e) {
      notify('error', e.response?.data?.message);
      setIsLoading(false);
    }
  }, 350);

  const renderApprovalStatus = (status) => {
    let approvalStatus = listPriotyStatusFilter.find((x) => x.value === status)?.label;

    let textColor = '';
    let backgroundColor = '';
    let borderColor = '';

    switch (status) {
      case PropertyStatus.Draft: {
        textColor = 'text-[#0C1419]'; //đen
        backgroundColor = 'bg-transparent';
        borderColor = 'border-[#FFD14B]';
        break;
      }
      case PropertyStatus.WaitingForApproval: {
        textColor = 'text-[#FFFFFF]'; // trắng
        backgroundColor = 'bg-[#F2994A]'; // cam
        borderColor = '';
        break;
      }
      case PropertyStatus.approved: {
        textColor = 'text-[#FFFFFF]'; // trắng
        backgroundColor = 'bg-[#1178F5]'; // xanh dương
        borderColor = '';
        break;
      }
      case PropertyStatus.Cancelled: {
        textColor = 'text-[#FFFFFF]'; // trắng
        backgroundColor = 'bg-[#EB5757]'; // đỏ
        borderColor = '';
        break;
      }
      case PropertyStatus.Published: {
        textColor = 'text-[#FFFFFF]'; // trắng
        backgroundColor = 'bg-[#27AE60]'; // cam
        borderColor = '';
        break;
      }
      case PropertyStatus.Expired: {
        textColor = 'text-[#FFFFFF]'; // trắng
        backgroundColor = 'bg-[#EB5757]'; // đỏ
        borderColor = '';
        break;
      }
      case PropertyStatus.Rejected: {
        textColor = 'text-[#FFFFFF]'; // trắng
        backgroundColor = 'bg-[#EB5757]'; // đỏ
        borderColor = '';
        break;
      }
      case PropertyStatus.Takedown: {
        textColor = 'text-[#FFFFFF]'; // trắng
        backgroundColor = 'bg-[#FEDB71]'; // vàng
        borderColor = '';
        break;
      }
      case PropertyStatus.TakeDownLeased:
      case PropertyStatus.TakeDownSold: {
        textColor = 'text-[#FFFFFF]'; // trắng
        backgroundColor = 'bg-[#7D35B5]'; // tím
        borderColor = '';
        break;
      }
      default: {
        break;
      }
    }

    return (
      <div
        className={`ml-2 w-fit rounded-full border px-2 py-1 font-medium ${borderColor} ${backgroundColor} ${textColor} `}
      >
        {t(approvalStatus)}
      </div>
    );
  };

  const handleChangePage = (pagination: any) => {
    filter.from = (pagination.current - 1) * pagination.pageSize;
    filter.size = pagination.pageSize;
    setCurrentPage(Math.floor(filter.from / filter.size) + 1);
    const paramsQuery = setNewStringQuery();
    getListData(paramsQuery);
  };

  const setNewStringQuery = () => {
    const values = formFilter.getFieldsValue();

    const queryStr = Object.keys(values)
      .filter((key) => validKey(values, key))
      .map((key) => {
        if (
          key === 'publishedDate' &&
          values.publishedDate?.some((item) => item !== null && item !== undefined)
        ) {
          return `fromDate=${values[key][0]}&toDate=${values[key][1]}`;
        } else if (key !== 'priceRange') {
          return `${key}=${values[key]}`;
        } else {
          return '';
        }
      })
      .filter((x) => x != null && x != '')
      .concat([`from=${filter.from + 0}`])
      .join('&');

    window.history.pushState({}, '', pathname + '?' + queryStr);
    return { ...values, from: filter.from };
  };

  const triggerSearch = debounce(async () => {
    filter.from = 0;
    setCurrentPage(Math.floor(filter.from / filter.size) + 1);
    const paramsQuery = setNewStringQuery();
    getListData(paramsQuery);
  }, 300);

  const handleChangeValueFilter = async (key: string, value: string) => {
    if (key == 'city') {
      if (value) {
        let dataDistrict = await apiMasterDataService.getDistrictV2(value);
        formFilter.setFieldValue('district', undefined);
        formFilter.setFieldValue('ward', undefined);
        setListDistrict(dataDistrict);
      } else {
        setListDistrict([]);
        setListWard([]);
      }
    }
    if (key == 'district') {
      if (value) {
        let dataWard = await apiMasterDataService.getWards(value);
        formFilter.setFieldValue('ward', undefined);
        setListWard(dataWard);
      } else {
        setListWard([]);
      }
    }

    triggerSearch();
  };

  const renderPriorityStatus = (priorty: number) => {
    let color = '';
    let background = '';
    let text = '';

    switch (priorty) {
      case packageListingEnum.Platinum:
        color = 'text-[#404040]';
        background = 'bg-[#DAD8D4]';
        text = 'Platinum';
        break;
      case packageListingEnum.Gold:
        color = 'text-[#404040]';
        background = 'bg-[#FFBF00]';
        text = 'Gold';
        break;
      case packageListingEnum.Basic:
        color = 'text-[#404040]';
        background = 'bg-[#69D6D8]';
        text = 'Basic';
        break;
      default:
    }

    return (
      <div className={`${color} ${background} rounded-md p-1 text-xs opacity-50`}>{comm(text)}</div>
    );
  };

  const columns: ColumnsType<PropertyListModel> = [
    {
      title: t('EcomPropertyListingPageListViewPropertyTitle'),
      dataIndex: 'imageThumbnailUrls',
      key: 'imageThumbnailUrls',
      width: 400,
      render: (imageThumbnailUrls, item: PropertyListModel) => {
        return (
          <div className="group flex w-full items-center justify-between">
            <div className="flex w-full items-center truncate">
              <div className="mr-2 w-[30%]">
                <img
                  className="h-[140px] w-[160px] object-fill"
                  alt={`${imageThumbnailUrls[0]?.name}`}
                  src={`${imageThumbnailUrls[0]?.url}`}
                />
                <div className="absolute left-[15px] top-[15px]">
                  {renderPriorityStatus(item?.priorityStatus)}
                </div>
              </div>
              <div className="w-[70%] flex-col items-start justify-center">
                <div className="text-sm font-medium" style={{ whiteSpace: 'normal' }}>
                  {item?.title}
                </div>
                <div className="line-clamp-3 flex h-[25%] w-full items-center py-2">
                  {locationIconFavoriteIcon}
                  <span
                    className="text-wrap pl-2 text-xs text-[#62686B]"
                    style={{ whiteSpace: 'normal' }}
                  >
                    {item?.location?.formattedAddress}
                  </span>
                </div>
                <div className="line-clamp-2 flex h-[15%] w-full items-center">
                  <div className="w-full">
                    <label className="font-medium text-[#A80707]">
                      {locale === 'vi' ? 'VNĐ' : 'VNĐ'}{' '}
                      <NumberFormatPrice value={item?.priceVnd}></NumberFormatPrice>
                      {item?.type === listingType.rent && t('/mo')}
                    </label>
                    <br />
                    {(item?.status === listingStatus.Expired ||
                      item?.status === 7 ||
                      item?.status === 6) &&
                      item?.actualPrice && (
                        <div className="flex font-medium text-[#A80707]">
                          {t('PriceActual')}
                          <label className="ml-1 font-medium text-[#A80707]">
                            {formatNumber(item?.actualPrice)} {locale === 'vi' ? 'VNĐ' : 'VNĐ'}
                            {item?.type === listingType.rent && t('/mo')}
                          </label>
                        </div>
                      )}
                  </div>
                </div>
                <div className="mt-2 line-clamp-2 flex h-[15%] w-full items-end justify-between">
                  {renderApprovalStatus(item?.status)}
                  {item?.status === listingStatus.Published && (
                    <span className="flex items-center">
                      {eyeIcon} &nbsp;
                      {item?.listingStatistic?.totalViews}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      },
    },
    columnCreate(),
    {
      title: t('EcomMemberPageListViewStaffAction'),
      dataIndex: 'id',
      key: 'id',
      width: 80,
      align: align.center,
      render: (id, item) => (
        <div className="flex w-full items-center justify-center">
          {item.status === PropertyStatus.Draft && (
            <button onClick={() => handelDelete(id)}>{deleteIcon}</button>
          )}
          <button className="mr-1" onClick={() => onEdit(id)}>
            {editIcon}
          </button>
        </div>
      ),
    },
  ];

  const onEdit = (id: string) => {
    push(`/client/tin-dang-cua-toi/listing=${id}`);
  };

  const renderFilter = () => {
    return (
      <div className="grid grid-cols-12 justify-between gap-x-2">
        <div className="col-span-12 lg:col-span-12">
          <Form
            form={formFilter}
            layout="horizontal"
            size="middle"
            onKeyDown={(e) => (blockKeyEnter(e) ? e.preventDefault() : undefined)}
          >
            <div className="w-full lg:flex lg:justify-between">
              <div className="grid w-full grid-cols-12 gap-x-1 lg:w-[100%]">
                <div className="col-span-12">
                  <AppRadioFilter
                    name="type"
                    onChange={triggerSearch}
                    options={listStatusProject.map((item) => ({
                      id: item.id,
                      name: comm(item.name),
                    }))}
                  />
                </div>
                <div className="col-span-12 lg:col-span-9">
                  <AppSearchFilter
                    name="keyword"
                    label={t('EcomPropertyListingPageSearchBarSearch')}
                    placeholder={t('EcomPropertyListingPageSearchBarPlaceholder')}
                    onChange={triggerSearch}
                  />
                </div>

                <div className="col-span-12 lg:col-span-3">
                  <AppSelectFilter
                    name="multipleStatusListting"
                    isMultiple={true}
                    label={t('EcomPropertyListingPageSearchBarStatus')}
                    options={listPriotyStatusFilter.map((x) => ({
                      value: x.value,
                      label: t(x.label),
                      id: x.value,
                    }))}
                    onChange={triggerSearch}
                    placeholder={t('EcomPropertyListingPageSearchBarStatus')}
                  />
                </div>
                <div className="col-span-12 lg:col-span-4">
                  <AppSelectFilter
                    name="projectId"
                    label={t('EcomPropertyListingPageSearchProjectName')}
                    filterOption={true}
                    options={listPorject?.map((x) => ({
                      value: x.id,
                      label: x.name,
                      id: x.id,
                    }))}
                    onChange={triggerSearch}
                    placeholder={t('EcomPropertyListingPageSearchProjectName')}
                  />
                </div>
                <div className="col-span-12 lg:col-span-4">
                  <AppSelectFilter
                    name="province"
                    label={t('EcomPropertyListingDetailPageLocationCityProvince')}
                    filterOption={true}
                    options={listProvince?.map((x) => ({
                      value: x?.provinceID,
                      label: x?.listProvinceName,
                    }))}
                    onChange={(value) => handleChangeValueFilter('city', value)}
                    placeholder={t('EcomPropertyListingDetailPageLocationCityProvince')}
                  />
                </div>
                <div className="col-span-12 lg:col-span-4">
                  <AppSelectFilter
                    name="district"
                    label={t('EcomPropertyListingDetailPageLocationDistrict')}
                    filterOption={true}
                    onChange={(value) => handleChangeValueFilter('district', value)}
                    options={listDistrict?.map((x) => ({
                      value: x?.listDistrictID,
                      label: x?.nameDisplay,
                    }))}
                    placeholder={t('EcomPropertyListingDetailPageLocationDistrict')}
                  />
                </div>

                <div className="col-span-12 lg:col-span-4">
                  <AppSelectFilter
                    name="ward"
                    label={t('EcomPropertyListingDetailPageLocationWardCommune')}
                    filterOption={true}
                    onChange={(value) => handleChangeValueFilter('ward', value)}
                    options={listWard?.map((x) => ({
                      value: x?.listWardID,
                      label: x?.nameDisplay,
                    }))}
                    placeholder={t('EcomPropertyListingDetailPageLocationWardCommune')}
                  />
                </div>

                <div className="col-span-12 flex items-end justify-end lg:col-span-8">
                  <Form.Item>
                    <ButtonPrimary
                      size="middle"
                      icon={plusIcon}
                      text={t('addNewProperty')}
                      onClick={() => push(`/client/tin-dang-cua-toi/${'add-new'}`)}
                    />
                  </Form.Item>
                </div>
                {/* <div className="col-span-12 lg:col-span-4">
                  <Form.Item name="publishedDate">
                    <RangeDateFilter
                      placeholder={t('EcomPropertyListingPageSearchBarDate')}
                      label={t('EcomPropertyListingPageSearchBarDate')}
                      onChange={(value) => {
                        if (value && value[0] !== null && value[1] !== null) {
                          triggerSearch();
                        }
                        if (value === null) {
                          triggerSearch();
                        }
                      }}
                      className="flex w-[100%] items-end"
                    />
                  </Form.Item>
                </div> */}
              </div>
            </div>
          </Form>
        </div>
      </div>
    );
  };

  return (
    <>
      <div>{renderFilter()}</div>

      {!isMobile ? (
        // DeskTop
        <div className="l w-full sm:rounded-lg">
          <DataTableAdvanced
            showChangePageSize
            pagination={{
              pageSize: pageResult?.size,
              current: currentPage,
              total: pageResult?.total ?? 0,
              onChange: handleChangePage,
            }}
          >
            <Table
              size={'middle'}
              pagination={false}
              columns={columns}
              dataSource={pageResult ? pageResult?.data : []}
              loading={isLoading}
              className="overflow-x-auto"
              scroll={{ y: '60vh', scrollToFirstRowOnChange: true }}
            />
          </DataTableAdvanced>
        </div>
      ) : (
        //  Mobile
        <div className="col-span-12">
          {pageResult?.data.map((item: PropertyListModel) => (
            <PropetyCardMobile property={item} onGoDetail={(id) => onEdit(id)} />
          ))}
          {pageResult?.data.length < 1 && (
            <div className="flex h-full w-full justify-center lg:hidden">
              <span className="text-lg">{t('noItem')}</span>
            </div>
          )}
          <div className="b-3 mt-3 flex w-full justify-center lg:hidden">
            <Pagination
              pagination={{
                current: currentPage,
                total: pageResult?.total ?? 0,
              }}
              onChange={(value: any) => handleChangePage(value)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PropertiesDataTableForStaff;
