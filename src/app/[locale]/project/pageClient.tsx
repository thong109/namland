'use client';
import ButtonCore from '@/components/ButtonCore/ButtonCore';
import { NAVIGATION } from '@/data/navigation';
import { getParamsStringFromObj } from '@/libs/appconst';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { Form, Input, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import Link from 'next-intl/link';
import dynamic from 'next/dynamic';
import * as NProgress from 'nprogress';
import { FC } from 'react';
import ProjectCardItem from './_components/projectCardItem';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';

export interface IProps {
  projectList: any;
  total: any;
  currentPage: any;
  pageSize: any;
}
const Pagination = dynamic(() => import('antd/lib/pagination'), { ssr: false });

const PageProjectClient: FC<IProps> = ({ projectList, total, currentPage, pageSize }) => {
  const t = useTranslations('webLabel');
  const [formRef] = Form.useForm();
  const { push } = useRouter();
  const onSubmit = async (values) => {
    const paramsString = getParamsStringFromObj(values);

    NProgress.start();
    push(NAVIGATION.projectList.href + '?' + paramsString);
  };
  return (
    <section>
      <Breadcrumb
        additionalClass=""
        breadcrumbItems={[
          { path: '/', title: 'Trang chủ' },
          { path: '', title: 'Dự án' },
        ]}
        hasBanner={false}
      />
      <div className='bg-portal-gray'>
        <div className='container'>
          <Form form={formRef} size="large" layout="vertical" onFinish={onSubmit}>
            <Form.Item
              name="keyword"
              className="!mb-10 hidden lg:block [&_.ant-input-affix-wrapper]:!rounded-none [&_.ant-input-affix-wrapper]:border-neutral-500 [&_.ant-input-affix-wrapper]:!py-0 [&_.ant-input-affix-wrapper]:!pr-0"
            >
              <Input
                placeholder={t('ProjectListingSearchPlaceholder')}
                suffix={
                  <ButtonCore
                    type="submit"
                    className="!rounded-none border-l border-l-neutral-500 px-6"
                    label={`${t('HomeRealEstateSearchFormSearch')}`}
                  />
                }
              />
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className="container">
        <div>
          <div className="mb-6">
            <div className="grid grid-cols-12 gap-4">
              {projectList.map((item, index) => (
                <div className="col-span-12 sm:col-span-6 lg:col-span-3" key={`prj-${index}`}>
                  <ProjectCardItem data={item} />
                </div>
              ))}
            </div>
            {total > 0 && (
              <div className="mt-6">
                <div className="mt-3 flex w-full justify-center">
                  <Pagination
                    current={currentPage}
                    total={total}
                    pageSize={pageSize}
                    showSizeChanger={false}
                    itemRender={(page, type, originalElement) => (
                      <Link legacyBehavior href={`${NAVIGATION.projectList.href}?page=${page}`}>
                        {originalElement}
                      </Link>
                    )}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageProjectClient;
