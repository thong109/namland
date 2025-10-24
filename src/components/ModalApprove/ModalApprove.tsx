import Form from 'antd/es/form';
import Col from 'antd/es/grid/col';
import Row from 'antd/es/grid/row';
import Modal from 'antd/es/modal';
import { useTranslations } from 'next-intl';

export interface IProps {
  name: string;
  form: any;
  visible: boolean;
  handleOk: () => void;
  handleCanncel: () => void;
}

const ModalApprove = ({ name, form, visible, handleOk, handleCanncel }: any) => {
  const t = useTranslations('Modal');
  const error = useTranslations('error');

  return (
    <Modal
      width="40%"
      open={visible}
      onOk={handleOk}
      onCancel={handleCanncel}
      closeIcon={false}
      footer={[
        <div className="flex justify-center" key="Na">
          <button
            key="back"
            className="mr-1 border-x border-y border-[#404040] bg-portal-card px-10 py-3"
            onClick={handleCanncel}
          >
            <label>{t('goBack')}</label>
          </button>

          <button
            key="submit"
            className="ml-1 border-x border-y border-portal-greenText bg-portal-greenBg px-10 py-3"
            onClick={handleOk}
          >
            <label className="text-portal-greenText">{t('approve')}</label>
          </button>
        </div>,
      ]}
    >
      <div className="h-52">
        <Row className="pb-2 pt-3">
          <Col span={24} className="flex justify-center">
            <label className="mt-2 text-2xl font-bold">{t('approveThisProperty')}</label>
          </Col>
          <Col span={24} className="flex justify-center">
            <label className="mt-2 text-base"> {t('approveContact')}</label>
          </Col>
        </Row>

        <Form form={form}>
          <Row gutter={[8, 8]} className="mt-1">
            <Col span={24}>
              <Form.Item name={name} rules={[{ required: true, message: error('inputRequired') }]}>
                <textarea
                  rows={3}
                  className="w-full border-b border-l-0 border-r-0 border-t border-[#F2F4F8]"
                  placeholder={t('descriptions')}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
};

export default ModalApprove;
