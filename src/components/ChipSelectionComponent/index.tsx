'use client';

import { useTranslations } from 'next-intl';
import { ReactNode, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
export interface InputProps {
  options: {
    value: string | number;
    name: string | number;
    icon?: ReactNode;
  }[];
  multiSelect?: boolean;
  value?: any;
  onChange?: (value: any[]) => void;
  optionStyle?: 'chips' | 'iconLabel';
  shortListItem?: number;
  onClick?: (val) => void;
}

const ChipSelectionComponent = ({
  options,
  value,
  multiSelect = false,
  onChange,
  optionStyle = 'chips',
  shortListItem = isMobile ? 6 : 8,
  onClick,
}: InputProps) => {
  const t = useTranslations('webLabel');
  const [selected, setSelected] = useState<any>(
    value !== null && typeof value !== 'undefined' ? value : multiSelect ? [] : null,
  );
  const [isShowMore, setIsShowMore] = useState<boolean>(false);

  const onOptionSelect = (option: { value: string | number; name: string | number }) => {
    let result = null;

    if (multiSelect) {
      result = selected;
      const index = selected.findIndex((x) => x == option.value);
      if (index > -1) {
        result.splice(index, 1);
      } else {
        result.push(option.value);
      }

      setSelected([...result]);
    } else {
      result = selected == option.value ? null : option.value;
      onClick && onClick(result);
      setSelected(result);
    }
  };

  useEffect(() => {
    if (onChange) {
      onChange(selected);
    }
  }, [selected]);

  const renderChipStyle = () => {
    return (
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <div
            key={option.value}
            className={` ${
              (multiSelect ? selected.includes(option.value) : selected == option.value)
                ? 'border-portal-primaryLiving font-bold text-portal-primaryLiving'
                : 'bg-white'
            } cursor-pointer rounded-[5px] border px-3 py-2 text-xs font-semibold`}
            onClick={() => onOptionSelect(option)}
          >
            <span className="whitespace-nowrap">{option.name}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderIconLabelStyle = () => {
    return (
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {options.slice(0, isShowMore ? options.length : shortListItem).map((option) => (
          <div
            key={option.value}
            className={`col-span-1 inline-flex cursor-pointer items-center gap-4 text-xs`}
            onClick={() => onOptionSelect(option)}
          >
            <div
              className={`inline-flex h-9 w-9 flex-none items-center justify-center rounded-full bg-portal-background ${
                (multiSelect ? selected.includes(option.value) : selected == option.value)
                  ? 'border border-portal-primaryLiving [&_*]:fill-portal-primaryLiving'
                  : ''
              }`}
            >
              {option.icon}
            </div>
            <span>{option.name}</span>
          </div>
        ))}
        {options.length > shortListItem && (
          <div className="col-span-full text-center">
            <label
              className="cursor-pointer underline underline-offset-2"
              onClick={() => setIsShowMore(!isShowMore)}
            >
              {isShowMore
                ? t('EcomSearchPageSearchFilterViewLess')
                : t('EcomSearchPageSearchFilterViewMore')}
            </label>
          </div>
        )}
      </div>
    );
  };

  switch (optionStyle) {
    case 'chips':
      return renderChipStyle();
    case 'iconLabel':
      return renderIconLabelStyle();
    default:
      return renderChipStyle();
  }
};

export default ChipSelectionComponent;
