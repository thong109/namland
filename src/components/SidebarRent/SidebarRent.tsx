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

  const SaleOrRentSelect = ({ filterBy, setFilterBy, t }) => {
    return (
      <Select
        value={filterBy}
        onChange={(value) => setFilterBy(value)}
        className='w-full max-w-xs'
        size='large'
        popupClassName='rounded-xl'
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

  const popupFilter = (
    title: string,
    component: React.ReactNode,
    hasOKButton?: boolean,
    resetAction?: () => void,
  ) => {
    return (
      <Popconfirm
        className='cursor-pointer'
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
        <div className='flex items-center justify-center gap-1 overflow-hidden font-semibold'>
          <span>{title}</span> <ChevronDownIcon className='size-4' />{' '}
        </div>
      </Popconfirm>
    );
  };

  return (
    <>
      <div className={clsx('sidebar-common-rent')}>
        <div className={clsx('container', filterBy === listingType.sale && 'rounded-tl-none')}>
          <Form className='form-common-rent' form={form} layout='vertical' onFinish={onSubmit} size='large'>
            <div className='hidden flex-row divide-neutral-500 lg:flex'>
              <div className='col-span-5'>
                <Form.Item
                  name='k'
                  className='hidden lg:block [&_.ant-input-affix-wrapper]:!rounded-none [&_.ant-input-affix-wrapper]:border-neutral-500 [&_.ant-input-affix-wrapper]:!py-0 [&_.ant-input-affix-wrapper]:!pr-0'
                >
                  <Input
                    placeholder={t('HomeRealEstateSearchFormSearchFieldPlaceHolder')}
                    prefix={<MagnifyingGlassIcon className='size-4' />}
                    allowClear
                    suffix={
                      <ButtonCore
                        type='submit'
                        className='!rounded-none border-l border-l-neutral-500 px-6 !text-pmh-text'
                        label={`${t('HomeRealEstateSearchFormSearch')}!`}
                      />
                    }
                  />
                </Form.Item>
              </div>
              <div className='pr-8'>
                <SaleOrRentSelect
                  filterBy={filterBy}
                  setFilterBy={seFilterBy}
                  t={t}
                />
              </div>
              <div className='flex flex-grow flex-row items-center gap-2 pl-8'>
                <Form.Item
                  name='c'
                  className='w-[22%]'
                >
                  <Select
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
                <Form.Item
                  name='rp'
                  className='w-[22%]'
                >
                  <PopupSearchPrice
                    typeft={filterBy}
                    defaultValue={
                      filterBy === listingType.sale
                        ? [500000000, 5000000000]
                        : [10000000, 35000000]
                    }
                    placeholder={t('HomeRealEstateSearchFormPriceFieldPlaceHolder')}
                  />
                </Form.Item>
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
              </div>
            </div>
            {/* mobile */}
            <div className='flex flex-col lg:hidden'>
              <div className='mb-4'>
                <SaleOrRentSelect
                  filterBy={filterBy}
                  setFilterBy={seFilterBy}
                  t={t}
                />
              </div>
              <Form.Item
                name='k'
                className='[&_.ant-input-affix-wrapper]:!rounded-none'
                label={t('HomeRealEstateSearchFormSearch')}
              >
                <Input
                  allowClear
                  placeholder={t('HomeRealEstateSearchFormSearchFieldPlaceHolder')}
                  suffix={<MagnifyingGlassIcon className='size-4' />}
                />
              </Form.Item>
              <Form.Item
                label={t('HomeRealEstateSearchProject')}
                name='prjs'
                className='lg:hidden [&_.ant-select-selector]:!rounded-none'
              >
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
                  placeholder={t('HomeRealEstateSearchFormType')}
                  allowClear
                  className='no-raidus-selector'
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
                <PopupSearchPrice
                  className='no-raidus-selector'
                  typeft={filterBy}
                  placeholder={t('HomeRealEstateSearchFormPriceFieldPlaceHolder')}
                />
              </Form.Item>

              <Form.Item name='p' label={t('HomeRealEstateSearchFormLocation')}>
                <Select
                  placeholder={t('ListingSearchPlaceholderProvince')}
                  showSearch
                  // allowClear={{ clearIcon: <>x</> }}
                  allowClear
                  filterOption={filterOptionsRemoveVietnameseTones}
                  className='no-raidus-selector'
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
                    className='no-raidus-selector w-full'
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

              <div className='mb-4 cursor-pointer text-center underline' onClick={resetFilter}>
                {t('HomeRealEstateSearchFormClearFilter')}
              </div>

              <ButtonCore
                type='submit'
                className='!rounded-none border border-neutral-500 px-6 !text-pmh-text'
                label={`${t('HomeRealEstateSearchFormSearch')}!`}
              />
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default SidebarRent;
