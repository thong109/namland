import ButtonBack from '@/components/Button/ButtonBack/ButtonBack';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import WrapPageScroll from '@/components/WrapPageScoll';
import { activeIcon, inactiveIcon } from '@/libs/appComponents';
import { legalStatuses } from '@/libs/appconst';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

export interface IProps {
  amenities: any[];
  listProperties: any[];
  visible: boolean;
  onClose: () => void;
}

const CompareProperties = ({ amenities, listProperties, visible, onClose }: any) => {
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  useEffect(() => {}, [visible]);

  const renderAction = () => {
    return (
      <div>
        <ButtonBack text={t('goBack')} onClick={onClose} />

        <ButtonPrimary text={t('save')} onClick={() => console.log('in ..')} className="ml-1" />
      </div>
    );
  };
  return (
    <div className="h-fit w-full bg-transparent px-5">
      <div className="align-items-center mb-4 mt-7 flex justify-between">
        <div className="align-items-center mt-7 flex justify-between">
          <h1 className="text-3xl font-semibold text-portal-primaryMainAdmin">
            {t('EcomFavoritesPageListViewCompareFavorites')}
          </h1>
        </div>
      </div>

      <WrapPageScroll renderActions={renderAction}>
        <table className="overflow-x-auto rounded-lg px-2">
          <tr className="w-[25%] bg-white">
            <th className="my-2 h-40 bg-white"></th>
            <th className="ml-2 flex h-12 items-center bg-portal-backgroud pl-3 text-start text-sm">
              {comm('title')}
            </th>
            <th className="ml-2 flex h-12 items-center bg-white pl-3 text-start text-sm">
              {comm('PropertyType')}
            </th>
            <th className="ml-2 flex h-12 items-center bg-portal-backgroud pl-3 text-start text-sm">
              {comm('Address')}
            </th>
            <th className="ml-2 flex h-12 items-center bg-white pl-3 text-start text-sm">
              {comm('City')}
            </th>
            <th className="ml-2 flex h-12 items-center bg-portal-backgroud pl-3 text-start text-sm">
              {comm('District')}
            </th>
            <th className="ml-2 flex h-12 items-center bg-white pl-3 text-start text-sm">
              {comm('Ward')}
            </th>
            <th className="ml-2 flex h-12 items-center bg-portal-backgroud pl-3 text-start text-sm">
              {comm('PropertySize')}
            </th>
            <th className="ml-2 flex h-12 items-center bg-white pl-3 text-start text-sm">
              {comm('Project')}
            </th>
            <th className="ml-2 flex h-12 items-center bg-portal-backgroud pl-3 text-start text-sm">
              {comm('Bedrooms')}
            </th>
            <th className="ml-2 flex h-12 items-center bg-white pl-3 text-start text-sm">
              {comm('Bathrooms')}
            </th>
            <th className="ml-2 flex h-12 items-center bg-portal-backgroud pl-3 text-start text-sm">
              {comm('GeneralFurnitureStatus')}
            </th>
            <th className="ml-2 flex h-12 items-center bg-white pl-3 text-start text-sm">
              {comm('View')}
            </th>
            <th className="ml-2 flex h-12 items-center bg-portal-backgroud pl-3 text-start text-sm">
              {comm('LegalStatus')}
            </th>
            <th className="ml-2 flex h-12 items-center bg-white pl-3 text-start text-sm">
              {comm('HandOverStatus')}
            </th>

            {amenities.map((item, index) => (
              <th
                className={`ml-2 flex h-12 items-center pl-3 text-sm ${
                  index % 2 == 0 ? 'bg-portal-backgroud' : 'bg-white'
                }`}
              >
                {item?.name}
              </th>
            ))}
          </tr>

          {listProperties.map((item, index) => (
            <tr key={index} className="w-[25%]">
              <td className="my-2 h-40 bg-white">
                <img className="h-40" src={item?.imageThumbnailUrl} />
              </td>
              <td className="flex h-12 items-center bg-portal-backgroud text-sm">
                <label className="line-clamp-2">{item?.title}</label>
              </td>
              <td className="flex h-12 items-center bg-white text-sm">{item?.type}</td>
              <td className="flex h-12 items-center bg-portal-backgroud text-sm">
                <label className="line-clamp-2">{item?.location?.address}</label>
              </td>
              <td className="flex h-12 items-center bg-white text-sm">{item?.location?.city}</td>
              <td className="flex h-12 items-center bg-portal-backgroud text-sm">
                {item?.location?.district}
              </td>
              <td className="flex h-12 items-center bg-white text-sm">{item?.location?.ward}</td>
              <td className="flex h-12 items-center bg-portal-backgroud text-sm">
                {item?.size} m<sup>2</sup>
              </td>
              <td className="flex h-12 items-center bg-white text-sm">{item?.projectName}</td>
              <td className="flex h-12 items-center bg-portal-backgroud text-sm">
                {item?.bedrooms}
              </td>
              <td className="flex h-12 items-center bg-white text-sm">{item?.bathrooms}</td>
              <td className="h-12 items-center bg-portal-backgroud text-sm">
                {item?.generalFurnitureStatus}
              </td>
              <td className="flex h-12 items-center bg-white text-sm">
                {item?.views?.map((item) => item?.name)}
              </td>
              <td className="flex h-12 items-center bg-portal-backgroud text-sm">
                {t(legalStatuses.find((a) => a?.id === item?.legalStatus)?.name)}
              </td>
              <td className="flex h-12 items-center bg-white text-sm">{item?.handOverStatus}</td>
              {amenities.map((amenity, index) => (
                <td
                  className={`flex h-12 items-center text-sm ${
                    index % 2 == 0 ? 'bg-portal-backgroud' : 'bg-white'
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
