import { Typography } from 'antd';
import { useTranslations } from 'next-intl';

type IProps = { data?: any[] };

const ServiceContent: React.FC<IProps> = ({ ...props }) => {
  const t = useTranslations('webLabel');

  const datas = [
    {
      title: (
        <Typography className="text-3xl font-bold uppercase text-white">
          {t('EcomEntructQuickMatchMaking')}
        </Typography>
      ),

      content: (
        <Typography className="text-lg text-white">
          {t(
            'EcomEntructBasicQuesyionnaireQuickClassificationToFilterAndSelectTheRightAgencyServiceForYou',
          )}
        </Typography>
      ),
    },
    {
      title: (
        <Typography className="text-3xl font-bold uppercase text-white">
          {t('EcomEntructDedicatedSuportInOneClick')}
        </Typography>
      ),

      content: (
        <Typography className="text-lg text-white">
          {t(
            'EcomEntructFillOutTheInformationAndADedicatedProfessionalWillMatchAnAgentWithOneClickApply',
          )}
        </Typography>
      ),
    },
    {
      title: (
        <Typography className="text-3xl font-bold uppercase text-white">
          {t('EcomConnectToTheBest')}
        </Typography>
      ),

      content: (
        <Typography className="text-lg text-white">
          {t('EcomEntructGetAnAssistanceFromAgentsToCaterToYourNeeds')}
        </Typography>
      ),
    },
  ];

  return (
    <div className="mb-2 py-16">
      <div className="mb-10">
        <Typography className="mb-1 text-3xl font-bold uppercase text-portal-primaryLiving">
          {t('EcomEntrustTitle')}
        </Typography>
        <Typography className="text-xl">{t('EcomEntrustContent')}</Typography>{' '}
      </div>
      <div className="grid grid-cols-12 gap-4">
        {datas?.map((serviceItem, index) => (
          <div
            key={`isc-${index}`}
            className="relative col-span-12 grid w-full grid-cols-12 bg-portal-primaryLiving p-4 lg:col-span-4 lg:mb-0"
          >
            <div className="absolute right-4 top-0 h-16 w-14 bg-portal-yellow">
              <div className="flex h-full items-center justify-center text-center text-3xl font-bold">
                {index + 1}{' '}
              </div>
              <span className="absolute bottom-[-8px] left-1/2 h-0 w-0 -translate-x-[10%] transform border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-portal-yellow"></span>
            </div>
            <div className="col-span-9 mt-4 text-lg font-bold">{serviceItem.title}</div>
            <div className="col-span-12 mt-2">{serviceItem.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceContent;
