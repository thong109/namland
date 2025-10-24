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
        className="bg-[#F5F5F5]"
        items={[
          { path: '/', title: 'Trang chủ' },
          { path: '', title: 'Liên hệ' },
        ]}
      />

      <div className="container desktop:pt-12 desktop:pb-[70px] xl:px-0">
        <Typography className="text-center uppercase text-2xl font-semibold text-portal-primaryLiving desktop:mb-[70px]">
          {t(`EcomContactUsPageDetailPageWe'reAlwaysEagerToHearFromYou!`)}
        </Typography>

        <div className="grid grid-cols-12 gap-8">
          {/* Info section */}
          <div className="col-span-12 grid grid-cols-1 gap-3 lg:grid-cols-3 desktop:mb-[12px]">
            {info.map((item, index) => (
              <div className="flex items-center justify-start" key={index}>
                <div>
                  <div className="flex items-center mb-[5px]">
                    <Image
                      alt=""
                      src={item.icon}
                      className="h-[25px] w-[25px] lg:h-[28px] lg:w-[28px]"
                      loading="eager"
                    />
                    <Typography className="ml-[2px] relative top-[3px] text-lg font-semibold text-primaryColor uppercase">
                      {t(item.title)}
                    </Typography>
                  </div>
                  {item.desc.map((item2, index2) => (
                    <div className="text-lg" key={index2}>
                      {t(item2.name)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="col-span-12 h-[380px] w-full lg:h-[466px]">
            <GoogleMapComponent initCenter={PMHCenter} isMarker listMarker={[PMHCenter]} />
          </div>

        </div>
      </div>
      <FormContact />
    </>
  );
}
