'use client';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import GoogleMapComponent from '@/components/GoogleMap';
import Image from 'next/image';
import LocaltionConstant from '@/libs/constants/locationConstant';
import { Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { assetsIcon } from '../../../assets/icon/package';
import FormContact from '@/components/FormContact/FormContact';

export default function ContactUs() {
  const t = useTranslations('webLabel');
  const PMHCenter = LocaltionConstant.PMHCoordinate;

  const info = [
    {
      title: 'EcomContactUsPageDetailPageAddress',
      desc: [{ name: 'EcomContactUsPageDetailAddressLocation', type: 'translate' }],
      icon: assetsIcon.IconLocation,
    },
    {
      title: 'FooterCustomerSupport',
      desc: [{ name: 'MAIL_CONTACT', type: 'email' }],
      icon: assetsIcon.IconLetter,
    },
    {
      title: 'Hotline',
      desc: [{ name: 'EcomContactUsPageDetailPagePhone', type: 'translate' }],
      icon: assetsIcon.IconPhone,
    },
  ];

  return (
    <>
      <Breadcrumb
        addtionalClass="bg-[#F5F5F5]"
        breadcrumbItems={[
          { path: '/', title: 'Trang chủ' },
          { path: '', title: 'Liên hệ' },
        ]}
        hasBanner={false}
      />

      <div className="container pt-12 pb-[70px]">
        <Typography className="text-center uppercase text-lg md:text-2xl font-semibold text-portal-primaryLiving mb-6 md:mb-[70px]">
          {t(`EcomContactUsPageDetailPageWe'reAlwaysEagerToHearFromYou!`)}
        </Typography>

        {/* Info section */}
        <div className="col-span-1 grid grid-cols-1 gap-5 lg:gap-3 lg:grid-cols-3 mb-6 md:mb-12">
          {info.map((item, index) => (
            <div className="flex items-center justify-start md:pr-3" key={index}>
              <div>
                <div className="flex items-center mb-[5px]">
                  <Image
                    alt=""
                    src={item.icon}
                    className="h-[25px] w-[25px] lg:h-[28px] lg:w-[28px]"
                    loading="eager"
                  />
                  <Typography className="ml-[2px] text-base md:text-lg font-semibold text-primaryColor uppercase">
                    {t(item.title)}
                  </Typography>
                </div>
                {item.desc.map((item2, index2) => (
                  <div className="text-sm md:text-lg" key={index2}>
                    {t(item2.name)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="col-span-1 h-[380px] w-full lg:h-[464px]">
          <GoogleMapComponent initCenter={PMHCenter} isMarker listMarker={[PMHCenter]} />
        </div>

      </div>
      <FormContact />
    </>
  );
}
