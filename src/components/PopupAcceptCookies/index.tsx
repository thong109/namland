'use client';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

const AcceptCookies = () => {
  const t = useTranslations('Common');
  const [isShow, setIsShow] = useState<boolean>(false);
  function checkCookies() {
    return document.cookie.indexOf('cookie_notice_accepted=true') !== -1;
  }

  function showPopup() {
    setIsShow(true);
  }

  function setCookie() {
    const expirationDate = dayjs().add(30, 'day').toDate();

    // Chuyển đổi thời gian hết hạn thành chuỗi UTC
    const expires = 'expires=' + expirationDate.toUTCString();
    document.cookie = 'cookie_notice_accepted=true; ' + expires + '; path=/';
  }

  useEffect(() => {
    if (!checkCookies()) {
      showPopup();
    }
  }, []);

  // Main logic

  // Khi người dùng chấp nhận cookies
  function acceptCookies() {
    setCookie();
    setIsShow(false);
  }

  return (
    <div
      className={`fixed bottom-0 z-[100] grid w-[100%] grid-cols-12 gap-x-2 rounded-lg bg-portal-gray-4 px-3 pb-3 pt-2 opacity-95 shadow-sm lg:mb-4 lg:ml-[1vw] lg:h-[200px] lg:w-[350px] lg:bg-yellow-50 lg:px-6 lg:pb-0 lg:opacity-100 ${
        isShow ? 'block' : 'hidden'
      }`}
    >
      {/* <div className="hidden h-[33px] w-[35px] lg:col-span-12 lg:-mb-8 lg:flex lg:h-[66px] lg:w-[70px]">
        {cookiesIcon}
      </div> */}
      <div className="col-span-12 mb-2 lg:-mb-6">
        <p className="hidden text-xs font-semibold text-gray-500 lg:block lg:text-sm">
          {t('cookieTitle')}
        </p>

        <p className="hidden text-[10px] leading-[14px] text-gray-500 lg:block lg:text-xs">
          {t('cookiesContent')}
          <a
            className="text-[10px] font-semibold leading-[14px] underline lg:text-xs"
            href="https://domdom.com.vn/chinh-sach-cookie"
            target="_blank"
          >
            {t('policyCookie')}
          </a>
        </p>
        <p className="flex justify-center p-1 text-xs text-white lg:hidden">
          {t('cookiesContentMobile')}
        </p>
        <a
          className="ml-1 flex justify-center text-[10px] leading-[14px] text-white underline lg:hidden"
          href="https://domdom.com.vn/chinh-sach-cookie"
          target="_blank"
        >
          {t('policyCookie')}
        </a>
      </div>
      <div className="col-span-6 lg:col-span-12 lg:-mb-8">
        <button
          className="w-full rounded-lg bg-[#25793A] p-2 text-[10px] leading-[14px] text-white lg:bg-[#25793AB2] lg:text-xs"
          type="button"
          onClick={() => acceptCookies()}
        >
          {t('allAcceptCookies')}
        </button>
      </div>
      <div className="col-span-6 lg:col-span-12 lg:-mb-8">
        <button
          className="w-full rounded-lg bg-[#25793A] p-2 text-[10px] leading-[14px] text-white lg:mb-2 lg:bg-[#25793AB2] lg:text-xs"
          type="button"
          onClick={() => acceptCookies()}
        >
          {t('necessaryCookiesOnly')}
        </button>
      </div>
    </div>
  );
};

export default AcceptCookies;
