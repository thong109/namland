import apiDashBoardService from '@/apiServices/externalApiServices/apiDashBoardService';
import apiMasterDataService from '@/apiServices/externalApiServices/apiMasterDataService';
import propertyApiService from '@/apiServices/externalApiServices/propertyApiService';
import AppRangeDateFilter from '@/components/AppFormFilter/AppRangeDateFilter/AppRangeDateFillter';
import AppSelectFilter from '@/components/AppFormFilter/AppSelectFilter/AppSelectFilter';
import DataTable from '@/components/DataTable';
import { percentDecreaseIcon, percentIncreaseIcon } from '@/libs/appComponents';
import { appPermissions, roleAdminGod } from '@/libs/appconst';
import { blockKeyEnter, checkPermissonAcion } from '@/libs/helper';
import { PropertyTypeModel } from '@/models/propertyModel/propertyTypeModel';
import useGlobalStore from '@/stores/useGlobalStore';
import { Button, Form } from 'antd';
import { Excel } from 'antd-table-saveas-excel';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import { useTranslations } from 'next-intl';
import { FC, useEffect, useState } from 'react';
import {
  columnExportTop5,
  columnTop5NumberOfRegion,
  columnTopPriceAVGOfRegion,
  columnTopSiceListting,
} from './columns';
import BarChartComponent from './component/BarChartComponent';
import LineChartComponent from './component/LineChartComponent';
import TableDashBoardComponent from './component/TableDashBoardComponent';

dayjs.extend(utc);

const PropertyDashBoard: FC = () => {
  const { userInfo } = useGlobalStore();
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  const [formFilter] = Form.useForm();
  const [formFilterAreaSale] = Form.useForm();
  const [formFilterAreaRent] = Form.useForm();
  const [formFilterAVGSale] = Form.useForm();
  const [formFilterAVGRent] = Form.useForm();
  const [propertyTypes, setPropertyTypes] = useState<PropertyTypeModel[]>([]);
  const [filter, setFilter] = useState<any>({
    fromDate: dayjs().startOf('year').utc().add(7, 'hour').format(),
    toDate: dayjs().utc().add(7, 'hour').format(),
  });
  const [filterAreaSale, setFilterAreaSale] = useState<any>({
    fromDate: dayjs().startOf('year').local().format(),
    toDate: dayjs().local().format(),
    from: 0,
    size: 10,
    // default HCM, Quan 7
    province: '518C73F1-2621-40B8-8373-50458BBEF950',
    districts: ['88B34FC2-F199-4772-B1E7-96E232A84F9C'],
    wards: [],
  });
  const [filterAreaRent, setFilterAreaRent] = useState<any>({
    fromDate: dayjs().startOf('year').local().format(),
    toDate: dayjs().local().format(),
    from: 0,
    size: 10,
    // default HCM, Quan 7
    province: '518C73F1-2621-40B8-8373-50458BBEF950',
    districts: ['88B34FC2-F199-4772-B1E7-96E232A84F9C'],
    wards: [],
  });

  const [filterAVGPriceSale, setFilterAVGPriceSale] = useState<any>({
    fromDate: dayjs().startOf('year').local().format(),
    toDate: dayjs().local().format(),
    from: 0,
    size: 10,
    // default HCM, Quan 7
    province: '518C73F1-2621-40B8-8373-50458BBEF950',
    districts: ['88B34FC2-F199-4772-B1E7-96E232A84F9C'],
    wards: [],
    listingCategories: [],
  });

  const [filterAVGPriceRent, setFilterAVGPriceRent] = useState<any>({
    fromDate: dayjs().startOf('year').local().format(),
    toDate: dayjs().local().format(),
    from: 0,
    size: 10,
    // default HCM, Quan 7
    province: '518C73F1-2621-40B8-8373-50458BBEF950',
    districts: ['88B34FC2-F199-4772-B1E7-96E232A84F9C'],
    wards: [],
    listingCategories: [],
  });

  const [citiesArea, setCitiesArea] = useState<any[]>([]);

  const [districtsAreaSale, setDistrictsAreaSale] = useState<any[]>([]);
  const [districtsAreaRent, setDistrictsAreaRent] = useState<any[]>([]);
  const [districtsAVGSale, setDistrictsAVGSale] = useState<any[]>([]);
  const [districtsAVGRent, setDistrictsAVGRent] = useState<any[]>([]);

  const [wardsAreaSale, setWardsAreaSale] = useState<any[]>([]);
  const [wardsAreaRent, setWardsAreaRent] = useState<any[]>([]);
  const [wardsAVGSale, setWardsAVGSale] = useState<any[]>([]);
  const [wardsAVGRent, setWardsAVGRent] = useState<any[]>([]);

  const [propertyWithType, setPropertyWithType] = useState<any[]>([]);

  const [listingForCategoryEveryMonth, setListingForCategoryEveryMonth] = useState<any[]>([]);
  const [listReportListingForCategory, setListReportListingForCategory] = useState<any[]>([]);
  const [listReportListingAVGSaleForCategory, setListReportListingAVGSaleForCategory] = useState<
    any[]
  >([]);
  const [listReportListingAVGRentForCategory, setListReportListingAVGRentForCategory] = useState<
    any[]
  >([]);
  const [topListtingSale, setTopListingSale] = useState<any>({
    items: [],
    total: 0,
  });
  const [topListtingRent, setTopListingRent] = useState<any>({
    items: [],
    total: 0,
  });

  const [listReportListingAreaSale, setListReportListingAreaSale] = useState<any>();
  const [currentPageAreaSale, setCurrentPageAreaSale] = useState<number>(
    Math.floor(filterAreaSale.from / filterAreaSale.size) + 1,
  );
  const [listReportListingAreaRent, setListReportListingAreaRent] = useState<any>();
  const [currentPageAreaRent, setCurrentPageAreaRent] = useState<number>(
    Math.floor(filterAreaRent.from / filterAreaRent.size) + 1,
  );

  const [listReportListingAVGPriceSale, setListReportListingAVGPriceSale] = useState<any>();
  const [currentPageAVGPriceSale, setCurrentPageAVGPriceSale] = useState<number>(
    Math.floor(filterAVGPriceSale.from / filterAVGPriceSale.size) + 1,
  );

  const [listReportListingAVGPriceRent, setListReportListingAVGPriceRent] = useState<any>();
  const [currentPageAVGPriceRent, setCurrentPageAVGPriceRent] = useState<number>(
    Math.floor(filterAVGPriceRent.from / filterAVGPriceRent.size) + 1,
  );
  const initData = (filter) => {
    formFilter.setFieldsValue({
      createAt: [dayjs(filter.fromDate), dayjs(filter.toDate)],
    });
    reportListingForType(filter);
    reportListingForCategoryEveryMonth(filter);
    reportListingForCategory(filter);
    reportListingAveragePriceSale(filter);
    reportListingAveragePriceRent(filter);
    getReportGetTopListingSale(filter);
    getReportGetTopListingRent(filter);
    reportListingAreaSale({
      ...filterAreaSale,
      from: 0,
      fromDate: filter.fromDate,
      toDate: filter.toDate,
    });
    reportListingAreaRent({
      ...filterAreaRent,
      from: 0,
      fromDate: filter.fromDate,
      toDate: filter.toDate,
    });
    reportListingAreaAVGPriceSale({
      ...filterAVGPriceSale,
      from: 0,
      fromDate: filter.fromDate,
      toDate: filter.toDate,
    });
    reportListingAreaAVGPriceRent({
      ...filterAVGPriceRent,
      from: 0,
      fromDate: filter.fromDate,
      toDate: filter.toDate,
    });
  };

  const columnTop5 = columnTopSiceListting();
  const columntop5Area = columnTop5NumberOfRegion();
  const columntopAVGAre = columnTopPriceAVGOfRegion();

  useEffect(() => {
    getMetaData();

    formFilterAreaSale.setFieldsValue({
      province: '518C73F1-2621-40B8-8373-50458BBEF950',
      districts: '88B34FC2-F199-4772-B1E7-96E232A84F9C',
    });
    formFilterAreaRent.setFieldsValue({
      province: '518C73F1-2621-40B8-8373-50458BBEF950',
      districts: '88B34FC2-F199-4772-B1E7-96E232A84F9C',
    });
    formFilterAVGSale.setFieldsValue({
      province: '518C73F1-2621-40B8-8373-50458BBEF950',
      districts: '88B34FC2-F199-4772-B1E7-96E232A84F9C',
    });
    formFilterAVGRent.setFieldsValue({
      province: '518C73F1-2621-40B8-8373-50458BBEF950',
      districts: '88B34FC2-F199-4772-B1E7-96E232A84F9C',
    });
  }, []);

  const getMetaData = () => {
    // default init HCM, Quan 7
    apiMasterDataService.getProvinceV2().then((x) => setCitiesArea(x));
    apiMasterDataService.getDistrictV2('518C73F1-2621-40B8-8373-50458BBEF950').then((x) => {
      setDistrictsAreaSale(x),
        setDistrictsAreaRent(x),
        setDistrictsAVGSale(x),
        setDistrictsAVGRent(x);
    });
    apiMasterDataService.getWards('88B34FC2-F199-4772-B1E7-96E232A84F9C').then((x) => {
      setWardsAreaSale(x), setWardsAreaRent(x), setWardsAVGSale(x), setWardsAVGRent(x);
    });
    propertyApiService.getPropertyTypes().then((x) => setPropertyTypes(x?.data || []));
  };

  useEffect(() => {
    initData(filter);
  }, [filter]);

  const onFilterFromTo = (values) => {
    if (values !== null) {
      setFilter({
        fromDate: values[0],
        toDate: values[1],
      });
      formFilter.setFieldsValue({
        createAt: values,
      });
    } else {
      setFilter({
        fromDate: dayjs().startOf('year').utc().add(7, 'hour').format(),
        toDate: dayjs().utc().add(7, 'hour').format(),
      });
      formFilter.setFieldsValue({
        createAt: [dayjs().startOf('year').add(7, 'hour'), dayjs().utc().add(7, 'hour')],
      });
    }
  };

  const reportListingForType = async (filter) => {
    const res = await apiDashBoardService.reportListingForType(filter);
    const data = res.data ?? [];
    setPropertyWithType(data);
  };

  const reportListingForCategoryEveryMonth = async (filter) => {
    const res = await apiDashBoardService.reportListingForCategoryEveryMonth(filter);
    const data = res.data ?? [];
    setListingForCategoryEveryMonth(data);
  };

  const reportListingForCategory = async (filter) => {
    const res = await apiDashBoardService.reportListingForCategory(filter);
    const data = res.data ?? [];
    setListReportListingForCategory(data);
  };

  const reportListingAveragePriceSale = async (filter) => {
    const res = await apiDashBoardService.reportListingAveragePriceSale(filter);
    const data = res.data ?? [];
    setListReportListingAVGSaleForCategory(data);
  };

  const reportListingAveragePriceRent = async (filter) => {
    const res = await apiDashBoardService.reportListingAveragePriceRent(filter);
    const data = res.data ?? [];
    setListReportListingAVGRentForCategory(data);
  };

  const getReportGetTopListingSale = async (filter) => {
    const res = await apiDashBoardService.reportGetTopListingSale(filter);
    const data = res.data;

    const dataTable = {
      items: data ?? [],
      total: data?.length ?? 0,
    };
    setTopListingSale(dataTable);
  };

  const getReportGetTopListingRent = async (filter) => {
    const res = await apiDashBoardService.reportGetTopListingRent(filter);
    const data = res.data;

    const dataTable = {
      items: data ?? [],
      total: data?.length ?? 0,
    };
    setTopListingRent(dataTable);
  };

  const reportListingAreaSale = async (filterAreaSale) => {
    // setFilterAreaSale({
    //   ...filterAreaSale,
    //   fromDate: filter.fromDate,
    //   toDate: filter.toDate,
    // });

    const res = await apiDashBoardService.reportListingAreaSale(filterAreaSale);
    const data = res.data;

    setListReportListingAreaSale(data);
  };

  const reportListingAreaRent = async (filterAreaRent) => {
    // setFilterAreaRent({
    //   ...filterAreaRent,
    //   fromDate: filter.fromDate,
    //   toDate: filter.toDate,
    // });

    const res = await apiDashBoardService.reportListingAreaRent(filterAreaRent);
    const data = res.data;

    setListReportListingAreaRent(data);
  };

  const reportListingAreaAVGPriceSale = async (filterAVGPriceSale) => {
    // setFilterAVGPriceSale({
    //   ...filterAVGPriceSale,
    //   fromDate: filter.fromDate,
    //   toDate: filter.toDate,
    // });
    const res = await apiDashBoardService.reportListingAreaAVGPriceSale(filterAVGPriceSale);
    const data = res.data;

    setListReportListingAVGPriceSale(data);
  };

  const reportListingAreaAVGPriceRent = async (filterAVGPriceRent) => {
    // setFilterAVGPriceRent({
    //   ...filterAVGPriceRent,
    //   fromDate: filter.fromDate,
    //   toDate: filter.toDate,
    // });

    const res = await apiDashBoardService.reportListingAreaAVGPriceRent(filterAVGPriceRent);
    const data = res.data;

    setListReportListingAVGPriceRent(data);
  };

  const handleChangeCitiFilter = async (value, form) => {
    if (value) {
      const dataDistrict = await apiMasterDataService.getDistrictV2(value);
      const pageFrom = 0;
      switch (form) {
        case 'formFilterAreaSale':
          setDistrictsAreaSale(dataDistrict);
          setFilterAreaSale({
            ...filterAreaSale,
            from: pageFrom,
            province: value,
            districts: [],
            wards: [],
          });
          formFilterAreaSale.setFieldsValue({
            districts: undefined,
            wards: [],
          });
          reportListingAreaSale({
            ...filterAreaSale,
            from: pageFrom,
            province: value,
            districts: [],
            wards: [],
          });
          formFilterAreaSale;
          setCurrentPageAreaSale(Math.floor(pageFrom / filterAreaSale.size) + 1);
          break;
        case 'formFilterAreaRent':
          setDistrictsAreaRent(dataDistrict);
          setFilterAreaRent({
            ...filterAreaRent,
            from: pageFrom,
            province: value,
            districts: [],
            wards: [],
          });
          reportListingAreaRent({
            ...filterAreaRent,
            from: pageFrom,
            province: value,
            districts: [],
            wards: [],
          });
          formFilterAreaRent.setFieldsValue({
            districts: undefined,
            wards: [],
          });
          setCurrentPageAreaRent(Math.floor(pageFrom / filterAreaRent.size) + 1);
          break;
        case 'formFilterAVGSale':
          setDistrictsAVGSale(dataDistrict);
          setFilterAVGPriceSale({
            ...filterAVGPriceSale,
            from: pageFrom,
            province: value,
            districts: [],
            wards: [],
          });
          reportListingAreaAVGPriceSale({
            ...filterAVGPriceSale,
            from: pageFrom,
            province: value,
            districts: [],
            wards: [],
          });
          formFilterAVGSale.setFieldsValue({
            districts: undefined,
            wards: [],
          });
          setCurrentPageAVGPriceSale(Math.floor(pageFrom / filterAVGPriceSale.size) + 1);

          break;
        case 'formFilterAVGRent':
          setDistrictsAVGRent(dataDistrict);
          setFilterAVGPriceRent({
            ...filterAVGPriceRent,
            from: pageFrom,
            province: value,
            districts: [],
            wards: [],
          });
          reportListingAreaAVGPriceRent({
            ...filterAVGPriceRent,
            from: pageFrom,
            province: value,
            districts: [],
            wards: [],
          });
          formFilterAVGRent.setFieldsValue({
            districts: undefined,
            wards: [],
          });
          setCurrentPageAVGPriceRent(Math.floor(pageFrom / filterAVGPriceRent.size) + 1);
          break;

        default:
        // code block
      }
    } else {
      const pageFrom = 0;
      switch (form) {
        case 'formFilterAreaSale':
          setDistrictsAreaSale([]);

          setFilterAreaSale({
            ...filterAreaSale,
            from: pageFrom,
            province: [],
            districts: [],
            wards: [],
          });
          reportListingAreaSale({
            ...filterAreaSale,
            from: pageFrom,
            province: [],
            districts: [],
            wards: [],
          });
          setCurrentPageAreaSale(Math.floor(pageFrom / filterAreaSale.size) + 1);
          break;
        case 'formFilterAreaRent':
          setDistrictsAreaRent([]);
          setFilterAreaRent({
            ...filterAreaRent,
            from: pageFrom,
            province: [],
            districts: [],
            wards: [],
          });
          reportListingAreaRent({
            ...filterAreaRent,
            from: pageFrom,
            province: [],
            districts: [],
            wards: [],
          });
          setCurrentPageAreaRent(Math.floor(pageFrom / filterAreaRent.size) + 1);
          break;
        case 'formFilterAVGSale':
          setDistrictsAVGSale([]);
          setFilterAVGPriceSale({
            ...filterAVGPriceSale,
            from: pageFrom,
            province: [],
            districts: [],
            wards: [],
          });
          reportListingAreaAVGPriceSale({
            ...filterAVGPriceSale,
            from: pageFrom,
            province: [],
            districts: [],
            wards: [],
          });
          setCurrentPageAVGPriceSale(Math.floor(pageFrom / filterAVGPriceSale.size) + 1);
          break;
        case 'formFilterAVGRent':
          setDistrictsAVGRent([]);
          setFilterAVGPriceRent({
            ...filterAVGPriceRent,
            from: pageFrom,
            province: [],
            districts: [],
            wards: [],
          });
          reportListingAreaAVGPriceRent({
            ...filterAVGPriceRent,
            from: pageFrom,
            province: [],
            districts: [],
            wards: [],
          });
          setCurrentPageAVGPriceRent(Math.floor(pageFrom / filterAVGPriceRent.size) + 1);
          break;

        default:
        // code block
      }
    }
  };

  const handleChangeDistrictFilter = async (value, form) => {
    if (value) {
      let dataWard = await apiMasterDataService.getWards(value);
      const pageFrom = 0;
      switch (form) {
        case 'formFilterAreaSale':
          formFilterAreaSale.setFieldsValue({ wards: [] });
          setWardsAreaSale(dataWard);

          setFilterAreaSale({
            ...filterAreaSale,
            from: pageFrom,
            districts: [value],
          });
          reportListingAreaSale({
            ...filterAreaSale,
            from: pageFrom,
            districts: [value],
          });

          setCurrentPageAreaSale(Math.floor(pageFrom / filterAreaSale.size) + 1);
          break;
        case 'formFilterAreaRent':
          formFilterAreaRent.setFieldsValue({ wards: [] });
          setWardsAreaRent(dataWard);
          setFilterAreaRent({
            ...filterAreaRent,
            from: pageFrom,
            districts: [value],
          });
          reportListingAreaRent({
            ...filterAreaRent,
            from: pageFrom,
            districts: [value],
          });
          setCurrentPageAreaRent(Math.floor(pageFrom / filterAreaRent.size) + 1);
          break;
        case 'formFilterAVGSale':
          formFilterAVGSale.setFieldsValue({ wards: [] });
          setWardsAVGSale(dataWard);
          setFilterAVGPriceSale({
            ...filterAVGPriceSale,
            from: pageFrom,
            districts: [value],
          });
          reportListingAreaAVGPriceSale({
            ...filterAVGPriceSale,
            from: pageFrom,
            districts: [value],
          });
          setCurrentPageAVGPriceSale(Math.floor(pageFrom / filterAVGPriceSale.size) + 1);
          break;
        case 'formFilterAVGRent':
          formFilterAVGRent.setFieldsValue({ wards: [] });
          setWardsAVGRent(dataWard);
          setFilterAVGPriceRent({
            ...filterAVGPriceRent,
            from: pageFrom,
            districts: [value],
          });
          reportListingAreaAVGPriceRent({
            ...filterAVGPriceRent,
            from: pageFrom,
            districts: [value],
          });
          setCurrentPageAVGPriceRent(Math.floor(pageFrom / filterAVGPriceRent.size) + 1);
          break;
        default:
        // code block
      }
    } else {
      const pageFrom = 0;
      switch (form) {
        case 'formFilterAreaSale':
          formFilterAreaSale.setFieldsValue({ wards: [] });
          setWardsAreaSale([]);
          setFilterAreaSale({
            ...filterAreaSale,
            from: pageFrom,
            districts: [],
          });
          reportListingAreaSale({
            ...filterAreaSale,
            from: pageFrom,
            districts: [],
          });
          setCurrentPageAreaSale(Math.floor(pageFrom / filterAreaSale.size) + 1);
          break;
        case 'formFilterAreaRent':
          formFilterAreaRent.setFieldsValue({ wards: [] });
          setWardsAreaRent([]);
          setFilterAreaRent({
            ...filterAreaRent,
            from: pageFrom,
            districts: [],
          });
          reportListingAreaRent({
            ...filterAreaRent,
            from: pageFrom,
            districts: [],
          });
          setCurrentPageAreaRent(Math.floor(pageFrom / filterAreaRent.size) + 1);
          break;
        case 'formFilterAVGSale':
          formFilterAVGSale.setFieldsValue({ wards: [] });
          setWardsAVGSale([]);
          setFilterAVGPriceSale({
            ...filterAVGPriceSale,
            from: pageFrom,
            districts: [],
          });
          reportListingAreaAVGPriceSale({
            ...filterAVGPriceSale,
            from: pageFrom,
            districts: [],
          });
          setCurrentPageAVGPriceSale(Math.floor(pageFrom / filterAVGPriceSale.size) + 1);
          break;
        case 'formFilterAVGRent':
          formFilterAVGRent.setFieldsValue({ wards: [] });
          setWardsAVGRent([]);
          setFilterAVGPriceRent({
            ...filterAVGPriceRent,
            from: pageFrom,
            districts: [],
          });
          reportListingAreaAVGPriceRent({
            ...filterAVGPriceRent,
            from: pageFrom,
            districts: [],
          });
          setCurrentPageAVGPriceRent(Math.floor(pageFrom / filterAVGPriceRent.size) + 1);
          break;
        default:
        // code block
      }
    }
  };

  const handleChangeWardFilter = async (values, form) => {
    if (values.length > 0) {
      const pageFrom = 0;
      switch (form) {
        case 'formFilterAreaSale':
          setFilterAreaSale({
            ...filterAreaSale,
            from: pageFrom,
            wards: values,
          });
          setCurrentPageAreaSale(Math.floor(pageFrom / filterAreaSale.size) + 1);
          reportListingAreaSale({
            ...filterAreaSale,
            from: pageFrom,
            wards: values,
          });
          setCurrentPageAreaSale(Math.floor(pageFrom / filterAreaSale.size) + 1);
          break;
        case 'formFilterAreaRent':
          setFilterAreaRent({
            ...filterAreaRent,
            from: pageFrom,
            wards: values,
          });
          reportListingAreaRent({
            ...filterAreaRent,
            from: pageFrom,
            wards: values,
          });
          setCurrentPageAreaRent(Math.floor(pageFrom / filterAreaRent.size) + 1);
          break;
        case 'formFilterAVGSale':
          setFilterAVGPriceSale({
            ...filterAVGPriceSale,
            from: pageFrom,
            wards: values,
          });
          reportListingAreaAVGPriceSale({
            ...filterAVGPriceSale,
            from: pageFrom,
            wards: values,
          });
          setCurrentPageAVGPriceSale(Math.floor(pageFrom / filterAVGPriceSale.size) + 1);
          break;
        case 'formFilterAVGRent':
          setFilterAVGPriceRent({
            ...filterAVGPriceRent,
            from: pageFrom,
            wards: values,
          });
          reportListingAreaAVGPriceRent({
            ...filterAVGPriceRent,
            from: pageFrom,
            wards: values,
          });
          setCurrentPageAVGPriceRent(Math.floor(pageFrom / filterAVGPriceRent.size) + 1);
          break;
        default:
        // code block
      }
    } else {
      const pageFrom = 0;
      switch (form) {
        case 'formFilterAreaSale':
          setFilterAreaSale({
            ...filterAreaSale,
            from: pageFrom,
            wards: [],
          });
          reportListingAreaSale({
            ...filterAreaSale,
            from: pageFrom,
            wards: [],
          });
          setCurrentPageAreaSale(Math.floor(pageFrom / filterAreaSale.size) + 1);
          break;
        case 'formFilterAreaRent':
          setFilterAreaRent({
            ...filterAreaRent,
            from: pageFrom,
            wards: [],
          });
          reportListingAreaRent({
            ...filterAreaRent,
            from: pageFrom,
            wards: [],
          });
          setCurrentPageAreaRent(Math.floor(pageFrom / filterAreaRent.size) + 1);
          break;
        case 'formFilterAVGSale':
          setFilterAVGPriceSale({
            ...filterAVGPriceSale,
            from: pageFrom,
            wards: [],
          });
          reportListingAreaAVGPriceSale({
            ...filterAVGPriceSale,
            from: pageFrom,
            wards: [],
          });
          setCurrentPageAVGPriceSale(Math.floor(pageFrom / filterAVGPriceSale.size) + 1);
          break;
        case 'formFilterAVGRent':
          setFilterAVGPriceRent({
            ...filterAVGPriceRent,
            from: pageFrom,
            wards: [],
          });
          reportListingAreaAVGPriceRent({
            ...filterAVGPriceRent,
            from: pageFrom,
            wards: [],
          });
          setCurrentPageAVGPriceRent(Math.floor(pageFrom / filterAVGPriceRent.size) + 1);
          break;
        default:
        // code block
      }
    }
  };

  const handleChangelistingCategoryFilter = async (values, form) => {
    if (values.length > 0) {
      const pageFrom = 0;
      switch (form) {
        case 'formFilterAVGSale':
          setFilterAVGPriceSale({
            ...filterAVGPriceSale,
            from: pageFrom,
            listingCategories: values,
          });
          reportListingAreaAVGPriceSale({
            ...filterAVGPriceSale,
            from: pageFrom,
            listingCategories: values,
          });
          setCurrentPageAVGPriceSale(Math.floor(pageFrom / filterAVGPriceSale.size) + 1);
          break;
        case 'formFilterAVGRent':
          setFilterAVGPriceRent({
            ...filterAVGPriceRent,
            from: pageFrom,
            listingCategories: values,
          });
          reportListingAreaAVGPriceRent({
            ...filterAVGPriceRent,
            from: pageFrom,
            listingCategories: values,
          });
          setCurrentPageAVGPriceRent(Math.floor(pageFrom / filterAVGPriceRent.size) + 1);
          break;
        default:
        // code block
      }
    } else {
      const pageFrom = 0;
      switch (form) {
        case 'formFilterAVGSale':
          setFilterAVGPriceSale({
            ...filterAVGPriceSale,
            from: pageFrom,
            listingCategories: [],
          });
          reportListingAreaAVGPriceSale({
            ...filterAVGPriceSale,
            from: pageFrom,
            listingCategories: [],
          });
          setCurrentPageAVGPriceSale(Math.floor(pageFrom / filterAVGPriceSale.size) + 1);
          break;
        case 'formFilterAVGRent':
          setFilterAVGPriceRent({
            ...filterAVGPriceRent,
            from: pageFrom,
            listingCategories: [],
          });
          reportListingAreaAVGPriceRent({
            ...filterAVGPriceRent,
            from: pageFrom,
            listingCategories: [],
          });
          setCurrentPageAVGPriceRent(Math.floor(pageFrom / filterAVGPriceRent.size) + 1);
          break;
        default:
        // code block
      }
    }
  };

  const handleExportExcel = async (tableName: string) => {
    const excel = new Excel();
    switch (tableName) {
      case 'TableTop5Sale':
        const columnExportTop5Sale = columnExportTop5(t);

        excel
          .addSheet('test')
          .addColumns(columnExportTop5Sale)
          .addDataSource(topListtingSale.items, {
            str2Percent: true,
          })
          .saveAs(`Excel_top5_sale_${dayjs().format('DD/MM/YYYY')}.xlsx`);
        break;

      case 'TableTop5Rent':
        const columnExportTop5Rent = columnExportTop5(t);

        excel
          .addSheet('test')
          .addColumns(columnExportTop5Rent)
          .addDataSource(topListtingRent.items, {
            str2Percent: true,
          })
          .saveAs(`Excel_top_5_rent_${dayjs().format('DD/MM/YYYY')}.xlsx`);
        break;

      case 'TableAreaSale':
        await apiDashBoardService.exportListingAreaSale(filterAreaSale);
        break;
      case 'TableAreaRent':
        await apiDashBoardService.exportListingAreaRent(filterAreaRent);
        break;
      case 'TableAVGSale':
        await apiDashBoardService.exportListingAVGSale(filterAreaRent);
        break;
      case 'TableAVGRent':
        await apiDashBoardService.exportListingAVGRent(filterAreaRent);
        break;
      default:
      // code block
    }
  };

  // phan trang
  const handleChangePage = (value, tableName: string) => {
    switch (tableName) {
      case 'formFilterAreaSale':
        filterAreaSale.from = (value.current - 1) * filterAreaSale.size!;
        setCurrentPageAreaSale(Math.floor(filterAreaSale.from / filterAreaSale.size) + 1);
        reportListingAveragePriceSale({ ...filterAreaSale });
        break;
      case 'formFilterAreaRent':
        filterAreaRent.from = (value.current - 1) * filterAreaRent.size!;
        setCurrentPageAreaRent(Math.floor(filterAreaRent.from / filterAreaRent.size) + 1);
        reportListingAveragePriceRent({ ...filterAreaRent });
        break;
      case 'formFilterAVGSale':
        filterAVGPriceSale.from = (value.current - 1) * filterAVGPriceSale.size!;
        setCurrentPageAVGPriceSale(
          Math.floor(filterAVGPriceSale.from / filterAVGPriceSale.size) + 1,
        );
        reportListingAreaAVGPriceSale({
          ...filterAVGPriceSale,
        });
        break;
      case 'formFilterAVGRent':
        // code block
        filterAVGPriceRent.from = (value.current - 1) * filterAVGPriceRent.size!;
        setCurrentPageAVGPriceRent(
          Math.floor(filterAVGPriceRent.from / filterAVGPriceRent.size) + 1,
        );
        reportListingAreaAVGPriceRent({
          ...filterAVGPriceRent,
        });
        break;

      default:
      // code block
    }
  };

  return (
    <>
      <div className="w-full">
        <div className="grid grid-cols-12">
          <div className="col-span-4">
            <Form
              form={formFilter}
              layout="horizontal"
              size="middle"
              onKeyDown={(e) => (blockKeyEnter(e) ? e.preventDefault() : undefined)}
            >
              <AppRangeDateFilter
                name="createAt"
                label={t('EcomDashBoardPropertyCreateAt')}
                onChange={(value) => {
                  if (value && value[0] !== null && value[1] !== null) {
                    onFilterFromTo(value);
                  }
                  if (value === null) {
                    onFilterFromTo(value);
                  }
                }}
              />
            </Form>
          </div>
        </div>

        <div className="grid h-fit grid-cols-12 gap-x-3">
          <div className="col-span-4">
            <div className="grid grid-cols-4 gap-x-3">
              <div className="col-span-4 my-3">
                <label className="text-lg font-semibold text-portal-textTitleChart">
                  {t('EcomDashBoardPropertNumberPropertyWithType')}
                </label>
              </div>
              {propertyWithType?.map((item) => (
                <div className="col-span-2 rounded-xl bg-[#FFD14B] p-2">
                  <div className="text-sm font-medium">{item?.type}</div>
                  <div className="py-1 text-3xl">{item?.total}</div>
                  <div className="flex items-center text-[#2FA84F]">
                    {item?.percentIncrease > 0 ? (
                      <span className="flex items-center text-xs text-[#2FA84F]">
                        {percentIncreaseIcon}-{item?.percentIncrease}%
                      </span>
                    ) : (
                      <span className="flex items-center space-x-2 text-xs text-[#FFD14B]">
                        {percentDecreaseIcon}-{item?.percentIncrease}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-8">
            <BarChartComponent dataBeforConvert={listingForCategoryEveryMonth} />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-12 gap-x-3">
          <div className="col-span-12 py-2">
            <label className="text-lg font-semibold text-portal-textTitleChart">
              {t('EcomDashBoardPropertNumberProperty')}
            </label>
          </div>
          <div className="col-span-12 flex">
            {listReportListingForCategory?.map((item) => (
              <div className="mr-2 w-[20%] items-center rounded-xl bg-[#FEF4EC] p-2">
                <div className="text-xs font-medium">{item?.listingCategoryName}</div>
                <div className="py-1 text-xl">{item?.total}</div>
                <div className="flex w-full items-center">
                  {item?.percentIncrease >= 0 ? (
                    <span className="flex items-center text-xs text-[#2FA84F]">
                      {percentIncreaseIcon}-{item?.percentIncrease}%
                    </span>
                  ) : (
                    <span className="flex items-center space-x-2 text-xs text-[#FFD14B]">
                      {percentDecreaseIcon}-{item?.percentIncrease}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 grid h-fit grid-cols-12 gap-x-3">
          <div className="col-span-12">
            <LineChartComponent
              dataBeforConvert={listReportListingAVGSaleForCategory}
              title={t('EcomDashBoardPropertNumberPropertyWithAVGSaleProductCategory')}
            />
          </div>
        </div>
        <div className="mt-5 grid h-fit grid-cols-12 gap-x-3">
          <div className="col-span-12">
            <LineChartComponent
              dataBeforConvert={listReportListingAVGRentForCategory}
              title={t('EcomDashBoardPropertNumberPropertyWithAVGRentProductCategory')}
            />
          </div>
        </div>

        <div className="mt-5 grid h-fit grid-cols-12 gap-x-3">
          <div className="col-span-12">
            <label className="text-lg font-semibold text-portal-textTitleChart">
              {t('EcomDashBoardPropertNumberPropertySaleWithTop5')}
            </label>
          </div>
          <div className="col-span-12">
            <TableDashBoardComponent
              columns={columnTop5}
              data={topListtingSale}
              exportData={() => handleExportExcel('TableTop5Sale')}
              permissionExport={checkPermissonAcion(userInfo?.accesses, [
                roleAdminGod,
                appPermissions.portal_dashboard.export,
                appPermissions.portal_dashboard.admin,
              ])}
            />
          </div>
        </div>

        <div className="mt-5 grid h-fit grid-cols-12 gap-x-3">
          <div className="col-span-12">
            <label className="text-lg font-semibold text-portal-textTitleChart">
              {t('EcomDashBoardPropertNumberPropertyRentWithTop5')}
            </label>
          </div>
          <div className="col-span-12">
            <TableDashBoardComponent
              columns={columnTop5}
              data={topListtingRent}
              exportData={() => handleExportExcel('TableTop5Rent')}
              permissionExport={checkPermissonAcion(userInfo?.accesses, [
                roleAdminGod,
                appPermissions.portal_dashboard.export,
                appPermissions.portal_dashboard.admin,
              ])}
            />
          </div>
        </div>

        <div className="mt-5 grid h-fit grid-cols-12 gap-x-3">
          <div className="col-span-12">
            <label className="text-lg font-semibold text-portal-textTitleChart">
              {t('EcomDashBoardPropertNumberPropertySaleWithTop5Area')}
            </label>
          </div>
          <div className="col-span-12">
            <Form
              form={formFilterAreaSale}
              layout="horizontal"
              size="middle"
              onKeyDown={(e) => (blockKeyEnter(e) ? e.preventDefault() : undefined)}
            >
              <div className="grid grid-cols-12 items-end gap-x-3">
                <div className="col-span-3">
                  <AppSelectFilter
                    allowClear={false}
                    name="province"
                    label={t('EcomPropertyListingDetailPageLocationCityProvince')}
                    options={citiesArea?.map((x) => ({
                      value: x.provinceID,
                      label: x.listProvinceName,
                      id: x.provinceID,
                    }))}
                    onChange={(value) => handleChangeCitiFilter(value, 'formFilterAreaSale')}
                    placeholder={t('EcomPropertyListingPageSearchBarAll')}
                  />
                </div>
                <div className="col-span-3">
                  <AppSelectFilter
                    name="districts"
                    label={t('EcomPropertyListingDetailPageLocationDistrict')}
                    options={districtsAreaSale?.map((x) => ({
                      value: x.listDistrictID,
                      label: x.nameDisplay,
                      id: x.listDistrictID,
                    }))}
                    onChange={(value) => handleChangeDistrictFilter(value, 'formFilterAreaSale')}
                    placeholder={t('EcomPropertyListingPageSearchBarAll')}
                  />
                </div>
                <div className="col-span-3">
                  <AppSelectFilter
                    name="wards"
                    isMultiple={true}
                    label={t('EcomPropertyListingDetailPageLocationWardCommune')}
                    onChange={(value) => handleChangeWardFilter(value, 'formFilterAreaSale')}
                    options={wardsAreaSale?.map((x) => ({
                      value: x.listWardID,
                      label: x.nameDisplay,
                      id: x.listWardID,
                    }))}
                    placeholder={t('EcomPropertyListingPageSearchBarAll')}
                  />
                </div>
              </div>
            </Form>
          </div>
          <div className="col-span-12 flex justify-end">
            {checkPermissonAcion(userInfo?.accesses, [
              roleAdminGod,
              appPermissions.portal_dashboard.export,
              appPermissions.portal_dashboard.admin,
            ]) && (
              <Button
                className="!bg-portal-primaryMainAdmin !text-white"
                onClick={() => handleExportExcel('TableAreaSale')}
              >
                {comm('ExportExcel')}
              </Button>
            )}
          </div>
          <div className="col-span-12">
            <DataTable
              pagination={{
                current: currentPageAreaSale,
                total: listReportListingAreaSale?.totalRecord ?? 0,
              }}
              onChangePagination={(value) => handleChangePage(value, 'formFilterAreaSale')}
              columns={columntop5Area}
              dataSource={listReportListingAreaSale?.data ?? []}
              pageSize={10}
            />
          </div>
        </div>

        <div className="mt-5 grid h-fit grid-cols-12 gap-x-3">
          <div className="col-span-12">
            <label className="text-lg font-semibold text-portal-textTitleChart">
              {t('EcomDashBoardPropertNumberPropertyRentWithTop5Area')}
            </label>
            <div className="col-span-12">
              <Form
                form={formFilterAreaRent}
                layout="horizontal"
                size="middle"
                onKeyDown={(e) => (blockKeyEnter(e) ? e.preventDefault() : undefined)}
              >
                <div className="grid grid-cols-12 items-end gap-x-3">
                  <div className="col-span-3">
                    <AppSelectFilter
                      allowClear={false}
                      name="province"
                      label={t('EcomPropertyListingDetailPageLocationCityProvince')}
                      options={citiesArea?.map((x) => ({
                        value: x.provinceID,
                        label: x.listProvinceName,
                        id: x.provinceID,
                      }))}
                      onChange={(value) => handleChangeCitiFilter(value, 'formFilterAreaRent')}
                      placeholder={t('EcomPropertyListingPageSearchBarAll')}
                    />
                  </div>
                  <div className="col-span-3">
                    <AppSelectFilter
                      name="districts"
                      label={t('EcomPropertyListingDetailPageLocationDistrict')}
                      options={districtsAreaRent?.map((x) => ({
                        value: x.listDistrictID,
                        label: x.nameDisplay,
                        id: x.listDistrictID,
                      }))}
                      onChange={(value) => handleChangeDistrictFilter(value, 'formFilterAreaRent')}
                      placeholder={t('EcomPropertyListingPageSearchBarAll')}
                    />
                  </div>
                  <div className="col-span-3">
                    <AppSelectFilter
                      name="wards"
                      isMultiple={true}
                      label={t('EcomPropertyListingDetailPageLocationWardCommune')}
                      onChange={(value) => handleChangeWardFilter(value, 'formFilterAreaRent')}
                      options={wardsAreaRent?.map((x) => ({
                        value: x.listWardID,
                        label: x.nameDisplay,
                        id: x.listWardID,
                      }))}
                      placeholder={t('EcomPropertyListingPageSearchBarAll')}
                    />
                  </div>
                </div>
              </Form>
            </div>
          </div>
          <div className="col-span-12 flex justify-end">
            {checkPermissonAcion(userInfo?.accesses, [
              roleAdminGod,
              appPermissions.portal_dashboard.export,
              appPermissions.portal_dashboard.admin,
            ]) && (
              <Button
                className="!bg-portal-primaryMainAdmin !text-white"
                onClick={() => handleExportExcel('TableAreaRent')}
              >
                {comm('ExportExcel')}
              </Button>
            )}
          </div>
          <div className="col-span-12">
            <DataTable
              pagination={{
                current: currentPageAreaRent,
                total: listReportListingAreaRent?.totalRecord ?? 0,
              }}
              onChangePagination={(value) => handleChangePage(value, 'formFilterAreaRent')}
              columns={columntop5Area}
              dataSource={listReportListingAreaRent?.data ?? []}
              pageSize={10}
            />
          </div>
        </div>

        <div className="mt-5 grid h-fit grid-cols-12 gap-x-3">
          <div className="col-span-12">
            <label className="text-lg font-semibold text-portal-textTitleChart">
              {t('EcomDashBoardPropertNumberPropertySaleAVGWithTop5Area')}
            </label>
          </div>
          <div className="col-span-12">
            <Form
              form={formFilterAVGSale}
              layout="horizontal"
              size="middle"
              onKeyDown={(e) => (blockKeyEnter(e) ? e.preventDefault() : undefined)}
            >
              <div className="grid grid-cols-12 items-end gap-x-3">
                <div className="col-span-3">
                  <AppSelectFilter
                    allowClear={false}
                    name="province"
                    label={t('EcomPropertyListingDetailPageLocationCityProvince')}
                    options={citiesArea?.map((x) => ({
                      value: x.provinceID,
                      label: x.listProvinceName,
                      id: x.provinceID,
                    }))}
                    onChange={(value) => handleChangeCitiFilter(value, 'formFilterAVGSale')}
                    placeholder={t('EcomPropertyListingPageSearchBarAll')}
                  />
                </div>
                <div className="col-span-3">
                  <AppSelectFilter
                    name="districts"
                    label={t('EcomPropertyListingDetailPageLocationDistrict')}
                    options={districtsAVGSale?.map((x) => ({
                      value: x.listDistrictID,
                      label: x.nameDisplay,
                      id: x.listDistrictID,
                    }))}
                    onChange={(value) => handleChangeDistrictFilter(value, 'formFilterAVGSale')}
                    placeholder={t('EcomPropertyListingPageSearchBarAll')}
                  />
                </div>
                <div className="col-span-3">
                  <AppSelectFilter
                    name="wards"
                    isMultiple={true}
                    label={t('EcomPropertyListingDetailPageLocationWardCommune')}
                    onChange={(value) => handleChangeWardFilter(value, 'formFilterAVGSale')}
                    options={wardsAVGSale?.map((x) => ({
                      value: x.listWardID,
                      label: x.nameDisplay,
                      id: x.listWardID,
                    }))}
                    placeholder={t('EcomPropertyListingPageSearchBarAll')}
                  />
                </div>
                <div className="col-span-3">
                  <AppSelectFilter
                    name="listingCategories"
                    isMultiple={true}
                    label={t('EcomHomePageBannerPropertyType')}
                    onChange={(value) =>
                      handleChangelistingCategoryFilter(value, 'formFilterAVGSale')
                    }
                    options={propertyTypes.map((x) => ({
                      value: x.id,
                      label: x.name,
                      id: x.id,
                    }))}
                    placeholder={t('EcomPropertyListingPageSearchBarAll')}
                  />
                </div>
              </div>
            </Form>
          </div>
          <div className="col-span-12 flex justify-end">
            {checkPermissonAcion(userInfo?.accesses, [
              roleAdminGod,
              appPermissions.portal_dashboard.export,
              appPermissions.portal_dashboard.admin,
            ]) && (
              <Button
                className="!bg-portal-primaryMainAdmin !text-white"
                onClick={() => handleExportExcel('TableAVGSale')}
              >
                {comm('ExportExcel')}
              </Button>
            )}
          </div>
          <div className="col-span-12">
            <DataTable
              pagination={{
                current: currentPageAVGPriceSale,
                total: listReportListingAVGPriceSale?.totalRecord ?? 0,
              }}
              onChangePagination={(value) => handleChangePage(value, 'formFilterAVGSale')}
              columns={columntopAVGAre}
              dataSource={listReportListingAVGPriceSale?.data ?? []}
              pageSize={10}
            />
          </div>
        </div>

        <div className="mt-5 grid h-fit grid-cols-12 gap-x-3">
          <div className="col-span-12">
            <label className="text-lg font-semibold text-portal-textTitleChart">
              {t('EcomDashBoardPropertNumberPropertyRentAVGWithTop5Area')}
            </label>
          </div>
          <div className="col-span-12">
            <Form
              form={formFilterAVGRent}
              layout="horizontal"
              size="middle"
              onKeyDown={(e) => (blockKeyEnter(e) ? e.preventDefault() : undefined)}
            >
              <div className="grid grid-cols-12 items-end gap-x-3">
                <div className="col-span-3">
                  <AppSelectFilter
                    allowClear={false}
                    name="province"
                    label={t('EcomPropertyListingDetailPageLocationCityProvince')}
                    options={citiesArea?.map((x) => ({
                      value: x.provinceID,
                      label: x.listProvinceName,
                      id: x.provinceID,
                    }))}
                    onChange={(value) => handleChangeCitiFilter(value, 'formFilterAVGRent')}
                    placeholder={t('EcomPropertyListingPageSearchBarAll')}
                  />
                </div>
                <div className="col-span-3">
                  <AppSelectFilter
                    name="districts"
                    label={t('EcomPropertyListingDetailPageLocationDistrict')}
                    options={districtsAVGRent?.map((x) => ({
                      value: x.listDistrictID,
                      label: x.nameDisplay,
                      id: x.listDistrictID,
                    }))}
                    onChange={(value) => handleChangeDistrictFilter(value, 'formFilterAVGRent')}
                    placeholder={t('EcomPropertyListingPageSearchBarAll')}
                  />
                </div>
                <div className="col-span-3">
                  <AppSelectFilter
                    name="wards"
                    isMultiple={true}
                    label={t('EcomPropertyListingDetailPageLocationWardCommune')}
                    onChange={(value) => handleChangeWardFilter(value, 'formFilterAVGRent')}
                    options={wardsAVGRent?.map((x) => ({
                      value: x.listWardID,
                      label: x.nameDisplay,
                      id: x.listWardID,
                    }))}
                    placeholder={t('EcomPropertyListingPageSearchBarAll')}
                  />
                </div>
                <div className="col-span-3">
                  <AppSelectFilter
                    name="listingCategories"
                    isMultiple={true}
                    label={t('EcomHomePageBannerPropertyType')}
                    onChange={(value) =>
                      handleChangelistingCategoryFilter(value, 'formFilterAVGRent')
                    }
                    options={propertyTypes.map((x) => ({
                      value: x.id,
                      label: x.name,
                      id: x.id,
                    }))}
                    placeholder={t('EcomPropertyListingPageSearchBarAll')}
                  />
                </div>
              </div>
            </Form>
          </div>
          <div className="col-span-12 flex justify-end">
            {checkPermissonAcion(userInfo?.accesses, [
              roleAdminGod,
              appPermissions.portal_dashboard.export,
              appPermissions.portal_dashboard.admin,
            ]) && (
              <Button
                className="!bg-portal-primaryMainAdmin !text-white"
                onClick={() => handleExportExcel('TableAVGRent')}
              >
                {comm('ExportExcel')}
              </Button>
            )}
          </div>
          <div className="col-span-12">
            <DataTable
              pagination={{
                current: currentPageAVGPriceRent,
                total: listReportListingAVGPriceRent?.totalRecord ?? 0,
              }}
              onChangePagination={(value) => handleChangePage(value, 'formFilterAVGRent')}
              columns={columntopAVGAre}
              dataSource={listReportListingAVGPriceRent?.data ?? []}
              pageSize={10}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDashBoard;
