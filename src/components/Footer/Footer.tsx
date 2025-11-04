'use client';

import Link from 'next/link';
import Image from 'next/image';
import { assetsImages } from '@/assets/images/package';
import './Footer.css';
import { useTranslations } from 'next-intl';
import { NAVIGATION } from '@/data/navigation';

const Footer = () => {
  const t = useTranslations('webLabel');
  const menu1 = [
    { href: NAVIGATION.saleListing.href, label: t('EcomHomePageMenuSale') },
    { href: NAVIGATION.rentListing.href, label: t('EcomHomePageMenuRent') },
    { href: NAVIGATION.projectList.href, label: t('EcomHomePageMenuProjects') },
    { href: "#", label: t('EcomEntrustFindAgents') },
    { href: NAVIGATION.contactUs.href, label: t('EcomEntrustContactUs') },
    { href: "#", label: t('EcomEntrustJoinUs') },
    { href: "#", label: t('EcomEntrustJoinUsList') },
    { href: "#", label: t('EcomEntrustPrivacy') },
  ];
  const menu2 = [
    { href: "#", label: t('EcomPageTsAnhCsTitlePageTitle') },
    { href: "#", label: t('EcomEntrustAgreement') },
    { href: "#", label: t('EcomLeftMenuBarPrivacyPolicy') },
    { href: "#", label: t('EcomLeftMenuBarRegulationSettlement') },
  ];
  const buttonToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  return (
    <footer className='footer-common'>
      <button className='button-common-totop' onClick={buttonToTop}></button>
      <div className='navigation-footer'>
        <div className='container'>
          <div className='navigation-footer__wrapper'>
            <div className='navigation-footer__block'>
              <span className='navigation-footer__block-label'>{t('EcomEntrustCompany')}</span>
              <ul className='list-footer-address'>
                <li className='list-footer-address__entry'>
                  <span className='list-footer-address__entry-title uppercase'><span className='list-footer-address__title-icon' style={{ maskImage: `url(${assetsImages.commonIconLocation.src})` }}></span>{t('IamOwnerPageAddress')}</span>
                  <address className='list-footer-address__entry-description'>{t('EcomContactUsPageDetailAddressLocation')}</address>
                </li>
                <li className='list-footer-address__entry'>
                  <span className='list-footer-address__entry-title uppercase'><span className='list-footer-address__title-icon' style={{ maskImage: `url(${assetsImages.commonIconLetter.src})` }}></span>{t('FooterCustomerSupport')}</span>
                  <Link className='list-footer-address__entry-description' href='mailto:info@namlongvn.com'>{t('MAIL_CONTACT')}</Link>
                </li>
                <li className='list-footer-address__entry'>
                  <span className='list-footer-address__entry-title uppercase'><span className='list-footer-address__title-icon' style={{ maskImage: `url(${assetsImages.commonIconPhone.src})` }}></span>{t('Hotline')}</span>
                  <Link className='list-footer-address__entry-description' href='tel:19002698'>{t('EcomContactUsPageDetailPagePhone')}</Link>
                </li>
              </ul>
              <div className='list-footer-sns'>
                <span className='list-footer-sns__label'>{t('EcomEntrustCompany2')}</span>
                <ul className='list-footer-sns__wrapper'>
                  <li className='list-footer-sns__entry'>
                    <Link className='list-footer-sns__entry-link' href='#' style={{ backgroundImage: `url(${assetsImages.commonIconSNS.src})` }}></Link>
                  </li>
                  <li className='list-footer-sns__entry'>
                    <Link className='list-footer-sns__entry-link' href='#' style={{ backgroundImage: `url(${assetsImages.commonIconSNS02.src})` }}></Link>
                  </li>
                  <li className='list-footer-sns__entry'>
                    <Link className='list-footer-sns__entry-link' href='#' style={{ backgroundImage: `url(${assetsImages.commonIconSNS03.src})` }}></Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className='navigation-footer__block'>
              <span className='navigation-footer__block-label uppercase'>{t('FooterMenu')}</span>
              <ul className='menu-footer'>
                {menu1?.map((item, index) => (
                  <li className='menu-footer__entry' key={index}><Link className='menu-footer__entry-link' href={item.href}>{item.label}</Link></li>
                ))}
              </ul>
            </div>
            <div className='navigation-footer__block'>
              <span className='navigation-footer__block-label uppercase'>{t('FooterRules')}</span>
              <ul className='menu-footer'>
                {menu2?.map((item, index) => (
                  <li className='menu-footer__entry' key={index}><Link className='menu-footer__entry-link' href={item.href}>{item.label}</Link></li>
                ))}

              </ul>
              <div className='navigation-footer__block-stamp'><Image src={assetsImages.commonStampVerify} width={206} height={70} alt='Stamp' /></div>
            </div>
          </div>
          <div className='navigation-footer__credits'>Copyright © 2025 Nam Long Living. All Right Reserved.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
