import ImageModel from '@/models/commonModel/imageModel';
import { CloseOutlined } from '@ant-design/icons';
import { Button, Spin } from 'antd';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { TypeOptions, toast } from 'react-toastify';
export interface InputProps {
  title?: string;
  uploadButtonLabel?: string;
  multiple?: boolean;
  required?: boolean;
  urlInit: string;
  disabled?: boolean;
  onChange: (images: File) => void;
}
const getBase64 = (img: File, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const UploadFile = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    title,
    uploadButtonLabel = 'Upload',
    multiple,
    required = false,
    urlInit,
    onChange,
    disabled = false,
  }) => {
    const notify = React.useCallback((type: TypeOptions, message: any) => {
      toast[type](message);
    }, []);
    const errorNotifi = useTranslations('errorNotifi');
    const [images, setImages] = useState<ImageModel[]>([]);
    const [imagesUpload, setImagesUpload] = useState<File>();
    const [pendingImage, setPendingImage] = useState<number>(0);
    const [isDelete, setIsDelete] = useState<boolean>(false);
    const handleImage = (files: FileList, index: number) => {
      if (index >= files.length) {
        return;
      }

      getBase64(files.item(index), (base64: string) => {
        setPendingImage(pendingImage - 1);
        images.push({ isBase64: true, value: base64 });
        setImages([...images]);
        handleImage(files, index + 1);
      });
    };

    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
      //check size file if size > 10 MB
      if (event.target.files[0].size / 1024 / 1024 > 5) {
        notify(
          'warning',
          errorNotifi('listNameFileisOverSize', {
            maxSize: 5,
          }),
        );
      } else {
        const { files } = event.target;

        setImagesUpload(event.target.files[0]);
        let index = 0;
        setPendingImage(files.length);
        handleImage(files, index);
      }
    };
    const removeImage = (index: number) => {
      images.splice(index, 1);
      setImages([...images]);
      onChange(undefined);
    };

    useEffect(() => {
      if (imagesUpload !== undefined) {
        onChange(imagesUpload);
      }
    }, [imagesUpload]);

    return (
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-full font-bold">
          <span>{title}</span>
          {required && <span className="text-danger"> *</span>}
        </div>
        <div className="col-span-full grid grid-cols-12 gap-4">
          {!isDelete && images.length < 1 && urlInit && (
            <div className="relative col-span-4">
              <img src={urlInit} alt="image" className="max-h-96 w-full rounded" />
              {!disabled && (
                <Button
                  className="absolute right-1 top-1 bg-white"
                  shape="circle"
                  icon={<CloseOutlined />}
                  size={'small'}
                  onClick={() => {
                    setIsDelete(true), onChange(undefined);
                  }}
                />
              )}
            </div>
          )}
          {(isDelete || images) &&
            images.map((image, index) => (
              <div key={index} className="relative col-span-4">
                <img src={image.value} alt="image" className="max-h-96 w-full rounded" />
                {!disabled && (
                  <Button
                    className="absolute right-1 top-1 bg-white"
                    shape="circle"
                    icon={<CloseOutlined />}
                    size={'small'}
                    onClick={() => removeImage(index)}
                  />
                )}
              </div>
            ))}
          {pendingImage > 0 &&
            Array.from(Array(pendingImage).keys()).map((imageUrl, index) => (
              <div key={index} className="relative col-span-4 md:col-span-2">
                <div className="flex h-full max-h-96 w-full items-center justify-center rounded border">
                  <Spin />
                </div>
              </div>
            ))}
        </div>

        {(!urlInit || isDelete) && images.length < 1 && (
          <div className="col-span-full">
            <label className="inline-flex cursor-pointer flex-col items-center rounded border border-black bg-white px-6 py-2 uppercase tracking-wide shadow-lg">
              <span className="text-base leading-normal">{uploadButtonLabel}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                style={{ display: 'none' }}
                onChange={changeHandler}
                multiple={false}
              />
            </label>
          </div>
        )}
      </div>
    );
  },
);

export default UploadFile;
