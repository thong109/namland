'use client';
import AdsBannerComponent from '@/components/AdsBannerComponent/AdsBannerComponent';
import BgGlassmorphism from '@/components/BgGlassmorphism';
import FilterHome from '@/components/HomeComponent/FilterHome';
import ListTopAgency from '@/components/HomeComponent/ListTopAgency';
import OurPartNer from '@/components/HomeComponent/OurPartner';
import PropertiesForRent from '@/components/HomeComponent/PropertiesForRent';
import PropertiesForSale from '@/components/HomeComponent/PropertiesForSale';
import SwiperExploreProperties from '@/components/HomeComponent/SwiperExploreProperties';
import useAllSettingLandingPage from '@/hooks/useAllSettingLandingPage';
import BannerModel from '@/models/masterDataModel/bannerModel';
import * as _ from 'lodash';
import { FC, useEffect, useState } from 'react';
export interface PageHomeClientProps {
  banner1?: BannerModel;
  banner2?: BannerModel;
  banner3?: BannerModel;
}
const PageHomeClient: FC<PageHomeClientProps> = ({ banner1, banner2, banner3 }) => {
  const { allSettingLandingPage } = useAllSettingLandingPage();
  const [fixedSearch, setFixedSearch] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [showAgency, setShowAgency] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleEvent);
    }
  }, []);
  const handleEvent = () => {
    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(showHideHeaderMenu);
    }
  };
  useEffect(() => {
    if (allSettingLandingPage) {
      let findLogo = _.find(allSettingLandingPage, { key: 'ZONE_LOGO_BANNER' });
      if (findLogo) {
        setShowLogo(findLogo?.value);
      }
      let findAgency = _.find(allSettingLandingPage, { key: 'ZONE_AGENCY' });
      if (findAgency) {
        setShowAgency(findAgency?.value);
      }
    }
  }, [allSettingLandingPage]);
  const showHideHeaderMenu = () => {
    //   let currentScrollPos = window.pageYOffset;
    //  if(currentScrollPos>200 ){
    //     setFixedSearch(true)
    //  }else {
    //     setFixedSearch(false)
    //  }
  };
  return (
    <>
      {/* GLASSMOPHIN */}
      <div className="relative h-auto w-auto">
        <BgGlassmorphism />

        <FilterHome
          className={`${fixedSearch ? 'sticky top-0 z-10 w-full bg-white' : 'h-[700px]'}`}
        ></FilterHome>

        <div className="container relative">
          <SwiperExploreProperties className="z-1 mt-[30px] lg:mb-[50px] lg:mt-[80px]"></SwiperExploreProperties>
        </div>
        {/* <div className="hidden md:block border-t-[1px] border-[#E6E9EC]"></div> */}
        <div className="container relative">
          <PropertiesForSale
            banner={banner1}
            className="z-1 mt-[30px] lg:mt-[50px]"
          ></PropertiesForSale>
          <PropertiesForRent
            banner={banner2}
            className="z-1 mt-[30px] lg:mt-[50px]"
          ></PropertiesForRent>
        </div>
        {banner3 && banner3?.status ? (
          <div className="z-1 container relative mt-[50px] w-full lg:mt-[50px]">
            <div
              className={` ${
                banner3 && banner3?.attachments[0] ? 'lg:h-[400px]' : ''
              } transition-transform duration-300 lg:hover:scale-105`}
            >
              <AdsBannerComponent
                banner={banner3}
                className="w-full object-cover"
              ></AdsBannerComponent>
            </div>
          </div>
        ) : null}

        {showAgency ? (
          <div className="z-1 container relative mt-[45px] lg:mt-[50px]">
            <ListTopAgency></ListTopAgency>
          </div>
        ) : null}

        {showLogo ? (
          <div className="z-1 container relative mt-[45px] lg:mt-[50px]">
            <OurPartNer></OurPartNer>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default PageHomeClient;
