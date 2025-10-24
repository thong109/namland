'use client';
import { amenityType } from '@/libs/appconst';
import { isEqual } from 'lodash';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
export interface InputProps {
  options: {
    value: string | number;
    name: string;
    imageUrl: string;
  }[];
  value?: any;
  onChange?: (value: any[]) => void;
  optionStyle?: 'chips' | 'iconLabel';
  disabled?: boolean;
  amenityEnum: number;
}

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const SelectionComponent = ({
  options,
  value,
  onChange,
  optionStyle = 'chips',
  disabled = false,
  amenityEnum,
}: InputProps) => {
  const previousValue = usePrevious(value);

  useEffect(() => {
    if (previousValue && !isEqual(previousValue, value)) {
      setSelected(value);
    }
  }, [value]);

  const [selected, setSelected] = useState<any>(
    value !== null && typeof value !== 'undefined' ? value : [],
  );

  const onOptionSelect = (option: {
    value: string | number;
    name: string | number;
    imageUrl: string;
  }) => {
    let result = null;
    result = selected;

    const index = selected.findIndex((x) => x == option.value);
    if (index > -1) {
      result.splice(index, 1);
    } else {
      result.push(option.value);
    }

    setSelected([...result]);
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
              selected.includes(option.value)
                ? 'border-portal-primaryLiving font-bold text-portal-primaryLiving'
                : 'bg-white'
            } cursor-pointer rounded-[5px] border px-3 py-2 text-xs font-semibold`}
            onClick={() => {
              if (disabled) {
                return;
              }
              onOptionSelect(option);
            }}
          >
            <span className="whitespace-nowrap">{option.name}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderIconLabelStyle = () => {
    return (
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {options.map((option) => {
          return (
            <div
              key={option.value}
              className={`col-span-1 inline-flex cursor-pointer items-center gap-4 text-xs`}
              onClick={() => {
                if (disabled) {
                  return;
                }
                onOptionSelect(option);
              }}
            >
              <div
                className={`inline-flex h-9 w-9 flex-none items-center justify-center rounded-full ${
                  selected.includes(option.value)
                    ? amenityEnum === amenityType.In
                      ? 'bg-portal-amenityIn [&_*]:fill-portal-amenityIn'
                      : 'bg-portal-amenityOut [&_*]:fill-portal-amenityOut'
                    : 'bg-portal-backgroud'
                }`}
              >
                <Image width={20} height={20} alt={option?.name ?? ''} src={option?.imageUrl} />
              </div>
              <span>{option.name}</span>
            </div>
          );
        })}
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

export default SelectionComponent;
