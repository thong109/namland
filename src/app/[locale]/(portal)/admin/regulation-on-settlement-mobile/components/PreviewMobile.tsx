import { Modal } from 'antd';

export const PreviewMobileComponents = ({ data, isShow, onCancel, language = 'vi' }) => {
  const title = data?.titleMobile.find((item) => item?.language === language)?.value ?? null;
  const description =
    data?.descriptionMobile.find((item) => item?.language === language)?.value ?? null;

  return (
    <Modal className="!h-[744px] !w-[390px]" open={isShow} onCancel={onCancel} footer={null}>
      <div className="flex items-center justify-center">
        {/* iPhone frame */}
        <div className="relative h-[744px] w-[390px] overflow-hidden rounded-[60px] border-2 border-black bg-black shadow-2xl">
          {/* Notch (camera + loa) */}
          <div className="absolute left-1/2 top-0 z-10 mt-2 flex h-6 w-40 -translate-x-1/2 transform items-center justify-center rounded-b-3xl bg-black">
            <div className="mr-2 h-2 w-2 rounded-full bg-gray-800"></div>
            <div className="h-1 w-16 rounded bg-gray-700"></div>
          </div>

          {/* Screen area */}
          <div className="container h-[744px] overflow-y-auto overflow-x-hidden bg-white px-2 py-8">
            <h1 className="color-portal-primaryLiving mb-7 pb-1 text-center text-3xl font-bold">
              {title}
            </h1>

            <div
              className="w-full break-words text-sm leading-relaxed text-gray-700"
              style={{
                wordBreak: 'break-word',
              }}
              dangerouslySetInnerHTML={{
                __html: description,
              }}
            />
          </div>

          {/* Home Indicator (thanh gạch ở dưới) */}
          <div className="absolute bottom-4 left-1/2 h-1.5 w-28 -translate-x-1/2 transform rounded-full bg-gray-400 opacity-80"></div>
        </div>
      </div>
    </Modal>
  );
};
