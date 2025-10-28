import Link from 'next/link';
import Image from 'next/image';
import { assetsImages } from '../../assets/images/package';
import './Header.css';
import { useState } from 'react';
import { NAVIGATION } from '@/data/navigation';
import ncNanoId from '@/utils/ncNanoId';
import * as _ from 'lodash';
import { useTranslations } from 'next-intl';
import SelectLanguage from "./SelectLanguage"
import useGlobalStore from '@/stores/useGlobalStore';
import AvatarDropdown from './AvatarDropdown';
import { ModalLoginOpen } from './ultil/ModalLoginOpen';
import LoginModal from '../LoginModal/LoginModal';
import NotifyDropdown from './NotifyDropdown';
import { useRouter } from 'next-intl/client';

const Header = ({ className, navType }: { className: string; navType: string }) => {
  const [stateNavigation, toggleNavigation] = useState(false);
  const t = useTranslations('webLabel');
  const { userInfo } = useGlobalStore();
  const [isModalOpen, setIsModalOpen] = ModalLoginOpen();
  const { push } = useRouter();
  const navigationHeaderData = [
    {
      id: ncNanoId(),
      href: `${NAVIGATION.saleListing.href}?p=518C73F1-2621-40B8-8373-50458BBEF950&d=88B34FC2-F199-4772-B1E7-96E232A84F9C`, //Default HCM, Quận 7
      name: 'EcomHomePageMenuSale',
      type: 'dropdown',
      subMenu: null,
    },
    {
      id: ncNanoId(),
      href: `${NAVIGATION.rentListing.href}?p=518C73F1-2621-40B8-8373-50458BBEF950&d=88B34FC2-F199-4772-B1E7-96E232A84F9C`, //Default HCM, Quận 7
      name: 'EcomHomePageMenuRent',
      type: 'dropdown',
      subMenu: null,
    },
    {
      id: ncNanoId(),
      href: NAVIGATION.projectList.href,
      name: 'EcomHomePageMenuProjects',
      type: 'dropdown',
      subMenu: null,
    },
    {
      id: ncNanoId(),
      href: NAVIGATION.newHomePage.href,
      name: 'EcomHomePageMenuNewHome',
      type: 'dropdown',
      subMenu: null,
    },
    {
      id: ncNanoId(),
      href: NAVIGATION.entrust.href,
      name: 'EcomHomePageMenuEntrust',
      type: 'dropdown',
      subMenu: (
        <ul className='menu-header__wrapper'>
          <li className='menu-header__entry'>
            <span className='menu-header__entry-label cursor-pointer' onClick={() => push(NAVIGATION.findHouse.href)}>{t('FIND_A_HOUSE')}</span>
          </li>
          <li className='menu-header__entry'>
            <span className='menu-header__entry-label cursor-pointer' onClick={() => push(NAVIGATION.findAgent.href)}>{t('SELL_RENT_MY_HOUSE')}</span>
          </li>
        </ul>
      ),
    },
    {
      id: ncNanoId(),
      href: NAVIGATION.housingServices.href,
      name: 'EcomHomePageMenuService',
      type: 'dropdown',
      subMenu: null,
    },
    {
      id: ncNanoId(),
      href: NAVIGATION.serviceAndProduct.href,
      name: 'EcomHomePageMenuProducts',
      type: 'dropdown',
      subMenu: null,
    },
    {
      id: ncNanoId(),
      href: NAVIGATION.contactUs.href,
      name: 'EcomHomePageMenuContactUs',
      type: 'dropdown',
      subMenu: null,
    },
  ];
  const handleOpenModal = () => {
    if (!userInfo) {
      setIsModalOpen(true);
    }
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <header className='header-common'>
      <div className='notification-header'>
        <div className='notification-header__label'>Cơ hội đầu tư Giai đoạn 1 Hồng Hạc City (Hà Nội) từ chính CĐT</div>
        <Link className='notification-header__link' href='#'>Đăng ký ngay</Link>
        <button className='notification-header__toggle' style={{ backgroundImage: `url(${assetsImages.commonIconClose.src})` }} type='button'></button>
      </div>
      <div className='header-common__wrapper'>
        <span className='logo-header cursor-pointer' onClick={() => push(NAVIGATION.home.href)}>
          <Image className='' src={assetsImages.commonLogoPrinmary} width={317} height={48} alt='Logo' />
        </span>
        <div className='navigation-header-outside'>
          <ul className='navigation-header-outside__wrapper'>
            {navigationHeaderData.map((item) => (
              <li key={item.id} className='navigation-header-outside__item'>
                <span className='navigation-header-outside__item-label' onClick={() => push(item.href)}>{t(item.name)}</span>
                {item.subMenu && <div className='menu-header'>{item.subMenu}</div>}
              </li>
            ))}
          </ul>
        </div>
        <button onClick={() => toggleNavigation(true)} className='button-header-burger' style={{ backgroundImage: `url(${assetsImages.commonIconBurger.src})` }} type='button'></button>
        <SelectLanguage isHiddenIcon={false} />
        {userInfo ? (
          <AvatarDropdown className="mx-[10px]" />
        ) : (
          <div className="button-header-user"><button onClick={handleOpenModal} className="button-header-user__wrapper"><div className='button-header-user__link' style={{ backgroundImage: `url(${assetsImages.commonIconUser.src})` }}></div></button></div>
        )}
        {userInfo && <NotifyDropdown />}
      </div>
      <div className={`lightbox-header ${stateNavigation ? 'is-state-active' : 'is-state-hidden'}`}>
        <button className='lightbox-header__toggle' onClick={() => toggleNavigation(false)} style={{ backgroundImage: `url(${assetsImages.commonIconClose.src})` }} type='button'></button>
        <div className='lightbox-header__viewport'>
          <div className='lightbox-header__wrapper'>
            <span className='lightbox-header__logo' onClick={() => { toggleNavigation(false); push(NAVIGATION.home.href) }}>
              <Image src={assetsImages.commonLogoPrinmaryWhite} width={565} height={86} alt='Logo' />
            </span>
            <div className='navigation-header-inside'>
              <ul className='navigation-header-inside__wrapper'>
                {navigationHeaderData.map((item) => (
                  <li className='navigation-header-inside__item' key={item.id}>
                    <span className='navigation-header-inside__item-label' onClick={() => { toggleNavigation(false); push(item.href) }}>{t(item.name)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {!userInfo && (
        <LoginModal
          isVisible={isModalOpen}
          closeModal={handleCloseModal}
          handleOk={handleCloseModal}
        />
      )}
    </header>
  );
};

export default Header;
