import { IconRemoveSocial } from '@/libs/appComponents';
import { convertPhoneNumber84To0 } from '@/libs/helper';
import Col from 'antd/es/grid/col';
import Row from 'antd/es/grid/row';
import Modal from 'antd/es/modal';
import { useTranslations } from 'next-intl';
import './style.scss';

export interface IProps {
  visible: boolean;
  handleOk: () => void;
  handleCanncel: () => void;
  phoneShow: string;
}

const ModalConfirmRemove = ({ visible, handleOk, handleCanncel, phoneShow }: any) => {
  const t = useTranslations('Modal');
  const textLabel = useTranslations('webLabel');
  return (
    <Modal
      width="18%"
      open={visible}
      onOk={handleOk}
      onCancel={handleCanncel}
      closeIcon={false}
      footer={[
        <div className="mt-16 flex justify-between" key="Na">
          <button
            key="back"
            className="rounded-xl border-x bg-[#FFD14B] px-10 py-2 font-medium text-[#ffffff]"
            onClick={handleCanncel}
          >
            <label>{t('goBack')}</label>
          </button>

          <button
            key="submit"
            className="rounded-xl border border-[#FFD14B] bg-[#ffffff] px-10 py-2 font-medium text-[#FFD14B]"
            onClick={handleOk}
          >
            <label>{t('Confirm')}</label>
          </button>
        </div>,
      ]}
    >
      <div className="h-60">
        <Row>
          <Col span={24} className="my-4 flex justify-center">
            {IconRemoveSocial}
          </Col>

          <Col span={24} className="mt-2 flex justify-center">
            <label className="mt-2 text-xl font-bold text-portal-primaryLiving">
              {textLabel('RemoveSocialAccountTitleModal')}
            </label>
          </Col>
          <Col span={24} className="flex justify-center">
            <label className="mt-2 text-center text-sm">
              {textLabel('noteAfterRemoveAccount', {
                phone: phoneShow ? convertPhoneNumber84To0(phoneShow) : '',
              })}
            </label>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default ModalConfirmRemove;
