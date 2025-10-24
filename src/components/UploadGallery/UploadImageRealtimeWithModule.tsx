import fileApiService from '@/apiServices/externalApiServices/apiFileService';
import ImageUrlModel from '@/models/commonModel/imageUrlModel';
import { CloseOutlined } from '@ant-design/icons';
import { Button, Spin } from 'antd';
import { useTranslations } from 'next-intl';
import React, { FC, useEffect, useState, useTransition } from 'react';
import { TypeOptions, toast } from 'react-toastify';
export interface InputProps {
  title?: string;
  uploadButtonLabel?: string;
  multiple?: boolean;
  required?: boolean;
  initImages?: ImageUrlModel[];
  disabled?: boolean;
  onChange: (images: File[], idRemove?: string, isActionDelete?: boolean) => void;
  maxFile?: number;
  noteBeforeUpload?: string;
  moduleId: string;
}

const UploadImageRealtimeWithModule: FC<InputProps> = ({
  title = 'Upload',
  uploadButtonLabel = 'Upload',
  multiple,
  required = false,
  initImages,
  onChange,
  disabled = false,
  maxFile = 10,
  noteBeforeUpload,
  moduleId,
}) => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);
  const errorNotifi = useTranslations('errorNotifi');
  const [currentLengthFile, setCurrentLengthFile] = useState<number>(0);
  const [filesAfterUpload, setFilesAfterUpload] = useState([] as any);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    initUpload();
  }, [initImages]);

  const initUpload = () => {
    setCurrentLengthFile(initImages ? initImages.length : 0);
    setFilesAfterUpload(initImages ?? []);
  };

  const uploadFiles = async (files: File[]) => {
    const listFileAfterUpload: any = await fileApiService.uploadFilesWithModule(files, moduleId);

    return listFileAfterUpload.data;
  };

  const changeHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    //check size file if size > 10 MB
    let currentFiles = [];
    let numberFiles = currentLengthFile;
    const { files } = event.target;
    let filesSelect = [...files];

    let namesFileError = [];
    let isHaveOverSize = false;

    filesSelect.map((item) => {
      if (item.size / 1024 / 1024 > 5) {
        isHaveOverSize = true;
        namesFileError.push(item.name);
        notify(
          'warning',
          errorNotifi('fileOverSize', {
            name: item.name,
            size: 5,
          }),
        );
      } else {
        if (numberFiles < maxFile) {
          numberFiles++;
          currentFiles.push(item);
        }
      }
    });
    startTransition(async () => {
      const filesUpload = await uploadFiles(currentFiles);
      setFilesAfterUpload([...filesAfterUpload, ...filesUpload]);
      setCurrentLengthFile([...filesAfterUpload, ...filesUpload].length);
      onChange(filesUpload, '', false);
    });
  };

  const removeImage = (id: string) => {
    const filesAfterRemove = filesAfterUpload.filter((item) => item.id !== id);
    setFilesAfterUpload(filesAfterRemove);
    setCurrentLengthFile(currentLengthFile - 1);
    onChange(filesAfterRemove, id, true);
  };

  return (
    <div className="grid grid-cols-12 gap-2">
      <div className="col-span-full font-bold">
        <span>{title}</span>
        {required && <span className="text-danger"> *</span>}
      </div>
      {noteBeforeUpload && <div className="col-span-full mt-[-10px]">{noteBeforeUpload}</div>}

      <div className="col-span-full grid grid-cols-12 gap-2">
        {filesAfterUpload &&
          filesAfterUpload.map((item) => (
            <div key={item?.id} className="relative col-span-4 md:col-span-2">
              <img src={item?.url} alt="image" className="max-h-96 w-full rounded" />
              {!disabled && (
                <Button
                  className="absolute right-1 top-1 bg-white"
                  shape="circle"
                  icon={<CloseOutlined />}
                  size={'small'}
                  onClick={() => removeImage(item?.id)}
                />
              )}
            </div>
          ))}
        {isPending && (
          <div className="relative col-span-4 md:col-span-2">
            <Spin />
          </div>
        )}
      </div>

      {!disabled && currentLengthFile < maxFile && (
        <div className="col-span-full">
          <label className="inline-flex cursor-pointer flex-col items-center rounded border border-black bg-white px-6 py-2 uppercase tracking-wide shadow-lg">
            <span className="text-base leading-normal">{uploadButtonLabel}</span>
            <input
              type="file"
              accept="image/* "
              className="hidden"
              style={{ display: 'none' }}
              onChange={changeHandler}
              multiple={multiple}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default UploadImageRealtimeWithModule;
