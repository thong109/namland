import ImageModel from '@/models/commonModel/imageModel';
import { CloseOutlined } from '@ant-design/icons';
import { Button, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
export interface InputProps {
  title?: string;
  uploadButtonLabel?: string;
  multiple?: boolean;
  required?: boolean;
  initImages: ImageModel[];
  disabled?: boolean;
  onChange: (images: ImageModel[]) => void;
}
const getBase64 = (img: File, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const GalleryUpload = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    title = 'Upload',
    uploadButtonLabel = 'Upload',
    multiple,
    required = false,
    initImages,
    onChange,
    disabled = false,
  }) => {
    const [images, setImages] = useState<ImageModel[]>(initImages ? initImages : []);

    const [pendingImage, setPendingImage] = useState<number>(0);

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
      const { files } = event.target;
      let index = 0;
      setPendingImage(files.length);
      handleImage(files, index);
    };

    const removeImage = (index: number) => {
      images.splice(index, 1);
      setImages([...images]);
    };

    useEffect(() => {
      if (images !== undefined && images.length > 0) {
        onChange(images);
      }
    }, [images]);

    return (
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-full font-bold">
          <span>{title}</span>
          {required && <span>*</span>}
        </div>
        <div className="col-span-full grid grid-cols-12 gap-4">
          {images &&
            images.map((image, index) => (
              <div key={index} className="relative col-span-4 md:col-span-2">
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

        {!disabled && (
          <div className="col-span-full">
            <label className="text-blue hover:bg-blue inline-flex cursor-pointer flex-col items-center border border-black bg-white px-12 py-4 uppercase tracking-wide">
              <span className="text-base leading-normal">{uploadButtonLabel}</span>
              <input
                type="file"
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
  },
);

export default GalleryUpload;
