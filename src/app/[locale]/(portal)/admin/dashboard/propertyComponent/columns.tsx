import { align } from '@/libs/appconst';
import { formatNumber } from '@/libs/helper';
import { useTranslations } from 'next-intl';

export const columnTopSiceListting = () => {
  const t = useTranslations('webLabel');

  const data = [
    {
      title: t('EcomDashBoardListingName'),
      dataIndex: 'listingName',
      key: 'listingName',
      width: '25%',
      align: align.left,
      render: (listingName) => <label>{listingName}</label>,
    },
    {
      title: t('EcomDashBoardProjectName'),
      dataIndex: 'projectName',
      key: 'projectName',
      width: '20%',
      align: align.left,
      render: (projectName) => (
        <label className="line-clamp-4 self-center text-sm">{projectName}</label>
      ),
    },
    {
      title: t('EcomDashBoardUnitCode'),
      dataIndex: 'unitCode',
      key: 'unitCode',
      width: '15%',
      align: align.left,
      render: (unitCode) => <label>{unitCode}</label>,
    },
    {
      title: t('EcomDashBoardListingCategoryName'),
      dataIndex: 'listingCategoryName',
      key: 'listingCategoryName',
      width: '15%',
      align: align.left,
      render: (listingCategoryName) => <label>{listingCategoryName}</label>,
    },
    {
      title: t('EcomDashBoardListingPriceVND'),
      dataIndex: 'priceDecimal',
      key: 'priceDecimal',
      width: '15%',
      align: align.left,
      render: (priceDecimal) => formatNumber(priceDecimal ?? 0),
    },
    {
      title: t('EcomDashBoardListingTotalView'),
      dataIndex: 'totalView',
      key: 'totalView',
      width: '15%',
      align: align.left,
      render: (totalView) => formatNumber(totalView ?? 0),
    },
  ];

  return data;
};

export const columnTop5NumberOfRegion = () => {
  const t = useTranslations('webLabel');

  const data = [
    {
      title: t('EcomDashBoardPropertyProvince'),
      dataIndex: 'location',
      key: 'location',
      width: '20%',
      align: align.left,
      render: (location) => <label>{location?.province}</label>,
    },
    {
      title: t('EcomDashBoardPropertyDistrict'),
      dataIndex: 'location',
      key: 'location',
      width: '20%',
      align: align.left,
      render: (location) => <label>{location?.district}</label>,
    },
    {
      title: t('EcomDashBoardPropertyWard'),
      dataIndex: 'location',
      key: 'location',
      width: '20%',
      align: align.left,
      render: (location) => <label>{location?.ward}</label>,
    },
    {
      title: t('EcomDashBoardPropertyTotal'),
      dataIndex: 'total',
      key: 'total',
      width: '20%',
      align: align.left,
      render: (total) => formatNumber(total ?? 0),
    },
  ];

  return data;
};

export const columnTopPriceAVGOfRegion = () => {
  const t = useTranslations('webLabel');

  const data = [
    {
      title: t('EcomDashBoardPropertyProvince'),
      dataIndex: 'location',
      key: 'location',
      width: '20%',
      align: align.left,
      render: (location) => <label>{location?.province}</label>,
    },
    {
      title: t('EcomDashBoardPropertyDistrict'),
      dataIndex: 'location',
      key: 'location',
      width: '20%',
      align: align.left,
      render: (location) => <label>{location?.district}</label>,
    },
    {
      title: t('EcomDashBoardPropertyWard'),
      dataIndex: 'location',
      key: 'location',
      width: '20%',
      align: align.left,
      render: (location) => <label>{location?.ward}</label>,
    },
    {
      title: t('EcomDashBoardProductType'),
      dataIndex: 'listingCategoryName',
      key: 'listingCategoryName',
      width: '20%',
      align: align.left,
      render: (listingCategoryName) => <label>{listingCategoryName}</label>,
    },

    {
      title: t('EcomDashBoardPropertyPriceAVG'),
      dataIndex: 'total',
      key: 'total',
      width: '20%',
      align: align.left,
      render: (total) => formatNumber(total ?? 0),
    },
  ];

  return data;
};

export const columnExportTop5 = (t: any) => {
  const data = [
    {
      title: t('EcomDashBoardListingName'),
      dataIndex: 'listingName',
      key: 'listingName',
    },
    {
      title: t('EcomDashBoardProjectName'),
      dataIndex: 'projectName',
      key: 'projectName',
    },
    {
      title: t('EcomDashBoardUnitCode'),
      dataIndex: 'unitCode',
      key: 'unitCode',
    },
    {
      title: t('EcomDashBoardListingCategoryName'),
      dataIndex: 'listingCategoryName',
      key: 'listingCategoryName',
    },
    {
      title: t('EcomDashBoardListingPriceVND'),
      dataIndex: 'priceDecimal',
      key: 'priceDecimal',
    },
    {
      title: t('EcomDashBoardListingTotalView'),
      dataIndex: 'totalView',
      key: 'totalView',
    },
  ];

  return data;
};
