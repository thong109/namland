import Link from 'next/link';
import Image from 'next/image';
import { assetsImages } from '../../assets/images/package';
import './Footer.css';
import { useState } from 'react';

const Footer = () => {
  return (
    <footer className='footer-common'>
      <div className='navigation-footer'>
        <div className='container'>
          <div className='navigation-footer__wrapper'>
            <div className='navigation-footer__block'>
              <span className='navigation-footer__block-label'>CÔNG TY TNHH Nam Long Living</span>
              <ul className='list-footer-address'>
                <li className='list-footer-address__entry'>
                  <span className='list-footer-address__entry-title'><span className='list-footer-address__title-icon' style={{ maskImage: `url(${assetsImages.commonIconLocation.src})` }}></span>ĐỊA CHỈ</span>
                  <address className='list-footer-address__entry-description'>Số 6 Nguyễn Khắc Viện, P. Tân Mỹ, TP. Hồ Chí Minh</address>
                </li>
                <li className='list-footer-address__entry'>
                  <span className='list-footer-address__entry-title'><span className='list-footer-address__title-icon' style={{ maskImage: `url(${assetsImages.commonIconLetter.src})` }}></span>CHĂM SÓC KHÁCH HÀNG</span>
                  <Link className='list-footer-address__entry-description' href='mailto:info@namlongvn.com'>info@namlongvn.com</Link>
                </li>
                <li className='list-footer-address__entry'>
                  <span className='list-footer-address__entry-title'><span className='list-footer-address__title-icon' style={{ maskImage: `url(${assetsImages.commonIconPhone.src})` }}></span>HOTLINE</span>
                  <Link className='list-footer-address__entry-description' href='tel:19002698'>1900 2698</Link>
                </li>
              </ul>
              <div className='list-footer-sns'>
                <span className='list-footer-sns__label'>THEO DÕI Nam Long Living</span>
                <ul className='list-footer-sns__wrapper'>
                  <li className='list-footer-sns__entry'>
                    <Link className='list-footer-sns__entry-link' href='#' style={{ backgroundImage: `url(${assetsImages.commonIconSNS.src})` }}></Link>
                  </li>
                  <li className='list-footer-sns__entry'>
                    <Link className='list-footer-sns__entry-link' href='#' style={{ backgroundImage: `url(${assetsImages.commonIconSNS2.src})` }}></Link>
                  </li>
                  <li className='list-footer-sns__entry'>
                    <Link className='list-footer-sns__entry-link' href='#' style={{ backgroundImage: `url(${assetsImages.commonIconSNS3.src})` }}></Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className='navigation-footer__block'>
              <span className='navigation-footer__block-label'>DANH MỤC</span>
              <ul className='menu-footer'>
                <li className='menu-footer__entry'><Link className='menu-footer__entry-link' href='#'>Bán</Link></li>
                <li className='menu-footer__entry'><Link className='menu-footer__entry-link' href='#'>Cho thuê</Link></li>
                <li className='menu-footer__entry'><Link className='menu-footer__entry-link' href='#'>Dự án</Link></li>
                <li className='menu-footer__entry'><Link className='menu-footer__entry-link' href='#'>Tìm Môi Giới</Link></li>
                <li className='menu-footer__entry'><Link className='menu-footer__entry-link' href='#'>Liên hệ</Link></li>
                <li className='menu-footer__entry'><Link className='menu-footer__entry-link' href='#'>Tiếp nhận phản ánh của Tổ chức xã hội</Link></li>
                <li className='menu-footer__entry'><Link className='menu-footer__entry-link' href='#'>Danh sách phản ánh của Tổ chức xã hội</Link></li>
                <li className='menu-footer__entry'><Link className='menu-footer__entry-link' href='#'>Chính sách bảo mật dữ liệu cá nhân</Link></li>
              </ul>
            </div>
            <div className='navigation-footer__block'>
              <span className='navigation-footer__block-label'>QUY ĐỊNH</span>
              <ul className='menu-footer'>
                <li className='menu-footer__entry'><Link className='menu-footer__entry-link' href='#'>Quy chế hoạt động</Link></li>
                <li className='menu-footer__entry'><Link className='menu-footer__entry-link' href='#'>Điều khoản thoả thuận</Link></li>
                <li className='menu-footer__entry'><Link className='menu-footer__entry-link' href='#'>Chính sách bảo mật</Link></li>
                <li className='menu-footer__entry'><Link className='menu-footer__entry-link' href='#'>Cơ chế giải quyết tranh chấp</Link></li>
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
