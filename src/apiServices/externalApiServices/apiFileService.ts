import { moduleUploadFile } from '@/libs/appconst';
import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import apiClient from './apiClient';

const fileApiService = {
  uploadFileImg: async (file: File): Promise<ApiResponseModel<any>> => {
    const formData = new FormData();
    formData.append(`image`, file);

    const response = await apiClient.post<ApiResponseModel<any>>('/Upload/UploadImage', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  getDocumentFile: async (id: string): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>('/Upload/GetDocumentFile', {
      params: {
        id: id,
      },
    });

    return response.data;
  },

  uploadFilesListing: async (files: File[]): Promise<ApiResponseModel<any>> => {
    const formData = new FormData();
    (files || []).forEach((file) => {
      const partName = `image`;
      formData.append(partName, file);
    });
    formData.append(`model`, JSON.stringify({}));

    const response = await apiClient.post<ApiResponseModel<any>>(
      '/Upload/UploadImageListing',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  },

  uploadFilesNewHome: async (files: File[]): Promise<ApiResponseModel<any>> => {
    const formData = new FormData();
    (files || []).forEach((file) => {
      const partName = `image`;
      formData.append(partName, file);
    });
    formData.append(`model`, JSON.stringify({}));

    const response = await apiClient.post<ApiResponseModel<any>>(
      '/Upload/UploadImageNewHomeImages',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  },

  uploadFilesProject: async (files: File[]): Promise<ApiResponseModel<any>> => {
    const formData = new FormData();
    (files || []).forEach((file) => {
      const partName = `image`;
      formData.append(partName, file);
    });
    formData.append(`model`, JSON.stringify({}));

    const response = await apiClient.post<ApiResponseModel<any>>(
      '/Upload/UploadImageProject',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  },

  uploadFilesWithModule: async (files: File[], moduleId): Promise<ApiResponseModel<any>> => {
    const formData = new FormData();
    (files || []).forEach((file) => {
      const partName = `image`;
      formData.append(partName, file);
    });
    formData.append(`model`, JSON.stringify({}));
    let urlUpload = '';
    switch (moduleId) {
      case moduleUploadFile.NEW_HOME:
        urlUpload = '/Upload/UploadImageNewHomes';
        break;
      case moduleUploadFile.PROJECT:
        urlUpload = '/Upload/UploadImageProject';
        break;
      default:
        urlUpload = '/Upload/UploadImageProject';
    }

    const response = await apiClient.post<ApiResponseModel<any>>(`${urlUpload}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  uploadProjectLogo: async (files: File[]): Promise<ApiResponseModel<any>> => {
    const formData = new FormData();
    (files || []).forEach((file) => {
      const partName = `image`;
      formData.append(partName, file);
    });
    formData.append(`model`, JSON.stringify({}));

    const response = await apiClient.post<ApiResponseModel<any>>(
      '/Upload/UploadImageProjectLogo',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  },
};

export default fileApiService;
