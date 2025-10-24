import banner from '@/assets/images/bannerEntrust.png';
import { Typography } from 'antd';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
type IProps = {};

const EntrustBannerHeader: React.FC<IProps> = ({ ...props }) => {
  const t = useTranslations('webLabel');
  return (
    <div className="relative h-fit w-full rounded-lg bg-[#f0f0f1] p-6 shadow lg:p-10">
      <div className="grid h-full grid-cols-12 gap-5">
        <div className="col-span-12 flex h-full flex-col items-center justify-center lg:col-span-6">
          <Typography className="mb-4 text-4xl font-bold uppercase text-portal-primaryLiving">
            {t(`EcomEntrustSearchAndCompareTheQualifiedRealEastateAgents`)}
          </Typography>
          <Typography className="text-lg font-semibold">
            {t(
              `EcomEntrustWhetherYouAreStartingYourSearchOrNeedAReferralYouCanCompareAgenciesBeforeMakingYourDecision`,
            )}
          </Typography>
        </div>
        <div className="col-span-12 h-full w-full lg:col-span-6">
          <div className="relative flex aspect-[47/37] w-full items-center justify-center overflow-hidden rounded-lg bg-white">
            <Image
              className="object-cover"
              src={banner.src ?? ''}
              alt={`banner`}
              loading="lazy"
              fill
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntrustBannerHeader;
