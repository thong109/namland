import DataTable from '@/components/DataTable';
import { Button } from 'antd';
import { useTranslations } from 'next-intl';
import { FC } from 'react';

interface Props {
  data: any;
  columns: any[];
  exportData?: () => void;
  permissionExport?: boolean;
}

const TableDashBoardComponent: FC<Props> = ({
  data,
  columns,
  exportData,
  permissionExport = false,
}) => {
  const comm = useTranslations('Common');

  return (
    <>
      {exportData && (
        <div className="flex w-full justify-end">
          {permissionExport && (
            <Button className="!bg-portal-primaryLiving !text-white" onClick={exportData}>
              {comm('ExportExcel')}
            </Button>
          )}
        </div>
      )}
      <DataTable columns={columns} dataSource={data.items ?? []} />
    </>
  );
};

export default TableDashBoardComponent;
