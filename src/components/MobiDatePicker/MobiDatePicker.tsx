'use client';

import { DatePicker as AntDatePicker } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import DatePicker from 'react-mobile-datepicker';

interface MobiDatePickerProps {
  value?: Date;
  onChange?: (value: Date) => void;
}

const MobiDatePicker = ({ value, onChange }: MobiDatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const comm = useTranslations('Common');

  const selectedDate = value ? dayjs(value).toDate() : new Date();

  const handleSelect = (date: Date) => {
    onChange?.(date);
    setIsOpen(false);
  };

  const dateConfig = {
    year: { format: 'YYYY', caption: 'Year', step: 1 },
    month: { format: 'MM', caption: 'Mon', step: 1 },
    date: { format: 'DD', caption: 'Day', step: 1 },
    hour: { format: 'HH', caption: 'Hour', step: 1 },
    minute: { format: 'mm', caption: 'Min', step: 1 },
  };

  return (
    <div>
      {/* Input giả để trigger mở picker */}
      <div onClick={() => setIsOpen(true)}>
        <AntDatePicker
          value={dayjs(selectedDate)}
          showTime
          showSecond={false}
          inputReadOnly
          className="w-full cursor-pointer border-portal-primaryLiving focus:border-portal-primaryLiving focus-within:border-portal-primaryLiving"
          open={false}
          onChange={() => {}}
        />
      </div>

      {/* Mobile picker hiển thị riêng */}
      <DatePicker
        value={selectedDate}
        isOpen={isOpen}
        onSelect={handleSelect}
        onCancel={() => setIsOpen(false)}
        confirmText={comm('Apply')}
        cancelText={comm('Cancel')}
        dateConfig={dateConfig}
        theme="ios"
        showHeader={false}
      />
    </div>
  );
};

export default MobiDatePicker;
