'use client';
import commentApiService from '@/apiServices/externalApiServices/apiReviewCommentService';
import DataTable from '@/components/DataTable';
import replaceSpecialStringForES, {
  align,
  appPermissions,
  listStatusComment,
  removeDiacritics,
  renderDateTime,
  roleAdminGod,
  statusCommentMember,
  timeOut,
} from '@/libs/appconst';
import PageResultModel from '@/models/reponseModel/pageResultModel';
import { Button, Form, Rate, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

import CommentApiService from '@/apiServices/externalApiServices/commentApiService';
import AppPageMeta from '@/components/AppPageMeta';
import RangeDateFilter from '@/components/FilterComponents/DateComponent/dateFilter';
import SearchFilter from '@/components/FilterComponents/SearchComponent/SearhFilter';
import SelectFilter from '@/components/FilterComponents/SelectCompoment/SelectFilter';
import {
  activeIcon,
  clearFilterIcon,
  eyeIcon,
  inactiveIcon,
  inEyeIcon,
} from '@/libs/appComponents';
import { tabModulComment } from '@/libs/appconst';
import {
  blockKeyEnter,
  checkDuplicateParamInFilter,
  checkPermissonAcion,
  removeparamInFilter,
} from '@/libs/helper';
import useGlobalStore from '@/stores/useGlobalStore';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { useRouter } from 'next-intl/client';
import { toast, TypeOptions } from 'react-toastify';
export interface ParamModal {
  commentId?: string;
  propertyId?: string;
}
export interface IPropertyDataTableProps {
  mainTabProps: number;
}

const CommentDataTable: React.FunctionComponent<IPropertyDataTableProps> = ({ mainTabProps }) => {
  const comm = useTranslations('Common');
  const success = useTranslations('successNotifi');
  const t = useTranslations('webLabel');
  const { push } = useRouter();

  const [filter, setFilter] = useState<any>({
    from: 0,
    size: 5,
    terms: [] as any,
    range: [] as any,
    must: [] as any,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pageResult, setPageResult] = useState<PageResultModel<any>>();
  const [formFilter] = Form.useForm();
  const errorTranslation = useTranslations('errorNotifi');
  const successTranslation = useTranslations('successNotifi');

  const { userInfo } = useGlobalStore();
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);
  const getListData = async () => {
    let responseData: any;
    setIsLoading(true);
    const response = await CommentApiService.getCommentList(filter, mainTabProps);

    responseData = response ?? undefined;
    setPageResult(responseData);
    setIsLoading(false);
  };

  const handleChangePage = (pagination: any) => {
    filter.from = (pagination.current - 1) * filter.size!;
    setFilter(filter);
    getListData();
  };

  useEffect(() => {
    getListData();
  }, [filter]);

  const onfilterTable = async (keyword, value) => {
    //search with keyword
    if (keyword === 'search') {
      let newFilter = filter;
      if (value.target.value === '') {
        newFilter.must = [
          {
            simple_query_string: {
              fields: ['message', 'applyId'],
              default_operator: 'AND',
              analyze_wildcard: true,
              query: '*',
            },
          },
        ];
      } else {
        newFilter.must = [
          {
            simple_query_string: {
              fields: ['message', 'applyId'],
              default_operator: 'AND',
              analyze_wildcard: true,
              query: `*${replaceSpecialStringForES(value?.target.value)}*`,
            },
          },
        ];
      }

      setFilter({ ...newFilter, from: 0 });
      return;
    }
    //search with date
    else if (keyword === 'createdAt') {
      let newFilter = filter;
      if (value == null) {
        newFilter.range = [];
      } else {
        if (value[0] && value[1]) {
          const dateFrom = value[0];
          const dateTo = value[1];
          if (dateFrom != null && dateTo != null) {
            newFilter.range = [
              {
                range: {
                  createdAt: {
                    time_zone: '+07:00',
                    gte: `${dayjs(dateFrom).format('YYYY/MM/DD')} 00:00`,
                    lte: `${dayjs(dateTo).format('YYYY/MM/DD')} 23:59`,
                    format: 'yyyy/MM/dd HH:mm',
                  },
                },
              },
            ];
          }
        } else {
          return;
        }
      }
      setFilter({ ...newFilter, from: 0 });
      return getListData();
    }
    //search with dropdown
    else {
      if (value === 'all' || value == null || value == undefined) {
        let newFilter = filter;
        const terms = removeparamInFilter(filter.terms, { [keyword]: value }, keyword);
        newFilter.terms = terms;
        setFilter({ ...newFilter, from: 0 });
        return getListData();
      } else {
        let newFilter = filter;
        const terms = checkDuplicateParamInFilter(filter.terms, { [keyword]: value }, keyword);
        newFilter.terms = terms;

        setFilter({ ...newFilter, from: 0 });

        return getListData();
      }
    }
  };
  const handleShowAndUnshowReview = debounce(async (id: string, isShow: string) => {
    if (id) {
      setIsLoading(true);
      const reponse = await commentApiService.showAndUnShowReview(id, !isShow);
      setTimeout(() => {
        getListData();
      }, timeOut);
      if (!reponse.success) {
        notify('error', reponse.messageEN);
      } else {
        setIsLoading(false);
        notify('success', success('updateAPI'));
      }
    }
  }, 250);

  const renderCommentStatus = (item) => {
    let initStatus = listStatusComment.find((x) => x.id === item?.status);

    return (
      <>
        <span
          className={`mr-1 w-fit p-1.5 text-xs bg-[${initStatus.color}] text-[${initStatus.textColor}] rounded-lg text-xs font-semibold leading-8`}
        >
          {comm(initStatus.name)}
        </span>

        <span className="w-fit rounded-lg bg-portal-gray-1 p-1.5 text-xs font-semibold leading-8">
          {item?.isShow ? t('show') : t('unShow')}
        </span>
      </>
    );
  };

  const renderActionByStatus = (item, status: number) => {
    const listAction = (
      <div className="flex">
        {status === statusCommentMember.waitingForApproval ? (
          <>
            <Tooltip trigger="hover" title={t('approved')}>
              <Button
                className="mr-[2px] !px-[4px] !py-[0px]"
                size="small"
                disabled={isLoading}
                onClick={() =>
                  checkPermissonAcion(userInfo?.accesses, [
                    roleAdminGod,
                    appPermissions.portal_comment.update,
                    appPermissions.portal_comment.admin,
                  ])
                    ? approveComment(item?.id)
                    : undefined
                }
              >
                {activeIcon}
              </Button>
            </Tooltip>
            <Tooltip trigger="hover" title={t('rejected')}>
              <Button
                className="mr-[2px] !px-[4px] !py-[0px]"
                size="small"
                disabled={isLoading}
                onClick={() =>
                  checkPermissonAcion(userInfo?.accesses, [
                    roleAdminGod,
                    appPermissions.portal_comment.update,
                    appPermissions.portal_comment.admin,
                  ])
                    ? approveComment(item?.id)
                    : undefined
                }
              >
                {inactiveIcon}
              </Button>
            </Tooltip>
          </>
        ) : status === statusCommentMember.approval ? (
          <>
            <Tooltip trigger="hover" title={t('EcomCommentManagementhangeItemToInactive')}>
              <Button
                className="mr-[2px] !px-[4px] !py-[0px]"
                size="small"
                disabled={isLoading}
                onClick={() =>
                  checkPermissonAcion(userInfo?.accesses, [
                    roleAdminGod,
                    appPermissions.portal_comment.update,
                    appPermissions.portal_comment.admin,
                  ])
                    ? rejectComment(item?.id)
                    : undefined
                }
              >
                {inactiveIcon}
              </Button>
            </Tooltip>
            <Tooltip
              trigger="hover"
              title={
                item.isShow
                  ? t('EcomCommentManagementhangeItemToUnShow')
                  : t('EcomCommentManagementhangeItemToShow')
              }
            >
              <Button
                className="mr-[2px] !px-[4px] !py-[0px]"
                size="small"
                disabled={isLoading}
                onClick={() =>
                  checkPermissonAcion(userInfo?.accesses, [
                    roleAdminGod,
                    appPermissions.portal_comment.update,
                    appPermissions.portal_comment.admin,
                  ])
                    ? handleShowAndUnshowReview(item.id, item.isShow)
                    : undefined
                }
              >
                {item.isShow ? inEyeIcon : eyeIcon}
              </Button>
            </Tooltip>
          </>
        ) : (
          <>
            <Tooltip trigger="hover" title={t('EcomCommentManagementhangeItemToActive')}>
              <Button
                className="mr-[2px] !px-[4px] !py-[0px]"
                size="small"
                disabled={isLoading}
                onClick={() =>
                  checkPermissonAcion(userInfo?.accesses, [
                    roleAdminGod,
                    appPermissions.portal_comment.update,
                    appPermissions.portal_comment.admin,
                  ])
                    ? approveComment(item.id)
                    : undefined
                }
              >
                {activeIcon}
              </Button>
            </Tooltip>
          </>
        )}
      </div>
    );

    return listAction;
  };

  const resetFilter = async () => {
    formFilter.resetFields();
    setFilter({
      from: 0,
      size: 5,
      terms: [] as any,
      range: [] as any,
      must: [] as any,
    });
  };
  const columns: ColumnsType<any> = [
    {
      title: t('EcomCommentManagementTableCommnent'),
      dataIndex: 'message',
      key: 'message',
      width: '30%',
      render: (text: string, item: any) => (
        <div className="group flex min-h-[30px] w-full items-center">
          <div className="flex w-[80%] items-center">
            <a
              onClick={() =>
                checkPermissonAcion(userInfo?.accesses, [
                  roleAdminGod,
                  appPermissions.portal_comment.update,
                  appPermissions.portal_comment.view,
                  appPermissions.portal_comment.admin,
                ])
                  ? onEdit({
                      commentId: item.id,
                      propertyId: item.applyId,
                    })
                  : undefined
              }
              className="ml-3 line-clamp-3 self-center text-xs"
            >
              {text ?? '--'}
            </a>
          </div>

          <div className="flex w-[20%] justify-end">{renderActionByStatus(item, item?.status)}</div>
        </div>
      ),
    },
    {
      title: t('EcomCommentManagementTableCreatBy'),
      dataIndex: 'memberInfo',
      key: 'memberInfo',
      align: align.left,
      width: '12%',
      render: (text: string, item: any) => (
        <div className="grid grid-cols-12">
          <div className="col-span-3 flex h-full w-full items-center justify-center">
            <img src={item?.createdByuserInfo?.avatarUrl} />
          </div>
          <div className="col-span-9 flex items-center justify-center pl-2 text-xs">
            {item?.createdByUser ? (
              <a onClick={() => push(`/agency/${item?.createdByuserInfo?.id}`)}>
                {item?.createdByuserInfo?.firstName} {item?.createdByuserInfo?.lastName}
              </a>
            ) : (
              item?.name
            )}
          </div>
        </div>
      ),
    },
    {
      title:
        mainTabProps === tabModulComment.property
          ? t('EcomCommentManagementTablePropertyName')
          : t('EcomCommentManagementOwnerBroker'),
      dataIndex: mainTabProps === tabModulComment.property ? 'listingInfo' : 'memberInfo',
      key: mainTabProps === tabModulComment.property ? 'listingInfo' : 'memberInfo',
      align: align.left,
      width: mainTabProps === tabModulComment.property ? '25%' : '15%',
      render: (text: string, item: any) => (
        <div className=" ">
          {mainTabProps === tabModulComment.property ? (
            <a className="line-clamp-3 self-center text-xs" onClick={() => gotoDetail(item)}>
              {item?.listingInfo?.title}
            </a>
          ) : (
            <div className="grid grid-cols-12">
              <div className="col-span-3 flex h-full w-full items-center justify-center">
                <img src={item?.avatar} />
              </div>
              <div className="col-span-9 pl-2">
                <a className="line-clamp-2 self-center text-xs" onClick={() => gotoDetail(item)}>
                  {item?.memberInfo?.fullName}
                </a>
                <span>
                  <Rate
                    disabled
                    allowHalf
                    defaultValue={5}
                    value={item?.scoreDetail?.value}
                    style={{ color: '#CAB877', fontSize: 13 }}
                  />
                  ({item?.scoreDetail?.value})
                </span>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      title: <>{t('EcomCommentManagementTableCreateBy')}</>,
      dataIndex: 'createBy',
      key: 'createBy',
      width: '10%',
      align: align.center,
      render: (createBy, item) => (
        <div className="item-center text-xs">
          {createBy ?? '--'}
          <br />
          {renderDateTime(item?.createdAt)}
        </div>
      ),
    },

    {
      title: t('EcomCommentManagementTableStatus'),
      dataIndex: 'status',
      key: 'status',
      width: '13%',
      render: (status, item: any) => renderCommentStatus(item),
    },
  ];

  const onEdit = (params: ParamModal) => {
    let stringParams = '';
    switch (mainTabProps) {
      case tabModulComment.property:
        stringParams = `/admin/staff-properties/listing=${params.propertyId}&commentId=${params.commentId}`;
        break;
      case tabModulComment.member:
        stringParams = `/admin/quan-ly-thanh-vien/memberId=${params.propertyId}&commentId=${params.commentId}`;
        break;
      default:
        stringParams = '';
        break;
    }
    push(stringParams);
  };

  const gotoDetail = (item: any) => {
    let stringParams = '';

    switch (mainTabProps) {
      case tabModulComment.property:
        let stringNotUniCode = removeDiacritics(item?.listingInfo?.title);
        let string = stringNotUniCode.replaceAll(/[^a-zA-Z ]/g, '').replaceAll(/ /g, '-');
        stringParams = `/property/${item.applyId}`;
        break;
      case tabModulComment.member:
        stringParams = `/agency/${item.applyId}`;
        break;
      default:
        stringParams = '';
        break;
    }
    push(stringParams);
  };

  const approveComment = debounce(async (commentId) => {
    setIsLoading(true);
    const response = await CommentApiService.approveComment(commentId);

    if (response.success) {
      setTimeout(() => {
        getListData();
      }, timeOut);
      notify('success', successTranslation('approveSucessfully'));
    } else {
      setIsLoading(false);
      notify('error', errorTranslation('updateAPI'));
    }
  }, 250);

  const rejectComment = debounce(async (commentId) => {
    setIsLoading(true);
    const response = await CommentApiService.rejectComment(commentId);

    if (response.success) {
      setTimeout(() => {
        getListData();
      }, timeOut);

      notify('success', successTranslation('rejectSucessfully'));
    } else {
      setIsLoading(false);
      notify('error', errorTranslation('updateAPI'));
    }
  }, 250);
  // const handleDelete = async commentId => {
  //   Modal.confirm({
  //     icon: <ExclamationCircleOutlined />,
  //     content: 'EcomCommentDeleteContent',
  //     title: t('EcomCommentDeleteTitle'),
  //     okText: t('YES'),
  //     cancelText: t('NO'),
  //     centered: true,
  //     okType: 'default',
  //     onOk() {
  //       deleteComment(commentId);
  //     },
  //     onCancel() {},
  //   });
  // };
  // const deleteComment = async commentId => {
  //   const response = await CommentApiService.deleteComment(commentId);
  //   if (response.success) {
  //     notify('success', successTranslation('deleteSucessfully'));
  //   } else {
  //     notify('error', errorTranslation('deleteAPI'));
  //   }
  //   await getListData();
  // };
  const renderFilter = () => {
    return (
      <>
        <Form
          form={formFilter}
          layout="vertical"
          onKeyDown={(e) => (blockKeyEnter(e) ? e.preventDefault() : undefined)}
        >
          <div className="mt-2 hidden md:hidden lg:flex lg:w-full">
            <div className="mr-7 grid w-[90%] grid-cols-12 gap-x-5 gap-y-3">
              <div className="col-span-4">
                <Form.Item name="search" className="mb-0">
                  <SearchFilter
                    onChange={debounce((value) => onfilterTable('search', value), 300)}
                    label={t('EcomCommentManagementSearchBar')}
                    placeholder={t('EcomCommentManagementSearchBarPlaceHolder')}
                    className="flex w-[100%] items-end"
                  />
                </Form.Item>
              </div>

              <div className="col-span-4">
                <Form.Item name="createdAt" className="mb-0">
                  <RangeDateFilter
                    label={t('EcomContactListInfoPageListViewCreatedDate')}
                    onChange={(value) => onfilterTable('createdAt', value)}
                    className="flex w-[100%] items-end"
                  />
                </Form.Item>
              </div>
              <div className="col-span-3">
                <Form.Item name="status" className="mb-0">
                  <SelectFilter
                    onChange={(value) => onfilterTable('status', value)}
                    placeholder={t('EcomPropertyListingPageSearchBarAll')}
                    label={t('EcomCommentManagementTableStatus')}
                    options={listStatusComment.map((x) => ({
                      value: x.id,
                      label: comm(x.name),
                      id: x.id,
                    }))}
                    className="flex w-[100%] items-end"
                  />
                </Form.Item>
              </div>
            </div>
            <div className="col-span-full">
              <button
                onClick={resetFilter}
                className="h-hit w-full rounded bg-portal-primaryMainAdmin px-2 py-1 text-white drop-shadow hover:bg-portal-primaryMainAdmin"
              >
                {clearFilterIcon}
              </button>
            </div>
          </div>
        </Form>
      </>
    );
  };

  return (
    <>
      <AppPageMeta title={t('EcomLeftCommentListView')} />
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
            dataSource={pageResult?.data ?? []}
            loading={isLoading}
          />
        </div>
      </div>
    </>
  );
};

export default CommentDataTable;
