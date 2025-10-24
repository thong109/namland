import { listingType } from '@/libs/appconst';
import { applyQuery } from '@/libs/helper';
import CoordinateModel from '@/models/commonModel/coordinateModel';
import ListingModel from '@/models/listingModel/listingModel';
import listingPropertyModel from '@/models/listingModel/listingPropertyModel';
import { PropertyDetailModel } from '@/models/propertyModel/propertyDetailModel';
import { PropertyListModel } from '@/models/propertyModel/propertyListModel';
import { PropertySearchFilterModel } from '@/models/propertyModel/propertySearchFilterModel';
import { PropertyTypeModel } from '@/models/propertyModel/propertyTypeModel';
import { PropertyUpdateModel } from '@/models/propertyModel/propertyUpdateModel';
import { PropertyViewModel } from '@/models/propertyModel/propertyViewModel';
import ApiResponseModel from '@/models/reponseModel/apiResponseModel';
import PageResultModel from '@/models/reponseModel/pageResultModel';
import SearchRequestModel from '@/models/searchModel/searchRequestModel';
import { PropertyCreateModel } from '../../models/propertyModel/propertyCreateModel';
import apiClient from './apiClient';

const propertyApiService = {
  getPropertyTypes: async (params?: any): Promise<ApiResponseModel<PropertyTypeModel[]>> => {
    const response = await apiClient.get<ApiResponseModel<any>>('EcomListingCategory/GetList', {
      params,
    });
    return response.data?.data;
  },

  getPropertyViews: async (): Promise<ApiResponseModel<PropertyViewModel[]>> => {
    const response = await apiClient.get<ApiResponseModel<any>>('EcomListingView/GetList');
    return response.data;
  },

  getPropertyInterior: async (): Promise<ApiResponseModel<PropertyViewModel[]>> => {
    const response = await apiClient.get<ApiResponseModel<any>>('/EcomInterior/GetList');
    return response.data;
  },

  getPropertyViewBalcony: async (): Promise<ApiResponseModel<PropertyViewModel[]>> => {
    const response = await apiClient.get<ApiResponseModel<any>>('EcomListingViewBalcony/GetList');
    return response.data;
  },

  getPropertyAmenities: async (): Promise<ApiResponseModel<any[]>> => {
    const response = await apiClient.get<ApiResponseModel<any>>('EcomListingAmenities/GetList');
    return response.data;
  },

  getPropertyAmenitiesFilter: async (params): Promise<ApiResponseModel<any[]>> => {
    const response = await apiClient.get<ApiResponseModel<any>>('EcomListingAmenities/GetList', {
      params,
    });
    return response.data;
  },

  createListing: async (property: PropertyCreateModel): Promise<any> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      '/Ecom/v1/EcomListing/Create',
      property,
    );
    return response.data.data;
  },

  updatListing: async (property: PropertyCreateModel): Promise<any> => {
    const response = await apiClient.put<ApiResponseModel<any>>(
      '/Ecom/v1/EcomListing/Update',
      property,
    );
    return response.data;
  },

  sendToApprovalWithExpired: async (body): Promise<any> => {
    const response = await apiClient.post<ApiResponseModel<any>>('/EcomListing/UpdateStatus', body);
    return response.data;
  },

  updateAsDraftForStaff: async (
    property: PropertyCreateModel | PropertyUpdateModel,
  ): Promise<ApiResponseModel<string>> => {
    const formData = new FormData();
    (property.gallery || []).forEach((file) => {
      const partName = `gallery`;
      formData.append(partName, file);
    });

    (property.saleContract || []).forEach((file) => {
      const partName = `saleContract`;
      formData.append(partName, file);
    });
    (property.certificateOfTitle || []).forEach((file) => {
      const partName = `certificateOfTitle`;
      formData.append(partName, file);
    });

    formData.append(`imageThumbnail`, property.imageThumbnail);

    formData.append(`model`, JSON.stringify(property));

    const response = await apiClient.post<ApiResponseModel<any>>(
      '/EcomListingStaff/UpdateByStaff',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  },

  updateStatus: async (body): Promise<ApiResponseModel<boolean>> => {
    await apiClient.post<ApiResponseModel<any>>('EcomListing/UpdateStatus', body);
    return Promise.resolve({
      success: true,
      data: true,
    });
  },

  updateStatusForStaff: async (body): Promise<ApiResponseModel<boolean>> => {
    await apiClient.post<ApiResponseModel<any>>('EcomListingStaff/UpdateStatus', body);
    return Promise.resolve({
      success: true,
      data: true,
    });
  },

  getPropertiesList: async (
    filter: SearchRequestModel,
  ): Promise<ApiResponseModel<PageResultModel<PropertyListModel>>> => {
    const query = applyQuery(filter);

    const response = await apiClient.post<ApiResponseModel<any>>('EcomListing/GetMyListing', query);
    return response.data.data;
  },
  getPropertiesListForStaff: async (
    filter: any,
  ): Promise<ApiResponseModel<PageResultModel<PropertyListModel>>> => {
    const query = applyQuery(filter);
    const response = await apiClient.post<ApiResponseModel<any>>(
      'EcomListingStaff/GetListingForStaff',
      query,
    );
    return response.data.data;
  },

  getDetailMyListingByQuery: async (id: string): Promise<any> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      `EcomListing/GetDetailMyListingByQuery`,
      {
        params: {
          id: id,
        },
      },
    );

    return PropertyDetailModel.assign(response.data.data);
  },

  deleteListtingById: async (id: string): Promise<any> => {
    await apiClient.delete<ApiResponseModel<any>>(`EcomListing/Delete`, {
      params: {
        id: id,
      },
    });

    return;
  },

  deleteListtingByIdRoleStaff: async (id: string): Promise<any> => {
    await apiClient.delete<ApiResponseModel<any>>(`EcomListingStaff/DeleteByStaff`, {
      params: {
        id: id,
      },
    });

    return;
  },

  getDetailForEdit: async (id: string): Promise<any> => {
    const response = await apiClient.get<ApiResponseModel<any>>(`EcomListing/GetDetailForEdit`, {
      params: {
        id: id,
      },
    });

    return PropertyDetailModel.assign(response.data.data);
  },

  getDetailForEditForStaff: async (id: string): Promise<any> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      `EcomListingStaff/GetDetailForEditByStaff`,
      {
        params: {
          id: id,
        },
      },
    );

    return PropertyDetailModel.assign(response.data.data);
  },

  getUnitPriceCheck: async (
    projectId: string,
    unitCode: string,
  ): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(`EcomListing/GetUnitPriceCheck`, {
      params: {
        projectId: projectId,
        unitCode: unitCode,
      },
    });
    return response.data;
  },

  getUnitPriceCheckForDetail: async (listingId: string): Promise<ApiResponseModel<any>> => {
    const response = await apiClient.get<ApiResponseModel<any>>(
      `EcomListing/GetUnitPriceCheckByListing`,
      {
        params: {
          listingId: listingId,
        },
      },
    );
    return response.data;
  },
  getPropertiesListForMember: async (
    filter: SearchRequestModel,
  ): Promise<ApiResponseModel<PageResultModel<ListingModel>>> => {
    const response = await apiClient.post<ApiResponseModel<PageResultModel<ListingModel>>>(
      `EcomListing/GetByQuery`,
      filter,
    );

    return response?.data;
  },
  searchProperties: async (
    filter: SearchRequestModel,
  ): Promise<ApiResponseModel<PageResultModel<ListingModel>>> => {
    const response = await apiClient.post<ApiResponseModel<PageResultModel<ListingModel>>>(
      `Listing/Search`,
      filter,
    );

    return response?.data;
  },
  searchRentProperties: async (
    filter: SearchRequestModel,
  ): Promise<ApiResponseModel<PageResultModel<ListingModel>>> => {
    const response = await apiClient.post<ApiResponseModel<PageResultModel<ListingModel>>>(
      `Listing/Search`,
      { ...filter, type: listingType.rent },
    );

    return response?.data;
  },
  searchSaleProperties: async (
    filter: SearchRequestModel,
  ): Promise<ApiResponseModel<PageResultModel<ListingModel>>> => {
    const response = await apiClient.post<ApiResponseModel<PageResultModel<ListingModel>>>(
      `Listing/Search`,
      { ...filter, type: listingType.sale },
    );

    return response?.data;
  },
  getAllPropertiesGeoRent: async (
    filter: PropertySearchFilterModel,
  ): Promise<ApiResponseModel<CoordinateModel[]>> => {
    const response = await apiClient.post<ApiResponseModel<CoordinateModel[]>>(`Listing/Geo`, {
      ...filter,
      type: listingType.rent,
    });

    return response?.data;
  },
  getAllPropertiesGeoSale: async (
    filter: PropertySearchFilterModel,
  ): Promise<ApiResponseModel<CoordinateModel[]>> => {
    const response = await apiClient.post<ApiResponseModel<CoordinateModel[]>>(`Listing/Geo`, {
      ...filter,
      type: listingType.sale,
    });

    return response?.data;
  },
  getAllPropertiesGeo: async (
    filter: PropertySearchFilterModel,
  ): Promise<ApiResponseModel<CoordinateModel[]>> => {
    const response = await apiClient.post<ApiResponseModel<CoordinateModel[]>>(
      `Listing/Geo`,
      filter,
    );

    return response?.data;
  },
  getSimpleProperty: async (id: string): Promise<ApiResponseModel<ListingModel>> => {
    const response = await apiClient.get<ApiResponseModel<ListingModel>>(`EcomListing/GetSimple`, {
      params: {
        id,
      },
    });

    return response?.data;
  },

  markAsVip: async (id: string, priority: number): Promise<any> => {
    const body = {
      id: id,
      priority: priority,
    };
    await apiClient.post<ApiResponseModel<any>>(`EcomListingStaff/MarkAsVip`, body);
  },

  getPreviewListingById: async (id: any): Promise<ApiResponseModel<listingPropertyModel>> => {
    const response = await apiClient.get<ApiResponseModel<listingPropertyModel>>(
      `EcomListing/PreviewListingById`,
      {
        params: {
          id,
        },
      },
    );
    return response.data;
  },

  pushListingForMember: async (id: string): Promise<any> => {
    const response = await apiClient.post<ApiResponseModel<any>>('EcomListing/Push', {
      id,
    });
    return response.data.data;
  },

  updateActualPrice: async (body): Promise<any> => {
    const response = await apiClient.post<ApiResponseModel<any>>(
      '/EcomListing/UpdateActualPrice',
      body,
    );
    return response.data;
  },

  getDetailListingLandingPage: async (id: string) => {
    const response = await apiClient.get<ApiResponseModel<listingPropertyModel>>(
      `EcomListing/GetDetailByQuery`,
      {
        params: {
          id,
        },
      },
    );
    return response.data.data;
  },
};

export default propertyApiService;
