import fileApiService from '@/apiServices/externalApiServices/apiFileService';
import { excelIcon, fileIcon, imageIcon, wordIcon } from '@/libs/appComponents';
import { typeFile } from '@/libs/appconst';
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
  InitFiles?: any[];
  disabled?: boolean;
  onChange: (images: File[], idRemove?: string) => void;
  maxFile?: number;
  noteBeforeUpload?: string;
}
const getBase64 = (img: File, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const UploadFileDocument: FC<InputProps> = ({
  title = 'Upload',
  uploadButtonLabel = 'Upload',
  multiple,
  required = false,
  InitFiles,
  onChange,
  disabled = false,
  maxFile = 10,
  noteBeforeUpload,
}) => {
  const notify = React.useCallback((type: TypeOptions, message: any) => {
    toast[type](message);
  }, []);
  const errorNotifi = useTranslations('errorNotifi');
  const [images, setImages] = useState<File[]>([]);
  const [currentLengthFile, setCurrentLengthFile] = useState<number>(0);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [pendingImage, setPendingImage] = useState<number>(0);

  const [imagesUrl, setImagesUrl] = useState<any[]>([]);

  useEffect(() => {
    initUpload();
    setImages([]);
  }, [InitFiles]);

  const initUpload = () => {
    setImagesUrl(InitFiles);
    setCurrentLengthFile(InitFiles ? InitFiles.length : 0);
  };

  const handleImage = (file: File, index: number) => {
    if (index >= 1) {
      return;
    }
    getBase64(file, (base64: string) => {
      setPendingImage(pendingImage - 1);
      images.push(file);
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
    const newList = imagesUrl.filter((item) => item.id !== id);
    setTimeout(() => {
      setImagesUrl(newList);
    }, 200);

    setCurrentLengthFile(currentLengthFile - 1);
    onChange(galleryImages, id);
  };

  const removeImage = (index: number, file: File) => {
    images.splice(index, 1);
    setImages([...images]);
    const newListFile = galleryImages.filter((item) => item !== file);
    setGalleryImages(newListFile);
    setCurrentLengthFile(currentLengthFile - 1);
    onChange(galleryImages, undefined);
  };

  const downloadfile = async (id: string) => {
    if (id) {
      await fileApiService.getDocumentFile(id);
    }
  };

  const renderFile = (file: any) => {
    let iconShow;
    switch (file.mimeType) {
      case typeFile.excel:
      case typeFile.excel1:
        iconShow = excelIcon;
        break;
      case typeFile.word:
      case typeFile.word1:
        iconShow = wordIcon;
        break;
      case typeFile.pdf:
        iconShow = fileIcon;
        break;
      case typeFile.image_png:
      case typeFile.imamge_jpeg:
        iconShow = imageIcon;
        break;
      default:
        iconShow = fileIcon;
    }

    return (
      <>
        {iconShow}
        <a href="" className="ml-1" onClick={() => downloadfile(file?.id)}>
          {file.name}
        </a>
      </>
    );
  };

  return (
    <div>
      <div className="col-span-full my-2 font-bold">
        <span>{title}</span>
        {required && <span className="text-danger"> *</span>}
      </div>
      {noteBeforeUpload && <div className="col-span-full mt-[-10px]">{noteBeforeUpload}</div>}

      {!disabled && currentLengthFile < maxFile && (
        <div className="col-span-full my-1">
          <label className="inline-flex cursor-pointer flex-col items-center rounded border border-black bg-white px-6 py-2 uppercase tracking-wide shadow-lg">
            <span className="text-base leading-normal">{uploadButtonLabel}</span>
            <input
              type="file"
              accept={`${[...Object.values(typeFile)]}`}
              className="hidden"
              style={{ display: 'none' }}
              onChange={changeHandler}
              multiple={multiple}
            />
          </label>
        </div>
      )}

      <ul className="gap-2">
        {imagesUrl &&
          imagesUrl.map((item) => (
            <li key={item.id} className="my-1 flex w-fit">
              {renderFile(item)}
              {!disabled && (
                <Button
                  className="ml-2"
                  shape="circle"
                  icon={<CloseOutlined />}
                  size={'small'}
                  onClick={() => removeInitImage(item.id)}
                />
              )}
            </li>
          ))}

        {images &&
          images.map((file, index) => (
            <li key={index} className="my-1 flex w-fit">
              {renderFile(file)}
              {!disabled && (
                <Button
                  className="ml-2"
                  shape="circle"
                  icon={<CloseOutlined />}
                  size={'small'}
                  onClick={() => removeImage(index, file)}
                />
              )}
            </li>
          ))}
        {pendingImage > 0 &&
          Array.from(Array(pendingImage).keys()).map((imageUrl, index) => (
            <div key={index} className="relative col-span-4 md:col-span-2">
              <div className="flex h-full max-h-96 w-full items-center justify-center rounded border">
                <Spin />
              </div>
            </div>
          ))}
      </ul>
    </div>
  );
};

export default UploadFileDocument;
