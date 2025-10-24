import { align, renderDateTimeV2 } from '@/libs/appconst';
import { convertPhoneNumber84To0 } from '@/libs/helper';
import { Tooltip } from 'antd';
import { useTranslations } from 'next-intl';
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

const SystemColumn = () => {
  const comm = useTranslations('Common');
  const systemColumn = {
    title: comm('SYSTEM'),
    dataIndex: 'creationTime',
    key: 'creationTime',
    readonly: true,
    align: align.left,
    render: (creationTime, row) => {
      return (
        <Tooltip
          title={
            <div className="grid grid-cols-1 text-xs">
              <div className="col-span-1">
                {comm('CREATED_BY')} {row.createdBy}
                {'. '}
                {comm('AT')} {renderDateTimeV2(row.createdAt)}
              </div>
              {row.updatedBy && (
                <div className="col-span-1">
                  {comm('UPDATED_BY')} {row.updatedBy}
                  {'. '} {comm('AT')}
                  {renderDateTimeV2(row.updatedAt)}
                </div>
              )}
            </div>
          }
        >
          <div className="grid grid-cols-1 text-xs">
            {row.updatedBy ? (
              <div className="col-span-1">
                {comm('UPDATED_BY')} {row.updatedBy}
                {'. '} {comm('AT')}
                {renderDateTimeV2(row.updatedAt)}
              </div>
            ) : (
              <div className="col-span-1">
                {comm('CREATED_BY')} {row.createdBy}
                {'. '}
                {comm('AT')} {renderDateTimeV2(row.createdAt)}
              </div>
            )}
          </div>
        </Tooltip>
      );
    },
  };
  return systemColumn;
};

export const columnCreate = () => {
  const comm = useTranslations('Common');
  const columnCreate = {
    title: comm('SYSTEM_CREATE'),
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 150,
    readonly: true,
    render: (createdAt, row) => {
      return (
        <div className="text-xs">
          {row.userInfo?.fullName ?? row?.createdBy}
          <br />
          {row.userInfo?.id && (
            <>
              {convertPhoneNumber84To0(row.userInfo?.phone ?? row.userInfo?.id)}
              <br />
            </>
          )}
          {createdAt ? renderDateTimeV2(createdAt) : null}
        </div>
      );
    },
  };

  return columnCreate;
};

export const columnCreateDate = () => {
  const comm = useTranslations('Common');
  const columnCreate = {
    title: comm('SYSTEM_CREATE_DATE'),
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 150,
    readonly: true,
    render: (createdAt, row) => {
      return <div className="text-xs">{createdAt ? renderDateTimeV2(createdAt) : null}</div>;
    },
  };

  return columnCreate;
};
export default SystemColumn;
