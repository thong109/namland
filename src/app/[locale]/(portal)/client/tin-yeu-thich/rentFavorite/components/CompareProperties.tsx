import ButtonBack from '@/components/Button/ButtonBack/ButtonBack';
import NumberFormatPrice from '@/components/NumberFormatPrice/NumberFormatPrice';
import WrapPageScroll from '@/components/WrapPageScoll';
import { activeIcon, inactiveIcon } from '@/libs/appComponents';
import { handOverStatuses, legalStatuses } from '@/libs/appconst';
import { useTranslations } from 'next-intl';

export interface IProps {
  amenities: any[];
  listProperties: any[];
  onClose: () => void;
}

const CompareProperties = ({
  amenities,
  listProperties,
  onClose,
  listProvince,
  listDistrict,
  listWard,
}: any) => {
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');

  const renderAction = () => {
    return (
      <div className="flex justify-end">
        <ButtonBack text={t('goBack')} onClick={onClose} />
      </div>
    );
  };

  return (
    <div className="h-fit w-full bg-transparent px-5">
      <div className="align-items-center mb-4 flex justify-between">
        <div className="align-items-center flex justify-between">
          <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
            {t('EcomFavoritesPageListViewCompareFavorites')}
          </h1>
        </div>
      </div>

      <WrapPageScroll renderActions={renderAction}>
        <table className="flex overflow-x-auto rounded-lg">
          <tr className="w-[25vw] bg-white">
            <th className="my-2 h-40 bg-white"></th>
            <th className="ml-2 flex h-12 items-center bg-portal-backgroud pl-3 text-start text-sm">
              {comm('title')}
            </th>
            <th className="ml-2 flex h-12 items-center bg-white pl-3 text-start text-sm">
              {comm('Rent')}
            </th>
            <th className="ml-2 flex h-12 items-center bg-portal-backgroud pl-3 text-start text-sm">
              {comm('PropertyType')}
            </th>
            <th className="ml-2 flex h-12 items-center bg-white pl-3 text-start text-sm">
              {comm('Address')}
            </th>
            <th className="ml-2 flex h-12 items-center bg-portal-backgroud pl-3 text-start text-sm">
              {comm('City')}
            </th>
            <th className="ml-2 flex h-12 items-center bg-white pl-3 text-start text-sm">
              {comm('District')}
            </th>
            <th className="ml-2 flex h-12 items-center bg-portal-backgroud pl-3 text-start text-sm">
              {comm('Ward')}
            </th>
            <th className="ml-2 flex h-12 items-center bg-white pl-3 text-start text-sm">
              {comm('PropertySize')}
            </th>
            <th className="ml-2 flex h-12 items-center bg-portal-backgroud pl-3 text-start text-sm">
              {comm('Project')}
            </th>
            <th className="ml-2 flex h-12 items-center bg-white pl-3 text-start text-sm">
              {comm('Bedrooms')}
            </th>
            <th className="ml-2 flex h-12 items-center bg-portal-backgroud pl-3 text-start text-sm">
              {comm('Bathrooms')}
            </th>
            <th className="ml-2 flex h-12 items-center bg-white pl-3 text-start text-sm">
              {comm('GeneralFurnitureStatus')}
            </th>
            <th className="ml-2 flex h-12 items-center bg-portal-backgroud pl-3 text-start text-sm">
              {comm('View')}
            </th>
            <th className="ml-2 flex h-12 items-center bg-white pl-3 text-start text-sm">
              {comm('LegalStatus')}
            </th>
            <th className="ml-2 flex h-12 items-center bg-portal-backgroud pl-3 text-start text-sm">
              {comm('HandOverStatus')}
            </th>

            {amenities.map((item, index) => (
              <th
                className={`ml-2 flex h-12 items-center pl-3 text-sm ${
                  index % 2 == 0 ? 'bg-white' : 'bg-portal-backgroud'
                }`}
              >
                {item?.name}
              </th>
            ))}
          </tr>

          {listProperties.map((item, index) => (
            <tr
              key={index}
              className={`w-[25vw] bg-white ${index + 1 == listProperties.length ? 'pr-2' : 'pr-0'}`}
            >
              <td className="my-2 h-40 bg-white">
                <img className="h-40" src={item?.imageThumbnailUrl} />
              </td>
              <td className="flex h-12 items-center bg-portal-backgroud text-sm">
                <label className="line-clamp-2">{item?.title}</label>
              </td>
              <td className="flex h-12 items-center bg-white text-sm">
                <div>
                  <span>
                    <NumberFormatPrice value={item?.priceVnd}></NumberFormatPrice> {t('/mo')}
                  </span>
                  {/* <br />
                  <span className="text-[#696969]">${formatNumber(item?.priceUsd)}</span> */}
                </div>
              </td>
              <td className="flex h-12 items-center bg-portal-backgroud text-sm">{item?.type}</td>
              <td className="flex h-12 items-center bg-white text-sm">
                <label className="line-clamp-2">{item?.location?.formattedAddress}</label>
              </td>
              <td className="flex h-12 items-center bg-portal-backgroud text-sm">
                {
                  listProvince.find(
                    (province: any) => province?.provinceID === item?.location?.province,
                  )?.listProvinceName
                }
              </td>
              <td className="flex h-12 items-center bg-white text-sm">
                {
                  listDistrict.find(
                    (district: any) => district?.listDistrictID === item?.location?.district,
                  )?.nameDisplay
                }
              </td>
              <td className="flex h-12 items-center bg-portal-backgroud text-sm">
                {
                  listWard.find((ward: any) => ward?.listWardID === item?.location?.ward)
                    ?.nameDisplay
                }
              </td>
              <td className="flex h-12 items-center bg-white text-sm">
                {item?.size} m<sup>2</sup>
              </td>
              <td className="flex h-12 items-center bg-portal-backgroud text-sm">
                {item?.projectName}
              </td>
              <td className="flex h-12 items-center bg-white text-sm">{item?.bedrooms}</td>
              <td className="flex h-12 items-center bg-portal-backgroud text-sm">
                {item?.bathrooms}
              </td>
              <td className="h-12 items-center bg-white text-sm">{item?.generalFurnitureStatus}</td>
              <td className="flex h-12 items-center bg-portal-backgroud text-sm">
                {item?.views?.map((item) => item?.name)}
              </td>
              <td className="flex h-12 items-center bg-white text-sm">
                {t(legalStatuses.find((a) => a?.id === item?.legalStatus)?.name)}
              </td>
              <td className="flex h-12 items-center bg-portal-backgroud text-sm">
                {t(handOverStatuses.find((a) => a?.id === item?.handOverStatus)?.name)}
              </td>
              {amenities.map((amenity, index) => (
                <td
                  className={`flex h-12 items-center text-sm ${
                    index % 2 == 0 ? 'bg-white' : 'bg-portal-backgroud'
                  }`}
                >
                  {item.amenities.some((a) => a.id === amenity?.id) ? (
                    <>{activeIcon}</>
                  ) : (
                    <>{inactiveIcon}</>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </table>

        <style scoped>
          {`

tr { display: block; float: left; }
th, td { display: block }

/* border-collapse */
tr>*:not(:first-child) { border-top: 0; }
tr:not(:first-child)>* { border-left:0; }
  `}
        </style>
      </WrapPageScroll>
    </div>
  );
};

export default CompareProperties;
