'use client';

import apiMasterDataService from '@/apiServices/externalApiServices/apiMasterDataService';
import BgHome from '@/assets/images/bg-home-1.webp';
import DistrictModel from '@/models/masterDataModel/districtModel';
import ProvinceModel from '@/models/masterDataModel/provinceModel';
import { Select, Spin } from 'antd';
import _ from 'lodash';
import { useLocale, useTranslations } from 'next-intl';
import { FC, useEffect, useState } from 'react';

import IconFilterWhite from '@/assets/icon/icon-filter-white.svg';
import IconFilter from '@/assets/icon/icon-filter.svg';
import SliderWithHomeDisplay from '@/components/FormInput/sliderWithValueHomeFilter';
import usePropertyType from '@/hooks/usePropertyType';
import NumberUtil from '@/utils/numberUtil';
import { useRouter } from 'next-intl/client';
export interface FilterHomeProps {
  className?: string;
  itemClassName?: string;
}
interface ValueFilter {
  type: string;
  keyword: string;
  categoryIds: string;
  Province: string;
  District: string;
}

const FilterHome: FC<FilterHomeProps> = ({ className = '', itemClassName = '' }) => {
  const t = useTranslations('webLabel');
  const locale = useLocale();
  const router = useRouter();
  const [valueType, setValueType] = useState('buy');
  const [dataProvince, setDataProvince] = useState<ProvinceModel[]>([] as ProvinceModel[]);
  const [dataDistrict, setDataDistrict] = useState<DistrictModel[]>([] as DistrictModel[]);
  const [loading, setLoading] = useState(true);
  const { propertyTypes } = usePropertyType();
  interface Option {
    label: string;
    value: string;
  }
  const options: Option[] = [
    { label: 'Room', value: 'Room' },
    { label: 'Apartment', value: 'Apartment' },
    { label: 'Office', value: 'Office' },
    // ... other options
  ];
  const [valuePrice, setValuePrice] = useState(
    locale == 'vi' ? [5000000000, 15000000000] : [200000, 400000],
  );
  useEffect(() => {
    // getMasterData();
    setLoading(false);
  }, []);
  // const setPropertyTypes = async () => {
  //   return Promise.all([
  //     // apiMasterDataService.getProvincev2().then(x => setDataProvince(x.data)),
  //     apiMasterDataService
  //       .getPropertyTypes()
  //       .then(x => setPropertyTypes(x?.data)),
  //   ]).finally(() => {
  //     setLoading(false);
  //   });
  // };
  const [valueFilter, setValueFilter] = useState<ValueFilter>({
    keyword: '',
    categoryIds: '',
    Province: '',
    District: '',
    type: '',
  });
  const getDataDistrict = async (id) => {
    let dataDistrict = await apiMasterDataService.getDistrictv2(id);
    if (dataDistrict.data) {
      _.remove(dataDistrict.data, {
        nameDisplay: 'NULL',
      });

      setDataDistrict(dataDistrict.data);
    } else {
      setDataDistrict([]);
    }
  };
  const handleChangeValueFilter = (key: string, value: string, id: string = null) => {
    let preFilter = { ...valueFilter };
    if (key == 'Province') {
      preFilter.District = '';
      getDataDistrict(id);
    }
    setValueFilter({ ...preFilter, [key]: value });
  };
  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const onSubmit = (e) => {
    e.preventDefault();
    let preValue = { ...valueFilter };
    let propertyLink = 'saleProperty';
    if (preValue?.Province) {
      let find = _.find(dataProvince, function (o) {
        return o.provinceID == preValue.Province;
      });
      preValue.Province = find.pmhMappingId;
    }
    if (preValue?.District) {
      let find = _.find(dataDistrict, function (o) {
        return o.listDistrictID == preValue.District;
      });
      preValue.District = find.pmhMappingId;
    }
    if (valueType == 'buy') {
      propertyLink = '/tin-dang-ban?';
    } else {
      propertyLink = '/tin-dang-cho-thue?';
    }

    let queryStr = Object.keys(preValue)
      .filter(
        (key) =>
          (!Array.isArray(preValue[key]) && !!preValue[key]) ||
          (Array.isArray(preValue[key]) && preValue[key].length > 0),
      )
      .map((key) => `${key}=${preValue[key]}`)
      .join('&');
    if (valuePrice[0] || valuePrice[1]) {
      if (locale === 'vi') {
        queryStr = queryStr + `&fromPriceVnd=${valuePrice[0]}&toPriceVnd=${valuePrice[1]}`;
      } else {
        queryStr = queryStr + `&fromPriceUsd=${valuePrice[0]}&toPriceUsd=${valuePrice[1]}`;
      }
    }

    router.push(propertyLink + queryStr);
  };
  const priceSlideValueFormatter = (value: number) => {
    return locale === 'vi'
      ? `${NumberUtil.numberWithCommas(value)}đ`
      : `$ ${NumberUtil.numberWithCommas(value)}`;
  };

  const priceStep = () => {
    const type = valueType;

    //for sale
    //5tr vnd & 100usd
    if (type !== null && typeof type !== 'undefined' && valueType === 'buy') {
      return locale === 'vi' ? 5 * 1000 * 1000 : 100;
    }
    //for rent
    //1tr vnd & 10usd
    else {
      return locale === 'vi' ? 1 * 1000 * 1000 : 10;
    }
  };
  const maxValuePriceRange = () => {
    const type = valueType;

    //for sale
    //100 ty vnd & 5tr usd
    if (type !== null && typeof type !== 'undefined' && valueType === 'buy') {
      return locale === 'vi' ? 100 * 1000 * 1000 * 1000 : 5 * 1000 * 1000;
    }
    //for rent
    //100tr vnd & 5000 usd
    else {
      return locale === 'vi' ? 100 * 1000 * 1000 : 5000;
    }
  };

  return (
    <div
      className={`nc-FilterHome ${className} flex flex-col items-center justify-center bg-cover`}
      style={{
        backgroundImage: `url(${BgHome.src})`,
      }}
    >
      <>
        {loading ? (
          <div className="flex h-full w-full items-center justify-center">
            <Spin></Spin>
          </div>
        ) : (
          <>
            <div className="hidden lg:block">
              <div className="container flex h-full flex-col content-center items-center justify-center">
                {/* <h1 className="text-white text-[60px] text-center  lg:block hidden">
                  {t('EcomHomePageBannerFindYourPerfectHome')}
                </h1> */}
                <div className="relative mt-20 rounded bg-[rgba(13,38,59,0.65)] px-4 py-4 lg:w-[1000px]">
                  <div className="absolute left-1/2 top-[-50px] z-10 flex -translate-x-1/2 transform items-center justify-end rounded-t">
                    <div
                      onClick={() => {
                        setValueType('buy');
                        locale == 'vi'
                          ? setValuePrice([5 * 1000 * 1000 * 1000, 15 * 1000 * 1000 * 1000])
                          : setValuePrice([200 * 1000, 400 * 1000]);
                      }}
                      className={`arrow_box ${
                        valueType == 'buy' ? 'active-arrow' : 'bg-[rgba(13,38,59,0.65)]'
                      } mr-[1.5px] flex h-[50px] cursor-pointer items-center justify-center rounded-t px-2 text-center font-bold text-white lg:w-[100px]`}
                    >
                      {t('EcomHomePageBannerBuy')}
                    </div>
                    <div
                      onClick={() => {
                        setValueType('rent');
                        locale == 'vi'
                          ? setValuePrice([15 * 1000 * 1000, 45 * 1000 * 1000])
                          : setValuePrice([1000, 3000]);
                      }}
                      className={`arrow_box ${
                        valueType == 'rent' ? 'active-arrow' : 'bg-[rgba(13,38,59,0.65)]'
                      } ml-[1.5px] flex h-[50px] cursor-pointer items-center justify-center rounded-t px-2 text-center font-bold text-white lg:w-[100px]`}
                    >
                      {t('EcomHomePageBannerRent')}
                    </div>
                  </div>
                  <form onSubmit={onSubmit}>
                    <div className="flex flex-col items-center">
                      <div className="grid w-full grid-cols-6">
                        <div className="relative col-span-5 h-[55px]">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg
                              className="mr-2 h-5 w-5"
                              aria-hidden="true"
                              fill="none"
                              viewBox="0 0 20 20"
                            >
                              <path
                                stroke="#9BA5B7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                              />
                            </svg>
                          </div>
                          <input
                            onChange={(e) => {
                              handleChangeValueFilter('keyword', e.target.value);
                            }}
                            type="text"
                            id="simple-search"
                            className="focus:border-grey-300 block h-full w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:outline-none focus:ring-0"
                            placeholder={t('EcomHomePageBannerHoChiMinh')}
                          />
                        </div>
                        <div className="relative">
                          <button
                            type="submit"
                            className="ml-2 flex h-[55px] w-full items-center justify-center rounded-lg border border-portal-primaryLiving bg-portal-primaryLiving p-2.5 text-sm font-medium text-white hover:bg-portal-primaryLiving focus:outline-none focus:ring-0"
                          >
                            <svg
                              className="mr-2 h-4 w-4"
                              aria-hidden="true"
                              fill="none"
                              viewBox="0 0 20 20"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                              />
                            </svg>
                            <span className="uppercase">{t('EcomHomePageBannerSearch')}</span>
                          </button>
                        </div>

                        <div className="relative col-span-5 mt-3 grid h-[55px] grid-cols-3 rounded-lg bg-white pl-2">
                          <div className="select-noborder h-full w-full">
                            <Select
                              showSearch
                              className="h-full w-full"
                              options={propertyTypes.map((x) => ({
                                value: x.id,
                                label: x.name,
                              }))}
                              value={valueFilter.categoryIds || undefined}
                              placeholder={t('EcomHomePageBannerPropertyType')}
                              allowClear
                              onChange={(value) => {
                                handleChangeValueFilter('categoryIds', value);
                              }}
                            ></Select>
                          </div>
                          <div className="col-span-2 flex items-center gap-2 pr-3">
                            {/* <div >Gia</div> */}
                            <div className="pr-2">{t('EcomCreateAPropertyPageDetailPrice')}</div>
                            <div className="w-full">
                              <SliderWithHomeDisplay
                                markerFormatter={priceSlideValueFormatter}
                                range
                                step={priceStep()}
                                min={0}
                                max={maxValuePriceRange()}
                                tooltip={{
                                  open: true,
                                }}
                                value={valuePrice}
                                onChange={(value) => {
                                  setValuePrice(value);
                                }}
                                className="home-filter !mt-0 w-full"
                              />
                            </div>
                          </div>

                          {/* <div className="w-full">
                            <div className="w-full h-full select-noborder">
                              <Select
                                showSearch
                                className="w-full h-full"
                                bordered={false}
                                value={valueFilter.Province || undefined}
                                placeholder={t('EcomHomePageBannerCity')}
                                allowClear
                                options={dataProvince.map(x => ({
                                  value: x.provinceID,
                                  label: x.listProvinceName,
                                  id: x.provinceID,
                                }))}
                                onChange={(value, option) => {
                                  handleChangeValueFilter(
                                    'Province',
                                    value,
                                    option['id'],
                                  );
                                }}
                                optionFilterProp="children"
                                filterOption={filterOption}
                              ></Select>
                            </div>
                          </div>
                          <div className="w-full">
                            <div className="w-full h-full select-noborder">
                              <Select
                                showSearch
                                className="w-full h-full"
                                options={dataDistrict.map(x => ({
                                  value: x.listDistrictID,
                                  label: x.nameDisplay,
                                  id: x.listDistrictID,
                                }))}
                                value={valueFilter.District || undefined}
                                placeholder={t('EcomHomePageBannerDistrict')}
                                allowClear
                                onChange={value => {
                                  handleChangeValueFilter('District', value);
                                }}
                                optionFilterProp="children"
                                filterOption={filterOption}
                                disabled={!valueFilter.Province}
                              ></Select>
                            </div>
                          </div> */}
                        </div>
                        <div
                          className="ml-2 flex w-full cursor-pointer items-center justify-center gap-1 text-white lg:mt-2"
                          onClick={() => {
                            router.push(
                              `/${
                                valueType === 'buy' ? 'tin-dang-ban' : 'tin-dang-cho-thue'
                              }?showFilter=true`,
                            );
                          }}
                        >
                          <img className="h-5 w-5 text-white" src={IconFilterWhite.src}></img>
                          {t('EcomHomePageBannerAdvanceSearch')}
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            {/* mobile */}
            <div className="block h-full w-full lg:hidden">
              <div className="flex h-full w-full flex-col justify-center bg-[rgba(13,38,59,0.65)] px-[20px]">
                {/* <h1 className="text-white text-[30px] leading-[40px] text-center  ">
                  {t('EcomHomePageBannerFindYourPerfectHome')}
                </h1> */}
                <div className="relative mt-20 w-full rounded bg-white px-[20px]">
                  <div className="absolute left-1/2 top-[-50px] z-10 flex -translate-x-1/2 transform items-center justify-end rounded-t">
                    <div
                      onClick={() => {
                        setValueType('buy');
                        locale == 'vi'
                          ? setValuePrice([5 * 1000 * 1000 * 1000, 15 * 1000 * 1000 * 1000])
                          : setValuePrice([200 * 1000, 400 * 1000]);
                      }}
                      className={`arrow_box ${
                        valueType == 'buy' ? 'active-arrow' : 'bg-[rgba(13,38,59,0.65)]'
                      } mr-[1px] flex h-[50px] w-[100px] cursor-pointer items-center justify-center rounded-t px-2 text-center font-bold text-white`}
                    >
                      {t('EcomHomePageBannerBuy')}
                    </div>
                    <div
                      onClick={() => {
                        setValueType('rent');
                        locale == 'vi'
                          ? setValuePrice([15 * 1000 * 1000, 45 * 1000 * 1000])
                          : setValuePrice([1000, 3000]);
                      }}
                      className={`arrow_box ${
                        valueType == 'rent' ? 'active-arrow' : 'bg-[rgba(13,38,59,0.65)]'
                      } ml-[1px] flex h-[50px] w-[100px] cursor-pointer items-center justify-center rounded-t px-2 text-center font-bold text-white`}
                    >
                      {t('EcomHomePageBannerRent')}
                    </div>
                  </div>
                  <form className="" onSubmit={onSubmit}>
                    <div className="flex flex-col py-5">
                      <div className="font-semibold uppercase text-primaryColor">
                        {t('EcomHomePageBannerSearch')}
                      </div>
                      <div className="relative h-[55px] w-full">
                        <input
                          onChange={(e) => {
                            handleChangeValueFilter('keyword', e.target.value);
                          }}
                          type="text"
                          autoComplete="new-password"
                          id="simple-search"
                          className="input-custom-border peer h-[55px] w-full !bg-white pl-0 pr-6 focus:border-portal-primaryLiving focus:outline-none focus:ring-0"
                          placeholder={t('EcomHomePageBannerHoChiMinh')}
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
                          <svg
                            className="mr-2 h-5 w-5"
                            aria-hidden="true"
                            fill="none"
                            viewBox="0 0 20 20"
                          >
                            <path
                              stroke="#9BA5B7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="mt-3 font-semibold uppercase text-primaryColor">
                        {t('EcomHomePageBannerPropertyType')}
                      </div>
                      <div className="select-custom">
                        <Select
                          showSearch
                          className="custom-padding h-full w-full"
                          options={propertyTypes.map((x) => ({
                            value: x.id,
                            label: x.name,
                          }))}
                          value={valueFilter.categoryIds || undefined}
                          placeholder={t('EcomHomePageBannerPropertyType')}
                          allowClear
                          onChange={(value) => {
                            handleChangeValueFilter('categoryIds', value);
                          }}
                          bordered={false}
                        ></Select>
                      </div>

                      {/* <div className="text-primaryColor font-semibold mt-3 uppercase">
                        {t('EcomHomePageBannerCity')}
                      </div>
                      <div className="select-custom">
                        <Select
                          showSearch
                          className="w-full h-full"
                          bordered={false}
                          value={valueFilter.Province || undefined}
                          placeholder={t('EcomHomePageBannerCity')}
                          allowClear
                          options={dataProvince.map(x => ({
                            value: x.provinceID,
                            label: x.listProvinceName,
                            id: x.provinceID,
                          }))}
                          onChange={(value, option) => {
                            handleChangeValueFilter(
                              'Province',
                              value,
                              option['id'],
                            );
                          }}
                          optionFilterProp="children"
                          filterOption={filterOption}
                        ></Select>
                      </div> */}
                      {/* <div className="text-primaryColor font-semibold mt-3 uppercase">
                        {t('EcomHomePageBannerDistrict')}
                      </div>
                      <div className="select-custom">
                        <Select
                          showSearch
                          className="w-full h-full"
                          options={dataDistrict.map(x => ({
                            value: x.listDistrictID,
                            label: x.nameDisplay,
                            id: x.listDistrictID,
                          }))}
                          bordered={false}
                          value={valueFilter.District || undefined}
                          placeholder={t('EcomHomePageBannerDistrict')}
                          allowClear
                          onChange={value => {
                            handleChangeValueFilter('District', value);
                          }}
                          optionFilterProp="children"
                          filterOption={filterOption}
                          disabled={!valueFilter.Province}
                        ></Select>
                      </div> */}
                      <div className="mt-[10px] flex flex-col gap-5">
                        {/* <div >Gia</div> */}
                        <div className="font-semibold uppercase text-primaryColor">
                          {t('EcomCreateAPropertyPageDetailPrice')}
                        </div>
                        {/* <div>{t('')}</div> */}
                        <div className="w-full">
                          <SliderWithHomeDisplay
                            markerFormatter={priceSlideValueFormatter}
                            range
                            step={priceStep()}
                            min={0}
                            max={maxValuePriceRange()}
                            tooltip={{
                              open: true,
                            }}
                            value={valuePrice}
                            onChange={(value) => {
                              setValuePrice(value);
                            }}
                            className="home-filter !mt-0 w-full"
                          />
                        </div>
                      </div>
                      <div
                        className="mt-3 flex gap-5"
                        onClick={() => {
                          router.push(
                            `/${
                              valueType === 'buy' ? 'saleProperty' : 'rentProperty'
                            }?showFilter=true`,
                          );
                        }}
                      >
                        <img className="h-7 w-7" src={IconFilter.src}></img>
                        <div className="text-[14px] text-primaryColor">
                          {t('EcomHomePageBannerAdvanceSearch')}
                        </div>
                      </div>
                      <div className="mt-5 w-full">
                        <button
                          type="submit"
                          className="flex h-[55px] w-full items-center justify-center rounded border border-portal-primaryLiving bg-portal-primaryLiving py-2 text-sm font-medium text-white hover:bg-portal-primaryLiving focus:outline-none focus:ring-4"
                        >
                          <svg
                            className="mr-2 h-4 w-4"
                            aria-hidden="true"
                            fill="none"
                            viewBox="0 0 20 20"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                            />
                          </svg>
                          <span className="uppercase">{t('EcomHomePageBannerSearch')}</span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    </div>
  );
};

export default FilterHome;
