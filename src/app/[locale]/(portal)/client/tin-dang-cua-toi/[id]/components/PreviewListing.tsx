import GalleryPrimary from '@/components/GalleryPrimary/GalleryPrimary';
import ArticleInformationDetails from '@/components/ArticleInformation/ArticleInformationDetails';
import ArticleInformationOverview from '@/components/ArticleInformation/ArticleInformationOverview';
import ButtonSaveListing from '@/components/Button/ButtonSaveListing/ButtonSaveListing';
import Modal from 'antd/es/modal';
import { useTranslations } from 'next-intl';
import React from 'react';

interface BuyPackageModalProps {
  closeModal: () => void;
  isVisible: boolean;
  dataShowPreview: any;
  handleOke: () => void;
  locale: string;
}

const PreviewListingModal: React.FC<BuyPackageModalProps> = ({
  isVisible,
  closeModal,
  handleOke,
  dataShowPreview,
  locale,
}) => {
  const comm = useTranslations('Common');

  return (
    <Modal
      style={{ borderRadius: '0px', top: 20 }}
      styles={{
        wrapper: {
          background: 'none',
          top: 10,
        },
        content: {
          padding: '0px',
          boxShadow: 'none',
        },
      }}
      open={isVisible}
      onCancel={closeModal}
      closable={false}
      footer={[
        <div className="flex justify-center py-5">
          <ButtonSaveListing text={comm('GoBack')} onClick={closeModal} className="mr-2" />
          <ButtonSaveListing
            text={comm('Submit')}
            className="!bg-[#FFD14B] px-6 !text-[#ffffff]"
            onClick={handleOke}
          />
        </div>,
      ]}
      width={'100%'}
    >
      <div className="container flex flex-col gap-10">
        <GalleryPrimary images={dataShowPreview?.imageUrls ?? []} />
        <ArticleInformationOverview listingDetail={dataShowPreview} locale={locale} />
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex flex-col gap-10 lg:w-3/4">
            <ArticleInformationDetails listingDetail={dataShowPreview} locale={locale} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PreviewListingModal;
