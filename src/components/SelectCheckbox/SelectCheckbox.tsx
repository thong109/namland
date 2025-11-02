import ButtonCore from '@/components/ButtonCore/ButtonCore';
import { filterOptionsRemoveVietnameseTones } from '@/libs/helper';
import { Checkbox, Divider, Select } from 'antd';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';
import './SelectCheckbox.css';

export interface IProps {
  options: any[];
  placeholder: any;
  multiSelect?: boolean;
  onChange?: (value: string[]) => void;
  onSearch?: (value: string) => void;
  required?: boolean;
  showSearch?: boolean;
  disabled?: boolean;
}

const SelectCheckbox = ({
  options,
  multiSelect = false,
  onChange,
  required = false,
  showSearch = false,
  disabled = false,
  onSearch,
  placeholder = '',
}: IProps) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const t = useTranslations('webLabel');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const handleChange = (selectedValues: string[]) => {
    setSelectedItems(selectedValues);
    onChange?.(selectedValues);
  };

  const handleApply = () => {
    setDropdownVisible(false);
  };

  const handleReset = () => {
    setSelectedItems([]);
    onChange?.([]);
  };

  const renderOption = useCallback(
    (item: any) => (
      <Select.Option key={item.value} value={item.value} label={item.label}>
        <div className='flex justify-between'>
          {item.label}
          <Checkbox
            checked={selectedItems.includes(item.value)}
            onChange={(e) => {
              const isChecked = e.target.checked;
              const updatedItems = isChecked
                ? [...selectedItems, item.value]
                : selectedItems.filter((val) => val !== item.value);
              setSelectedItems(updatedItems);
              onChange?.(updatedItems);
            }}
            disabled={disabled}
          />
        </div>
      </Select.Option>
    ),
    [selectedItems, onChange, disabled],
  );

  return (
    <Select
      className='select-common select-common--has-checkbox'
      value={selectedItems}
      mode='multiple'
      placeholder={placeholder}
      style={{ width: '100%' }}
      open={dropdownVisible}
      onDropdownVisibleChange={(visible) => setDropdownVisible(visible)}
      dropdownRender={(menu) => (
        <div>
          {menu}
          <Divider style={{ margin: '8px 0' }} />
          <div className='flex items-end justify-between p-2'>
            <button className='button-common-resetfilters' onClick={handleReset} disabled={disabled}>
              {t('HomeSearchResetButton')}
            </button>
            <ButtonCore onClick={handleApply} label={`${t('HomeSearchAplyButton')}`}
            />
          </div>
        </div>
      )}
      showSearch={showSearch}
      filterOption={filterOptionsRemoveVietnameseTones}
      disabled={disabled}
      onSearch={onSearch}
      onChange={handleChange}
      allowClear
      maxTagCount='responsive'
      maxTagPlaceholder={() => '...'}
      tagRender={({ label }) => {
        return <>{label}</>;
      }}
    >
      {options.map(renderOption)}
    </Select>
  );
};

export default SelectCheckbox;
