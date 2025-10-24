import { ConversationModel } from '@/models/conversationModel/ConversationModel';
import { IProjectFilterModelInAdmin } from '@/models/projectModelInAdmin/projectModelInAdmin';
import PageResultModel from '@/models/reponseModel/pageResultModel';
import ApiResponseModel from '../../models/reponseModel/apiResponseModel';
import apiClient from './apiClient';
const apiConversationService = {
  getListConvesationWithId: async (referenceId: string, moduleId: number): Promise<any> => {
    const response = await apiClient.post<ApiResponseModel<any>>('EcomConversation/GetByQuery', {
      from: 0,
      query: {
        bool: {
          must: [
            {
              term: {
                referenceId: `${referenceId}`,
              },
            },
            {
              term: {
                moduleId: `${moduleId}`,
              },
            },
          ],
          must_not: [],
        },
      },
      size: 100,
      sort: {
        label: 'Số thứ tự tăng dần',
        field: 'createdAt',
        sortOrder: 0,
        isDefault: true,
      },
    });

    return ConversationModel.assigns(response.data.data?.data || []);
  },

  createConversation: async (body: any, fileUploads: any): Promise<any> => {
    const formData = new FormData();

    // Append each file from fileUploads array
    if (fileUploads && fileUploads.length > 0) {
      fileUploads.forEach((file, index) => {
        const partName = `image`; // Unique part name for each file
        formData.append(partName, file);
      });
    }

    formData.append(`model`, JSON.stringify(body));

    const response = await apiClient.post<ApiResponseModel<any>>(
      'EcomConversation/Create',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return ConversationModel.assign(response.data.data);
  },

  getConversationNEwHomeInquiry: async (
    params: any,
  ): Promise<ApiResponseModel<PageResultModel<IProjectFilterModelInAdmin>>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      '/EcomNewHomesInquiry/GetConversation',
      { params },
    );

    return response.data.data;
  },

  createConversationNEwHomeInquiry: async (body: any, fileUploads: any): Promise<any> => {
    const formData = new FormData();

    // Append each file from fileUploads array
    if (fileUploads && fileUploads.length > 0) {
      fileUploads.forEach((file, index) => {
        const partName = `image`; // Unique part name for each file
        formData.append(partName, file);
      });
    }

    formData.append(`model`, JSON.stringify(body));

    const response = await apiClient.post<ApiResponseModel<any>>(
      'EcomConversation/Create',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return ConversationModel.assign(response.data.data);
  },
};

export default apiConversationService;
