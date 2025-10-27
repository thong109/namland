import Link from 'next/link';
import Image from 'next/image';
import { assetsImages } from '../../assets/images/package';
import './Header.css';
import { useState } from 'react';
import { NAVIGATION } from '@/data/navigation';
import ncNanoId from '@/utils/ncNanoId';
import * as _ from 'lodash';
import { useTranslations } from 'next-intl';
import LangDropdownSingle from "./LangDropdownSingle"
import useGlobalStore from '@/stores/useGlobalStore';
import AvatarDropdown from './AvatarDropdown';
import { ModalLoginOpen } from './ultil/ModalLoginOpen';
import LoginModal from '../LoginModal/LoginModal';
import NotifyDropdown from './NotifyDropdown';

const Header = ({ className, navType }: { className: string; navType: string }) => {
  const [stateNavigation, toggleNavigation] = useState(false);
  const t = useTranslations('webLabel');
  const { userInfo } = useGlobalStore();
  const [isModalOpen, setIsModalOpen] = ModalLoginOpen();

  const dataMenu = [
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
            <Link className='menu-header__entry-label' href={NAVIGATION.findHouse.href}>{t('FIND_A_HOUSE')}</Link>
          </li>
          <li className='menu-header__entry'>
            <Link className='menu-header__entry-label' href={NAVIGATION.findAgent.href}>{t('SELL_RENT_MY_HOUSE')}</Link>
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
        <Link className='logo-header' href={NAVIGATION.home.href}>
          <Image className='' src={assetsImages.commonLogoPrinmary} width={317} height={48} alt='Logo' />
        </Link>
        <div className='navigation-header-outside'>
          <ul className='navigation-header-outside__wrapper'>
            {dataMenu.map((item) => (
              <li key={item.id} className='navigation-header-outside__item'>
                <Link className='navigation-header-outside__item-label uppercase' href={item.href}>{t(item.name)}</Link>
                {item.subMenu && <div className='menu-header'>{item.subMenu}</div>}
              </li>
            ))}
          </ul>
        </div>
        <button onClick={() => toggleNavigation(true)} className='button-header-burger' style={{ backgroundImage: `url(${assetsImages.commonIconBurger.src})` }} type='button'></button>
        <LangDropdownSingle isHiddenIcon={false} />

        {userInfo ? (
          <AvatarDropdown className="mx-[10px]" />
        ) : (
          <div className="!mx-[10px] flex h-10 w-10 items-center justify-center self-center sm:h-12 sm:w-12">
            <button
              onClick={handleOpenModal}
              className="button-header-user-wrapper"
            >
              <div className='button-header-user' style={{ backgroundImage: `url(${assetsImages.commonIconUser.src})` }}></div>
            </button>
          </div>
        )}
        {userInfo && <NotifyDropdown />}

      </div>
      <div className={`lightbox-header ${stateNavigation ? 'is-state-active' : 'is-state-hidden'}`}>
        <button className='lightbox-header__toggle' onClick={() => toggleNavigation(false)} style={{ backgroundImage: `url(${assetsImages.commonIconClose.src})` }} type='button'></button>
        <div className='lightbox-header__viewport'>
          <div className='lightbox-header__wrapper'>
            <Link className='lightbox-header__logo' href='#'>
              <Image src={assetsImages.commonLogoPrinmaryWhite} width={565} height={86} alt='Logo' />
            </Link>
            <div className='navigation-header-inside'>
              <ul className='navigation-header-inside__wrapper'>
                <li className='navigation-header-inside__item'>
                  <Link className='navigation-header-inside__item-label' href='#'>BÁN</Link>
                </li>
                <li className='navigation-header-inside__item'>
                  <Link className='navigation-header-inside__item-label' href='#'>CHO THUÊ</Link>
                </li>
                <li className='navigation-header-inside__item'>
                  <Link className='navigation-header-inside__item-label' href='#'>DỰ ÁN</Link>
                </li>
                <li className='navigation-header-inside__item'>
                  <Link className='navigation-header-inside__item-label' href='#'>DỰ ÁN MỚI</Link>
                </li>
                <li className='navigation-header-inside__item'>
                  <Link className='navigation-header-inside__item-label' href='#'>TƯ VẤN HỖ TRỢ</Link>
                </li>
                <li className='navigation-header-inside__item'>
                  <Link className='navigation-header-inside__item-label' href='#'>DỊCH VỤ NHÀ Ở</Link>
                </li>
                <li className='navigation-header-inside__item'>
                  <Link className='navigation-header-inside__item-label' href='#'>DỊCH VỤ VÀ SẢN PHẨM</Link>
                </li>
                <li className='navigation-header-inside__item'>
                  <Link className='navigation-header-inside__item-label' href='#'>LIÊN HỆ</Link>
                </li>
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
