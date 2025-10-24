import ProjectConstant from '@/libs/constants/projectConstant';
import ListingModel from '@/models/listingModel/listingModel';
import { ProjectBrochureModel } from '@/models/projectModel/projectBrochureMode';
import { ProjectDetailModel } from '@/models/projectModel/projectDetailModel';
import { ProjectGalleryModel } from '@/models/projectModel/projectGalleryModel';
import { ProjectListModel } from '@/models/projectModel/projectListModel';
import { ProjectLookupModel } from '@/models/projectModel/projectLookupModel';
import { ProjectMasterPlanModel } from '@/models/projectModel/projectMasterPlanModel';
import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import PageResultModel from '@/models/reponseModel/pageResultModel';
import SearchRequestModel from '@/models/searchModel/searchRequestModel';
import apiClient from './apiClient';
const projectApiService = {
  getLookupProjects: async (): Promise<PageResultModel<ProjectLookupModel>> => {
    const response = await apiClient.post<PageResultModel<ProjectLookupModel>>(
      'Ecom/EcomProject/GetByQuery',
      {
        from: 0,
        query: {
          bool: {
            must: [
              // {
              //   term: {
              //     isActive: true,
              //   },
              // },
            ],
            must_not: [],
          },
        },
        size: 300,
        sort: {
          label: 'Số thứ tự tăng dần',
          field: 'order',
          sortOrder: 0,
          isDefault: true,
        },
      },
    );
    return response.data;
  },

  getListProjectLandingPage: async (): Promise<PageResultModel<ProjectLookupModel>> => {
    const response = await apiClient.post<PageResultModel<ProjectLookupModel>>(
      'Ecom/EcomProject/GetListProject',
      {
        from: 0,
        query: {
          bool: {
            must: [
              {
                term: {
                  isActive: true,
                },
              },
            ],
            must_not: [],
          },
        },
        size: 100,
        sort: {
          label: 'Số thứ tự tăng dần',
          field: 'order',
          sortOrder: 0,
          isDefault: true,
        },
      },
    );
    return response.data;
  },

  getProjectByQueryForPortal: async (): Promise<ApiResponseModel<ProjectLookupModel[]>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/EcomProject/GetProjectByQueryForPortal',
      {
        from: 0,
        query: {
          bool: {
            must: [
              {
                term: {
                  isActive: true,
                },
              },
            ],
            must_not: [],
          },
        },
        size: 100,
        sort: {
          label: 'Số thứ tự tăng dần',
          field: 'order',
          sortOrder: 0,
          isDefault: true,
        },
      },
    );
    return response.data;
  },

  getLookupUnitFromProjects: async (
    projectId: string,
    unitCode: string,
  ): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      `Ecom/EcomProperty/GetByQueryForPortal?projectId=${projectId}&unitCode=${unitCode}`,
    );
    return response.data;
  },

  getProjectsList: async (
    filter: SearchRequestModel,
  ): Promise<PageResultModel<ProjectListModel>> => {
    const response = await apiClient.post<PageResultModel<ProjectListModel>>(
      'Ecom/EcomProject/GetByQuery',
      {
        from: filter.from || 0,
        size: filter.size || ProjectConstant.TotalProjectsInPage,
        query: filter.query,
        sort: filter.sort,
      },
    );
    return response.data;
  },

  getProjectsListLandingPage: async (
    filter: SearchRequestModel,
  ): Promise<PageResultModel<ProjectListModel>> => {
    const response = await apiClient.post<PageResultModel<ProjectListModel>>(
      'Ecom/EcomProject/GetListProject',
      {
        from: filter.from || 0,
        size: filter.size || ProjectConstant.TotalProjectsInPage,
        query: filter.query,
        sort: filter.sort,
      },
    );
    return response.data;
  },
  getProjectById: async (params: { id: string; lang: string }): Promise<ProjectDetailModel> => {
    const response = await apiClient.post<ProjectDetailModel>(
      `/Ecom/EcomProject/GetById`,
      {
        headers: {
          'App.Culture': params?.lang || 'vi',
        },
      },
      {
        params: {
          id: params.id,
        },
      },
    );
    return response.data;
  },
  getProjectGallery: async (projectId: string): Promise<ProjectGalleryModel[]> => {
    const filter: SearchRequestModel = {
      from: 0,
      size: 1,
      query: {
        bool: {
          must: [
            {
              term: {
                projectId: projectId,
              },
            },
          ],
        },
      },
    };

    const response = await apiClient.post<PageResultModel<ProjectGalleryModel>>(
      `/Ecom/EcomProject/GetGalleryByQuery`,
      filter,
    );
    return response.data.data;
  },
  getProjectBrochure: async (projectId: string): Promise<ProjectBrochureModel[]> => {
    const filter: SearchRequestModel = {
      from: 0,
      size: 10,
      query: {
        bool: {
          must: [
            {
              term: {
                projectId: projectId,
              },
            },
          ],
        },
      },
    };

    const response = await apiClient.post<PageResultModel<ProjectBrochureModel>>(
      `/Ecom/EcomProject/GetBrochureByQuery`,
      filter,
    );
    return response.data.data;
  },
  getProjectMasterPlan: async (projectId: string): Promise<ProjectMasterPlanModel[]> => {
    const filter: SearchRequestModel = {
      from: 0,
      size: 10,
      query: {
        bool: {
          must: [
            {
              term: {
                projectId: projectId,
              },
            },
          ],
        },
      },
    };

    const response = await apiClient.post<PageResultModel<ProjectMasterPlanModel>>(
      `/Ecom/EcomProject/GetMasterPlanByQuery`,
      filter,
    );
    return response.data.data;
  },
  getRecentListingsForSale: async (projectId: string): Promise<ListingModel[]> => {
    const filter: SearchRequestModel = {
      from: 0,
      query: {
        bool: {
          must: [
            {
              term: {
                projectId: projectId,
              },
            },
          ],
          must_not: [],
        },
      },
      size: 10,
    };

    const response = await apiClient.post<ApiResponseModel<PageResultModel<ListingModel>>>(
      `/EcomListing/GetForSellByQuery`,
      filter,
    );
    return response.data?.data?.data;
  },
  getRecentListingsForRent: async (projectId: string): Promise<ListingModel[]> => {
    const filter: SearchRequestModel = {
      from: 0,
      query: {
        bool: {
          must: [
            {
              term: {
                projectId: projectId,
              },
            },
          ],
          must_not: [],
        },
      },
      size: 10,
    };

    const response = await apiClient.post<ApiResponseModel<PageResultModel<ListingModel>>>(
      `/EcomListing/GetForRentByQuery`,
      filter,
    );
    return response.data?.data?.data;
  },

  getLandingPageWithId: async (id: string): Promise<ProjectDetailModel> => {
    const response = await apiClient.get<ApiResponseModel<any>>(`Ecom/EcomProject/Get`, {
      params: {
        id: id,
      },
    });

    return response.data.data;
  },
};

export default projectApiService;
