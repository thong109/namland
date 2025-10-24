import { Input } from 'antd';
import Tag from 'antd/lib/tag';
import React, { useEffect, useRef, useState } from 'react';

import { dataType } from '@/libs/appconst';
import { isValidEmail } from '@/libs/helper';
import isEqual from 'lodash/isEqual';
import { useTranslations } from 'next-intl';
import './tags-input.scss';

interface TagProps {
  value?: any[];
  onChange?: (value: any[]) => void;
  placeholder: string;
  type: string;
  disabled?: boolean;
}

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const TagsInputShape: React.FC<TagProps> = ({
  value = [],
  onChange,
  placeholder,
  type,
  disabled,
}) => {
  const previousValue = usePrevious(value);
  const eForm = useTranslations('error');
  const [currentValue, setCurrentValue] = useState(value);
  const [errorMessage, setErrorMessage] = useState('');
  const [newTagState, setNewTagState] = useState({ tag: '' });

  let refInputNew = null as any;

  useEffect(() => {
    if (previousValue && !isEqual(previousValue, value)) {
      setCurrentValue(value);
    }
  }, [value]);

  const saveRefInput = (input, type) => {
    if (!input) {
      return;
    }
    if (type === 'ADD') {
      refInputNew = input;
      // refInputNew.focus();
    }
  };

  const removeTagClick = (itemRemove) => {
    const updateValue = currentValue.filter((item) => item !== itemRemove);
    setCurrentValue(updateValue);
    triggerChange(updateValue);
  };

  const triggerChange = (updateValue) => {
    if (onChange) {
      onChange(updateValue);
    }
  };

  const validateBeforeSave = (text) => {
    if (type === dataType.email && !isValidEmail(text)) {
      setErrorMessage(eForm('INVALID_FORMAT', { type: type }));
      return false;
    }

    return true;
  };

  const handleTagChange = (e, type) => {
    if (type === 'ADD') {
      setNewTagState({ ...newTagState, tag: e.target.value });
    }
  };

  const addTag = () => {
    const tag = newTagState.tag.trim();

    if (!validateBeforeSave(tag)) {
      return;
    }
    if (tag.length < 1) {
      setErrorMessage(`${eForm('pleaseInput')} `);
      return;
    }

    const newValue = [...currentValue, tag];
    setCurrentValue(newValue);
    setNewTagState({ tag: '' }); // Clear the input
    setErrorMessage('');
    triggerChange(newValue);
  };

  return (
    <div className="tags-input">
      <Input
        ref={(input) => saveRefInput(input, 'ADD')}
        value={newTagState.tag}
        disabled={disabled}
        placeholder={placeholder}
        onPressEnter={addTag}
        onChange={(e) => handleTagChange(e, 'ADD')}
      />
      {errorMessage && errorMessage.length && <div className="text-danger">{errorMessage}</div>}

      <div className="mt-2 flex flex-wrap">
        {currentValue.map((item, index) => {
          return (
            <Tag
              className="flex w-fit items-center rounded-xl bg-portal-primaryButtonAdmin px-2 py-2 text-sm font-normal text-white"
              key={`${item}${index}`}
              closable
              onClose={() => (disabled ? undefined : removeTagClick(item))}
            >
              {item}
            </Tag>
          );
        })}
      </div>
    </div>
  );
};

export default TagsInputShape;
