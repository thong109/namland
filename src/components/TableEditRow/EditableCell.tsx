import { Checkbox, DatePicker, Form, Input, InputNumber } from 'antd';
import * as React from 'react';

import Select from 'antd/lib/select';

import TextArea from 'antd/lib/input/TextArea';

import { inputNumberFormatter } from '@/libs/helper';
import { useTranslations } from 'next-intl';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'checkbox' | 'text' | 'select' | 'textarea' | 'multiSelect' | 'datetime';
  record: any;
  index: number;
  children: React.ReactNode;
  options: any[];
  required: boolean;
  onSearch?: (value) => void;
  onchange?: (value) => void;
  onBlur?: (value) => void;
  locale?: string;
  symbol?: string;
}

export const buildEditableCell = (
  record,
  inputType,
  dataIndex,
  title,
  isEditing,
  options?,
  required?,
  onSearch?,
  onchange?,
  onBlur?,
  locale?,
  symbol?,
) => ({
  record,
  inputType,
  dataIndex,
  title,
  editing: isEditing(record),
  options,
  required,
  onSearch,
  onchange,
  onBlur,
  locale,
  symbol,
});

export const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  children,
  options,
  required,
  onSearch,
  onchange,
  onBlur,
  locale,
  symbol,
  ...restProps
}) => {
  const t = useTranslations('webLabel');
  let inputNode;
  switch (inputType) {
    case 'multiSelect': {
      inputNode = (
        <Select className="full-width" mode="multiple">
          {(options || []).map((option, index) => (
            <Select.Option key={index} value={option.value || option.id}>
              {option.label || option.name || option.ipName}
            </Select.Option>
          ))}
        </Select>
      );
      break;
    }
    case 'number': {
      inputNode = (
        <InputNumber
          min={0}
          formatter={(value) => inputNumberFormatter(value)}
          className="full-width"
        />
      );
      break;
    }

    case 'checkbox': {
      inputNode = <Checkbox onChange={onBlur} defaultChecked={record[dataIndex]} />;
      break;
    }

    case 'textarea': {
      inputNode = <TextArea size="middle" autoSize={{ maxRows: 5 }} />;
      break;
    }
    case 'datetime': {
      inputNode = (
        <DatePicker size="middle" className="full-width" showTime format={'DD/MM/YYYY HH:mm'} />
      );

      break;
    }
    case 'select': {
      inputNode = (
        <Select
          size="middle"
          className="full-width"
          showSearch
          showArrow
          allowClear
          onSearch={onSearch}
          onChange={() => onchange}
        >
          {(options || []).map((option, index) => (
            <Select.Option key={index} value={option.value || option.id}>
              {option.label ||
                option.name ||
                option.ipName ||
                option.projectName ||
                option.periodName}
            </Select.Option>
          ))}
        </Select>
      );
      break;
    }
    default: {
      inputNode = <Input size="middle" />;
    }
  }
  return (
    <td {...restProps}>
      {editing ? (
        inputType === 'checkbox' ? (
          <Form.Item
            messageVariables={{
              label: t(title),
            }}
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[{ required }]}
            // label={title}
            valuePropName="checked"
          >
            <div>{inputNode}</div>
          </Form.Item>
        ) : (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[{ required }]}
            messageVariables={{
              label: t(title),
            }}
          >
            {inputNode}
          </Form.Item>
        )
      ) : (
        children
      )}
    </td>
  );
};
