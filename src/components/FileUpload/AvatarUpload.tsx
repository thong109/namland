import authApiService from '@/apiServices/externalApiServices/authApiService';
import { LoadingOutlined, UserOutlined } from '@ant-design/icons';
import { Upload, message } from 'antd';
import type { RcFile } from 'antd/es/upload/interface';
import React, { useEffect, useState } from 'react';
export interface InputProps {
  label?: string;
  note?: string;
  baseImage?: string;
}
const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};
const handleUpload = async (file) => {
  await authApiService.uploadAvatar(file);
};

const AvatarUpload = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label = 'Upload', baseImage, note }) => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();
    const [showMessageError, setShowMessageError] = useState<string>(undefined);
    useEffect(() => {
      if (baseImage) setImageUrl(baseImage);
    }, [baseImage]);

    const beforeUpload = (file: RcFile) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
        setShowMessageError('You can only upload JPG/PNG file!');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isLt2M) {
        message.error('Image must smaller than 5MB!');
        setShowMessageError('Image must smaller than 5MB!');
        return false;
      }
      setShowMessageError(undefined);

      handleUpload(file);

      return false;
    };

    const handleChange = (info: any) => {
      getBase64(info.file, (imageUrl) => setImageUrl(imageUrl));
    };

    const uploadButton = (
      <div className="bg flex h-[250px] w-[250px] rounded border border-zinc-200">
        {loading ? (
          <div className="flex w-full items-center justify-center">
            <LoadingOutlined />
          </div>
        ) : (
          <div className="flex w-full items-center justify-center">
            <UserOutlined style={{ fontSize: '25px' }} />
          </div>
        )}
      </div>
    );

    return (
      <div className="flex h-full w-full flex-col items-center">
        {imageUrl ? (
          <img src={imageUrl} alt="avatar" className="h-[250px] w-[250px] rounded drop-shadow" />
        ) : (
          uploadButton
        )}
        <Upload
          accept=".jpg, .jpeg, .png"
          name="avatar"
          className="mt-3 rounded-lg bg-portal-primaryMainAdmin p-3 font-medium text-white"
          showUploadList={false}
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {label}
        </Upload>
        {note && <label className="py-3 text-sm text-[#696969]">{note}</label>}
        <span className="text--portal-primaryMainAdmin">
          {showMessageError && showMessageError}
        </span>
      </div>
    );
  },
);

export default AvatarUpload;
