import { ILanguageValue, keySyncfusion, listLangue } from '@/libs/appconst';
import { arrayToObject } from '@/libs/helper';
import { registerLicense } from '@syncfusion/ej2-base';
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-buttons/styles/material.css';
import '@syncfusion/ej2-icons/styles/material.css';
import '@syncfusion/ej2-inputs/styles/material.css';
import '@syncfusion/ej2-lists/styles/material.css';
import '@syncfusion/ej2-navigations/styles/material.css';
import '@syncfusion/ej2-popups/styles/material.css';
import {
  Count,
  HtmlEditor,
  Image,
  Inject,
  Link,
  QuickToolbar,
  Resize,
  RichTextEditorComponent,
  Table,
  Toolbar,
  ToolbarSettingsModel,
  ToolbarType,
} from '@syncfusion/ej2-react-richtexteditor';
import '@syncfusion/ej2-react-richtexteditor/styles/material.css';
import '@syncfusion/ej2-richtexteditor/styles/material.css';
import '@syncfusion/ej2-splitbuttons/styles/material.css';
import { Tabs } from 'antd';
import { isEqual } from 'lodash';
import { useLocale } from 'next-intl';
import React, { useEffect, useRef, useState } from 'react';

registerLicense(keySyncfusion);

const { TabPane } = Tabs;

interface MultiLanguageSyncFusionProps {
  value?: ILanguageValue[];
  onChange?: (value: ILanguageValue[]) => void;
}

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const MultiLanguageSyncFusion: React.FC<MultiLanguageSyncFusionProps> = ({
  value = [],
  onChange,
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
    setLanguageValue({ ...languageValue, [selectedLanguage]: e });
  };

  const rteRef = useRef<RichTextEditorComponent>(null);

  const fontColor = {
    modeSwitcher: true,
  };

  const fontFamily = {
    items: [
      { text: 'Segoe UI', value: 'Segoe UI' },
      {
        text: 'Open Sans',
        value: 'Open Sans, sans-serif',
        command: 'Font',
        subCommand: 'FontName',
      },
      { text: 'Arial', value: 'Arial,Helvetica,sans-serif' },
      { text: 'Courier New', value: 'Courier New,Courier,monospace' },
      { text: 'Georgia', value: 'Georgia,serif' },
      { text: 'Impact', value: 'Impact,Charcoal,sans-serif' },
      { text: 'Lucida Console', value: 'Lucida Console,Monaco,monospace' },
      { text: 'Tahoma', value: 'Tahoma,Geneva,sans-serif' },
      { text: 'Times New Roman', value: 'Times New Roman,Times,serif' },
      { text: 'Trebuchet MS', value: 'Trebuchet MS,Helvetica,sans-serif' },
      { text: 'Verdana', value: 'Verdana,Geneva,sans-serif' },
    ],
    width: '60px',
  };

  const toolbarSettings: ToolbarSettingsModel = {
    type: ToolbarType.MultiRow,
    items: [
      'Bold',
      'Italic',
      'Underline',
      'StrikeThrough',
      'FontName',
      'FontSize',
      'FontColor',
      'CreateTable',
      'LowerCase',
      'UpperCase',
      '|',
      'Formats',
      'Alignments',
      'OrderedList',
      'UnorderedList',
      'Outdent',
      'Indent',
      '|',
      'CreateLink',
      '|',

      '|',
      'ClearFormat',
      'SourceCode',
      '|',
      'NumberFormatList',
      'BulletFormatList',
      'Undo',
      'Redo',
    ],
  };

  return (
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
          <RichTextEditorComponent
            fontColor={fontColor}
            fontFamily={fontFamily}
            ref={rteRef}
            enableResize={true}
            value={languageValue[selectedLanguage]}
            toolbarSettings={toolbarSettings}
            height={400}
            saveInterval={1}
            showCharCount
            iframeSettings={{ enable: true }}
            blur={triggerChange}
            change={(e) => onTextChange(e?.value)}
          >
            <Inject
              services={[Link, Image, HtmlEditor, Toolbar, QuickToolbar, Count, Resize, Table]}
            />
          </RichTextEditorComponent>
          <style>{`
     .e-richtexteditor {
      min-width: 100%;
      max-width: 100%;

  }
    `}</style>
        </TabPane>
      ))}
    </Tabs>
  );
};

export default MultiLanguageSyncFusion;
