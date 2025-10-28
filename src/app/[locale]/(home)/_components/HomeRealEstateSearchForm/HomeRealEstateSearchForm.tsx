'use client';

import { Form, Input, Modal, Popconfirm, Select } from 'antd';
import { useTranslations } from 'next-intl';
import { FC, useEffect, useState } from 'react';

import ButtonCore from '@/components/ButtonCore/ButtonCore';
import PriceSearchListing from '@/components/FormInput/priceSearchListing';
import MultiSelectWithCheckbox from '@/components/MultiSelectWithCheckbox/Index';
import { NAVIGATION } from '@/data/navigation';
import {
  getEcomEcomPlaceGetProvince,
  getEcomEcomProjectGetListProjectSearch,
  getEcomInteriorGetList,
  getEcomListingAmenitiesGetList,
  getEcomListingCategoryGetList,
  getEcomListingViewGetList,
} from '@/ecom-sadec-api-client';
import {
  getParamsStringFromObj,
  handOverStatuses,
  legalStatuses,
  listingRentLeaseTerm,
  listingType,
} from '@/libs/appconst';
import { filterOptionsRemoveVietnameseTones } from '@/libs/helper';
import { ShortHomeRealEstateSearchModel } from '@/models/homeRealEstateSearchModel/homeRealEstateSearchModel';
import * as pixel from '@/utils/pixel';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useRouter } from 'next-intl/client';
import dynamic from 'next/dynamic';
import * as NProgress from 'nprogress';
import styles from './HomeRealEstateSearch.module.scss';
import PropertySelectionField from './_components/PropertySelectionField';

const AdvanceSearchListing = dynamic(() => import('@/components/FormInput/advanceSearchListing'), {
  ssr: false,
});

export interface HomeRealEstateSearchFormProps {}

const HomeRealEstateSearchForm: FC<HomeRealEstateSearchFormProps> = ({}) => {
  const t = useTranslations('webLabel');
  const { push } = useRouter();
  const comm = useTranslations('Common');
  const [form] = Form.useForm();
  const [formAdvanceSearch] = Form.useForm();
  const [advanceSearchValues, setAdvanceSearchValues] = useState<ShortHomeRealEstateSearchModel>(
    {},
  );

  const [saleCategories, setSaleCategories] = useState<any>([]);
  const [rentCategories, setRentCategories] = useState<any>([]);
  const [provinces, setProvinces] = useState<any>([]);
  const [views, setViews] = useState<any>([]);
  const [inAmenities, setInAmenities] = useState<any>([]);
  const [outAmenities, setOutAmenities] = useState<any>([]);
  const [funitureStatus, setFunitureStatus] = useState<any>([]);
  const [projects, setProjects] = useState<any>([]);

  const [isMobileMoreFilterModalOpen, setIsMobileMoreFilterModalOpen] = useState(false);

  const [filterBy, seFilterBy] = useState(listingType.sale);
  const [selectedMoreFilterArea, setSelectedMoreFilterArea] = useState<string | null>(null);

  const priceRangeVnd = Form.useWatch('rp', form);
  const priceRangeUsd = Form.useWatch('rpUsd', form);

  const locationArea = Form.useWatch('p', form);
  const propertyType = Form.useWatch('c', form);
  const inA = Form.useWatch('inA', formAdvanceSearch);
  const outA = Form.useWatch('outA', formAdvanceSearch);
  const hS = Form.useWatch('hS', formAdvanceSearch);
  const i = Form.useWatch('i', formAdvanceSearch);
  const lS = Form.useWatch('lS', formAdvanceSearch);
  const v = Form.useWatch('v', formAdvanceSearch);
  const advanSearchValue = [inA, outA, hS, i, lS, v].some(
    (value) => value !== undefined && value?.length !== 0 && value !== null && value !== '',
  );

  const [currentLocation, setCurrentLocation] = useState<any>(null);

  const initFilters = async () => {
    const project = ((await getEcomEcomProjectGetListProjectSearch()) as any).data;
    setProjects(project);

    const saleCategories = (
      (await getEcomListingCategoryGetList({ type: listingType.sale })) as any
    ).data.data;
    setSaleCategories(saleCategories);

    const rentCategories = (
      (await getEcomListingCategoryGetList({ type: listingType.rent })) as any
    ).data.data;
    setRentCategories(rentCategories);

    const provinces = ((await getEcomEcomPlaceGetProvince()) as any).data?.data;
    setProvinces(provinces);

    const views = ((await getEcomListingViewGetList()) as any).data;
    setViews(views);

    const inAmenities = ((await getEcomListingAmenitiesGetList({ type: 1 })) as any).data;
    setInAmenities(inAmenities);

    const outAmenities = ((await getEcomListingAmenitiesGetList({ type: 2 })) as any).data;
    setOutAmenities(outAmenities);

    const funitureStatus = ((await getEcomInteriorGetList()) as any).data;
    setFunitureStatus(funitureStatus);
  };

  useEffect(() => {
    initFilters();
  }, []);

  useEffect(() => {
    const keywordValue = form.getFieldValue('k');

    form.resetFields();
    formAdvanceSearch.resetFields();

    form.setFieldsValue({ k: keywordValue });
  }, [filterBy]);

  const addStringByArr = (str: string, arrParent: any[], arrResult: any[]) => {
    if (arrResult && arrResult.length > 0) {
      const viewStr = arrParent
        .filter((item) => arrResult.includes(item.id))
        .map((item) => item.name)
        .join(', ');
      if (str && str.length > 0) {
        str = str + ', ' + viewStr;
      } else {
        str = str + viewStr;
      }
    }
    return str;
  };

  const addStringByBoolean = (str: string, value: any, title: string) => {
    if (!str) {
      str = str + title + ': ' + comm(value ? 'Yes' : 'No');
    } else {
      str = str + ', ' + title + ': ' + comm(value ? 'Yes' : 'No');
    }

    return str;
  };
  const advanceSearchToString = (objAdvance: ShortHomeRealEstateSearchModel) => {
    let str = '';
    str = addStringByArr(str, views, objAdvance.v);
    objAdvance.lS &&
      (str = addStringByArr(
        str,
        legalStatuses.map((item) => ({
          id: item.id,
          name: t(item.name),
        })),
        [objAdvance.lS],
      ));
    (objAdvance.hS || objAdvance.hS === 0) &&
      (str = addStringByArr(
        str,
        handOverStatuses.map((item) => ({
          id: item.id,
          name: t(item.name),
        })),
        [objAdvance.hS],
      ));

    objAdvance.lt &&
      (str = addStringByArr(
        str,
        listingRentLeaseTerm.map((item) => ({
          id: item.id,
          name: comm(item.name),
        })),
        [objAdvance.lt],
      ));
    objAdvance.i &&
      (str = addStringByArr(
        str,
        funitureStatus.map((item) => ({
          id: item.id,
          name: item.interiorName,
        })),
        [objAdvance.i],
      ));

    (objAdvance.iPA || objAdvance.iPA === false) &&
      (str = addStringByBoolean(str, objAdvance.iPA, comm('petAllowance')));
    str = addStringByArr(str, inAmenities, objAdvance.inA);
    str = addStringByArr(str, outAmenities, objAdvance.outA);
    return str;
  };

  const onFormAvChange = (changedValues, allValues: ShortHomeRealEstateSearchModel) => {
    setAdvanceSearchValues(allValues);
    const str = advanceSearchToString(allValues);
    setSelectedMoreFilterArea(!str ? undefined : str);
  };

  const resetFilter = () => {
    form.resetFields();
    formAdvanceSearch.resetFields();
  };
  const onSubmit = async (values: ShortHomeRealEstateSearchModel) => {
    const dataFilter: ShortHomeRealEstateSearchModel = {
      ...values,
      fmd: values.fmd ? dayjs(values.fmd).toJSON() : undefined,
      tmd: values.tmd ? dayjs(values.tmd).toJSON() : undefined,
      ...advanceSearchValues,
    };

    const paramsString = getParamsStringFromObj(dataFilter);

    NProgress.start();
    pixel.search(paramsString);
    switch (filterBy) {
      case listingType.sale:
        push(NAVIGATION.saleListing.href + '?' + paramsString);
        break;
      case listingType.rent:
        push(NAVIGATION.rentListing.href + '?' + paramsString);
        break;
    }
  };

  const saleOrRentBlock = () => {
    return (
      <div className="grid grid-cols-2 items-center gap-2 rounded-3xl border border-neutral-500 p-2 lg:flex lg:p-0.5">
        <div
          onClick={() => {
            seFilterBy(listingType.sale);
          }}
          className={clsx(
            `cursor-pointer grid-cols-1 rounded-3xl px-4 py-2 text-center font-semibold lg:py-1`,
            {
              'border border-neutral-500 bg-neutral-0': filterBy === listingType.sale,
            },
          )}
        >
          {t('EcomHomePageBannerBuy')}
        </div>
        <div
          onClick={() => {
            seFilterBy(listingType.rent);
          }}
          className={clsx(
            `cursor-pointer grid-cols-1 rounded-3xl px-4 py-2 text-center font-semibold lg:py-1`,
            {
              'border border-neutral-500 bg-neutral-0': filterBy === listingType.rent,
            },
          )}
        >
          {t('EcomHomePageBannerRent')}
        </div>
      </div>
    );
  };

  const popupFilter = (
    title: string,
    component: React.ReactNode,
    hasOKButton?: boolean,
    resetAction?: () => void,
  ) => {
    return (
      <Popconfirm
        className="cursor-pointer"
        title={component}
        icon={false}
        arrow={false}
        okText={t('HomeSearchAplyButton')}
        cancelText={t('HomeSearchResetButton')}
        placement="bottom"
        okButtonProps={{ hidden: hasOKButton ? false : true, size: 'middle' }}
        cancelButtonProps={{
          hidden: hasOKButton ? false : true,
          size: 'middle',
          onClick: resetAction,
        }}
      >
        <div className="flex items-center justify-center gap-1 overflow-hidden font-semibold">
          <span>{title}</span> <ChevronDownIcon className="size-4" />{' '}
        </div>
      </Popconfirm>
    );
  };

  const onLocationFilterClick = () => {
    const select = document.querySelector('.location-filter .ant-select-selector');
    const clickEvent = new Event('mousedown', { bubbles: true, cancelable: true });
    select?.dispatchEvent(clickEvent);
  };

  const onPriceFilterClick = () => {
    const select = document.querySelector('.price-filter .ant-select-selector');
    const clickEvent = new Event('click', { bubbles: true, cancelable: true });
    select?.dispatchEvent(clickEvent);
  };

  return (
    <>
      <div
        className={clsx(
          'container flex h-full flex-col content-center items-center justify-center',
          styles['home-real-estate-search-form'],
        )}
      >
        <div
          className={clsx(
            'relative w-full bg-portal-yellow px-8 py-6 lg:w-[1000px] lg:px-20',
            filterBy === listingType.sale && 'rounded-tl-none',
          )}
        >
          <Form
            form={form}
            className="search-form flex flex-col gap-4"
            layout="vertical"
            onFinish={onSubmit}
            size="large"
          >
            <div className="hidden flex-row divide-neutral-500 lg:flex lg:divide-x">
              <div className="pr-8">{saleOrRentBlock()}</div>
              <div className="flex flex-grow flex-row items-center gap-2 pl-8">
                <div
                  className={clsx(
                    'w-[21%] rounded-xl px-2 py-2 text-center',
                    propertyType && propertyType.length > 0 && 'bg-portal-yellow-1',
                  )}
                >
                  {popupFilter(
                    t('HomeRealEstateSearchFormType'),
                    <Form.Item name="c">
                      <PropertySelectionField
                        options={filterBy === listingType.sale ? saleCategories : rentCategories}
                        multiple
                      />
                    </Form.Item>,
                    true,
                    () => form.resetFields(['c']),
                  )}
                </div>
                <div
                  className={clsx(
                    'price-filter relative w-[21%] rounded-xl px-2 py-2 text-center',
                    ((priceRangeVnd &&
                      priceRangeVnd.length > 0 &&
                      priceRangeVnd.find((x) => !!x)) ||
                      (priceRangeUsd &&
                        priceRangeUsd.length > 0 &&
                        priceRangeUsd.find((x) => !!x))) &&
                      'bg-portal-yellow-1',
                  )}
                >
                  <div
                    className="flex cursor-pointer items-center justify-center gap-1 overflow-hidden font-semibold"
                    onClick={onPriceFilterClick}
                  >
                    <span>{t('HomeRealEstateSearchFormPrice')}</span>{' '}
                    <ChevronDownIcon className="size-4" />{' '}
                  </div>
                  <Form.Item
                    name="rp"
                    className="absolute -bottom-2 left-1/2 -z-50 min-w-96 -translate-x-1/2 transform"
                  >
                    <PriceSearchListing
                      defaultValue={
                        filterBy === listingType.sale
                          ? [500000000, 5000000000]
                          : [10000000, 35000000]
                      }
                      typeft={filterBy}
                      placeholder={t('HomeRealEstateSearchFormPriceFieldPlaceHolder')}
                    />
                  </Form.Item>
                  {/* {popupFilter(
                    t('HomeRealEstateSearchFormPrice'),
                    <Form.Item name="rp" className="min-w-96">
                      <PriceSearchListing
                        typeft={filterBy}
                        placeholder={t('HomeRealEstateSearchFormPriceFieldPlaceHolder')}
                      />
                    </Form.Item>,
                  )} */}
                </div>
                <div
                  className={clsx(
                    'location-filter relative w-[21%] rounded-xl px-2 py-2 text-center',
                    locationArea && 'bg-portal-yellow-1',
                  )}
                >
                  <div
                    className="flex cursor-pointer items-center justify-center gap-1 overflow-hidden font-semibold"
                    onClick={onLocationFilterClick}
                  >
                    <span>{t('HomeRealEstateSearchFormLocation')}</span>{' '}
                    <ChevronDownIcon className="size-4" />{' '}
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -z-50 -translate-x-1/2 transform">
                    <Form.Item name="p">
                      <Select
                        placeholder={t('ListingSearchPlaceholderProvince')}
                        allowClear
                        showSearch
                        filterOption={filterOptionsRemoveVietnameseTones}
                        className={clsx('min-w-60 opacity-0')}
                        options={provinces?.map((province) => ({
                          value: province.provinceID,
                          label: province.listProvinceName,
                          id: province.provinceID,
                        }))}
                        onSelect={(e) => {
                          if (e === currentLocation) {
                            form.resetFields(['p']);
                            setCurrentLocation(null);
                          } else {
                            setCurrentLocation(e);
                          }
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>
                <div
                  className={clsx(
                    'w-[21%] rounded-xl px-2 py-2 text-center',
                    advanSearchValue && 'bg-portal-yellow-1',
                  )}
                >
                  {popupFilter(
                    t('HomeRealEstateSearchFormMoreFilter'),
                    <AdvanceSearchListing
                      filterBy={filterBy}
                      formref={formAdvanceSearch}
                      funitureStatus={funitureStatus}
                      inAmenities={inAmenities}
                      outAmenities={outAmenities}
                      views={views}
                      onFormChange={(changedValues, allValues) =>
                        onFormAvChange(changedValues, allValues)
                      }
                      notActionButton={true}
                    />,
                    true,
                    () => formAdvanceSearch.resetFields(),
                  )}
                </div>
                <div
                  className="cursor-pointer text-center font-bold underline"
                  onClick={resetFilter}
                >
                  {t('HomeRealEstateSearchFormClearFilter')}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              <div className="col-span-2">
                <Form.Item
                  name="prjs"
                  className="hidden lg:block [&_.ant-select-selector]:!h-[42px] [&_.ant-select-selector]:!rounded-none [&_.ant-select-selector]:!border-neutral-500 [&_.ant-select-selector]:!py-0 [&_.ant-select-selector]:!pr-0"
                >
                  <MultiSelectWithCheckbox
                    showSearch
                    placeholder={t('HomeRealEstateSearchFormSearchFieldProject')}
                    options={projects?.map((prj) => ({
                      value: prj.id,
                      label: prj.name,
                      id: prj.id,
                    }))}
                  />
                </Form.Item>
              </div>
              <div className="col-span-5">
                <Form.Item
                  name="k"
                  className="hidden lg:block [&_.ant-input-affix-wrapper]:!rounded-none [&_.ant-input-affix-wrapper]:border-neutral-500 [&_.ant-input-affix-wrapper]:!py-0 [&_.ant-input-affix-wrapper]:!pr-0"
                >
                  <Input
                    placeholder={t('HomeRealEstateSearchFormSearchFieldPlaceHolder')}
                    prefix={<MagnifyingGlassIcon className="size-4" />}
                    allowClear
                    suffix={
                      <ButtonCore
                        type="submit"
                        className="!rounded-none border-l border-l-neutral-500 px-6 !text-pmh-text"
                        label={`${t('HomeRealEstateSearchFormSearch')}!`}
                      />
                    }
                  />
                </Form.Item>
              </div>
            </div>

            {/* mobile */}
            <div className="flex flex-col lg:hidden">
              <div className="mb-4">{saleOrRentBlock()}</div>
              <Form.Item
                name="k"
                className="[&_.ant-input-affix-wrapper]:!rounded-none"
                label={t('HomeRealEstateSearchFormSearch')}
              >
                <Input
                  allowClear
                  placeholder={t('HomeRealEstateSearchFormSearchFieldPlaceHolder')}
                  suffix={<MagnifyingGlassIcon className="size-4" />}
                />
              </Form.Item>
              <Form.Item
                label={t('HomeRealEstateSearchProject')}
                name="prjs"
                className="lg:hidden [&_.ant-select-selector]:!rounded-none"
              >
                <MultiSelectWithCheckbox
                  placeholder={t('HomeRealEstateSearchFormSearchFieldProject')}
                  showSearch
                  options={projects?.map((prj) => ({
                    value: prj.id,
                    label: prj.name,
                    id: prj.id,
                  }))}
                />
              </Form.Item>

              <Form.Item name="c" label={t('HomeRealEstateSearchFormType')}>
                <Select
                  placeholder={t('HomeRealEstateSearchFormType')}
                  allowClear
                  className="no-raidus-selector"
                  mode="multiple"
                >
                  {(filterBy === listingType.sale ? saleCategories : rentCategories)?.map(
                    (category) => (
                      <Select.Option key={category.id} value={category.id}>
                        {category.name}
                      </Select.Option>
                    ),
                  )}
                </Select>
              </Form.Item>

              <Form.Item name="rp" label={t('HomeRealEstateSearchFormPrice')}>
                <PriceSearchListing
                  className="no-raidus-selector"
                  typeft={filterBy}
                  placeholder={t('HomeRealEstateSearchFormPriceFieldPlaceHolder')}
                />
              </Form.Item>

              <Form.Item name="p" label={t('HomeRealEstateSearchFormLocation')}>
                <Select
                  placeholder={t('ListingSearchPlaceholderProvince')}
                  showSearch
                  // allowClear={{ clearIcon: <>x</> }}
                  allowClear
                  filterOption={filterOptionsRemoveVietnameseTones}
                  className="no-raidus-selector"
                  options={provinces?.map((province) => ({
                    value: province.provinceID,
                    label: province.listProvinceName,
                    id: province.provinceID,
                  }))}
                />
              </Form.Item>

              <Form.Item label={t('HomeRealEstateSearchFormMoreFilter')}>
                <div onClick={() => setIsMobileMoreFilterModalOpen(!isMobileMoreFilterModalOpen)}>
                  <Select
                    placeholder={t('HomeRealEstateSearchFormMoreFilterFieldPlaceHolder')}
                    value={selectedMoreFilterArea}
                    className="no-raidus-selector w-full"
                    open={false}
                  />
                </div>
              </Form.Item>

              <Modal open={isMobileMoreFilterModalOpen} footer={null} centered closable={false}>
                <AdvanceSearchListing
                  filterBy={filterBy}
                  formref={formAdvanceSearch}
                  funitureStatus={funitureStatus}
                  inAmenities={inAmenities}
                  outAmenities={outAmenities}
                  views={views}
                  onFormChange={(changedValues, allValues) =>
                    onFormAvChange(changedValues, allValues)
                  }
                  onChangePopup={setIsMobileMoreFilterModalOpen}
                />
              </Modal>

              <div className="mb-4 cursor-pointer text-center underline" onClick={resetFilter}>
                {t('HomeRealEstateSearchFormClearFilter')}
              </div>

              <ButtonCore
                type="submit"
                className="!rounded-none border border-neutral-500 px-6 !text-pmh-text"
                label={`${t('HomeRealEstateSearchFormSearch')}!`}
              />
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default HomeRealEstateSearchForm;
