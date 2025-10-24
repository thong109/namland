'use client';
import contactApiService from '@/apiServices/externalApiServices/apiContact';
import AppRangeDateFilter from '@/components/AppFormFilter/AppRangeDateFilter/AppRangeDateFillter';
import AppSearchFilter from '@/components/AppFormFilter/AppSearchFilter/AppSearchFilter';
import AppPageMeta from '@/components/AppPageMeta';
import DataTable from '@/components/DataTable';
import PaginationComponent from '@/components/PaginationComponent/Pagination';
import WaringPermission from '@/components/WarningPermission/WaringPermission';
import { clearFilterIcon, collapseDownIcon, collapseUpIcon } from '@/libs/appComponents';
import { align, appPermissions, renderDateTime, roleAdminGod } from '@/libs/appconst';
import {
  blockKeyEnter,
  checkPermissonAcion,
  convertPhoneNumber84To0,
  validKey,
} from '@/libs/helper';
import { ContactPortalFilterModel } from '@/models/contactModel/ContactPortalFilterModel';
import PageResultModel from '@/models/reponseModel/pageResultModel';
import useGlobalStore from '@/stores/useGlobalStore';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import Link from 'next-intl/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import ContactStaffCardMobile from './cardMobile';

const props: (keyof ContactPortalFilterModel)[] = ['keywordContact', 'fromDate', 'toDate'];

const PortalContactsForStaff: FC = () => {
  let filter: any = {
    fromDate: null,
    toDate: null,
    from: 0,
    size: 5,
  };
  const comm = useTranslations('Common');
  const t = useTranslations('webLabel');
  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userInfo } = useGlobalStore();
  const [formFilter] = Form.useForm();
  const [contacts, setContacts] = useState<PageResultModel<any>>();
  const [isShowFilter, setIsShowFilter] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(Math.floor(filter.from / filter.size) + 1);

  useEffect(() => {
    getParamFromUrl();
    getListContact(filter);
  }, []);

  const getParamFromUrl = () => {
    props.forEach((key: keyof ContactPortalFilterModel) => setFormFilter(key));
    formFilter.setFieldsValue({
      ...filter,
      date: filter.fromDate && filter.toDate && [dayjs(filter.fromDate), dayjs(filter.toDate)],
    });
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
        default:
          filter[prop] = searchParams.get(prop);
          break;
      }
    }
    if (filter?.fromDate && filter?.toDate) {
      filter.date = [filter?.fromDate, filter?.toDate];
    }
    setCurrentPage(Math.floor(filter.from / filter.size) + 1);
  };

  const handleChangePage = (pagination: any) => {
    filter.from = (pagination.current - 1) * filter.size!;
    setCurrentPage(Math.floor(filter.from / filter.size) + 1);
    const paramsQuery = setNewStringQuery();
    getListContact(paramsQuery);
  };

  const setNewStringQuery = () => {
    const values = formFilter.getFieldsValue();

    const queryStr = Object.keys(values)
      .filter((key) => validKey(values, key))
      .map((key) => {
        if (key === 'date' && values.date[0] !== null && values.date[1] !== null) {
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
  const getListContact = async (paramsfilter) => {
    let contacts: any;
    const contactResponse = await contactApiService.getListContactForStaff(paramsfilter);

    contacts = contactResponse ?? undefined;
    setContacts(contacts);
  };

  const triggerSearch = debounce(async () => {
    filter.from = 0;
    setCurrentPage(Math.floor(filter.from / filter.size) + 1);
    const paramsQuery = setNewStringQuery();
    getListContact(paramsQuery);
  }, 300);

  const onGoDetail = (id: string) => {
    push(`/portal-contact-staff/${id}`);
  };
  const resetFilter = () => {
    filter.from = 0;
    setCurrentPage(Math.floor(filter.from / filter.size) + 1);
    formFilter.resetFields();
    const paramsQuery = setNewStringQuery();
    getListContact(paramsQuery);
  };
  const columnsStaff = [
    {
      title: t('EcomContactListInfoPageSearchBarClientName'),
      dataIndex: 'clientName',
      key: 'clientName',
      ellipsis: true,
      width: '24%',
      render: (clientName: string, item: any) => (
        <Link className="truncate" href={{ pathname: `/portal-contact-staff/${item.id}` }}>
          <div className="flex items-center justify-between">
            <div className="self-center truncate">
              <strong>{item?.clientName ?? '--'}</strong>
              <br />
              {convertPhoneNumber84To0(item.phone) ?? '--'}
              <br />
              <span className="truncate">{item.email ?? '--'}</span>
            </div>
          </div>
        </Link>
      ),
    },

    {
      title: t('EcomTicketManagementInforPageSearchBarOwnerBroker'),
      dataIndex: 'clientName',
      key: 'clientName',
      width: '24%',
      ellipsis: true,
      render: (member, item) => {
        return (
          <div className="flex items-center justify-between">
            <div className="self-center truncate">
              <strong>{item?.ownerBrokerClientName ?? '--'}</strong>
              <br />
              {convertPhoneNumber84To0(item.ownerBrokerPhone) ?? '--'}
              <br />
              <span className="truncate">{item.ownerBrokerEmail ?? '--'}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: t('EcomContactListInfoPageListViewMessage'),
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
      render: (view: string) => <div className="truncate">{view}</div>,
    },
    {
      title: t('EcomContactListInfoPageListViewCreatedDate'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '15%',
      align: align.center,
      render: (createdAt: string) => <div>{renderDateTime(createdAt)}</div>,
    },
  ];
  const renderFilter = () => {
    return (
      <>
        {/* DeskTop */}
        <div className="flex justify-between">
          <div className="flex w-fit items-center" onClick={() => setIsShowFilter(!isShowFilter)}>
            <strong className="mr-2">{isShowFilter ? collapseDownIcon : collapseUpIcon}</strong>
            <strong>{t('EcomPropertyListingPageListFilter')}</strong>
          </div>
        </div>

        {isShowFilter && (
          <>
            <Form
              form={formFilter}
              layout="horizontal"
              size="middle"
              onKeyDown={(e) => (blockKeyEnter(e) ? e.preventDefault() : undefined)}
            >
              <div className="mt-2 lg:flex lg:w-full">
                <div className="grid w-[95%] grid-cols-12 gap-x-3 lg:mr-7">
                  <div className="col-span-12 lg:col-span-6">
                    <AppSearchFilter
                      name="keywordContact"
                      label={t('EcomTicketManagementInforPageSearchBarSearch')}
                      placeholder={t('EcomContactListInfoPageListViewPlaceHolder')}
                      onChange={triggerSearch}
                    />
                  </div>

                  <div className="col-span-12 lg:col-span-6">
                    <AppRangeDateFilter
                      name="date"
                      label={t('EcomContactListInfoPageListViewCreatedDate')}
                      onChange={(value) => {
                        if (value && value[0] !== null && value[1] !== null) {
                          triggerSearch();
                        }
                        if (value === null) {
                          triggerSearch();
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="flex w-full flex-col justify-center text-neutral-700 dark:text-neutral-200 lg:w-fit">
                  <button
                    onClick={resetFilter}
                    className="h-hit flex w-full justify-center rounded bg-portal-primaryMainAdmin p-2 text-white drop-shadow hover:bg-portal-primaryMainAdmin lg:w-fit"
                  >
                    {clearFilterIcon}&nbsp;
                    <span className="border-l-black lg:hidden">{comm('resetFilter')}</span>
                  </button>
                </div>
              </div>
            </Form>
          </>
        )}
      </>
    );
  };

  return checkPermissonAcion(userInfo?.accesses, [
    roleAdminGod,
    appPermissions.portal_contact.view,
    appPermissions.portal_contact.admin,
  ]) ? (
    <>
      <AppPageMeta title={t('EcomContactListDetailPageHeaderContactList')} />
      <div className="h-full w-full bg-portal-backgroud px-3 md:px-[40px] lg:px-[60px]">
        <div className="align-items-center mt-[57px] flex justify-between">
          <div className="mb-5 text-xl font-semibold">
            <h1>{t('EcomContactListDetailPageHeaderContactList')}</h1>
          </div>
        </div>
        <div className="mb-5">{renderFilter()}</div>
        <div className="col-span-12 hidden sm:rounded-lg lg:block">
          <DataTable
            pagination={{
              current: currentPage,
              total: contacts?.total ?? 0,
            }}
            onChangePagination={handleChangePage}
            columns={columnsStaff}
            dataSource={contacts?.data ?? []}
          />
        </div>
        <div className="block overflow-x-auto sm:rounded-lg lg:hidden">
          {contacts?.data.length > 0 ? (
            <>
              {contacts?.data.map((item) => (
                <ContactStaffCardMobile item={item} gotoDetail={(id) => onGoDetail(id)} />
              ))}

              <div className="mt-3 flex w-full justify-center pb-3">
                <PaginationComponent
                  pagination={{
                    current: currentPage,
                    total: contacts?.total ?? 0,
                  }}
                  onChange={(value: any) => handleChangePage(value)}
                />
              </div>
            </>
          ) : (
            <div className="flex h-[150px] w-full items-center justify-center">
              <span>{t('EcomContactPageListViewNoData')}</span>
            </div>
          )}
        </div>
      </div>
    </>
  ) : (
    <WaringPermission />
  );
};

export default PortalContactsForStaff;
