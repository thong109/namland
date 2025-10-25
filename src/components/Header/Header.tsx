
import Image from 'next/image';
import { assetsImages } from '../../assets/images/package';
import './style.css';
import { useState } from 'react';

const Header = () => {
  const [stateNavigation, toggleNavigation] = useState(false);

  return (
    <header className='header-common'>
      <div className='notification-header'>
        <div className='notification-header__label'>Cơ hội đầu tư Giai đoạn 1 Hồng Hạc City (Hà Nội) từ chính CĐT</div>
        <a className='notification-header__link' href='#'>Đăng ký ngay</a>
        <button className='notification-header__toggle' style={{ backgroundImage: `url(${assetsImages.commonIconClose.src})` }} type='button'></button>
      </div>
      <div className='header-common__wrapper'>
        <a className='logo-header' href='#'>
          <Image className='' src={assetsImages.commonLogoPrinmary} width={317} height={48} alt='Logo' />
        </a>
        <div className='navigation-header-outside'>
          <ul className='navigation-header-outside__wrapper'>
            <li className='navigation-header-outside__item'>
              <a className='navigation-header-outside__item-label' href='#'>BÁN</a>
            </li>
            <li className='navigation-header-outside__item'>
              <a className='navigation-header-outside__item-label' href='#'>CHO THUÊ</a>
            </li>
            <li className='navigation-header-outside__item'>
              <a className='navigation-header-outside__item-label' href='#'>DỰ ÁN</a>
            </li>
            <li className='navigation-header-outside__item'>
              <a className='navigation-header-outside__item-label' href='#'>DỰ ÁN MỚI</a>
            </li>
            <li className='navigation-header-outside__item'>
              <a className='navigation-header-outside__item-label' href='#'>TƯ VẤN HỖ TRỢ</a>
              <div className='menu-header'>
                <ul className='menu-header__wrapper'>
                  <li className='menu-header__entry'>
                    <a className='menu-header__entry-label' href='#'>Tìm nhà</a>
                  </li>
                  <li className='menu-header__entry'>
                    <a className='menu-header__entry-label' href='#'>Bán/ Cho thuê nhà của tôi</a>
                  </li>
                </ul>
              </div>
            </li>
            <li className='navigation-header-outside__item'>
              <a className='navigation-header-outside__item-label' href='#'>DỊCH VỤ NHÀ Ở</a>
            </li>
            <li className='navigation-header-outside__item'>
              <a className='navigation-header-outside__item-label' href='#'>DỊCH VỤ VÀ SẢN PHẨM</a>
            </li>
            <li className='navigation-header-outside__item'>
              <a className='navigation-header-outside__item-label' href='#'>LIÊN HỆ</a>
            </li>
          </ul>
        </div>
        <button onClick={() => toggleNavigation(true)} className='button-header-burger' style={{ backgroundImage: `url(${assetsImages.commonIconBurger.src})` }} type='button'></button>
        <select className='select-header-language' style={{ backgroundImage: `url(${assetsImages.commonIconLanguage.src}), url(${assetsImages.commonIconArrow.src})` }}>
          <option value='VN' selected>VN</option>
          <option value='VN'>EN</option>
        </select>
        <button className='button-header-user' style={{ backgroundImage: `url(${assetsImages.commonIconUser.src})` }} type='button'></button>
      </div>
      <div className={`lightbox-header ${stateNavigation ? 'is-state-active' : 'is-state-hidden'}`}>
        <button className='lightbox-header__toggle' onClick={() => toggleNavigation(false)} style={{ backgroundImage: `url(${assetsImages.commonIconClose.src})` }} type='button'></button>
        <div className='lightbox-header__viewport'>
          <div className='lightbox-header__wrapper'>
            <a className='lightbox-header__logo' href='#'>
              <Image className='' src={assetsImages.commonLogoPrinmaryWhite} width={565} height={86} alt='Logo' />
            </a>
            <div className='navigation-header-inside'>
              <ul className='navigation-header-inside__wrapper'>
                <li className='navigation-header-inside__item'>
                  <a className='navigation-header-inside__item-label' href='#'>BÁN</a>
                </li>
                <li className='navigation-header-inside__item'>
                  <a className='navigation-header-inside__item-label' href='#'>CHO THUÊ</a>
                </li>
                <li className='navigation-header-inside__item'>
                  <a className='navigation-header-inside__item-label' href='#'>DỰ ÁN</a>
                </li>
                <li className='navigation-header-inside__item'>
                  <a className='navigation-header-inside__item-label' href='#'>DỰ ÁN MỚI</a>
                </li>
                <li className='navigation-header-inside__item'>
                  <a className='navigation-header-inside__item-label' href='#'>TƯ VẤN HỖ TRỢ</a>
                </li>
                <li className='navigation-header-inside__item'>
                  <a className='navigation-header-inside__item-label' href='#'>DỊCH VỤ NHÀ Ở</a>
                </li>
                <li className='navigation-header-inside__item'>
                  <a className='navigation-header-inside__item-label' href='#'>DỊCH VỤ VÀ SẢN PHẨM</a>
                </li>
                <li className='navigation-header-inside__item'>
                  <a className='navigation-header-inside__item-label' href='#'>LIÊN HỆ</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
