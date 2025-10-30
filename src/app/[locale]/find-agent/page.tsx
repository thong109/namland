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
    // <div className="container pb-5 pt-5">
    //   <div>
    //     <EntrustBannerHeader />
    //     
    //     <ContactUs data={contactUsContent} />
    //     <div className="relative mt-6 h-40 w-full lg:h-96">
    //       <Image
    //         className="h-full w-full object-cover"
    //         src={Bg.src}
    //         alt={`banner`}
    //         loading="lazy"
    //         fill
    //       />
    //     </div>
    //     <EntrustAgent />
    //   </div>
    // </div>
    <>
      <section>
        <Breadcrumb
          additionalClass='breadcrumb-common--style-transparent'
          breadcrumbItems={[
            { path: '/', title: 'Trang chủ' },
            { path: '/nhu-cau-cua-toi', title: 'Tìm môi giới' },
            { path: '', title: 'Bán/ Cho thuê nhà của tôi' },
          ]}
          hasBanner={true}
        />
        <div className='container pb-12 md:pb-[82px]'>
          <div className="contact__banner" style={{ backgroundImage: `url(${assetsImages.commonImageContact.src})` }}>
            <div className="grid grid-col">
              <h2>Tìm và so sánh các đơn vị môi giới uy tín</h2>
              <p>Bạn luôn có thể so sánh các đơn vị môi giới để được tư vấn trước khi đưa ra quyết định</p>
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
