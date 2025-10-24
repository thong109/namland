import { listStatusComment, renderDateTime } from '@/libs/appconst';
import { useTranslations } from 'next-intl';
export interface InputProps {
  item: any;
}

const CommentPortalAction = ({ item }) => {
  const comm = useTranslations('Common');
  const t = useTranslations('webLabel');
  const renderCommentStatus = (item) => {
    let initStatus = listStatusComment.find((x) => x.id === item?.status);

    return (
      <>
        <span
          className={`mr-1 w-fit p-1 text-xs bg-[${initStatus.color}] text-[${initStatus.textColor}] rounded-lg text-xs leading-8`}
        >
          {comm(initStatus.name)}
        </span>

        <span className="w-fit rounded-lg bg-portal-gray-1 p-1 text-xs leading-8">
          {item?.isShow ? t('show') : t('unShow')}
        </span>
      </>
    );
  };

  return (
    <div className="mt-1 grid h-fit grid-cols-12 items-center">
      <div className="col-span-12">
        <label className="text-sm font-medium">{item.name}</label>
      </div>
      <div className="col-span-4 text-xs font-light">
        {item.createdAt ? renderDateTime(item.createdAt) : '--'}
      </div>
      <div className="col-span-8 w-full">
        {comm('statusComment')}: {renderCommentStatus(item)}
      </div>
      <div className="col-span-12 py-3">
        <label className="line-clamp-6 text-xs font-light">{item.message}</label>
      </div>
    </div>
  );
};

export default CommentPortalAction;
