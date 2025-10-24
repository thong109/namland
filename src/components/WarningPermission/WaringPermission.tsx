'use-client';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { useTranslations } from 'next-intl';

import { handBanIcon } from '@/libs/appComponents';
import useGlobalStore from '@/stores/useGlobalStore';
import { Spin } from 'antd';

const WaringPermission = () => {
  const error = useTranslations('error');
  const { userInfo } = useGlobalStore();

  return userInfo === null ? (
    <div className="flex h-full w-full items-center justify-center">
      <Spin style={{ fontSize: '26px' }} />
    </div>
  ) : (
    <div className="flex h-full w-full items-center justify-center">
      {handBanIcon}
      <p>{error('accessDenied')}</p>
    </div>
  );
};

export default WaringPermission;
