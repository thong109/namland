'use client';
import { Input, Tabs } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

import { ILanguageValue, listLangue } from '@/libs/appconst';
import { arrayToObject } from '@/libs/helper';
import 'famfamfam-flags/dist/sprite/famfamfam-flags.css';
import { isEqual } from 'lodash';
import { useLocale } from 'next-intl';
import './index.scss';

const { TextArea } = Input;
const { TabPane } = Tabs;

interface MultiLanguageTextAreaProps {
  row?: number;
  value?: ILanguageValue[];
  onChange?: (value: ILanguageValue[]) => void;
  maxLength?: number;
  disabled?: boolean;
}

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const MultiLanguageTextArea: React.FC<MultiLanguageTextAreaProps> = ({
  value = [],
  onChange,
  maxLength,
  disabled = false,
  row = 1,
}) => {
  const previousValue = usePrevious(value);
  const [languageValue, setLanguageValue] = useState(arrayToObject(value, 'languageName', 'value'));
  const currentLanguage = useLocale();
  const [selectedLanguage, setSelectedLanguage] = useState(
    currentLanguage && 3 ? currentLanguage : value && value.length ? value[0].language : '',
  );

  useEffect(() => {
    if (previousValue && !isEqual(previousValue, value)) {
      setLanguageValue(arrayToObject(value, 'language', 'value'));
    }
  }, [value]);

  const triggerChange = () => {
    const changedValue = (value || []).map((lang) => {
      return { ...lang, value: languageValue[lang.language] as string };
    });
    if (onChange) {
      onChange(changedValue);
    }
  };

  const onTextChange = (e) => {
    setLanguageValue({ ...languageValue, [selectedLanguage]: e.target.value });
  };

  return (
    <div className="formLang">
      <Tabs activeKey={selectedLanguage} onChange={(e) => setSelectedLanguage(e)}>
        {(listLangue || []).map((language) => (
          <TabPane
            tab={
              <div className="flex items-center">
                <i className={language.icon} />
                {/* <span className="ml-1 text-black">{language.name}</span> */}
              </div>
            }
            key={language.name}
          >
            <TextArea
              disabled={disabled}
              allowClear={true}
              value={languageValue[selectedLanguage]}
              onChange={onTextChange}
              onBlur={triggerChange}
              maxLength={maxLength || 2000}
              autoSize={{ minRows: row, maxRows: 6 }}
            />
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default MultiLanguageTextArea;
