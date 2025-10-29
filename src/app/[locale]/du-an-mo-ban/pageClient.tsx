'use client';
import ButtonCore from '@/components/ButtonCore/ButtonCore';
import { NAVIGATION } from '@/data/navigation';
import EmptyImage from '@/images/emptyImage.png';
import { getParamsStringFromObj } from '@/libs/appconst';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { Form, Input, InputNumber, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import Link from 'next-intl/link';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import * as NProgress from 'nprogress';
import { FC, useState } from 'react';
import HomeCardItem from './_components/HomeCardItem';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import SectionContact from '@/components/SectionContact/SectionContact';

export interface IProps {
  newHomeList: any;
  total: any;
  currentPage: any;
  pageSize: any;
}
const Pagination = dynamic(() => import('antd/lib/pagination'), { ssr: false });

const NewHomePageClient: FC<IProps> = ({ newHomeList, total, currentPage, pageSize }) => {
  const t = useTranslations('webLabel');
  const comm = useTranslations('Common');
  const [formRef] = Form.useForm();
  const { push } = useRouter();
  const [isShowFilter, setIsShowFilter] = useState<boolean>(false);

  const onSubmit = async (values) => {
    const paramsString = getParamsStringFromObj(values);
    NProgress.start();
    push(NAVIGATION.newHomePage.href + '?' + paramsString);
  };
  return (
    <>
      <Breadcrumb
        additionalClass=''
        breadcrumbItems={[
          { path: '/', title: 'Trang chủ' },
          { path: '', title: 'Dự án mới' },
        ]}
        hasBanner={false}
      />
      <div className='bg-portal-gray p-[10px_0_20px] md:p-[8px_0_40px]'>
        <div className='container'>
          <Form form={formRef} size="large" layout="vertical" onFinish={onSubmit}>
            <Form.Item
              name="keyword"
              className="!mb-0 [&_.ant-input-affix-wrapper]:!rounded-[5px] [&_.ant-input-affix-wrapper]:border-gray [&_.ant-input-affix-wrapper]:!p-[3px_3px_3px_16px]"
            >
              <Input
                placeholder={t('ProjectListingSearchPlaceholder')}
                suffix={
                  <ButtonCore
                    type="submit"
                    buttonType='search'
                    className="!rounded-none !p-[1px_1.5rem] !min-h-[34px] !w-30 md:!w-40"
                    label={`${t('HomeRealEstateSearchFormSearch')}`}
                  />
                }
              />
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className="pt-12 md:pt-[46px] pb-8 md:pb-[60px]">
        <div className="container">
          <div className="mb-6">
            <div className="grid grid-cols-12 gap-4">
              {total > 0 ? (
                newHomeList.map((item, index) => (
                  <div className="col-span-12 sm:col-span-6 lg:col-span-4" key={`prj-${index}`}>
                    <HomeCardItem data={item} />
                  </div>
                ))
              ) : (
                <div className="col-span-12 flex-col justify-items-center">
                  <Image src={EmptyImage} width={500} height={500} alt="empty" className="p-4" />
                  <span className="">{t('notHaveData')}</span>
                </div>
              )}
            </div>
            {total > 0 && (
              <div className="pagination-common mt-8 md:mt-[38px]">
                <Pagination
                  current={currentPage}
                  total={total}
                  pageSize={pageSize}
                  showSizeChanger={false}
                  itemRender={(page, type, originalElement) => (
                    <Link legacyBehavior href={`${NAVIGATION.newHomePage.href}?page=${page}`}>
                      {originalElement}
                    </Link>
                  )}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <SectionContact />
    </>
  );
};

export default NewHomePageClient;
