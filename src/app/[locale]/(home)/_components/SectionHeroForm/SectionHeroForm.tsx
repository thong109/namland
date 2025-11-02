'use client';

import { Form, Input, Modal, Popconfirm, Select } from 'antd';
import { useTranslations } from 'next-intl';
import { FC, useEffect, useState } from 'react';

import ButtonCore from '@/components/ButtonCore/ButtonCore';
import PriceSearchListing from '@/components/PopupSearchPrice/PopupSearchPrice';
import SelectCheckbox from '@/components/SelectCheckbox/SelectCheckbox';
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
import './SectionHeroForm.css';
import PropertySelectionField from './_components/PropertySelectionField';
import { assetsImages } from '@/assets/images/package';

const AdvanceSearchListing = dynamic(() => import('@/components/FormInput/advanceSearchListing'), {
  ssr: false,
});

export interface SectionHeroFormProps { }

const SectionHeroForm: FC<SectionHeroFormProps> = ({ }) => {
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
  const selectHomeSaleRent = () => {
    return (
      <div className='select-home-salerent'>
        <div onClick={() => { seFilterBy(listingType.sale); }} className={clsx(`select-home-salerent__option`, { 'is-state-active': filterBy === listingType.sale })}>{t('EcomHomePageBannerBuy')}</div>
        <div onClick={() => { seFilterBy(listingType.rent); }} className={clsx(`select-home-salerent__option`, { 'is-state-active': filterBy === listingType.rent })}>{t('EcomHomePageBannerRent')}</div>
      </div>
    );
  };
  const popupHomeSearch = (
    title: string,
    component: React.ReactNode,
    hasOKButton?: boolean,
    resetAction?: () => void,
  ) => {
    return (
      <Popconfirm
        className='toggle-home-search'
        title={component}
        icon={false}
        arrow={false}
        okText={t('HomeSearchAplyButton')}
        cancelText={t('HomeSearchResetButton')}
        placement='bottom'
        okButtonProps={{ hidden: hasOKButton ? false : true, size: 'middle' }}
        cancelButtonProps={{
          hidden: hasOKButton ? false : true,
          size: 'middle',
          onClick: resetAction,
        }}
      >
        <span className='toggle-home-search__wrapper'>{title}</span>
        <span className='toggle-home-search__icon' style={{ backgroundImage: `url(${assetsImages.commonIconArrow.src})` }}></span>
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
      <div className={clsx('form-home-search')}>
        <div className={clsx('form-home-search__viewport', filterBy === listingType.sale)}>
          <Form className='form-home-search__wrapper' form={form} layout='vertical' onFinish={onSubmit} size='large'>
            <div className='form-home-search__inner form-home-search__inner--desktop'>
              <div className='form-home-search__filter'>
                {selectHomeSaleRent()}
                <div className='form-home-search__filter-wrapper'>
                  <div className={clsx('form-home-search__filter-entry', propertyType && propertyType.length > 0 && 'is-state-active')}>
                    {popupHomeSearch(
                      t('HomeRealEstateSearchFormType'),
                      <Form.Item name='c'>
                        <PropertySelectionField
                          options={filterBy === listingType.sale ? saleCategories : rentCategories}
                          multiple
                        />
                      </Form.Item>,
                      true,
                      () => form.resetFields(['c']),
                    )}
                  </div>
                  <div className={clsx('form-home-search__filter-entry price-filter',
                    ((priceRangeVnd &&
                      priceRangeVnd.length > 0 &&
                      priceRangeVnd.find((x) => !!x)) ||
                      (priceRangeUsd &&
                        priceRangeUsd.length > 0 &&
                        priceRangeUsd.find((x) => !!x))) &&
                    'is-state-active',
                  )}>
                    <div className='toggle-home-search' onClick={onPriceFilterClick}>
                      <span className='toggle-home-search__wrapper'>{t('HomeRealEstateSearchFormPrice')}</span>
                      <span className='toggle-home-search__icon' style={{ backgroundImage: `url(${assetsImages.commonIconArrow.src})` }}></span>
                    </div>
                    <Form.Item className='absolute -bottom-2 left-1/2 -z-50 min-w-96 -translate-x-1/2 transform' name='rp'>
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
                  </div>
                  <div className={clsx('form-home-search__filter-entry location-filter', locationArea && 'is-state-active')}>
                    <div className='toggle-home-search' onClick={onLocationFilterClick}>
                      <span className='toggle-home-search__wrapper'>{t('HomeRealEstateSearchFormLocation')}</span>
                      <span className='toggle-home-search__icon' style={{ backgroundImage: `url(${assetsImages.commonIconArrow.src})` }}></span>
                    </div>
                    <div className='absolute -bottom-2 left-1/2 -z-50 -translate-x-1/2 transform'>
                      <Form.Item name='p'>
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
                  <div className={clsx('form-home-search__filter-entry', advanSearchValue && 'is-state-active')}>
                    {popupHomeSearch(
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
                  <div className='button-common-resetfilters' onClick={resetFilter}>{t('HomeRealEstateSearchFormClearFilter')}</div>
                </div>
              </div>
              <div className='form-home-search__field'>
                <Form.Item className='form-home-search__field-wrapper' name='k'>
                  <Input
                    allowClear
                    suffix={ <ButtonCore type='submit' buttonType='search' label={`${t('HomeRealEstateSearchFormSearch')}`} /> }
                  />
                </Form.Item>
              </div>
            </div>
            <div className='form-home-search__inner form-home-search__inner--mobile'>
              <div className='form-home-search__entry'>{selectHomeSaleRent()}</div>
              <Form.Item className='form-home-search__entry' name='k' label={t('HomeRealEstateSearchFormSearch')}>
                <Input
                  className='input-common input-common--search'
                  placeholder={t('HomeRealEstateSearchFormSearchFieldPlaceHolder')}
                  allowClear
                />
              </Form.Item>
              <Form.Item className='form-home-search__entry' label={t('HomeRealEstateSearchProject')} name='prjs'>
                <SelectCheckbox
                  placeholder={t('HomeRealEstateSearchFormSearchFieldProject')}
                  showSearch
                  options={projects?.map((prj) => ({
                    value: prj.id,
                    label: prj.name,
                    id: prj.id,
                  }))}
                />
              </Form.Item>
              <Form.Item name='c' label={t('HomeRealEstateSearchFormType')}>
                <Select
                  className='select-common'
                  placeholder={t('HomeRealEstateSearchFormType')}
                  allowClear
                  mode='multiple'
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
              <Form.Item name='rp' label={t('HomeRealEstateSearchFormPrice')}>
                <PriceSearchListing
                  className='select-common'
                  typeft={filterBy}
                  placeholder={t('HomeRealEstateSearchFormPriceFieldPlaceHolder')}
                />
              </Form.Item>
              <Form.Item name='p' label={t('HomeRealEstateSearchFormLocation')}>
                <Select
                  className='select-common'
                  placeholder={t('ListingSearchPlaceholderProvince')}
                  showSearch
                  // allowClear={{ clearIcon: <>x</> }}
                  allowClear
                  filterOption={filterOptionsRemoveVietnameseTones}
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
                    className='select-common'
                    placeholder={t('HomeRealEstateSearchFormMoreFilterFieldPlaceHolder')}
                    value={selectedMoreFilterArea}
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
              <div className='form-home-search__controller'>
                <div className='button-common-resetfilters' onClick={resetFilter}>{t('HomeRealEstateSearchFormClearFilter')}</div>
                <ButtonCore
                  type='submit'
                  label={`${t('HomeRealEstateSearchFormSearch')}!`}
                />
              </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default SectionHeroForm;
