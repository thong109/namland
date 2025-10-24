
import Image from 'next/image';
import { assetsImages } from '../../assets/images/package';
import './style.css';

const Header = () => {
  return (
    <header className='header-common'>
      <div className='header-common__notification'>
        <div className='header-common__notification-label'>Cơ hội đầu tư Giai đoạn 1 Hồng Hạc City (Hà Nội) từ chính CĐT</div>
        <a className='header-common__notification-button' href='#'>Đăng ký ngay</a>
      </div>
      <div className='header-common__wrapper'>
        <a className='header-common__logo' href='#'>
          <Image className='' src={assetsImages.commonLogoPrinmary} width={317} height={48} alt='Logo' />
        </a>
        <div className='header-common__navigation'>
          <div className='header-common__navigation-wrapper'>
            <div className='header-common__navigation-item'>
              <a className='header-common__item-label' href='#'>BÁN</a>
            </div>
            <div className='header-common__navigation-item'>
              <a className='header-common__item-label' href='#'>CHO THUÊ</a>
            </div>
            <div className='header-common__navigation-item'>
              <a className='header-common__item-label' href='#'>DỰ ÁN</a>
            </div>
            <div className='header-common__navigation-item'>
              <a className='header-common__item-label' href='#'>DỰ ÁN MỚI</a>
            </div>
            <div className='header-common__navigation-item'>
              <a className='header-common__item-label' href='#'>TƯ VẤN HỖ TRỢ</a>
            </div>
            <div className='header-common__navigation-item'>
              <a className='header-common__item-label' href='#'>DỊCH VỤ NHÀ Ở</a>
            </div>
            <div className='header-common__navigation-item'>
              <a className='header-common__item-label' href='#'>DỊCH VỤ VÀ SẢN PHẨM</a>
            </div>
            <div className='header-common__navigation-item'>
              <a className='header-common__item-label' href='#'>LIÊN HỆ</a>
            </div>
          </div>
        </div>
        <button className='header-common__burger' style={{ backgroundImage: `url(${assetsImages.commonIconBurger.src})` }} type='button'></button>
      </div>
    </header>
  );
};

export default Header;
