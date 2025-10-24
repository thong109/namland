import { PropertyStatus } from '@/models/propertyModel/propertyDetailModel';
import { Button } from 'antd';
import Form from 'antd/es/form';
import Col from 'antd/es/grid/col';
import Row from 'antd/es/grid/row';
import Modal from 'antd/es/modal';
import { useTranslations } from 'next-intl';
import FormFloatInputArea from '../FormInput/formTextArea';

export interface IProps {
  typeModal: number;
  form: any;
  visible: boolean;
  handleOk: () => void;
  handleCanncel: () => void;
}

const ModalApproveOrRejectStatus = ({ typeModal, form, visible, handleOk, handleCanncel }: any) => {
  const t = useTranslations('webLabel');
  const error = useTranslations('error');
  return (
    <Modal
      open={visible}
      onOk={handleOk}
      onCancel={handleCanncel}
      closeIcon={false}
      footer={[
        <div className="flex justify-center" key="Na">
          <Button size="large" key="back" className="mr-1 rounded-lg" onClick={handleCanncel}>
            <span>{t('goBack')}</span>
          </Button>

          <Button
            size="large"
            className={`ml-1 rounded-lg ${
              typeModal === PropertyStatus.approved
                ? '!bg-[#1E854A] !text-[#FFFFFF]'
                : '!bg-[#EB5757] !text-[#FFFFFF]'
            }`}
            onClick={handleOk}
          >
            <span>{typeModal === PropertyStatus.approved ? t('approve') : t('reject')}</span>
          </Button>
        </div>,
      ]}
    >
      <div className="h-52">
        <Row className="pb-2 pt-3">
          <Col span={24} className="flex justify-center">
            <label className="mt-2 text-2xl font-bold">
              {typeModal === PropertyStatus.approved ? t('ApproveProperty') : t('RejectProperty')}
            </label>
          </Col>
          <Col span={24} className="flex justify-center">
            <label className="mt-2 text-base">
              {typeModal === PropertyStatus.approved
                ? t('titleApproveProperty')
                : t('titleRejectProperty')}
            </label>
          </Col>
        </Row>

        <Form form={form}>
          <Row gutter={[8, 8]} className="mt-1">
            <Col span={24}>
              <FormFloatInputArea
                name="message"
                placeholder={typeModal === PropertyStatus.approved ? t('description') : t('reason')}
                rules={[
                  {
                    required: typeModal === PropertyStatus.approved ? false : true,
                    message: `${error('pleaseInput')} ${
                      typeModal === PropertyStatus.approved ? t('description') : t('reason')
                    }`,
                  },
                ]}
                row={5}
              />
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
};

export default ModalApproveOrRejectStatus;
