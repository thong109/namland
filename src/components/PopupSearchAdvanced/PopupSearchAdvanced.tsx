'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Button, Checkbox, Form, Select } from 'antd';
import type { FormInstance } from 'antd';
import { handOverStatuses, legalStatuses, listingRentLeaseTerm, listingType } from '@/libs/appconst';
import { filterOptionsRemoveVietnameseTones, formatDate } from '@/libs/helper';
import './PopupSearchAdvanced.css';

export interface IProps {
  formRef: FormInstance<any>;
  filterBy?: number;
  views?: { id: number | string; name: string }[];
  inAmenities?: { id: number | string; name: string; imageUrl?: string }[];
  outAmenities?: { id: number | string; name: string; imageUrl?: string }[];
  furnitureStatus?: { id: number | string; interiorName: string }[];
  onFormChange?: (changedValues: any, allValues: any) => void;
  onChangePopup?: (value: boolean) => void;
  notActionButton?: boolean;
}

const AdvanceSearchListing = ({
  views = [],
  inAmenities = [],
  outAmenities = [],
  furnitureStatus = [],
  formRef,
  filterBy = listingType.sale,
  onFormChange,
  onChangePopup,
  notActionButton = false,
}: IProps) => {
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  const popupRef = useRef<HTMLDivElement>(null);

  const handleApply = () => {
    onChangePopup?.(false);
  };

  const handleReset = () => {
    formRef?.resetFields();
    onFormChange?.({}, formRef?.getFieldsValue());
  };

  return (
    <Form className="form-common-listing" form={formRef} onValuesChange={onFormChange} layout="vertical">
      <div className="form-common-listing__wrapper">
        <div className="form-common-listing__entry form-common-listing__entry--stacked">
          <span className="form-common-listing__entry-label">
            {t('HomeRealEstateSearchFormView')}
          </span>
          <div className="form-common-listing__entry-wrapper">
            <Form.Item name="v" className="!mb-0">
              <Select
                className="select-common"
                placeholder={t('HomeRealEstateSearchFormView')}
                allowClear
                filterOption={filterOptionsRemoveVietnameseTones}
                getPopupContainer={(trigger) => trigger.parentElement!}
                options={views.map((view) => ({
                  label: view.name,
                  value: view.id,
                }))}
              />
            </Form.Item>
          </div>
        </div>
        {filterBy === listingType.sale && (
          <>
            <div className="form-common-listing__entry form-common-listing__entry--stacked">
              <span className="form-common-listing__entry-label">
                {t('HomeRealEstateSearchFormLegalStatus')}
              </span>
              <div className="form-common-listing__entry-wrapper">
                <Form.Item name="lS" className="!mb-0">
                  <Select
                    className="select-common"
                    placeholder={t('HomeRealEstateSearchFormLegalStatus')}
                    allowClear
                    getPopupContainer={(trigger) => trigger.parentElement!}
                    options={legalStatuses.map((term) => ({
                      label: t(term.name),
                      value: term.id,
                    }))}
                  />
                </Form.Item>
              </div>
            </div>
          </>
        )}
        {filterBy === listingType.rent && (
          <>
            <div className="form-common-listing__entry form-common-listing__entry--stacked">
              <span className="form-common-listing__entry-label">
                {t('HomeRealEstateSearchFormLeaseTerm')}
              </span>
              <div className="form-common-listing__entry-wrapper">
                <Form.Item name="lt" className="!mb-0">
                  <Select
                    className="select-common"
                    placeholder={t('HomeRealEstateSearchFormLeaseTerm') || 'Chọn thời hạn thuê'}
                    allowClear
                    getPopupContainer={(trigger) => trigger.parentElement!}
                    options={listingRentLeaseTerm.map((term) => ({
                      label: comm(term.name),
                      value: term.id,
                    }))}
                  />
                </Form.Item>
              </div>
            </div>
          </>
        )}
        <div className="form-common-listing__entry form-common-listing__entry--stacked">
          <span className="form-common-listing__entry-label">
            {t('HomeRealEstateSearchFormFurnitureStatus')}
          </span>
          <div className="form-common-listing__entry-wrapper">
            <Form.Item name="i" className="!mb-0">
              <Select
                className="select-common"
                placeholder={t('HomeRealEstateSearchFormFurnitureStatus')}
                allowClear
                getPopupContainer={(trigger) => trigger.parentElement!}
                options={furnitureStatus.map((item) => ({
                  label: item.interiorName,
                  value: item.id,
                }))}
              />
            </Form.Item>
          </div>
        </div>
        {filterBy === listingType.sale && (
          <>
            <div className="form-common-listing__entry form-common-listing__entry--stacked">
              <span className="form-common-listing__entry-label">
                {t('HomeRealEstateSearchFormHandoverStatus')}
              </span>
              <div className="form-common-listing__entry-wrapper">
                <Form.Item name="hS" className="!mb-0">
                  <Select
                    className="select-common"
                    placeholder={t('HomeRealEstateSearchFormHandoverStatus')}
                    allowClear
                    getPopupContainer={(trigger) => trigger.parentElement!}
                    options={handOverStatuses.map((term) => ({
                      label: t(term.name),
                      value: term.id,
                    }))}
                  />
                </Form.Item>
              </div>
            </div>
          </>
        )}
        {filterBy === listingType.rent && (
          <>
            <div className="form-common-listing__entry form-common-listing__entry--stacked">
              <span className="form-common-listing__entry-label">
                {t('HomeRealEstateSearchFormPetAllowance')}
              </span>
              <div className="form-common-listing__entry-wrapper">
                <Form.Item name="iPA" className="!mb-0">
                  <Select
                    className="select-common"
                    placeholder={t('HomeRealEstateSearchFormPetAllowance') || 'Chọn thời hạn thuê'}
                    allowClear
                    getPopupContainer={(trigger) => trigger.parentElement!}
                    options={[
                      { id: true, name: 'Yes' },
                      { id: false, name: 'No' },
                    ].map((item) => ({
                      label: comm(item.name),
                      value: item.id,
                    }))}
                  />
                </Form.Item>
              </div>
            </div>
          </>
        )}
        <div className="form-common-listing__entry form-common-listing__entry--stacked">
          <span className="form-common-listing__entry-label">
            {t('inDoorAmenities')}
          </span>
          <div className="form-common-listing__entry-wrapper">
            <Form.Item name="indoorAmenities" className="!mb-0">
              <Checkbox.Group className="checkbox-common">
                {inAmenities.map((a) => (
                  <Checkbox key={a.id} value={a.id}>
                    {a.name}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            </Form.Item>
          </div>
        </div>
        <div className="form-common-listing__entry form-common-listing__entry--stacked">
          <span className="form-common-listing__entry-label">
            {t('outDoorAmenities')}
          </span>
          <div className="form-common-listing__entry-wrapper">
            <Form.Item name="outdoorAmenities" className="!mb-0">
              <Checkbox.Group className="checkbox-common">
                {outAmenities.map((a) => (
                  <Checkbox key={a.id} value={a.id}>
                    {a.name}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            </Form.Item>
          </div>
        </div>
      </div>
      {!notActionButton && (
        <div className="popup-common-searchadvanced__controller">
          <Button className='button-common button-common--reset' onClick={handleReset}>{t('HomeSearchResetButton')}</Button>
          <Button className='button-common' onClick={handleApply}>{t('HomeSearchAplyButton')}</Button>
        </div>
      )}
    </Form>
  );
};

export default AdvanceSearchListing;
