'use client';
import ChipSelectionField from '@/_components/ChipSelectionField/ChipSelectionField';
import CoreButton from '@/_components/CoreButton/CoreButton';
import SliderRange from '@/components/FormInput/sliderRange';
import { NAVIGATION } from '@/data/navigation';
import { getEcomEcomPlaceGetDistrict, getEcomEcomPlaceGetWard } from '@/ecom-sadec-api-client';
import {
  getParamsStringFromObj,
  handOverStatuses,
  legalStatuses,
  listLangue,
  listingRentLeaseTerm,
  listingType,
} from '@/libs/appconst';
import { filterOptionsRemoveVietnameseTones, formatDate } from '@/libs/helper';
import { ShortHomeRealEstateSearchModel } from '@/models/homeRealEstateSearchModel/homeRealEstateSearchModel';
import { Button, Checkbox, DatePicker, Form, Input, Radio, Select } from 'antd';
import dayjs from 'dayjs';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import * as NProgress from 'nprogress';
import { FC, useEffect, useState } from 'react';
import * as pixel from '@/utils/pixel';
import './SidebarListing.css';
import { assetsImages } from '../../../../assets/images/package';

export interface IProps {
  saleCategories?: any;
  properties?: any;
  provinces?: any;
  projects?: any;
  views?: any;
  inAmenities?: any;
  outAmenities?: any;
  funitureStatus?: any;
  type: any;
  searchParams: ShortHomeRealEstateSearchModel;
  onOffFiltter?: () => void;
  className?: any;
}

const SidebarListing: FC<IProps> = ({
  properties = [],
  provinces = [],
  projects = [],
  views = [],
  inAmenities = [],
  outAmenities = [],
  funitureStatus = [],
  type = listingType.sale,
  searchParams = {},
  onOffFiltter,
  className,
}) => {
  const locale = useLocale();
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  const [formRef] = Form.useForm();
  const { push } = useRouter();
  const [districts, setDistricts] = useState(null);
  const [wards, setWards] = useState(null);
  const [isShowMore, setIsShowMore] = useState<boolean>(false);
  useEffect(() => {
    formRef.setFieldsValue({
      ...searchParams,
      fmd: searchParams.fmd ? dayjs(searchParams.fmd) : undefined,
      tmd: searchParams.tmd ? dayjs(searchParams.tmd) : undefined,
    });
    if (searchParams.p) {
      getDistricts(searchParams.p).then(() => formRef.setFieldValue('d', searchParams.d));
    }
    if (searchParams.d) {
      getWards(searchParams.d).then(() => formRef.setFieldValue('w', searchParams.w));
    }
  }, [searchParams]);
  const getDistricts = async (provinceId) => {
    formRef.resetFields(['d', 'w']);
    const result = await getEcomEcomPlaceGetDistrict({ provinceId });
    setDistricts((result as any).data?.data);
  };
  const getWards = async (districtId) => {
    formRef.resetFields(['w']);
    const result = await getEcomEcomPlaceGetWard({ districtId });
    setWards((result as any).data?.data);
  };
  const onSubmit = async (values) => {
    const dataFilter: ShortHomeRealEstateSearchModel = values;
    // always include poster brokder if it's available
    if (searchParams.pb) {
      dataFilter.pb = searchParams.pb;
    }
    if (dataFilter.fmd) {
      dataFilter.fmd = dayjs(dataFilter.fmd).toJSON();
    }
    if (dataFilter.tmd) {
      dataFilter.tmd = dayjs(dataFilter.tmd).toJSON();
    }
    const paramsString = getParamsStringFromObj(dataFilter);
    NProgress.start();
    pixel.search(paramsString);
    switch (type) {
      case listingType.sale:
        push(NAVIGATION.saleListing.href + '?' + paramsString);
        break;
      case listingType.rent:
        push(NAVIGATION.rentListing.href + '?' + paramsString);
        break;
    }
    onOffFiltter && onOffFiltter();
  };
  const resetFilter = () => {
    formRef.resetFields();
  };
  return (
    <div className={`sidebar-common-listing ${className}`}>
      <div className='sidebar-common-listing__wrapper'>
        <Form className='form-common-listing' form={formRef} size='large' layout='vertical' onFinish={onSubmit}>
          <Form.Item name='k'>
            <Input
              className='input-common-listing input-common-listing--search'
              placeholder={t('ListingSearchPlaceholderKeyword')}
              style={{ backgroundImage: `url(${assetsImages.commonIconSearch.src})` }}
              allowClear
            />
          </Form.Item>
          <Form.Item name='c'>
            <Select
              className='select-common-listing'
              mode='multiple'
              allowClear
              placeholder={t('ListingSearchPlaceholderCategories')}
            >
              {properties?.map((property) => (
                <Select.Option key={property.id} value={property.id}>
                  {property.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name='prjs'>
            <Select
              className='select-common-listing'
              mode='multiple'
              allowClear
              filterOption={filterOptionsRemoveVietnameseTones}
              placeholder={t('EcomHomePageMenuProjects')}
            >
              {projects?.map((project) => (
                <Select.Option key={project.id} value={project.id}>
                  {project.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label={t('HomeRealEstateSearchFormBedroom')} name='br'>
            <ChipSelectionField
              hasAny
              multiple
              options={[
                { name: '1', id: 1 },
                { name: '2', id: 2 },
                { name: '3', id: 3 },
                { name: '4', id: 4 },
                { name: '> 4', id: 5 },
              ]}
            />
          </Form.Item>
          <Form.Item
            label={t('HomeRealEstateSearchFormBathroom')}
            className='border-t border-neutral-500 pt-1'
            name='bathr'
          >
            <ChipSelectionField
              hasAny
              multiple
              options={[
                { name: '1', id: 1 },
                { name: '2', id: 2 },
                { name: '3', id: 3 },
                { name: '4', id: 4 },
                { name: '> 4', id: 5 },
              ]}
            />
          </Form.Item>
          {type === listingType.rent && (
            <Form.Item
              label={t('HomeRealEstateSearchFormLeaseTerm')}
              className='border-t border-neutral-500 pt-1'
              name='lt'
            >
              <ChipSelectionField
                hasAny
                tidyItem
                options={listingRentLeaseTerm.map((item) => ({
                  id: item.id,
                  name: comm(item.name),
                }))}
              />
            </Form.Item>
          )}
          <Form.Item
            label={t('HomeRealEstateSearchFormPrice')}
            className='border-t border-neutral-500 pt-1'
            name='rp'
          >
            <SliderRange min={0} max={type === listingType.rent ? 100000000 : 20000000000} />
          </Form.Item>
          <Form.Item
            label={t('HomeRealEstateSearchFormSize')}
            name='sz'
            className='border-t border-neutral-500 pt-1'
          >
            <SliderRange min={0} max={500} />
          </Form.Item>
          <Form.Item
            label={t('HomeRealEstateSearchFormLocation')}
            name='p'
            className='border-t border-neutral-500 pt-1'
          >
            <Select
              placeholder={t('ListingSearchPlaceholderProvince')}
              showSearch
              className='select-common-listing'
              filterOption={filterOptionsRemoveVietnameseTones}
              allowClear
              onChange={getDistricts}
              options={provinces?.map((province) => ({
                value: province.provinceID,
                label: province.listProvinceName,
                id: province.provinceID,
              }))}
            />
          </Form.Item>
          <Form.Item name='d'>
            <Select
              placeholder={t('ListingSearchPlaceholderDistrict')}
              className='select-common-listing'
              showSearch
              filterOption={filterOptionsRemoveVietnameseTones}
              allowClear
              onChange={getWards}
              options={districts?.map((district) => ({
                value: district.listDistrictID,
                label: district.nameDisplay,
                id: district.listDistrictID,
              }))}
            />
          </Form.Item>
          <Form.Item name='w'>
            <Select
              placeholder={t('ListingSearchPlaceholderWard')}
              className='select-common-listing'
              showSearch
              filterOption={filterOptionsRemoveVietnameseTones}
              allowClear
              options={wards?.map((ward) => ({
                value: ward.listWardID,
                label: ward.nameDisplay,
                id: ward.listWardID,
              }))}
            />
          </Form.Item>
          {type === listingType.rent && (
            <div className='flex flex-col gap-2 border-t border-neutral-500 pt-1'>
              <label className='font-bold'>{t('HomeRealEstateSearchFormCanMoveInDate')}</label>
              <div className='w-full lg:flex lg:items-center lg:gap-3'>
                <Form.Item name={'fmd'}>
                  <DatePicker
                    className='w-full !rounded-none'
                    placeholder={comm('SelectDate')}
                    format={formatDate}
                    allowClear={true}
                  />
                </Form.Item>
                <label className='mb-3 font-semibold'>{comm('To')}</label>
                <Form.Item name={'tmd'}>
                  <DatePicker
                    className='w-full !rounded-none'
                    placeholder={comm('SelectDate')}
                    format={formatDate}
                    allowClear={true}
                  />
                </Form.Item>
              </div>
            </div>
          )}
          <Form.Item
            label={t('HomeRealEstateSearchFormView')}
            name='v'
            className='border-t border-neutral-500 pt-1'
          >
            <ChipSelectionField tidyItem hasAny multiple options={views ?? []} />
          </Form.Item>
          {isShowMore && (
            <>
              {type === listingType.sale && (
                <>
                  <Form.Item
                    label={t('HomeRealEstateSearchFormLegalStatus')}
                    name='lS'
                    className='border-t border-neutral-500 pt-1'
                  >
                    <ChipSelectionField
                      hasAny
                      tidyItem
                      multiple
                      options={legalStatuses.map((item) => ({
                        id: item.id,
                        name: t(item.name),
                      }))}
                    />
                  </Form.Item>
                  <Form.Item
                    label={t('HomeRealEstateSearchFormHandoverStatus')}
                    name='hS'
                    className='border-t border-neutral-500 pt-1'
                  >
                    <ChipSelectionField
                      hasAny
                      tidyItem
                      options={handOverStatuses.map((item) => ({
                        id: item.id,
                        name: t(item.name),
                      }))}
                    />
                  </Form.Item>
                </>
              )}

              <>
                <Form.Item
                  label={t('HomeRealEstateSearchFormFurnitureStatus')}
                  name='i'
                  className='border-t border-neutral-500 pt-1'
                >
                  <ChipSelectionField
                    hasAny
                    multiple
                    tidyItem
                    options={funitureStatus?.map((item) => ({
                      id: item.id,
                      name: item.interiorName,
                    }))}
                  />
                </Form.Item>
                <Form.Item
                  label={t('HomeRealEstateSearchFormPetAllowance')}
                  name='iPA'
                  className='border-t border-neutral-500 pt-1'
                >
                  <ChipSelectionField
                    hasAny
                    tidyItem
                    options={[
                      { id: true, name: 'Yes' },
                      { id: false, name: 'No' },
                    ].map((item) => ({
                      id: item.id,
                      name: comm(item.name),
                    }))}
                  />
                </Form.Item>
              </>

              <Form.Item
                name='odb'
                label={t('ListingSearchFormCreateTime')}
                className='border-t border-neutral-500 pt-1'
              >
                <Radio.Group className='grid w-full grid-cols-2 gap-x-1 gap-y-2'>
                  <Radio value={false}>{comm('NewestFirst')}</Radio>
                  <Radio value={true}>{comm('OldestFirst')}</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label={t('inDoorAmenities')}
                name='inA'
                valuePropName='checked'
                className='border-t border-neutral-500 pt-1'
              >
                <Checkbox.Group
                  defaultValue={searchParams.inA}
                  className='grid w-full grid-cols-2 gap-x-1 gap-y-2'
                  options={inAmenities.map((amenity) => ({
                    value: amenity.id,
                    label: amenity.name,
                  }))}
                />
              </Form.Item>

              <Form.Item
                label={t('outDoorAmenities')}
                name='outA'
                valuePropName='checked'
                className='border-t border-neutral-500 pt-1'
              >
                <Checkbox.Group
                  defaultValue={searchParams.outA}
                  className='grid w-full grid-cols-2 gap-x-1 gap-y-2'
                  options={outAmenities.map((amenity) => ({
                    value: amenity.id,
                    label: amenity.name,
                  }))}
                />
              </Form.Item>

              <Form.Item
                label={t('ListingSearchContentLanguage')}
                name='lan'
                valuePropName='checked'
                className='border-t border-neutral-500 pt-1'
              >
                <Checkbox.Group
                  defaultValue={searchParams.lan}
                  className='grid w-full grid-cols-2 gap-x-1 gap-y-2'
                  options={listLangue.map((lan) => ({
                    value: lan.name,
                    label: lan.displayName,
                  }))}
                />
              </Form.Item>
            </>
          )}
          <div className='flex w-full justify-center'>
            <Button
              className='w-fit underline underline-offset-2'
              size='small'
              type='text'
              onClick={() => setIsShowMore(!isShowMore)}
            >
              {isShowMore ? comm('viewLess') : comm('viewMore')}
            </Button>
          </div>
          <div className='mt-3 flex justify-center gap-2'>
            <CoreButton
              onClick={resetFilter}
              preset='neutral'
              label={t('HomeRealEstateSearchFormClearFilter')}
            />
            <CoreButton type='submit' label={t('HomeRealEstateSearchFormSearch')} />
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SidebarListing;
