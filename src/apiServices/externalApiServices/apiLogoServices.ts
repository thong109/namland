import { LogoDetailModel } from '@/models/propertyModel/logoDetailModel';
import ApiResponseModel from '../../models/reponseModel/apiResponseModel';
import apiClient from './apiClient';
const logoApiService = {
  getListLogo: async (filter: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>('EcomLogoBanner/GetByQuery', {
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
    });
    return response.data;
  },

  getById: async (id: string): Promise<any> => {
    const response = await apiClient.get<ApiResponseModel<any>>(`EcomLogoBanner/GetDetailForEdit`, {
      params: {
        id: id,
      },
    });

    return LogoDetailModel.assign(response.data.data);
  },

  createLogo: async (property: any, fileLogo: File): Promise<any> => {
    const formData = new FormData();

    if (fileLogo) {
      const partName = `logoBanner`;
      formData.append(partName, fileLogo);
    }

    formData.append(`model`, JSON.stringify(property));
    const response = await apiClient.post<ApiResponseModel<any>>(
      '/EcomLogoBanner/Create',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  },
  updateLogo: async (property: any, fileLogo: File): Promise<any> => {
    const formData = new FormData();

    if (fileLogo) {
      const partName = `logoBanner`;
      formData.append(partName, fileLogo);
    }

    formData.append(`model`, JSON.stringify(property));
    const response = await apiClient.put<ApiResponseModel<any>>(
      '/EcomLogoBanner/Update',
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

export default logoApiService;
