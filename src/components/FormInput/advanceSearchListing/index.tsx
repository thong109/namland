import SelectorChip from '@/components/SelectorChip/SelectorChip';
import ButtonCore from '@/components/ButtonCore/ButtonCore';
import {
  amenityType,
  handOverStatuses,
  legalStatuses,
  listingRentLeaseTerm,
  listingType,
} from '@/libs/appconst';
import { OptionModel } from '@/models/optionModel/optionModel';
import { Form } from 'antd';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import FormSelectIcon from '../FormSelectIcon';

export interface IProps {
  formref: any;
  filterBy: number;
  views?: OptionModel[];
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
    <div
      ref={popupRef}
      className={clsx(
        `transform transition-all duration-300`,
        'translate-y-0 opacity-100',
        `bg-white px-4`,
        'scrollbar-hidden relative max-h-[80vh] overflow-scroll',
      )}
    >
      <Form
        onValuesChange={onFormChange}
        form={formref}
        className="search-form flex flex-col"
        layout="vertical"
      >
        <Form.Item label={t('HomeRealEstateSearchFormView')} name="v">
          <SelectorChip hasAny multiple options={views ?? []} />
        </Form.Item>
        {filterBy === listingType.sale ? (
          <>
            <Form.Item label={t('HomeRealEstateSearchFormLegalStatus')} name="lS">
              <SelectorChip
                hasAny
                multiple
                options={legalStatuses.map((item) => ({
                  id: item.id,
                  name: t(item.name),
                }))}
              />
            </Form.Item>
            <Form.Item label={t('HomeRealEstateSearchFormFurnitureStatus')} name="i">
              <SelectorChip
                hasAny
                multiple
                options={funitureStatus?.map((item) => ({
                  id: item.id,
                  name: item.interiorName,
                }))}
              />
            </Form.Item>
            <Form.Item label={t('HomeRealEstateSearchFormHandoverStatus')} name="hS">
              <SelectorChip
                hasAny
                multiple
                options={handOverStatuses.map((item) => ({
                  id: item.id,
                  name: t(item.name),
                }))}
              />
            </Form.Item>
          </>
        ) : (
          <>
            <Form.Item label={t('HomeRealEstateSearchFormLeaseTerm')} name="lt">
              <SelectorChip
                hasAny
                options={listingRentLeaseTerm.map((item) => ({
                  id: item.id,
                  name: comm(item.name),
                }))}
              />
            </Form.Item>
            <Form.Item label={t('HomeRealEstateSearchFormFurnitureStatus')} name="i">
              <SelectorChip
                hasAny
                multiple
                options={funitureStatus?.map((item) => ({
                  id: item.id,
                  name: item.interiorName,
                }))}
              />
            </Form.Item>
            <Form.Item label={t('HomeRealEstateSearchFormPetAllowance')} name="iPA">
              <SelectorChip
                hasAny
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
        )}
        <label className="text-base font-medium">{t('Amenities')}</label>

        <label className="text-base">{t('inDoorAmenities')}</label>
        <FormSelectIcon
          amenityEnum={amenityType.In}
          name="inA"
          options={inAmenities?.map((p) => ({
            name: p.name,
            value: p.id,
            imageUrl: p.imageUrl,
          }))}
        />
        <label className="text-base">{t('outDoorAmenities')}</label>
        <FormSelectIcon
          amenityEnum={amenityType.Out}
          name="outA"
          options={outAmenities?.map((p) => ({
            name: p.name,
            value: p.id,
            imageUrl: p.imageUrl,
          }))}
        />

        {!notActionButton && (
          <div className="sticky bottom-0 flex justify-center gap-2 bg-white p-2">
            <ButtonCore onClick={handleReset} preset="neutral" label={t('HomeSearchResetButton')} />
            <ButtonCore type="submit" onClick={handleApply} label={t('HomeSearchAplyButton')} />
          </div>
        )}
      </Form>
    </div>
  );
};

export default AdvanceSearchListing;
