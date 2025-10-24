'use client';

import { FC } from 'react';

export interface LabelStatusProps {
  text?: string;
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  className?: string;
}

const LabelStatus: FC<LabelStatusProps> = ({
  text,
  textColor,
  backgroundColor,
  borderColor,
  className,
}) => {
  return (
    <div>
      <label
        className={`p-2 ${textColor} ${backgroundColor} border border-solid text-xs font-semibold ${borderColor} rounded-lg ${className}`}
      >
        {text}
      </label>
    </div>
  );
};

export default LabelStatus;
