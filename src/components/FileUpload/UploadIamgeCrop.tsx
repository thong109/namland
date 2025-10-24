import { CloseOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { TypeOptions, toast } from 'react-toastify';
export interface InputProps {
  title?: string;
  uploadButtonLabel?: string;
  required?: boolean;
  urlInit: string;
  disabled?: boolean;
  onChange: (values) => void;
  width?: number;
  height?: number;
}
const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const UploadImamgeCrop = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    title,
    uploadButtonLabel = 'Upload',
    required = false,
    urlInit,
    onChange,
    disabled = false,
    width = 150,
    height = 150,
  }) => {
    const notify = React.useCallback((type: TypeOptions, message: any) => {
      toast[type](message);
    }, []);
    const t = useTranslations('webLabel');
    const [fileList, setFileList] = useState<any[]>([]);
    const [isDeleteInit, setIsDeleteInit] = useState<boolean>(false);
    const onCancleImage = (value) => {
      // console.log(value);
    };

    const onOkImage = async (value: File) => {
      const fileUrl = await getBase64(value);
      setIsDeleteInit(true);
      const data = {
        ...value,
        thumbUrl: fileUrl,
        name: value.name,
        newFile: value,
      };
      const newList = [data];
      setFileList(newList);
    };

    const removeImage = () => {
      setFileList(undefined);
      onChange && onChange(undefined);
    };

    useEffect(() => {
      if (fileList !== undefined) {
        onChange(fileList[0]?.newFile);
      }
    }, [fileList]);

    return (
      <div>
        <div className="col-span-full font-bold">
          <span>{title}</span>
          {required && <span className="text-danger"> *</span>}
        </div>
        <div className="col-span-full gap-4"></div>

        <div className="col-span-full">
          {(!urlInit || !isDeleteInit) && (
            <label className="uppercase">
              <ImgCrop
                showGrid
                showReset
                rotationSlider
                onModalCancel={onCancleImage}
                onModalOk={onOkImage}
                aspect={1} // hinh vuong
              >
                <Upload
                  className="mb-3 flex w-fit cursor-pointer justify-center rounded border border-zinc-500 bg-white p-2 drop-shadow hover:bg-gray-100"
                  fileList={fileList}
                  showUploadList={false}
                >
                  {uploadButtonLabel}
                </Upload>
              </ImgCrop>
            </label>
          )}
          {fileList?.length > 0 && (
            <div className="grid grid-cols-12 gap-2">
              {fileList.map((item, index) => (
                <div key={index} className="col-span-4">
                  <div className="relative">
                    <img
                      src={item?.thumbUrl}
                      height={300}
                      width={300}
                      alt="avatar"
                      className="h-full w-full rounded drop-shadow"
                    />

                    <Button
                      className="absolute right-1 top-1 bg-white"
                      shape="circle"
                      icon={<CloseOutlined />}
                      size={'small'}
                      onClick={removeImage}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          {!isDeleteInit && urlInit && (
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <div className="relative">
                  <img
                    src={urlInit}
                    height={300}
                    width={300}
                    alt="avatar"
                    className="h-full w-full rounded drop-shadow"
                  />

                  <Button
                    className="absolute right-1 top-1 bg-white"
                    shape="circle"
                    icon={<CloseOutlined />}
                    size={'small'}
                    onClick={() => setIsDeleteInit(true)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  },
);

export default UploadImamgeCrop;
