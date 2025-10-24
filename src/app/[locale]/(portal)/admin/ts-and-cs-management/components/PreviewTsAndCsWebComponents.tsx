import { Modal } from 'antd';

export const PreviewTsAndCsWebComponents = ({ data, isShow, onCancel, language = 'vi' }) => {
  const title = data?.title.find((item) => item?.language === language)?.value ?? null;
  const description = data?.description.find((item) => item?.language === language)?.value ?? null;

  return (
    <Modal className="!w-[100vw]" open={isShow} onCancel={onCancel} footer={null}>
      <div className="container bg-white py-5">
        <h1 className="color-portal-primaryLiving mb-7 pb-1 text-center text-3xl font-bold">
          {title}
        </h1>

        <div
          dangerouslySetInnerHTML={{
            __html: description,
          }}
        />
      </div>
    </Modal>
  );
};
