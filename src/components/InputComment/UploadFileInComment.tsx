import { addFileImage } from '@/libs/appComponents';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { TypeOptions, toast } from 'react-toastify';
export interface InputProps {
  onChange?: (files: File[]) => void;
  maxFile?: number;
  disabled?: boolean;
}

const UploadFileInComment = React.forwardRef<HTMLInputElement, InputProps>(
  ({ onChange, maxFile, disabled = false }) => {
    const notify = React.useCallback((type: TypeOptions, message: any) => {
      toast[type](message);
    }, []);
    const errorNotifi = useTranslations('errorNotifi');
    const [currentLengthFile, setCurrentLengthFile] = useState<number>(0);
    const [fileUpload, setFileUpload] = useState<File[]>([]);

    const handleImage = (files: FileList, index: number) => {
      if (index >= files.length) {
        return;
      }
    };

    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
      //check size file if size > 10 MB

      Object.values(event.target.files).map((item) => {
        if (item.size / 1024 / 1024 > 5) {
          return notify(
            'warning',
            errorNotifi('listNameFileisOverSize', {
              maxSize: 5,
            }),
          );
        }
      });

      const { files } = event.target;

      setFileUpload(Object.values(files));
      setCurrentLengthFile(currentLengthFile + 1);

      let index = 0;

      handleImage(files, index);

      // ✅ Reset giá trị input để lần sau chọn lại file vẫn được
      event.target.value = '';
    };

    useEffect(() => {
      if (fileUpload !== undefined) {
        onChange(fileUpload);
      }
    }, [fileUpload]);

    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-lg text-sm focus:outline-none">
        <label>
          <span>{addFileImage}</span>
          <input
            multiple
            type="file"
            accept="image/*" // Chỉ cho phép upload ảnh
            className="hidden"
            style={{ display: 'none' }}
            onChange={changeHandler}
          />
        </label>
      </div>
    );
  },
);

export default UploadFileInComment;
