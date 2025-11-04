import NumberUtil from '@/utils/numberUtil';
import { Button, Divider, Dropdown, MenuProps, Select } from 'antd';
import { useTranslations } from 'next-intl';
import React, { useEffect, useRef, useState } from 'react';
import SliderSize from './_components/sliderSize';
export interface InputProps {
  onChange?: (value: [number | undefined, number | undefined]) => void;
  placeholder?: string;
}

const SizeSearchListing = ({ placeholder, onChange }: InputProps) => {
  const t = useTranslations('webLabel');
  const [selectedArea, setSelectedArea] = useState(null);
  const [visible, setVisible] = useState(false);
  const [range, setRange] = useState<[number | undefined, number | undefined]>([null, null]);
  const popupRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (onChange) {
      onChange(range);
    }
  }, [range]);

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
    setVisible(false);
  };

  const handleReset = () => {
    setSelectedArea(null);
    setRange([undefined, undefined]);
  };
  const setDataSelect = (size: [number | undefined, number | undefined]) => {
    const formattedArr = size.map((num) => `${NumberUtil.numberWithCommas(num ?? 0)} m²`);
    let output = '';
    if (size[0] && size[1]) {
      output = formattedArr.join(' - ');
    } else if (size[1] && !size[0]) {
      output = `≤ ${formattedArr[1]}`;
    } else if (size[0] && !size[1]) {
      output = `≥ ${formattedArr[0]}`;
    } else if (!size[1] && !size[0]) {
      output = undefined;
    }
    setSelectedArea(output);
  };
  const onChooseSize = (size: [number | undefined, number | undefined]) => {
    setRange(size);
    setDataSelect(size);
  };

  const items: MenuProps['items'] = [
    {
      key: 'all',
      label: t('HomeSearchSizeFilterAllSize'),
      onClick: () => onChooseSize([undefined, undefined]),
    },
    {
      key: '1',
      label: t('HomeSearchSizeFilterUnder30'),
      onClick: () => onChooseSize([0, 30]),
    },
    {
      key: '2',
      label: '30 - 50 m²',
      onClick: () => onChooseSize([30, 50]),
    },
    {
      key: '3',
      label: '50 - 80 m²',
      onClick: () => onChooseSize([50, 80]),
    },
    {
      key: '4',
      label: '80 - 100 m²',
      onClick: () => onChooseSize([80, 100]),
    },
    {
      key: '5',
      label: '100 - 150 m²',
      onClick: () => onChooseSize([100, 150]),
    },
    {
      key: '6',
      label: '150 - 200 m²',
      onClick: () => onChooseSize([150, 200]),
    },
    {
      key: '7',
      label: '200 - 250 m²',
      onClick: () => onChooseSize([200, 250]),
    },
    {
      key: '8',
      label: '250 - 300 m²',
      onClick: () => onChooseSize([250, 300]),
    },
    {
      key: '9',
      label: '300 - 500 m²',
      onClick: () => onChooseSize([300, 500]),
    },
    {
      key: '10',
      label: t('HomeSearchSizeFilterOver500'),
      onClick: () => onChooseSize([500, undefined]),
    },
  ];

  return (
    <div>
      <Dropdown
        open={visible}
        trigger={['click']}
        menu={{ items }}
        popupRender={(menu) => (
          <div ref={popupRef} className="w-full rounded-xl bg-white p-2 shadow-lg">
            <SliderSize
              range={range}
              max={500}
              onchange={(value) => onChooseSize(value as [number | undefined, number | undefined])}
            />
            <div className="overflow-scroll lg:h-40">
              {React.cloneElement(menu as React.ReactElement, { style: { boxShadow: 'none' } })}
            </div>
            <Divider style={{ margin: 0 }} />
            <div className="flex w-full justify-end gap-2 p-2">
              <Button onClick={handleReset}>{t('HomeSearchResetButton')}</Button>
              <Button type="primary" onClick={handleApply}>
                {t('HomeSearchAplyButton')}
              </Button>
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

      <></>
    </div>
  );
};

export default SizeSearchListing;
