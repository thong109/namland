import { deleteFileIcon, sendMessageIcon } from '@/libs/appComponents';
import { Form } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useState } from 'react';
import UploadFileInComment from './UploadFileInComment';

interface OptionalPropsName {
  form?: any;
  onSubmit?: (file: File) => void;
  labelButton?: string;
  labelPlaceholder?: string;
}

const InputComment = ({ form, onSubmit, labelButton, labelPlaceholder }: OptionalPropsName) => {
  const [fileUpload, setFileUpload] = useState([] as any);
  const [isDisable, setIsDisable] = useState<boolean>(true);
  const onSendMessage = () => {
    onSubmit(fileUpload);
    setFileUpload([]);
  };

  const handleChangeFiles = (files) => {
    const merged = [...files, ...fileUpload];

    const listFileUnique: any[] = Array.from(
      new Map(merged.map((item) => [item.name, item])).values(),
    );

    setFileUpload(listFileUnique), setIsDisable(false);
  };

  const onDeleteFile = (file) => {
    setFileUpload(fileUpload.filter((item) => item !== file));

    setIsDisable(true);
  };

  return (
    <Form form={form} layout="vertical" className="px-2">
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-12 grid grid-cols-12 items-center gap-x-5">
          {fileUpload ? (
            fileUpload?.map((item) => {
              return (
                <div className="col-span-6 flex h-[20px] items-center">
                  {/* <button> {fileCommentIcon}</button> */}
                  <span className="mr-1 line-clamp-1 text-sm text-portal-gray-4">{item?.name}</span>
                  <button className="justify-start" onClick={() => onDeleteFile(item)}>
                    {deleteFileIcon}
                  </button>
                </div>
              );
            })
          ) : (
            <div className="flex h-[20px] items-center"></div>
          )}
        </div>
        <div className="col-span-10 grid grid-cols-12">
          <div className="col-span-11">
            <Form.Item name="message">
              <TextArea
                placeholder={labelPlaceholder}
                onChange={(value) =>
                  value.target.value.length > 0 ? setIsDisable(false) : setIsDisable(true)
                }
                autoSize={{ minRows: 3 }}
                className={`block w-full rounded-lg border border-[#E2E8F0] bg-gray-50 text-sm text-gray-900 hover:border-[#E2E8F0] hover:outline-none focus:border-[#E2E8F0] focus:outline-none`}
              />
            </Form.Item>
          </div>
          <div style={{ position: 'relative', right: '40px' }}>
            <UploadFileInComment onChange={(files) => handleChangeFiles(files)} />
          </div>
        </div>
        <div className="col-span-2">
          <button
            disabled={isDisable}
            onClick={onSendMessage}
            type="submit"
            className={`${
              isDisable ? 'opacity-50' : 'opacity-100'
            } flex w-full items-center justify-center rounded-lg bg-portal-primaryLiving px-4 py-3 text-sm font-medium text-white focus:outline-none focus:ring-4`}
          >
            <span className="mr-2">{labelButton}</span>
            <span>{sendMessageIcon}</span>
          </button>
        </div>
      </div>
    </Form>
  );
};

export default InputComment;
