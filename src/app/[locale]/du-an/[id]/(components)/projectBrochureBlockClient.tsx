'use client';

import IconDownload from '@/components/Icons/IconDownload';
import IconExcel from '@/components/Icons/IconExcel';
import IconFile from '@/components/Icons/IconFile';
import IconPdf from '@/components/Icons/IconPdf';
import IconPhoto from '@/components/Icons/IconPhoto';
import IconPpt from '@/components/Icons/IconPpt';
import IconView from '@/components/Icons/IconView';
import IconWord from '@/components/Icons/IconWord';
import { ProjectBrochureModel } from '@/models/projectModel/projectBrochureMode';
import { Modal, Spin, Typography } from 'antd';
import mimeType from 'mime-types';
import { useLocale, useTranslations } from 'next-intl';
import { FC, useState } from 'react';

interface ProjectBrochureBlockProps {
  brochures: ProjectBrochureModel[];
}

const ProjectBrochureBlockClient: FC<ProjectBrochureBlockProps> = ({ brochures }) => {
  const t = useTranslations('error');
  const locale = useLocale();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{
    name: string;
    url: string;
  }>(null);
  const [base64Pdf, setBase64Pdf] = useState<string>(null);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    selectedDocument?.url && window.open(selectedDocument?.url);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const viewDoc = async (doc: { name: string; url: string }) => {
    switch (mimeType.lookup(doc.name)) {
      case 'image/png':
      case 'image/jpeg':
      case 'image/apng':
      case 'image/avif':
      case 'image/gif':
      case 'image/svg+xml':
      case 'image/webp':
      case 'application/pdf': {
        setSelectedDocument(doc);
        showModal();

        const res = await fetch(doc.url, {
          method: 'GET',
        });
        const blob = await res.blob();
        // const file = new File([blob], doc.name);
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.addEventListener('load', () => {
          var base64data = reader.result as string;
          setBase64Pdf(base64data);
        });
        break;
      }
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'application/vnd.ms-excel':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      case 'application/vnd.ms-powerpoint':
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      default:
        //download only
        window.open(doc.url);
        break;
    }
  };

  const renderDocumentIcon = (fileName: string) => {
    switch (mimeType.lookup(fileName)) {
      case 'image/png':
      case 'image/jpeg':
      case 'image/apng':
      case 'image/avif':
      case 'image/gif':
      case 'image/svg+xml':
      case 'image/webp':
        return <IconPhoto className="h-4 w-4" />;
      case 'application/pdf':
        return <IconPdf className="h-4 w-4" />;
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return <IconWord className="h-4 w-4" />;
      case 'application/vnd.ms-excel':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return <IconExcel className="h-4 w-4" />;
      case 'application/vnd.ms-powerpoint':
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        return <IconPpt className="h-4 w-4" />;
      default:
        return <IconFile className="h-4 w-4" />;
    }
  };

  const renderViewOrDownloadIcon = (fileName: string) => {
    switch (mimeType.lookup(fileName)) {
      case 'image/png':
      case 'image/jpeg':
      case 'image/apng':
      case 'image/avif':
      case 'image/gif':
      case 'image/svg+xml':
      case 'image/webp':
      case 'application/pdf':
        return <IconView />;
      default:
        return <IconDownload />;
    }
  };

  const renderModalBody = () => {
    switch (mimeType.lookup(selectedDocument.name)) {
      case 'application/pdf': {
        return (
          <object
            data={base64Pdf}
            type={mimeType.lookup(selectedDocument.name) as string}
            width="100%"
            height="100%"
          ></object>
        );
      }
      case 'image/png':
      case 'image/jpeg':
      case 'image/apng':
      case 'image/avif':
      case 'image/gif':
      case 'image/svg+xml':
      case 'image/webp': {
        return (
          <img
            src={selectedDocument.url}
            alt={selectedDocument.name}
            className="h-full w-full object-contain"
          ></img>
        );
      }
      default:
        return <div>{t('cannotBePreviewed')}</div>;
    }
  };

  const renderMultiLanguageText = (brochure: ProjectBrochureModel, prefix: string) => {
    let result =
      locale === 'vi'
        ? brochure[prefix]
        : locale === 'en'
          ? brochure[prefix + 'En']
          : brochure[prefix + 'Kr'];
    return result ?? brochure[prefix];
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {brochures &&
          brochures.map((brochure, index) => (
            <div key={index}>
              <Typography className="text-base font-bold">
                {renderMultiLanguageText(brochure, 'title')}
              </Typography>
              <Typography>{renderMultiLanguageText(brochure, 'description')}</Typography>
              <div className="bg-portal-gray-1 bg-opacity-40 p-4 shadow-md">
                {brochure.documentUrls.map((d, subIndex) => (
                  <div key={index + '-' + subIndex} className="grid grid-cols-12">
                    <div className="col-span-1">{renderDocumentIcon(d.name)}</div>
                    <div className="col-span-9 underline">{d.name}</div>
                    <div className="col-span-2">
                      <span
                        className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-portal-border"
                        onClick={() => viewDoc(d)}
                      >
                        {renderViewOrDownloadIcon(d.name)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={'80%'}
        style={{
          top: '2%',
          height: '100vh',
          paddingBottom: 0,
        }}
        styles={{
          body: {
            paddingTop: '2rem',
            height: '100%',
          },
          content: {
            height: '96%',
          },
        }}
        footer={null}
      >
        <div className="flex h-full w-full justify-center">
          {selectedDocument ? renderModalBody() : <Spin />}
        </div>
      </Modal>
    </>
  );
};

export default ProjectBrochureBlockClient;
