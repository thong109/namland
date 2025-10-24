import { applyQuery } from '@/libs/helper';
import { IPremisesModel } from '@/models/projectModelInAdmin/premisesModel';
import {
  IProjectFilterModelInAdmin,
  ProjectDetailInAdmin,
} from '@/models/projectModelInAdmin/projectModelInAdmin';
import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import PageResultModel from '@/models/reponseModel/pageResultModel';
import SearchRequestModel from '@/models/searchModel/searchRequestModel';
import apiClient from './apiClient';

const projectApiInAdmin = {
  getProjectList: async (
    filter: SearchRequestModel,
  ): Promise<ApiResponseModel<PageResultModel<IProjectFilterModelInAdmin>>> => {
    const query = applyQuery(filter);
    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/EcomProject/GetProjectByQueryForPortal',
      query,
    );

    return response.data;
  },

  getById: async (id: string): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(`Ecom/EcomProject/GetById`, null, {
      params: {
        id: id,
      },
    });

    return ProjectDetailInAdmin.assign(response.data.data);
  },

  createProject: async (project: any): Promise<ApiResponseModel<any>> => {
    const formData = new FormData();
    (project.projectImage || []).forEach((file) => {
      const partName = `projectImage`;
      formData.append(partName, file);
    });
    formData.append(`projectLogo`, project.projectLogo);
    formData.append(`model`, JSON.stringify(project));
    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/EcomProject/CreateProject',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  },

  createProjectV1: async (body: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      'Ecom/v1/EcomProject/Create',
      body,
    );

    return response.data;
  },

  updateProject: async (project: any): Promise<ApiResponseModel<any>> => {
    const formData = new FormData();
    (project.projectImage || []).forEach((file) => {
      const partName = `projectImage`;
      formData.append(partName, file);
    });
    formData.append(`projectLogo`, project.projectLogo);
    formData.append(`model`, JSON.stringify(project));
    const response = await apiClient.put<ApiResponseModel<any>>(
      '/Ecom/EcomProject/UpdateProject',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  },

  updateProjectV1: async (body: any): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.put<ApiResponseModel<any>>(
      '/Ecom/v1/EcomProject/Update',
      body,
    );

    return response.data;
  },

  GetProjectMasterPlanById: async (
    projectId: string,
  ): Promise<ApiResponseModel<PageResultModel<IPremisesModel>>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      '/Ecom/EcomProject/GetProjectMasterPlanById',
      {
        params: {
          projectId: projectId,
        },
      },
    );
    return response.data;
  },

  createProjectMasterPlanByQueryById: async (
    values: any,
    projectMasterplanAvatar?: File,
    projectMasterplanImages?: File[],
  ): Promise<ApiResponseModel<any>> => {
    const formData = new FormData();
    formData.append(`model`, JSON.stringify(values));
    if (projectMasterplanAvatar) {
      formData.append('ProjectMasterplanAvatar', projectMasterplanAvatar);
    }
    if (projectMasterplanImages && projectMasterplanImages.length > 0) {
      projectMasterplanImages.forEach((file) => {
        const partName = `ProjectMasterplanImages`;
        formData.append(partName, file);
      });
    }

    const response = await apiClient.post<ApiResponseModel<any>>(
      '/Ecom/EcomProject/CreateProjectMasterPlan',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  },

  updateProjectMasterPlanByQueryById: async (
    values: any,
    projectMasterplanAvatar?: File,
    projectMasterplanImages?: File[],
  ): Promise<ApiResponseModel<any>> => {
    const formData = new FormData();
    formData.append(`model`, JSON.stringify(values));
    if (projectMasterplanAvatar) {
      formData.append('ProjectMasterplanAvatar', projectMasterplanAvatar);
    }
    if (projectMasterplanImages && projectMasterplanImages.length > 0) {
      projectMasterplanImages.forEach((file) => {
        const partName = `ProjectMasterplanImages`;
        formData.append(partName, file);
      });
    }

    const response = await apiClient.put<ApiResponseModel<any>>(
      '/Ecom/EcomProject/UpdateProjectMasterPlan',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  },

  getProjectBrochureById: async (
    projectId: string,
  ): Promise<ApiResponseModel<PageResultModel<IPremisesModel>>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      '/Ecom/EcomProject/GetProjectBrochureById',
      {
        params: {
          projectId: projectId,
        },
      },
    );
    return response.data;
  },

  createProjectBrochureByQueryById: async (
    values: any,
    projectMasterplanImages?: File[],
  ): Promise<ApiResponseModel<any>> => {
    const formData = new FormData();
    formData.append(`model`, JSON.stringify(values));

    if (projectMasterplanImages && projectMasterplanImages.length > 0) {
      projectMasterplanImages.forEach((file) => {
        const partName = `ProjectBrochureFiles`;
        formData.append(partName, file);
      });
    }

    const response = await apiClient.post<ApiResponseModel<any>>(
      '/Ecom/EcomProject/CreateProjectBrochure',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  },
  updateProjectBrochureByQueryById: async (
    values: any,
    projectMasterplanImages?: File[],
  ): Promise<ApiResponseModel<any>> => {
    const formData = new FormData();
    formData.append(`model`, JSON.stringify(values));

    if (projectMasterplanImages && projectMasterplanImages.length > 0) {
      projectMasterplanImages.forEach((file) => {
        const partName = `ProjectBrochureFiles`;
        formData.append(partName, file);
      });
    }

    const response = await apiClient.put<ApiResponseModel<any>>(
      '/Ecom/EcomProject/UpdateProjectBrochure',
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
export default projectApiInAdmin;
