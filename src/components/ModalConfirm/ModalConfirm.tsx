import Col from 'antd/es/grid/col';
import Row from 'antd/es/grid/row';
import Modal from 'antd/es/modal';
import { useTranslations } from 'next-intl';
import ButtonBack from '../Button/ButtonBack/ButtonBack';
import ButtonPrimary from '../Button/ButtonPrimary/ButtonPrimary';

export interface IProps {
  visible: boolean;
  title: string;
  content: string;
  handleOk: () => void;
  handleCanncel: () => void;
}

const ModalConfirm = ({ title, content, visible, handleOk, handleCanncel }: any) => {
  const t = useTranslations('Modal');
  const error = useTranslations('error');
  return (
    <Modal
      width="30%"
      open={visible}
      onOk={handleOk}
      onCancel={handleCanncel}
      closeIcon={false}
      footer={[
        <div className="flex justify-center">
          <ButtonBack text={t('goBack')} onClick={handleCanncel} />
          <ButtonPrimary text={t('confirm')} onClick={handleOk} className="ml-1 rounded-full" />
        </div>,
      ]}
    >
      <div>
        <Row className="pb-2 pt-3">
          <Col span={24} className="flex justify-center">
            <label className="mt-2 text-2xl font-bold">{title}</label>
          </Col>
          <Col span={24} className="flex justify-center">
            <label className="mt-2 text-base">{content}</label>
          </Col>
        </Row>
        <hr className="my-4 h-px border-0 bg-gray-200 dark:bg-gray-700"></hr>
      </div>
    </Modal>
  );
};

export default ModalConfirm;
