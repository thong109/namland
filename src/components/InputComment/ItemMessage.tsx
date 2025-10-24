import { fileCommentIcon } from '@/libs/appComponents';
import { renderDateTime } from '@/libs/appconst';
import Link from 'next/link';

const ItemMessage = ({ data, userId }) => {
  return data.user?.id === userId ? (
    <div className="mb-4 ml-2 grid grid-cols-12">
      <div className="col-span-11 rounded-lg bg-white p-3 text-xs">
        <div className="flex w-full justify-between">
          <span>{renderDateTime(data?.createdAt)}</span>
          <span className="font-bold">{data?.user?.fullName}</span>
        </div>
        {data.files?.length > 0 &&
          data.files.map((item) => {
            return (
              <Link
                id={item?.id}
                target="_blank"
                className="mt-1 flex w-full justify-end"
                href={`${item?.url}`}
              >
                <span className="mr-2 h-3 w-3"> {fileCommentIcon}</span>
                <span className="text-portal-gray-5">{item?.name}</span>
              </Link>
            );
          })}
        <div className="mt-1 w-full">{data?.content}</div>
      </div>
      <div className="col-span-1 flex justify-center">
        <img className="h-[32px] w-[32px] rounded-full" src={data.user?.avatarUrl ?? ''} />
      </div>
    </div>
  ) : (
    <div className="mb-4 mr-2 grid grid-cols-12">
      <div className="col-span-1 flex justify-center">
        <img className="h-[32px] w-[32px] rounded-full" src={data.user?.avatarUrl ?? ''} />
      </div>
      <div className="col-span-11 rounded-lg bg-white p-3 text-xs">
        <div className="flex w-full justify-between">
          <span className="font-bold text-portal-gray-5">{data?.user?.fullName}</span>
          <span>{renderDateTime(data?.createdAt)}</span>
        </div>
        {data.files?.length > 0 &&
          data.files.map((item) => {
            return (
              <Link
                id={item?.id}
                target="_blank"
                className="mt-1 flex w-full justify-end"
                href={`${item?.url}`}
              >
                <span className="mr-2 h-3 w-3"> {fileCommentIcon}</span>
                <span className="text-portal-gray-5">{item?.name}</span>
              </Link>
            );
          })}
        <div className="mt-1 w-full">{data?.content}</div>
      </div>
    </div>
  );
};

export default ItemMessage;
