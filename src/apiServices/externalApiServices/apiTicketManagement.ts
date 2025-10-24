import { applyQuery } from '@/libs/helper';
import { OwnInquiryDetailModel } from '@/models/ownInquiryModel/ownInquiryDetailModel';
import { TicketListModel } from '@/models/propertyModel/TicketModel';
import { TicketDetailModel } from '@/models/propertyModel/ticketDetailModel';
import PageResultModal from '@/models/reponseModel/pageResultModel';
import SearchRequestModel from '@/models/searchModel/searchRequestModel';
import ApiResponseModel from '../../models/reponseModel/apiResponseModel';
import apiClient from './apiClient';
const apiTicketManagement = {
  getListTicket: async (
    filter: SearchRequestModel,
    type?: any,
  ): Promise<ApiResponseModel<PageResultModal<TicketListModel>>> => {
    const query = applyQuery(filter);
    const response = await apiClient.post<ApiResponseModel<any>>(
      `Ecom/EcomInquiry/GetByQuery`,
      query,
      {
        params: {
          type: type,
        },
      },
    );
    return response.data.data;
  },

  getListOwnerInquiryNoPaging: async (): Promise<
    ApiResponseModel<PageResultModal<TicketListModel>>
  > => {
    const response = await apiClient.get<ApiResponseModel<any>>('Ecom/OwnerInquiry/GetAll');
    return response.data?.data;
  },

  getListOwnerInquiry: async (
    params: any,
  ): Promise<ApiResponseModel<PageResultModal<TicketListModel>>> => {
    // const query = applyQuery(filter);
    const response = await apiClient.get<ApiResponseModel<any>>(
      'Ecom/OwnerInquiry/GetByQueryForClient',
      {
        params,
      },
    );
    return response.data?.data;
  },

  getListOwnInquiryForStaff: async (
    params: any,
  ): Promise<ApiResponseModel<PageResultModal<TicketListModel>>> => {
    const response = await apiClient.get<ApiResponseModel<any>>('/Ecom/OwnerInquiry/GetByQuery', {
      params,
    });
    return response.data?.data;
  },

  getListTicketForStaffWithBoardView: async (filter: any): Promise<ApiResponseModel<any>> => {
    const query = applyQuery(filter);
    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/EcomInquiry/GetByQueryForStaff',
      query,
    );
    return response.data.data;
  },

  getListTicketNewHomeStaff: async (filter: any): Promise<ApiResponseModel<any>> => {
    const query = applyQuery(filter);
    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/EcomInquiry/GetByQueryForStaff',
      query,
    );
    return response.data.data;
  },

  getAllTicketNewHomeByMe: async (params: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      '/EcomNewHomesInquiry/GetAllMyInq',
      { params },
    );
    return response.data.data;
  },

  getAllTicketNewHomeByStaff: async (params: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      '/EcomNewHomesInquiry/GetAllByStaff',
      { params },
    );
    return response.data.data;
  },
  getAllTicketNewHomeByPIC: async (params: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      '/EcomNewHomesInquiry/GetAllMyPic',
      { params },
    );
    return response.data.data;
  },

  getAllTicketForMyFindAHome: async (params: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      '/Ecom/EcomFindHome/GetMyFindHome',
      { params },
    );
    return response.data.data;
  },

  getAllTicketForFindAHome: async (params: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>('Ecom/EcomFindHome/GetFindHome', {
      params,
    });
    return response.data.data;
  },

  getListTicketForMemberWithBoardView: async (
    filter: any,
    type,
  ): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      `Ecom/EcomInquiry/GetByQuery`,
      {
        from: filter.from,
        query: {
          bool: {
            must: filter.must,
            filter: [...filter.terms, ...filter.range],
            must_not: [],
          },
        },
        size: filter.size,
        sort: {
          label: 'Số thứ tự tăng dần',
          field: 'createdAt',
          sortOrder: 1,
          isDefault: true,
        },
      },
      {
        params: {
          type: type,
        },
      },
    );
    return response.data.data;
  },

  getByid: async (id: string): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(`Ecom/EcomInquiry/GetById`, {
      params: {
        id: id,
      },
    });
    return TicketDetailModel.assign(response.data.data);
  },

  getFindAHomeByid: async (id: string): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(`Ecom/EcomFindHome/Get`, {
      params: {
        id: id,
      },
    });
    return TicketDetailModel.assign(response.data.data);
  },

  getInquryNewHomeByMe: async (id: string): Promise<any> => {
    const response = await apiClient.get<ApiResponseModel<any>>(`Ecom/EcomFindHome/Get`, {
      params: {
        id: id,
      },
    });
    return response.data.data;
  },

  getInquryNewHomeByStaff: async (id: string): Promise<any> => {
    const response = await apiClient.get<ApiResponseModel<any>>(`/EcomNewHomesInquiry/GetByStaff`, {
      params: {
        id: id,
      },
    });
    return response.data.data;
  },

  getInquryNewHomeByPIC: async (id: string): Promise<any> => {
    const response = await apiClient.get<ApiResponseModel<any>>(`/EcomNewHomesInquiry/GetByPic`, {
      params: {
        id: id,
      },
    });
    return response.data.data;
  },

  getOwnInquiryStaffByid: async (id: string): Promise<any> => {
    const response = await apiClient.get<ApiResponseModel<any>>(`Ecom/OwnerInquiry/GetDetail`, {
      params: {
        id: id,
      },
    });

    return OwnInquiryDetailModel.assign(response.data.data);
  },

  getOwnInquiryByid: async (id: string): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      `Ecom/OwnerInquiry/GetDetailForClient`,
      {
        params: {
          id: id,
        },
      },
    );
    return OwnInquiryDetailModel.assign(response.data.data);
  },

  listInquirySummary: async (): Promise<any> => {
    const response = await apiClient.get<ApiResponseModel<any>>('Ecom/EcomInquiry/InquirySummary');
    return response.data.data;
  },

  listInquirySummaryForMember: async (): Promise<any> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      'Ecom/EcomInquiry/InquirySummaryMyTicket',
    );
    return response.data.data;
  },
  update: async (body: any): Promise<any> => {
    const response = await apiClient.post<ApiResponseModel<any>>('/Ecom/EcomInquiry/Update', body);

    return response.data;
  },
  updateStatus: async (body: any): Promise<any> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      '/Ecom/EcomInquiry/UpdateStatus',
      body,
    );

    return response.data;
  },
  updateFindAHome: async (body: any): Promise<any> => {
    const response = await apiClient.put<ApiResponseModel<any>>('/Ecom/EcomFindHome/Update', body);

    return response.data;
  },

  updateOwnInquiryStaff: async (body: any): Promise<any> => {
    const response = await apiClient.put<ApiResponseModel<any>>('Ecom/OwnerInquiry/Update', body);

    return response.data;
  },
};

export default apiTicketManagement;
