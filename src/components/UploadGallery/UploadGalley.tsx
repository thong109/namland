import ImageModelFull from '@/models/commonModel/imageModelFull';
import ImageUrlModel from '@/models/commonModel/imageUrlModel';
import { CloseOutlined } from '@ant-design/icons';
import { Button, Spin } from 'antd';
import { useTranslations } from 'next-intl';
import React, { FC, useEffect, useState } from 'react';
import { TypeOptions, toast } from 'react-toastify';
export interface InputProps {
  title?: string;
  uploadButtonLabel?: string;
  multiple?: boolean;
  required?: boolean;
  initImages?: ImageUrlModel[];
  disabled?: boolean;
  onChange: (images: File[], idRemove?: string, isDeleteFileBeforUpdate?: boolean) => void;
  maxFile?: number;
  noteBeforeUpload?: string;
}
const getBase64 = (img: File, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const UploadGallery: FC<InputProps> = ({
  title = 'Upload',
  uploadButtonLabel = 'Upload',
  multiple,
  required = false,
  initImages,
  onChange,
  disabled = false,
  maxFile = 10,
  noteBeforeUpload,
}) => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);
  const errorNotifi = useTranslations('errorNotifi');
  const [images, setImages] = useState<ImageModelFull[]>([]);
  const [currentLengthFile, setCurrentLengthFile] = useState<number>(0);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [pendingImage, setPendingImage] = useState<number>(0);

  const [imagesUrl, setImagesUrl] = useState([] as any);

  useEffect(() => {
    initUpload();
  }, [initImages]);

  const initUpload = () => {
    setCurrentLengthFile(initImages ? initImages.length : 0);
    setImagesUrl(initImages);
  };

  const handleImage = (file: File, index: number) => {
    if (index >= 1) {
      return;
    }
    getBase64(file, (base64: string) => {
      setPendingImage(pendingImage - 1);
      images.push({ isBase64: true, value: base64, file: file });
      setImages([...images]);
      handleImage(file, index + 1);
    });
  };

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    //check size file if size > 10 MB
    let currentFiles = galleryImages;
    let numberFiles = currentLengthFile;
    const { files } = event.target;
    let filesSelect = [...files];

    let namesFileError = [];
    let isHaveOverSize = false;

    filesSelect.map((item) => {
      if (item.size / 1024 / 1024 > 5) {
        isHaveOverSize = true;
        namesFileError.push(item.name);
      } else {
        if (numberFiles < maxFile) {
          numberFiles++;
          currentFiles.push(item);
          let index = 0;
          setPendingImage(1);
          handleImage(item, index);
        }
      }
    });

    setGalleryImages(currentFiles);
    setCurrentLengthFile(numberFiles);

    onChange(galleryImages);
    if (isHaveOverSize) {
      var names = namesFileError;
      var text = names.join(',');

      notify(
        'warning',
        errorNotifi('listNameFileisOverSize', {
          maxSize: 5,
        }),
      );
    }
  };

  const removeInitImage = (id: string) => {
    const listItem = [...imagesUrl];
    const newList = listItem.filter((item) => item.id !== id);

    setImagesUrl([...newList]);
    setCurrentLengthFile(currentLengthFile - 1);
    onChange(galleryImages, id);
  };

  const removeImage = (index: number, file: File) => {
    images.splice(index, 1);
    setImages([...images]);
    const newListFile = galleryImages.filter((item) => item !== file);
    setGalleryImages(newListFile);
    setCurrentLengthFile(currentLengthFile - 1);
    onChange(galleryImages, undefined, true);
  };

  return (
    <div className="grid grid-cols-12 gap-2">
      <div className="col-span-full font-bold">
        <span>{title}</span>
        {required && <span className="text-danger"> *</span>}
      </div>
      {noteBeforeUpload && <div className="col-span-full mt-[-10px]">{noteBeforeUpload}</div>}
      <div className="col-span-full grid grid-cols-12 gap-2">
        {imagesUrl &&
          imagesUrl.map((item) => (
            <div key={item?.id} className="relative col-span-4 md:col-span-2">
              <img src={item?.url} alt="image" className="max-h-96 w-full rounded" />
              {!disabled && (
                <Button
                  className="absolute right-1 top-1 bg-white"
                  shape="circle"
                  icon={<CloseOutlined />}
                  size={'small'}
                  onClick={() => removeInitImage(item?.id)}
                />
              )}
            </div>
          ))}

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
                  onClick={() => removeImage(index, image.file)}
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

export default UploadGallery;
