'use server';
import { getEcomOwnerGetDetail } from '@/ecom-sadec-api-client';
import { getTranslator } from 'next-intl/server';
import { FC } from 'react';
import ContactUs from './_components/ContactUs';
import ServiceContent from './_components/ServiceContent';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { assetsImages } from '@/assets/images/package';
import SectionContact from '@/components/SectionContact/SectionContact';
import "./findAgent.css";
export interface IProps {
  params: any;
}

const PageEntrust: FC<IProps> = async ({ params: { locale } }) => {
  const t = await getTranslator(locale, 'webLabel');

  const response = await getEcomOwnerGetDetail();

  const contactUsContent = (response as any).data?.ownerContentDetails.find(
    (item) => item.type === 'Contact Us',
  );
  const serviceContents = (response as any).data?.ownerContentDetails.filter(
    (item) => item.type !== 'Contact Us',
  );

  return (
    <>
      <section>
        <Breadcrumb
          additionalClass='breadcrumb-common--style-transparent'
          breadcrumbItems={[
            { path: '/', title: t('EcomMenuBarHome') },
            { path: '/nhu-cau-cua-toi', title: t('EcomEntrustFindAgents') },
            { path: '', title: t('EcomEntrustSellMyHouse') },
          ]}
          hasBanner={true}
        />
        <div className='container pb-12 md:pb-[82px]'>
          <div className="contact__banner" style={{ backgroundImage: `url(${assetsImages.commonImageContact.src})` }}>
            <div className="grid grid-col">
              <h2>{t('EcomEntrustSearchAndCompareTheQualifiedRealEastateAgents')}</h2>
              <p>{t('EcomEntrustWhetherYouAreStartingYourSearchOrNeedAReferralYouCanCompareAgenciesBeforeMakingYourDecision')}</p>
            </div>
          </div>
          <ServiceContent data={serviceContents} />
          <ContactUs data={contactUsContent} />
        </div>
        <SectionContact />
      </section>
    </>
  );
};

export default PageEntrust;
