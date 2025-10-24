import ButtonBack from '@/components/Button/ButtonBack/ButtonBack';
import ButtonPrimary from '@/components/Button/ButtonPrimary/ButtonPrimary';
import { ListtingExpiredIcon } from '@/libs/appComponents';
import { Col, Row } from 'antd';
import Modal from 'antd/es/modal';
import { useTranslations } from 'next-intl';
import React from 'react';

interface ModalDetailProps {
  closeModal: () => void;
  open: boolean;
  onRepostWithoutRepost: (isChange) => void;
}

const ModalAcctionListtingExpired: React.FC<ModalDetailProps> = ({
  onRepostWithoutRepost,
  open,
  closeModal,
}) => {
  const t = useTranslations('Common');

  const handleCanncel = () => {
    closeModal();
  };

  return (
    <Modal
      onCancel={handleCanncel}
      mask={false}
      open={open}
      maskClosable={false}
      closeIcon={false}
      footer={[
        <div className="flex flex-wrap justify-evenly lg:justify-between">
          <ButtonBack text={t('goBack')} onClick={handleCanncel} className="mt-1 text-xs" />
          <ButtonBack
            text={t('ChangeListingContent')}
            onClick={() => onRepostWithoutRepost(true)}
            className="mt-1 text-xs"
          />
          <ButtonPrimary
            text={t('RepostWithothChanging')}
            onClick={() => onRepostWithoutRepost(false)}
            className="ml-1 mt-1 rounded-full text-xs"
          />
        </div>,
      ]}
    >
      <div className="h-100">
        <Row>
          <Col span={24} className="my-4 flex justify-center">
            {ListtingExpiredIcon}
          </Col>

          <Col span={24} className="mt-2 flex justify-center">
            <label className="mt-2 text-xl font-bold text-portal-primaryLiving">
              {t('ListingRepostTitleModal')}
            </label>
          </Col>
          <Col span={24}>
            <p className="mt-2 text-sm">{t('noteListingExpiredBeforeSubmit1')}</p>

            <p className="mt-2 text-sm">{t('noteListingExpiredBeforeSubmit2')}</p>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default ModalAcctionListtingExpired;
