import { downFileIcon } from '@/libs/appComponents';
import FileUrlModel from '@/models/commonModel/fileUrlModel';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { TypeOptions, toast } from 'react-toastify';
export interface InputProps {
  title?: string;
  uploadButtonLabel?: string;
  multiple?: boolean;
  required?: boolean;
  initFiles: FileUrlModel[];
  onChange: (file: File[], idRemove?: string) => void;
  maxFile?: number;
  disabled?: boolean;
  label?: string;
  noteBeforeUpload?: string;
}
const getBase64 = (img: File, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};
const AttachmentUpload = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    title = 'Upload',
    uploadButtonLabel = 'Upload',
    noteBeforeUpload = '',
    label,
    multiple,
    required = false,
    initFiles,
    onChange,
    maxFile,
    disabled = false,
  }) => {
    const notify = React.useCallback((type: TypeOptions, message: any) => {
      toast[type](message);
    }, []);
    const errorNotifi = useTranslations('errorNotifi');
    const [images, setImages] = useState<File[]>([]);
    const [currentLengthFile, setCurrentLengthFile] = useState<number>(0);
    const [galleryImages, setGalleryImages] = useState<File[]>([]);
    const [pendingImage, setPendingImage] = useState<number>(0);

    const [imagesUrl, setImagesUrl] = useState<FileUrlModel[]>([]);
    useEffect(() => {
      initUpload();
    }, [initFiles]);

    const initUpload = () => {
      setImagesUrl(initFiles);
      setCurrentLengthFile(initFiles ? initFiles.length : 0);
    };

    const handleImage = (files: FileList, index: number) => {
      if (index >= files.length) {
        return;
      }
      getBase64(files.item(index), (base64: string) => {
        setPendingImage(pendingImage - 1);
        images.push(files[0]);
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

        const ListImageNew = [...galleryImages, event.target.files[0]];
        setGalleryImages(ListImageNew);
        setCurrentLengthFile(currentLengthFile + 1);

        let index = 0;
        setPendingImage(files.length);
        handleImage(files, index);
      }
    };

    const removeInitImage = (id: string) => {
      const newList = imagesUrl.filter((item) => item.id !== id);
      setImagesUrl(newList);
      setCurrentLengthFile(currentLengthFile - 1);
      onChange(galleryImages, id);
    };

    const removeImage = (index: number, file: File) => {
      images.splice(index, 1);
      setImages([...images]);
      const newListFile = galleryImages.filter((item) => item !== file);
      setGalleryImages(newListFile);
      setCurrentLengthFile(currentLengthFile - 1);
    };

    useEffect(() => {
      if (galleryImages !== undefined) {
        onChange(galleryImages);
      }
    }, [galleryImages]);
    return (
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-full text-sm font-bold">
          <span>{label}</span>
          {required && <span>*</span>}
        </div>
        <div className="col-span-full text-sm">
          <span>{noteBeforeUpload}</span>
        </div>
        <div className="col-span-12 grid grid-cols-6 gap-1">
          <div className="col-span-6 lg:col-span-6">
            <span className="text-xs font-bold text-[#FFD14B]">{title}</span>
          </div>
          <div className="col-span-6 lg:col-span-6">
            {imagesUrl &&
              imagesUrl.map((file) => (
                <div className="mb-2 flex items-center justify-end">
                  <a key={file.id + 'left'} className="col-span-5 mr-2 truncate" href={file.url}>
                    <span>{downFileIcon}</span>
                  </a>
                  <div key={file.id + 'left'} className="col-span-5 mr-3 truncate">
                    <span className="text-portal-gray-5">{file.name}</span>
                  </div>

                  {!disabled && (
                    <div key={file.name + 'right'} className="col-span-1">
                      <Button
                        className="right-1 top-1 bg-white"
                        shape="circle"
                        icon={<CloseOutlined />}
                        size={'small'}
                        onClick={() => removeInitImage(file.id)}
                      />
                    </div>
                  )}
                </div>
              ))}

            {images &&
              images.map((file, index) => [
                <div className="mb-2 flex items-center justify-end">
                  <div key={index + 'left'} className="col-span-5 mr-9 truncate"></div>
                  <div key={file.name + 'left'} className="col-span-5 mr-1 truncate">
                    <span>{file.name}</span>
                  </div>
                  ,
                  <div key={file.name + 'right'} className="col-span-1">
                    <Button
                      className="right-1 top-1 bg-white"
                      shape="circle"
                      icon={<CloseOutlined />}
                      size={'small'}
                      onClick={() => removeImage(index, file)}
                    />
                  </div>
                </div>,
              ])}
          </div>
        </div>
        {!disabled && currentLengthFile < maxFile && (
          <div className="col-span-full">
            <label className="inline-flex cursor-pointer flex-col items-center rounded border border-black bg-white px-6 py-2 uppercase tracking-wide shadow-lg">
              <span className="text-base leading-normal">{uploadButtonLabel}</span>
              <input
                type="file"
                accept="image/*, .pdf"
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

export default AttachmentUpload;
