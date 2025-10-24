import { useTranslations } from 'next-intl';
import React, { InputHTMLAttributes, useEffect, useState } from 'react';

interface Option {
  value: string | number;
  label: string;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  fontClass?: string;
  label?: string;
  required?: boolean;
  options?: Option[];
  disable?: boolean;
  placeholder?: string;
  multiple?: boolean;
  initValue?: string[] | number[] | string | number;
  onChange?: (value?: any) => void;
}

const FloatSelect = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    label = 'label',
    options = [],
    onChange,
    disable = false,
    required = false,
    multiple = false,
    initValue,
  }) => {
    const t = useTranslations('Common');
    const getInitValue = (): Option[] => {
      if (initValue) {
        if (typeof initValue == 'string' || typeof initValue == 'number') {
          return options.filter((x) => x.value == initValue);
        } else {
          return options.filter((x) => initValue.findIndex((y) => y == x.value) > -1);
        }
      } else return [];
    };
    const [selected, setSelected] = useState<Option[]>(getInitValue());
    const [filter, setFilter] = useState<string>('');

    const [open, setOpen] = useState<boolean>(false);
    const [touched, setTouched] = useState<boolean>(false);

    const isOptionSelected = (item: Option) => {
      return selected.find((x) => x.value === item.value);
    };

    const handleSingleSelect = (item: { value: string | number; label: string }) => {
      if (!isOptionSelected(item)) {
        setSelected([item]);
      }
    };

    const handleMultipleSelect = (item: Option) => {
      if (!isOptionSelected(item)) {
        selected.push(item);
        setSelected([...selected]);
      } else {
        const index = selected.indexOf(item);
        selected.splice(index, 1);
        setSelected([...selected]);
      }
    };

    const handleSelect = (item: Option) => {
      if (multiple) {
        handleMultipleSelect(item);
      } else {
        handleSingleSelect(item);
      }
    };

    const displaySelectedValues = () => {
      if (selected === undefined || selected.length == 0) {
        return '';
      } else {
        if (multiple) {
          return selected.map((x) => x.label).join(', ');
        } else {
          return selected[0].label;
        }
      }
    };

    useEffect(() => {
      if (touched && selected !== undefined && selected != null) {
        onChange(selected);
      }
    }, [selected, touched]);

    useEffect(() => {
      if (open == false) {
        setFilter('');
      } else if (!touched) {
        setTouched(true);
      }
    }, [open]);

    return (
      <div className={`relative z-10 mb-5 w-full ${open ? 'z-20' : ''}`}>
        <div
          onClick={() => setOpen(!open)}
          className={`block w-full px-0 py-2 text-sm ${
            disable ? 'text-gray-400' : 'text-black'
          } peer cursor-pointer appearance-none border-0 border-b-2 border-gray-300 bg-transparent placeholder:text-black focus:border-portal-primaryLiving focus:outline-none focus:ring-0`}
        >
          {displaySelectedValues()}
          {selected !== null && selected.length === 0 && <span>&#8203;</span>}
        </div>
        <div className={`absolute z-10 w-full border border-gray-300 ${open ? 'block' : 'hidden'}`}>
          {!multiple && (
            <input
              disabled={disable}
              className={`block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent bg-white px-0 py-2 text-sm focus:border-portal-primaryLiving focus:outline-none focus:ring-0`}
              value={filter}
              onChange={(e) => !multiple && setFilter(e.target.value)}
              autoComplete="off"
              placeholder={t('search')}
            />
          )}
          <ul className={`absolute z-10 mt-1 w-full overflow-y-auto bg-white drop-shadow-lg`}>
            {options
              ?.filter((x) => x.label.toLowerCase().includes(filter.toLowerCase()))
              .map((option: any) => (
                <li
                  key={option?.value}
                  className={`hover:text--portal-primaryLiving cursor-pointer border-b border-gray-200 p-2 text-sm hover:bg-gray-200/20 ${isOptionSelected(option) ? 'font-bold text-black' : ''} `}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelect(option);
                    if (!multiple) {
                      setOpen(false);
                    }
                  }}
                >
                  {option?.label}
                </li>
              ))}
          </ul>
        </div>
        <label
          className={`absolute top-3 -z-10 origin-[0] transform text-sm text-gray-500 duration-300 ${
            open ? 'left-0 -translate-y-6 scale-90 text-portal-primaryLiving' : ' '
          } ${selected === undefined || selected.length == 0 ? '' : '-translate-y-6 scale-100'} `}
        >
          {label}
          {required && <span className="text--portal-primaryLiving">*</span>}
        </label>
      </div>
    );
  },
);
export default FloatSelect;
