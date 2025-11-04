import React, { useEffect, useRef, useState } from 'react';
import { listingType } from '@/libs/appconst';
import { Button, Divider, Dropdown, MenuProps, Select } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import SliderFrice from './PopupSearchPriceRange';
import './PopupSearchPrice.css';

export interface InputProps {
  typeft?: any;
  onChange?: (value: [number | undefined, number | undefined]) => void;
  placeholder?: string;
  defaultValue?: [number | undefined, number | undefined];
  className?: string;
}

const PopupSearchPrice = ({
  placeholder,
  onChange,
  typeft = listingType.sale,
  className,
  defaultValue,
  ...props
}: InputProps) => {
  const locale = useLocale();
  const t = useTranslations('webLabel');
  const [selectedArea, setSelectedArea] = useState(null);
  const [visible, setVisible] = useState(false);
  const [range, setRange] = useState<[number | undefined, number | undefined]>(
    defaultValue ?? [null, null],
  );
  const [maxValue, setMaxValue] = useState(0);
  const popupRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (onChange) {
      onChange(range);
    }
  }, [range]);
  useEffect(() => {
    setMaxValue(maxValuePriceRange());
  }, [typeft]);

  function lamTronSo(number) {
    var lamTron = Math.round(number * 100) / 100; // Làm tròn đến 3 chữ số thập phân
    if (lamTron % 1 === 0) {
      return Math.round(lamTron)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        .replace(/\./g, ','); // Trả về số nguyên nếu không có dư
    } else {
      return lamTron
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        .replace(/\./g, ','); // Trả về số thập phân nếu có dư
    }
  }
  const formatNumberToTrieuTy = (value) => {
    if (value >= 1000000000) {
      return (
        lamTronSo(value / 1000000000) + (locale === 'vi' ? ' tỷ' : locale === 'en' ? ' bil' : '억')
      );
    } else if (value >= 1000000) {
      return (
        lamTronSo(value / 1000000) + (locale === 'vi' ? ' tr' : locale === 'en' ? ' mil' : '만')
      );
    } else if (value >= 1000) {
      return (
        lamTronSo(value / 1000) + (locale === 'vi' ? ' nghìn' : locale === 'en' ? ' th' : '천')
      );
    } else {
      return;
    }
  };
  const handleClickOutside = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setVisible(false);
    }
  };
  useEffect(() => {
    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible]);
  const handleApply = () => {
    if (onChange) {
      onChange(range);
    }
    setVisible(false);
  };

  const handleReset = () => {
    setSelectedArea(null);
    setRange([undefined, undefined]);
  };
  const setDataSelect = (price: [number | undefined, number | undefined]) => {
    const formattedArr = price?.map((num) => formatNumberToTrieuTy(num));
    let output = '';
    if (price[0] && price[1]) {
      output = formattedArr.join(' - ');
    } else if (price[1] && !price[0]) {
      output = `≤ ${formattedArr[1]}`;
    } else if (price[0] && !price[1]) {
      output = `≥ ${formattedArr[0]}`;
    } else if (!price[1] && !price[0]) {
      output = undefined;
    }
    setSelectedArea(output);
  };
  const onChoosePrice = (price: [number | undefined, number | undefined]) => {
    setRange(price);
    setDataSelect(price);
  };
  const itemSales: MenuProps['items'] = [
    {
      key: 'all',
      label: t('HomeSearchPriceFilterAllPrice'),
      onClick: () => onChoosePrice([undefined, undefined]),
    },
    {
      key: '1',
      label: t('HomeSearchPriceFilterSale[1]'),
      onClick: () => onChoosePrice([0, 500000000]),
    },
    {
      key: '2',
      label: t('HomeSearchPriceFilterSale[2]'),
      onClick: () => onChoosePrice([500000000, 800000000]),
    },
    {
      key: '3',
      label: t('HomeSearchPriceFilterSale[3]'),
      onClick: () => onChoosePrice([800000000, 1000000000]),
    },
    {
      key: '4',
      label: t('HomeSearchPriceFilterSale[4]'),
      onClick: () => onChoosePrice([1000000000, 2000000000]),
    },
    {
      key: '5',
      label: t('HomeSearchPriceFilterSale[5]'),
      onClick: () => onChoosePrice([2000000000, 3000000000]),
    },
    {
      key: '6',
      label: t('HomeSearchPriceFilterSale[6]'),
      onClick: () => onChoosePrice([3000000000, 5000000000]),
    },
    {
      key: '7',
      label: t('HomeSearchPriceFilterSale[7]'),
      onClick: () => onChoosePrice([5000000000, 7000000000]),
    },
    {
      key: '8',
      label: t('HomeSearchPriceFilterSale[8]'),
      onClick: () => onChoosePrice([7000000000, 20000000000]),
    },
    {
      key: '9',
      label: t('HomeSearchPriceFilterSale[9]'),
      onClick: () => onChoosePrice([20000000000, 200000000000]),
    },
  ];
  const itemRents: MenuProps['items'] = [
    {
      key: 'all',
      label: t('HomeSearchPriceFilterAllPrice'),
      onClick: () => onChoosePrice([undefined, undefined]),
    },
    {
      key: '1',
      label: t('HomeSearchPriceFilterRent[1]'),
      onClick: () => onChoosePrice([0, 1000000]),
    },
    {
      key: '2',
      label: t('HomeSearchPriceFilterRent[2]'),
      onClick: () => onChoosePrice([1000000, 3000000]),
    },
    {
      key: '3',
      label: t('HomeSearchPriceFilterRent[3]'),
      onClick: () => onChoosePrice([3000000, 5000000]),
    },
    {
      key: '4',
      label: t('HomeSearchPriceFilterRent[4]'),
      onClick: () => onChoosePrice([5000000, 10000000]),
    },
    {
      key: '5',
      label: t('HomeSearchPriceFilterRent[5]'),
      onClick: () => onChoosePrice([10000000, 40000000]),
    },
    {
      key: '6',
      label: t('HomeSearchPriceFilterRent[6]'),
      onClick: () => onChoosePrice([40000000, 70000000]),
    },
    {
      key: '7',
      label: t('HomeSearchPriceFilterRent[7]'),
      onClick: () => onChoosePrice([70000000, 100000000]),
    },

    {
      key: '9',
      label: t('HomeSearchPriceFilterRent[9]'),
      onClick: () => onChoosePrice([100000000, 100000000]),
    },
  ];
  const maxValuePriceRange = () => {
    if (typeft === listingType.sale) {
      return 20000000000;
    } else {
      return 100000000;
    }
  };
  return (
    <div className={className}>
      <Dropdown
        open={visible}
        trigger={['click']}
        menu={{ items: typeft === listingType.sale ? itemSales : itemRents }}
        popupRender={(menu) => (
          <div ref={popupRef} className='popup-common-searchprice'>
            <SliderFrice range={range} max={maxValue} onchange={(value) => onChoosePrice(value as [number | undefined, number | undefined])} />
            <div className='popup-common-searchprice__menu'>
              {React.cloneElement(menu as React.ReactElement, { style: { boxShadow: 'none' } })}
            </div>
            <div className='popup-common-searchprice__controller'>
              <Button className='button-common button-common--reset' onClick={handleReset}>{t('HomeSearchResetButton')}</Button>
              <Button className='button-common' onClick={handleApply}>{t('HomeSearchAplyButton')}</Button>
            </div>
          </div>
        )}
      >
        <Select
          onClick={() => setVisible(true)}
          value={selectedArea}
          placeholder={placeholder}
          open={false}
        />
      </Dropdown>
    </div>
  );
};

export default PopupSearchPrice;
