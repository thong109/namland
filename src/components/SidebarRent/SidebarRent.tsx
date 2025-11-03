'use client';

import { Form, Input, Modal, Popconfirm, Select } from 'antd';
import { useTranslations } from 'next-intl';
import { FC, useEffect, useState } from 'react';

import ButtonCore from '@/components/ButtonCore/ButtonCore';
import PopupSearchPrice from '@/components/PopupSearchPrice/PopupSearchPrice';
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
import './SidebarRent.css';

const AdvanceSearchListing = dynamic(() => import('@/components/PopupSearchAdvanced/PopupSearchAdvanced'), {
  ssr: false,
});

export interface HomeRealEstateSearchFormProps { }

const SidebarRent: FC<HomeRealEstateSearchFormProps> = ({ }) => {
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

  const [filterBy, seFilterBy] = useState(listingType.rent);
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
  const buttonCommonSearchAdvancedValue = [inA, outA, hS, i, lS, v].some(
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

  const SelectCommonType = ({ filterBy, setFilterBy, t }) => {
    return (
      <Select
        className='select-common select-common--type'
        value={filterBy}
        onChange={(value) => setFilterBy(value)}
        size='large'
        popupClassName='is-state-active'
      >
        <Select.Option value={listingType.rent}>
          {t('EcomHomePageBannerRent')}
        </Select.Option>
        <Select.Option value={listingType.sale}>
          {t('EcomHomePageBannerBuy')}
        </Select.Option>
      </Select>
    );
  };

  const buttonCommonSearchAdvanced = (
    title: string,
    component: React.ReactNode,
    hasOKButton?: boolean,
    resetAction?: () => void,
  ) => {
    return (
      <Popconfirm
        className='button-common-searchadvanced'
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
        {title}
      </Popconfirm>
    );
  };

  return (
    <>
      <Form className='sidebar-common-rent' form={form} layout='vertical' onFinish={onSubmit} size='large'>
        <div className='sidebar-common-rent__wrapper sidebar-common-rent__wrapper--desktop'>
          <Form.Item className='sidebar-common-rent__entry' name='k'>
            <Input
              className='input-common'
              placeholder={t('HomeRealEstateSearchFormSearchFieldPlaceHolder')}
              allowClear
              suffix={
                <ButtonCore type='submit' buttonType='search'/>
              }
            />
          </Form.Item>
          <div className='sidebar-common-rent__entry'>
            <SelectCommonType filterBy={filterBy} setFilterBy={seFilterBy} t={t} />
          </div>
          <Form.Item className='sidebar-common-rent__entry' name='c'>
            <Select
              className='select-common'
              placeholder={t('HomeRealEstateSearchFormType')}
              allowClear
              showSearch
              optionFilterProp='label'
              filterOption={(input, option) =>
                String(option?.label ?? '').toLowerCase().includes(String(input).toLowerCase())
              }
              options={
                (filterBy === listingType.sale ? saleCategories : rentCategories)?.map(
                  (item) => ({
                    label: item.name,
                    value: item.id,
                  })
                )
              }
            />
          </Form.Item>
          <Form.Item className='sidebar-common-rent__entry' name='rp'>
            <PopupSearchPrice
              className='select-common'
              typeft={filterBy}
              defaultValue={
                filterBy === listingType.sale
                  ? [500000000, 5000000000]
                  : [10000000, 35000000]
              }
              placeholder={t('HomeRealEstateSearchFormPriceFieldPlaceHolder')}
            />
          </Form.Item>
          <div className={clsx('sidebar-common-rent__entry', buttonCommonSearchAdvancedValue)}>
            {buttonCommonSearchAdvanced(
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
        </div>
        <div className='sidebar-common-rent__wrapper sidebar-common-rent__wrapper--mobile'>
          <div className='form-common-listing'>
            <div className='form-common-listing__wrapper'>
              <div className='form-common-listing__entry form-common-listing__entry--stacked'>
                <span className='form-common-listing__entry-label'>{t('HomeRealEstateSearchFormSearch')}</span>
                <div className='form-common-listing__entry-wrapper'>
                  <Form.Item className='form-common-listing__entry-item' name='k'>
                    <Input
                      className='input-common input-common--search'
                      placeholder={t('HomeRealEstateSearchFormSearchFieldPlaceHolder')}
                      allowClear
                      />
                  </Form.Item>
                  <div className='form-common-listing__entry-item'>
                    <SelectCommonType filterBy={filterBy} setFilterBy={seFilterBy} t={t} />
                  </div>
                </div>
              </div>
              <div className='form-common-listing__entry form-common-listing__entry--stacked'>
                <span className='form-common-listing__entry-label'>{t('HomeRealEstateSearchFormType')}</span>
                <div className='form-common-listing__entry-wrapper'>
                  <Form.Item className='form-common-listing__entry-item' name='c'>
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
                </div>
              </div>
              <div className='form-common-listing__entry form-common-listing__entry--stacked'>
                <span className='form-common-listing__entry-label'>{t('HomeRealEstateSearchFormPrice')}</span>
                <div className='form-common-listing__entry-wrapper'>
                  <Form.Item className='form-common-listing__entry-item' name='rp'>
                    <PopupSearchPrice
                      className='select-common'
                      typeft={filterBy}
                      placeholder={t('HomeRealEstateSearchFormPriceFieldPlaceHolder')}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className='form-common-listing__entry form-common-listing__entry--end'>
                <span className='form-common-listing__entry-label'>{t('HomeRealEstateSearchFormMoreFilter')}</span>
                <div className='form-common-listing__entry-wrapper'>
                  <Form.Item className='form-common-listing__entry-item'>
                    <div onClick={() => setIsMobileMoreFilterModalOpen(!isMobileMoreFilterModalOpen)}>
                      <Select
                        className='select-common'
                        placeholder={t('HomeRealEstateSearchFormMoreFilterFieldPlaceHolder')}
                        value={selectedMoreFilterArea}
                        open={false}
                      />
                    </div>
                  </Form.Item>
                </div>
              </div>
            </div>
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
            <div className='form-common-listing__controller'>
              <ButtonCore type='submit' label={`${t('HomeRealEstateSearchFormSearch')}!`} />
            </div>
          </div>
        </div>
      </Form>
    </>
  );
};

export default SidebarRent;
