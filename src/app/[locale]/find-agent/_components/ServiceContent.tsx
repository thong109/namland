import { assetsImages } from '@/assets/images/package';
import { Typography } from 'antd';
import { useTranslations } from 'next-intl';

type IProps = { data?: any[] };

const ServiceContent: React.FC<IProps> = ({ ...props }) => {
  const t = useTranslations('webLabel');

  const datas = [
    {
      icon: (
        <div className="w-[89px] h-[89px] rounded-full bg-[#F9ECEC] flex items-center justify-center flex-[0_0_auto]">
          <div className="block w-[61px] h-[61px]" style={{ backgroundImage: `url(${assetsImages.contactIcon01.src})` }}></div>
        </div>
      ),
      title: (
        <Typography className="font-mona text-xl md:text-2xl font-semibold text-portal-primaryLiving leading-[calc(30/24)]">
          {t('EcomEntructQuickMatchMaking')}
        </Typography>
      ),

      content: (
        <Typography className="font-mona text-lg text-portal-gray-7">
          {t(
            'EcomEntructBasicQuesyionnaireQuickClassificationToFilterAndSelectTheRightAgencyServiceForYou',
          )}
        </Typography>
      ),
    },
    {
      icon: (
        <div className="w-[89px] h-[89px] rounded-full bg-[#F9ECEC] flex items-center justify-center flex-[0_0_auto]">
          <div className="block w-[61px] h-[61px]" style={{ backgroundImage: `url(${assetsImages.contactIcon02.src})` }}></div>
        </div>
      ),
      title: (
        <Typography className="font-mona text-xl md:text-2xl font-semibold text-portal-primaryLiving leading-[calc(30/24)] pr-1">
          {t('EcomEntructDedicatedSuportInOneClick')}
        </Typography>
      ),

      content: (
        <Typography className="font-mona text-lg text-portal-gray-7">
          {t(
            'EcomEntructFillOutTheInformationAndADedicatedProfessionalWillMatchAnAgentWithOneClickApply',
          )}
        </Typography>
      ),
    },
    {
      icon: (
        <div className="w-[89px] h-[89px] rounded-full bg-[#F9ECEC] flex items-center justify-center flex-[0_0_auto]">
          <div className="block w-[61px] h-[61px]" style={{ backgroundImage: `url(${assetsImages.contactIcon03.src})` }}></div>
        </div>
      ),
      title: (
        <Typography className="font-mona text-xl md:text-2xl font-semibold text-portal-primaryLiving leading-[calc(30/24)]">
          {t('EcomConnectToTheBest')}
        </Typography>
      ),

      content: (
        <Typography className="font-mona text-lg text-portal-gray-7">
          {t('EcomEntructGetAnAssistanceFromAgentsToCaterToYourNeeds')}
        </Typography>
      ),
    },
  ];

  return (
    <div className="mb-4 md:mb-8 lg:mb-[58px] pt-1">
      <div className="grid grid-cols-12 gap-2 md:gap-4 lg:gap-[30px]">
        {datas?.map((serviceItem, index) => (
          <div
            key={`isc-${index}`}
            className="relative col-span-12 grid w-full grid-cols-12 bg-white border border-portal-gray-border p-[26px] lg:pb-[49px] lg:col-span-4 lg:mb-0 rounded-[10px]"
          >
            <div className="col-span-12 flex items-center">
              <div className="col-span-3 mr-[19px]">{serviceItem.icon}</div>
              <div className="col-span-9 text-lg font-bold">{serviceItem.title}</div>
            </div>
            <div className="col-span-12 mt-[18px]">{serviceItem.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceContent;
