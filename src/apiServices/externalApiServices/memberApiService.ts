import { renderDateTime } from '@/libs/appconst';
import { applyQuery, convertCountryPhoneCode, downloadFile } from '@/libs/helper';
import { MemberAnonymousModel } from '@/models/memberModel/memberAnonymousModel';
import { MemberDetailModel } from '@/models/propertyModel/memberDetailModel';
import SearchRequestModel from '@/models/searchModel/searchRequestModel';
import dayjs from 'dayjs';
import ApiResponseModel from '../../models/reponseModel/apiResponseModel';
import apiClient from './apiClient';

const memberApiService = {
  getListmember: async (filter: SearchRequestModel): Promise<ApiResponseModel<any>> => {
    const query = applyQuery(filter);

    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/EcomAccount/GetByQuery',
      query,
    );
    return response.data;
  },

  getListAccount: async (keyword: string): Promise<ApiResponseModel<any>> => {
    const query = {
      from: 0,
      query: {
        bool: {
          must: [],
          filter: [],
          must_not: [],
        },
      },
      size: 10,
      sort: {
        label: 'Số thứ tự tăng dần',
        field: 'createdAt',
        sortOrder: 1,
        isDefault: true,
      },
    };
    if (keyword) {
      query.query.bool.must.push({
        bool: {
          should: [
            {
              simple_query_string: {
                fields: ['fullName'],
                query: `*${keyword}*`,
                default_operator: 'AND',
                analyze_wildcard: true,
              },
            },
            {
              simple_query_string: {
                fields: ['phone'],
                query: `*${convertCountryPhoneCode(keyword)}*`,
                default_operator: 'AND',
                analyze_wildcard: true,
              },
            },
            {
              simple_query_string: {
                fields: ['phone'],
                query: `*${keyword}*`,
                default_operator: 'AND',
                analyze_wildcard: true,
              },
            },
          ],
        },
      });
    }
    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/EcomAccount/GetByQuery',
      query,
    );
    return response.data;
  },
  getFilterCreatedAt: async (keyword: string): Promise<ApiResponseModel<any>> => {
    const query = {
      from: 0,
      query: {
        bool: {
          must: [],
          filter: [],
          must_not: [],
        },
      },
      size: 10,
      sort: {
        label: 'Số thứ tự tăng dần',
        field: 'createdAt',
        sortOrder: 1,
        isDefault: true,
      },
    };
    if (keyword) {
      query.query.bool.must.push({
        bool: {
          should: [
            {
              simple_query_string: {
                fields: ['fullName'],
                query: `*${keyword}*`,
                default_operator: 'AND',
                analyze_wildcard: true,
              },
            },
            {
              simple_query_string: {
                fields: ['phone'],
                query: `*${convertCountryPhoneCode(keyword)}*`,
                default_operator: 'AND',
                analyze_wildcard: true,
              },
            },
            {
              simple_query_string: {
                fields: ['phone'],
                query: `*${keyword}*`,
                default_operator: 'AND',
                analyze_wildcard: true,
              },
            },
          ],
        },
      });
    }
    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/EcomAccount/GetFilterCreatedAt',
      query,
    );
    return response.data;
  },

  getByid: async (id: string): Promise<any> => {
    const response = await apiClient.get<ApiResponseModel<any>>(`Ecom/EcomAccount/GetById`, {
      params: {
        id: id,
      },
    });

    return MemberDetailModel.assign(response.data.data);
  },

  approveMember: async (id: string): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(`Ecom/EcomAccount/Approve/${id}`);
    return response.data;
  },

  rejectMember: async (body: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(`Ecom/EcomAccount/Reject`, body);
    return response.data;
  },

  ActiveOrInActiveMember: async (body: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(`Ecom/EcomAccount/Active`, body);
    return response.data;
  },
  onShowOrUnShow: async (body: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      `Ecom/EcomAccount/ShowOnHome`,
      body,
    );
    return response.data;
  },

  getMemberByAnonymous: async (id: string): Promise<ApiResponseModel<MemberAnonymousModel>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(`Ecom/EcomAccount/GetByIdPublish`, {
      params: {
        id: id,
      },
    });
    return response.data;
  },

  exportMembers: async (filter: SearchRequestModel): Promise<any> => {
    // delete filter.from;
    // delete filter.size;
    const body = {
      keyword: filter.keyword,
      isActive: filter.isActive,
    };

    const query = applyQuery(body);

    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/EcomAccount/ExportMember',
      body,
      { responseType: 'blob' },
    );
    downloadFile(response.data, `list_member${renderDateTime(dayjs())}.xlsx`);
  },
};

export default memberApiService;
