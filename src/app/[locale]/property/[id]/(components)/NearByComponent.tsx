// https://www.youtube.com/watch?v=4Ra293cHkdU
'use-client';
import apiListingCategorriesServices from '@/apiServices/externalApiServices/apiListingCategorriesServices';
import LocationNearbyListing from '@/models/propertyModel/locationNearbyListing';
import * as _ from 'lodash';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
interface GroupLocationNearby {
  title?: string;
  key?: string;
  data?: LocationNearbyListing[];
}
const NearByComponent = ({ data }: any) => {
  const locale = useLocale();
  const t = useTranslations('webLabel');
  const success = useTranslations('successNotifi');
  const [dataLocation, setDataLocation] = useState<GroupLocationNearby[]>(
    [] as GroupLocationNearby[],
  );

  useEffect(() => {
    getDataLocationNearby();
  }, []);
  const getDataLocationNearby = async () => {
    try {
      let response = await apiListingCategorriesServices.getLocationNearbyListing(data.id, 5);
      if (response && response.success) {
        let dataList = response.data;
        let dataGroupBy = _.chain(dataList)
          // Group the elements of Array based on `color` property
          .groupBy('placeType')
          // `key` is group's name (color), `value` is the array of objects
          .map((value, key) => ({
            title: getTitle(key),
            placeType: key,
            data: value,
          }))
          .value();
        setDataLocation(dataGroupBy);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getTitle = (key) => {
    switch (key) {
      case 'School':
        return 'EcomPropertyDetailPageNearByEducation';
      case 'Hospital':
        return 'EcomPropertyDetailPageNearByHealth&Medical';
      case 'RealEstateAgency':
        return 'EcomPropertyDetailPageNearByRealEstate';
      case 'ShoppingMall':
        return 'EcomPropertyDetailPageNearByShoppingMall';
      default:
        return 'EcomPropertyDetailPageNearByRealEstate';
    }
  };
  const formatToKm = (number: number) => {
    if (number < 1000) {
      return number.toFixed(0) + ' m';
    }
    return number / 1000 > 0 ? (number / 1000).toFixed(1) + ' Km' : '0 Km';
  };
  return (
    <>
      <div className="flex flex-col">
        <div className="grid grid-cols-1 gap-y-5 lg:grid-cols-2">
          {dataLocation && dataLocation.length ? (
            _.map(dataLocation, (item, index) => {
              return (
                <div key={index + 1}>
                  <div className="font-semibold text-primaryColor">{t(item?.title)}</div>
                  {_.map(item?.data, (itemChild, indexChild) => {
                    return (
                      <div className="flex" key={indexChild + 1}>
                        <div className="w-[83%] md:w-[85%]">{itemChild?.name}</div>
                        <div className="flex-1">{formatToKm(itemChild?.distance)}</div>
                      </div>
                    );
                  })}
                  <div></div>
                </div>
              );
            })
          ) : (
            <>{t('noData')}</>
          )}
        </div>
      </div>
    </>
  );
};

export default NearByComponent;
