// components/MobiDatePicker.tsx
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
  const selectedDate = dayjs(value).toJSON() || dayjs().toJSON();

  const handleSelect = (date: Date) => {
    onChange?.(date); // Trigger form change handler
    setIsOpen(false);
  };

  const dateConfig = {
    year: { format: 'YYYY', caption: 'Year', step: 1 },
    month: { format: 'MM', caption: 'Mon', step: 1 },
    date: { format: 'DD', caption: 'Day', step: 1 },
    hour: { format: 'hh', caption: 'Hour', step: 1 },
    minute: { format: 'mm', caption: 'Min', step: 1 },
  };

  return (
    <div>
      <AntDatePicker
        value={dayjs(selectedDate)}
        onClick={() => setIsOpen(!isOpen)}
        showTime
        showSecond={false}
        inputReadOnly
        className="w-full"
        open={false} // Disable built-in Ant Picker display
      />

      <DatePicker
        value={new Date(selectedDate)}
        // showCaption={true}
        isOpen={isOpen}
        onSelect={handleSelect}
        showHeader={false}
        onCancel={() => setIsOpen(false)}
        confirmText={comm('Apply')}
        cancelText={comm('Cancel')}
        dateConfig={dateConfig}
        theme="ios"
      />
    </div>
  );
};

export default MobiDatePicker;
