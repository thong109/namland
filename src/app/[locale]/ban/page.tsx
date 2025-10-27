'use client';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import Image from 'next/image';
import SectionContact from '@/components/SectionContact/SectionContact';

export default function PageBan() {
  return (
    <>
      <Breadcrumb
        breadcrumbItems={[
          { path: '/', title: 'Trang chủ' },
          { path: '', title: 'Bán' },
        ]}
        hasBanner={false}
      />
      <div className='section-ban'>
        <div className='container'>
          <h1 className='section-ban__title'>Gửi bán Bất động sản Nam Long<br /><strong>Nhanh chóng, Bảo mật & Uy tín</strong></h1>
          <div className='section-ban__sidebar'>
            <div className='section-ban__sidebar-wrapper'>
              <div className='input-ban-search'><input type='text' placeholder='Tìm theo tên bài đăng' /></div>
              <div className='select-ban'>
                <select>
                  <option value='' hidden selected>Loại bất động sản</option>
                  <option value='A'>A</option>
                  <option value='B'>B</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SectionContact />
    </>
  );
}
