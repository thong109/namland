import fileApiService from '@/apiServices/externalApiServices/apiFileService';
import { keySyncfusion } from '@/libs/appconst';
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
import { message } from 'antd';
import { debounce, isEqual } from 'lodash';
import { useTranslations } from 'next-intl';
import { FC, useEffect, useRef, useState } from 'react';

registerLicense(keySyncfusion);

interface SyncfutionRichTextEditorProps {
  value?: string;
  onChange?: (value) => void;
  isNotEdit?: boolean;
}

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const SyncfutionRichText: FC<SyncfutionRichTextEditorProps> = ({ value, onChange, isNotEdit }) => {
  const error = useTranslations('error');

  const previousValue = usePrevious(value);
  const [currentValue, setCurrentValue] = useState(value || '');
  useEffect(() => {
    if (!isEqual(previousValue, value)) {
      setCurrentValue(value || '');
    }
  }, [value]);
  const triggerChange = () => {
    if (onChange) {
      onChange(currentValue);
    }
  };

  const rteRef = useRef<RichTextEditorComponent>(null);

  // Handle image upload button click
  const handleImageUpload = () => {
    const fileInput = document.createElement('input');

    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    // Handle selected image file
    fileInput.onchange = (e) => {
      const inputElement = e.target as HTMLInputElement;
      const file = inputElement.files?.[0]; // Use optional chaining to handle null value

      if (file) {
        // Send the image to the API
        if (file.size <= 5 * 1024 * 1024) {
          uploadImage(file);
        } else {
          message.warning(
            error('listNameFileisOverSize', {
              maxSize: 5,
            }),
          );
        }
      }
    };

    fileInput.click();
  };

  // Send the image to the API
  const uploadImage = async (file: File) => {
    try {
      const response: any = await fileApiService.uploadFileImg(file);
      const image = response;

      if (image?.url) {
        rteRef.current?.executeCommand(
          'insertHTML',
          `<img src="${image.url}" alt="Uploaded Image" />`,
        );
        // Optional: update local state too
        setCurrentValue(rteRef.current?.value || '');
      }
    } catch (error) {
      console.error('Image upload failed:', error);
    }
  };

  const onTextChange = debounce((value) => {
    setCurrentValue(value);
  }, 200);
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
      'Outdent',
      'Indent',
      '|',
      'CreateLink',
      '|',
      {
        tooltipText: 'Insert Image',
        template:
          '<button class="e-tbar-btn e-control e-btn e-lib e-icon-btn" type="button" id="richtexteditor_373116951_0_toolbar_Image" tabindex="-1" data-tabindex="-1" aria-label="Insert Image (Ctrl + Shift + I)" aria-disabled="false" style="width: auto;"><span class="e-btn-icon e-image e-icons"></span></button>',
        click: handleImageUpload,
      },
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
    <div>
      <RichTextEditorComponent
        value={value}
        fontColor={fontColor}
        fontFamily={fontFamily}
        ref={rteRef}
        enableResize={true}
        imageUploadSuccess={handleImageUpload}
        readonly={isNotEdit}
        toolbarSettings={toolbarSettings}
        height={300}
        saveInterval={1}
        showCharCount
        iframeSettings={{ enable: true }}
        blur={triggerChange}
        change={(e) => onTextChange(e?.value)}
      >
        <Inject services={[Link, Image, HtmlEditor, Toolbar, QuickToolbar, Count, Resize, Table]} />
      </RichTextEditorComponent>
      <style>{`
     .e-richtexteditor {
      min-width: 100%;
      max-width: 100%;

  }
    `}</style>
    </div>
  );
};

SyncfutionRichText.defaultProps = {
  value: '',
};

export default SyncfutionRichText;
