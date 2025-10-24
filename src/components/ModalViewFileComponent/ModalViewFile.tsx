import Modal from 'antd/es/modal';
import { useTranslations } from 'next-intl';
import { FC } from 'react';

export interface IProps {
  name?: string;
  visible: boolean;
  handleOk: () => void;
  handleCanncel: () => void;
  type: string;
  src: string;
}

const ModalViewFile: FC<IProps> = ({ name, type, visible, handleOk, handleCanncel, src }) => {
  const t = useTranslations('Modal');
  const error = useTranslations('error');
  return (
    <Modal width="80%" open={visible} footer={false} onCancel={handleCanncel} closeIcon={true}>
      <div className="flex h-[80vh] items-center justify-center overflow-y-auto p-4">
        {type == 'img' ? (
          <img src={src} alt="" className="h-full w-full object-contain" loading="lazy"></img>
        ) : (
          <iframe src={src} className="h-full w-full"></iframe>
        )}
      </div>
    </Modal>
  );
};

export default ModalViewFile;
