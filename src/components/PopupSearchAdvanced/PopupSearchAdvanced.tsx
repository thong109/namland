'use client';
import SelectorChip from '@/components/SelectorChip/SelectorChip';
import ButtonCore from '@/components/ButtonCore/ButtonCore';
import {
  getParamsStringFromObj,
  handOverStatuses,
  legalStatuses,
  listLangue,
  listingRentLeaseTerm,
  listingType,
} from '@/libs/appconst';
import { filterOptionsRemoveVietnameseTones, formatDate } from '@/libs/helper';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { Button, Checkbox, DatePicker, Form, Input, Radio, Select } from 'antd';

export interface IProps {
  formref: any;
  filterBy: number;
  views?: any;
  inAmenities?: any;
  outAmenities?: any;
  funitureStatus?: any;
  onFormChange?: (changedValues: any, allValues: any) => void;

  onChangePopup?: (value: boolean) => void;
  notActionButton?: boolean;
}

const AdvanceSearchListing = ({
  views = [],
  inAmenities = [],
  outAmenities = [],
  funitureStatus = [],
  formref,
  filterBy = listingType.sale,
  onFormChange,
  onChangePopup,
  notActionButton = false,
}: IProps) => {
  const comm = useTranslations('Common');
  const t = useTranslations('webLabel');
  const popupRef = useRef<HTMLDivElement>(null);

  const handleApply = () => {
    onChangePopup?.(false);
  };

  const handleReset = () => {
    formref?.resetFields();
  };

  return (
    <div className='popup-common-searchadvanced' ref={popupRef}>
      <Form className='form-common-listing' form={formref} onValuesChange={onFormChange} layout='vertical'>
        <div className='form-common-listing__wrapper'>
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
                <Select
                  className='select-common'
                  placeholder={t('HomeRealEstateSearchFormFurnitureStatus')}
                  options={funitureStatus?.map((item) => ({
                    id: item.id,
                    name: item.interiorName,
                  }))}
                />
              </Form.Item>
            </div>
          </div>
          <div className='form-common-listing__entry form-common-listing__entry--stacked'>
            <span className='form-common-listing__entry-label'>{t('inDoorAmenities')}</span>
            <div className='form-common-listing__entry-wrapper'>
              <Form.Item className='form-common-listing__entry-item' name='inA' valuePropName='checked'>
                <Checkbox.Group
                  className='checkbox-common'
                  name='inA'
                  options={inAmenities?.map((p) => ({
                    name: p.name,
                    value: p.id,
                    imageUrl: p.imageUrl,
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
                  name='outA'
                  options={outAmenities?.map((p) => ({
                    name: p.name,
                    value: p.id,
                    imageUrl: p.imageUrl,
                  }))}
                />
              </Form.Item>
            </div>
          </div>
        </div>
        {!notActionButton && (
          <div className='form-common-listing__controller'>
            <ButtonCore onClick={handleReset} preset='neutral' label={t('HomeSearchResetButton')} />
            <ButtonCore type='submit' onClick={handleApply} label={t('HomeSearchAplyButton')} />
          </div>
        )}
      </Form>
    </div>
  );
};

export default AdvanceSearchListing;
