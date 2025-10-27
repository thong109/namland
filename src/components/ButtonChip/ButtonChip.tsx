import clsx from 'clsx';
import React from 'react';
import './ButtonChip.css';

interface ButtonChipProps {
  className?: string;
  label: string;
  selected: boolean;
  onClick?: () => void;
}

const ButtonChip: React.FC<ButtonChipProps> = ({ onClick, selected, label, className }) => {
  return (
    <button 
      className={`button-common-chip ${clsx(className ? className : '', selected === true ? 'is-state-selected': 'is-state-unselected')}`} type="button" onClick={onClick}>{label}</button>
  );
};

export default ButtonChip;
