import { CloseOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { IconUploadIcon, linkBannerIconIcon } from '@/libs/appComponents';
import { BannerAttachments } from '@/models/propertyModel/bannerListModal';
import { Button, Popconfirm, Upload } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload/interface';
import { useTranslations } from 'next-intl';
export interface Props {
  label?: string;
  baseValue?: BannerAttachments[];
  form?: any;
  aspectImage?: number;
  bannerChangeValue?: (value) => void;
}

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
const BannerUpload: React.FC<Props> = ({ label, baseValue, bannerChangeValue, aspectImage }) => {
  const t = useTranslations('webLabel');
  const [fileList, setFileList] = useState<any[]>([]);
  const [listIdImageDelete, setListIdImageDelete] = useState<any[]>([]);
  const [inputValues, setInputValues] = useState(Array(fileList.length).fill(''));
  useEffect(() => {
    setFileList([]);
    setInputValues([]);
    let newListIdDelete = [] as any;
    fileList.map((item) => {
      if (item.id) {
        newListIdDelete.push(item.id);
      }
    });
    setListIdImageDelete(newListIdDelete);
  }, [aspectImage]);
  useEffect(() => {
    if (baseValue) {
      let newListImage = [] as any;
      let newListLink = [] as any;
      for (const banner of baseValue) {
        newListImage.push({
          thumbUrl: banner?.bannerImageUrl,
          id: banner?.bannerId,
          name: banner?.bannerName,
        });
        newListLink.push(banner?.bannerLink);
      }
      setFileList(newListImage);
      setInputValues(newListLink);
    }
  }, [baseValue]);

  useEffect(() => {
    const attachments = [] as any;
    fileList.map((file, index) => {
      const data = {
        bannerId: file.id,
        bannerLink: inputValues[index],
        bannerName: file.name,
        newFile: file.newFile,
        sequence: index,
      };
      attachments.push(data);
    });

    bannerChangeValue({
      attachments: attachments,
      listImageDelete: listIdImageDelete,
    });
  }, [fileList, inputValues, listIdImageDelete]);
  const handleInputChange = (index, value) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);
  };
  const onChange: UploadProps['onChange'] = async ({ fileList: newFileList, file }) => {
    const data = await Promise.all(
      newFileList.map(async (file) => {
        if (file?.originFileObj) {
          const fileUrl = await getBase64(file?.originFileObj);

          return { ...file, thumbUrl: fileUrl, newFile: file?.originFileObj };
        } else {
          return { ...file };
        }
      }),
    );
    // setFileList(data);
  };
  const removeImage = (value, index?) => {
    const newList = [...fileList].filter((item) => item.uid !== value.uid);

    let newLink = [...inputValues];
    newLink.splice(index, 1);
    setFileList(newList);
    setInputValues(newLink);
    if (value.id) {
      const newListIdDelete = [...listIdImageDelete, value.id];
      setListIdImageDelete(newListIdDelete);
    }
  };
  const onCancleImage = (value) => {
    // console.log(value);
  };
  const onOkImage = async (value: RcFile) => {
    const fileUrl = await getBase64(value);

    const data = {
      ...value,
      thumbUrl: fileUrl,
      name: uuid(),
      newFile: value,
    };
    const newList = [...fileList, data];
    setFileList(newList);
  };
  const empty = (
    <div className="flex h-80 w-full items-center justify-center">
      <span>{t('EcomBannerImageNoImage')}</span>
    </div>
  );
  return (
    <div className="flex">
      <ImgCrop
        showGrid
        showReset
        rotationSlider
        onModalCancel={onCancleImage}
        onModalOk={onOkImage}
        aspect={aspectImage}
      >
        <Upload
          className="mr-2 flex"
          onChange={onChange}
          fileList={fileList}
          showUploadList={false}
          disabled={fileList.length >= 6}
        >
          {IconUploadIcon}
        </Upload>
      </ImgCrop>
      {fileList.length > 0 ? (
        <div className="grid w-full grid-cols-12 gap-2">
          {fileList.map((item, index) => (
            <div key={index} className={`${aspectImage > 1 ? 'col-span-6' : 'col-span-3'}`}>
              {/*  aspectImage lớn hơn 1 là horizontal, ngược lại là vertical  */}
              <div className="relative">
                <img
                  src={item?.thumbUrl}
                  alt="avatar"
                  className={`${aspectImage === 2 ? 'h-[233px] w-[475px]' : aspectImage > 3 ? 'h-[100px] w-full' : 'h-[400px] w-[160px]'} rounded drop-shadow`} /*  aspectImage lớn hơn 1 là horizontal, ngược lại là vertical  */
                />

                <Popconfirm
                  title={t('EcomBannerManagementConfirmDeleteImageTitle')}
                  description={t('EcomBannerManagementConfirmDeleteImageDescription')}
                  onConfirm={() => removeImage(item, index)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    className="absolute right-1 top-1 bg-white"
                    shape="circle"
                    icon={<CloseOutlined />}
                    size={'small'}
                  />
                </Popconfirm>
              </div>
              <div className="mt-2 w-full rounded-lg drop-shadow">
                <div className="flex rounded-lg bg-white">
                  <span className="inline-flex items-center rounded-l-lg rounded-s-md border-r border-gray-300 bg-white px-3">
                    {linkBannerIconIcon}
                  </span>
                  <input
                    value={inputValues[index]}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    className="block w-full appearance-none rounded-r-lg border-0 bg-transparent px-1 py-2 text-sm focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        empty
      )}
    </div>
  );
};

export default BannerUpload;
