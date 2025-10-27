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
              <div className='section-ban__sidebar-block section-ban__sidebar-block--basic'>
                <div className='input-ban-search'><input type='text' placeholder='Tìm theo tên bài đăng' /></div>
                <div className='select-ban'>
                  <select>
                    <option value='' hidden selected>Loại bất động sản</option>
                    <option value='A'>A</option>
                    <option value='B'>B</option>
                  </select>
                </div>
                <div className='select-ban'>
                  <select>
                    <option value='' hidden selected>Dự án</option>
                    <option value='A'>A</option>
                    <option value='B'>B</option>
                  </select>
                </div>
              </div>
              <div className='section-ban__sidebar-block'>
                <div className='radio-ban-rounded'>
                  <div className='label-ban-primary'>P. Ngủ</div>
                  <div className='radio-ban-rounded__wrapper'>
                    <label className='radio-ban-rounded__entry'><input type='radio' id='phongngu-1' name='phongngu' value='1' />1</label>
                    <label className='radio-ban-rounded__entry'><input type='radio' id='phongngu-2' name='phongngu' value='2' />2</label>
                    <label className='radio-ban-rounded__entry'><input type='radio' id='phongngu-3' name='phongngu' value='3' />3</label>
                    <label className='radio-ban-rounded__entry'><input type='radio' id='phongngu-4' name='phongngu' value='4' />4</label>
                    <label className='radio-ban-rounded__entry'><input type='radio' id='phongngu-5' name='phongngu' value='5' />5</label>
                    <label className='radio-ban-rounded__entry'><input type='radio' id='phongngu-6' name='phongngu' value='6' />6+</label>
                  </div>
                </div>
              </div>
              <div className='section-ban__sidebar-block'>
                <div className='radio-ban-rounded'>
                  <div className='label-ban-primary'>P. Tắm</div>
                  <div className='radio-ban-rounded__wrapper'>
                    <label className='radio-ban-rounded__entry'><input type='radio' id='phongtam-1' name='phongtam' value='1' />1</label>
                    <label className='radio-ban-rounded__entry'><input type='radio' id='phongtam-2' name='phongtam' value='2' />2</label>
                    <label className='radio-ban-rounded__entry'><input type='radio' id='phongtam-3' name='phongtam' value='3' />3</label>
                    <label className='radio-ban-rounded__entry'><input type='radio' id='phongtam-4' name='phongtam' value='4' />4</label>
                    <label className='radio-ban-rounded__entry'><input type='radio' id='phongtam-5' name='phongtam' value='5' />5</label>
                    <label className='radio-ban-rounded__entry'><input type='radio' id='phongtam-6' name='phongtam' value='6' />6+</label>
                  </div>
                </div>
              </div>
              <div className='section-ban__sidebar-block'>
                <div className='range-ban-rounded'>
                  <div className='label-ban-primary'>Giá (VNĐ)</div>
                  <div className='range-ban-rounded__wrapper'>
                    <input type='range' id='gia' name='gia' min='0' max='20' value='0' step='10' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SectionContact />
    </>
  );
}
