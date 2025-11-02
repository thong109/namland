'use client';
import SelectorChip from '@/components/SelectorChip/SelectorChip';
import ButtonCore from '@/components/ButtonCore/ButtonCore';
import Range from '@/components/Range/Range';
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
import { assetsImages } from '@/assets/images/package';

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
    push(window.location.pathname);
  };
  return (
    <div className={`sidebar-common-listing ${className}`}>
      <div className='sidebar-common-listing__wrapper'>
        <Form className='form-common-listing' form={formRef} size='large' layout='vertical' onFinish={onSubmit}>
          <div className='form-common-listing__wrapper'>
            <div className='form-common-listing__entry form-common-listing__entry--basic'>
              <div className='form-common-listing__entry-wrapper form-common-listing__entry-wrapper--width-full'>
                <Form.Item className='form-common-listing__entry-item' name='k'>
                  <Input
                    className='input-common input-common--search'
                    placeholder={t('ListingSearchPlaceholderKeyword')}
                    allowClear
                  />
                </Form.Item>
                <Form.Item className='form-common-listing__entry-item' name='c'>
                  <Select
                    className='select-common'
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
                <Form.Item className='form-common-listing__entry-item' name='prjs'>
                  <Select
                    className='select-common'
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
              </div>
            </div>
            <div className='form-common-listing__entry form-common-listing__entry--wrapping'>
              <span className='form-common-listing__entry-label'>{t('HomeRealEstateSearchFormBedroom')}</span>
              <div className='form-common-listing__entry-wrapper'>
                <Form.Item className='form-common-listing__entry-item' name='br'>
                  <SelectorChip
                    multiple
                    options={[
                      { name: '1', id: 1 },
                      { name: '2', id: 2 },
                      { name: '3', id: 3 },
                      { name: '4', id: 4 },
                      { name: '5', id: 5 },
                      { name: '6+', id: 6 },
                    ]}
                  />
                </Form.Item>
              </div>
            </div>
            <div className='form-common-listing__entry form-common-listing__entry--wrapping'>
              <span className='form-common-listing__entry-label'>{t('HomeRealEstateSearchFormBathroom')}</span>
              <div className='form-common-listing__entry-wrapper'>
                <Form.Item className='form-common-listing__entry-item' name='bathr'>
                  <SelectorChip
                    multiple
                    options={[
                      { name: '1', id: 1 },
                      { name: '2', id: 2 },
                      { name: '3', id: 3 },
                      { name: '4', id: 4 },
                      { name: '5', id: 5 },
                      { name: '6+', id: 6 },
                    ]}
                  />
                </Form.Item>
              </div>
            </div>
            <div className='form-common-listing__entry form-common-listing__entry--range'>
              <span className='form-common-listing__entry-label'>{t('HomeRealEstateSearchFormPrice')}</span>
              <div className='form-common-listing__entry-wrapper'>
                <Form.Item name="rp" noStyle>
                  <Range min={0} max={type === listingType.rent ? 100000000 : 20000000000} />
                </Form.Item>
              </div>
            </div>
            <div className='form-common-listing__entry form-common-listing__entry--range'>
              <span className='form-common-listing__entry-label'>{t('HomeRealEstateSearchFormSize')}</span>
              <div className='form-common-listing__entry-wrapper'>
                <Form.Item name="sz" noStyle>
                  <Range min={0} max={500} />
                </Form.Item>
              </div>
            </div>
            <div className='form-common-listing__entry form-common-listing__entry--stacked'>
              <span className='form-common-listing__entry-label'>{t('HomeRealEstateSearchFormLocation')}</span>
              <div className='form-common-listing__entry-wrapper'>
                <Form.Item className='form-common-listing__entry-item' name='p'>
                  <Select
                    className='select-common'
                    placeholder={t('ListingSearchPlaceholderProvince')}
                    showSearch
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
                <Form.Item className='form-common-listing__entry-item' name='d'>
                  <Select
                    className='select-common'
                    placeholder={t('ListingSearchPlaceholderDistrict')}
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
                <Form.Item className='form-common-listing__entry-item' name='w'>
                  <Select
                    className='select-common'
                    placeholder={t('ListingSearchPlaceholderWard')}
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
              </div>
            </div>
            <div className='form-common-listing__entry form-common-listing__entry--stacked'>
              <span className='form-common-listing__entry-label'>{t('HomeRealEstateSearchFormView')}</span>
              <div className='form-common-listing__entry-wrapper'>
                <Form.Item name='v' className='!mb-0'>
                  <Select
                    className='select-common'
                    placeholder={t('HomeRealEstateSearchFormView')}
                    allowClear
                    filterOption={filterOptionsRemoveVietnameseTones}
                  >
                    {views?.map((view) => (
                      <Select.Option key={view.id} value={view.id}>
                        {view.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>
            <div className='form-common-listing__entry form-common-listing__entry--stacked'>
              <span className='form-common-listing__entry-label'>{t('HomeRealEstateSearchFormFurnitureStatus')}</span>
              <div className='form-common-listing__entry-wrapper'>
                <Form.Item className='form-common-listing__entry-item' name='i'>
                  <SelectorChip
                    className='selector-common-chip--blocky'
                    options={funitureStatus?.map((item) => ({
                      id: item.id,
                      name: item.interiorName,
                    }))}
                  />
                </Form.Item>
              </div>
            </div>
            <div className='form-common-listing__entry form-common-listing__entry--stacked'>
              <span className='form-common-listing__entry-label'>{t('HomeRealEstateSearchFormLegalStatus')}</span>
              <div className='form-common-listing__entry-wrapper'>
                <Form.Item className='form-common-listing__entry-item' name='lS'>
                  <SelectorChip
                    className='selector-common-chip--blocky'
                    hasAny
                    multiple
                    options={legalStatuses.map((item) => ({
                      id: item.id,
                      name: t(item.name),
                    }))}
                  />
                </Form.Item>
              </div>
            </div>
            <div className='form-common-listing__entry form-common-listing__entry--stacked'>
              <span className='form-common-listing__entry-label'>{t('HomeRealEstateSearchFormHandoverStatus')}</span>
              <div className='form-common-listing__entry-wrapper'>
                <Form.Item className='form-common-listing__entry-item' name='hS' >
                  <SelectorChip
                    className='selector-common-chip--blocky'
                    hasAny
                    options={handOverStatuses.map((item) => ({
                      id: item.id,
                      name: t(item.name),
                    }))}
                  />
                </Form.Item>
              </div>
            </div>
            <div className='form-common-listing__entry form-common-listing__entry--wrapping'>
              <span className='form-common-listing__entry-label'>{t('ListingSearchFormCreateTime')}</span>
              <div className='form-common-listing__entry-wrapper'>
                <Form.Item className='form-common-listing__entry-item' name="odb">
                  <Radio.Group className='radio-common'>
                    <Radio value={false}>{comm('NewestFirst')}</Radio>
                    <Radio value={true}>{comm('OldestFirst')}</Radio>
                  </Radio.Group>
                </Form.Item>
              </div>
            </div>
            <div className='form-common-listing__entry form-common-listing__entry--stacked'>
              <span className='form-common-listing__entry-label'>{t('inDoorAmenities')}</span>
              <div className='form-common-listing__entry-wrapper'>
                <Form.Item className='form-common-listing__entry-item' name='inA' valuePropName='checked'>
                  <Checkbox.Group
                    className='checkbox-common'
                    defaultValue={searchParams.inA}
                    options={inAmenities.map((amenity) => ({
                      value: amenity.id,
                      label: amenity.name,
                    }))}
                  />
                </Form.Item>
              </div>
            </div>
            <div className='form-common-listing__entry form-common-listing__entry--stacked'>
              <span className='form-common-listing__entry-label'>{t('outDoorAmenities')}</span>
              <div className='form-common-listing__entry-wrapper'>
                <Form.Item className='form-common-listing__entry-item' name='outA' valuePropName='checked'>
                  <Checkbox.Group
                    className='checkbox-common'
                    defaultValue={searchParams.outA}
                    options={outAmenities.map((amenity) => ({
                      value: amenity.id,
                      label: amenity.name,
                    }))}
                  />
                </Form.Item>
              </div>
            </div>
            <div className='form-common-listing__entry form-common-listing__entry--end'>
              <span className='form-common-listing__entry-label'>{t('ListingSearchContentLanguage')}</span>
              <div className='form-common-listing__entry-wrapper'>
                <Form.Item className='form-common-listing__entry-item' name='lan' valuePropName='checked'>
                  <Checkbox.Group
                    className='checkbox-common'
                    defaultValue={searchParams.lan}
                    options={listLangue.map((lan) => ({
                      value: lan.name,
                      label: lan.displayName,
                    }))}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
          <div className='form-common-listing__controller'>
            <ButtonCore buttonType='destroy' preset='neutral' onClick={resetFilter} label={t('HomeRealEstateSearchFormClearFilter')} />
            <ButtonCore buttonType='search' type='submit' label={t('HomeRealEstateSearchFormSearch')} />
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SidebarListing;
