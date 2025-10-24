import { Typography } from 'antd';
import Image from 'next/image';

type IProps = { data };

const ServiceContent: React.FC<IProps> = ({ data, ...props }) => {
  return (
    <div className="mb-20">
      <div className="grid grid-cols-12 gap-2">
        {data?.map((serviceItem, index) => {
          return (
            <div
              key={`isc-${index}`}
              className={`col-span-12 mx-auto max-w-[335px] rounded-2xl border border-portal-border bg-white drop-shadow-md lg:col-span-4`}
            >
              <div
                className={`relative h-52 w-full flex-shrink-0 overflow-hidden rounded-t-2xl border-b border-portal-border sm:h-56`}
              >
                <Image
                  fill
                  alt={serviceItem?.fileName}
                  src={serviceItem?.imageUrl}
                  className="h-full w-full object-fill"
                  loading="lazy"
                />
              </div>

              <div className="grid grid-flow-row p-4">
                <Typography className={`h-5 truncate font-semibold text-primaryColor`}>
                  {serviceItem.title}
                </Typography>
                <Typography className={`mt-2 whitespace-pre-line text-sm text-portal-gray`}>
                  {serviceItem.content}
                </Typography>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceContent;
