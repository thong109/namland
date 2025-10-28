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
    <div className="container mb-3 pt-10">
      <Typography className="mb-5 text-center text-3xl font-bold text-portal-primaryLiving">
        {t('EcomHomePageMenuNewHome')}
      </Typography>
      <Form form={formRef} size="middle" layout="vertical" onFinish={onSubmit}>
        <div className="mb-3 hidden grid-cols-12 lg:grid">
          <div className="col-span-12">
            <Form.Item name="keyword" className="hidden lg:block">
              <Input
                className="w-full"
                placeholder={t('ProjectListingSearchPlaceholder')}
                prefix={<MagnifyingGlassIcon className="size-4" />}
              />
            </Form.Item>
          </div>
          <div className="col-span-12 flex items-center justify-around">
            <Form.Item
              label={t('HomeRealEstateSearchFromToPrice')}
              name="fromPrice"
              className="mr-1"
            >
              <InputNumber
                placeholder={t('HomeRealEstateSearchFromPrice')}
                size="middle"
                className="w-full"
                min={0}
              />
            </Form.Item>
            <Form.Item label=" " name="toPrice" className="mr-1">
              <InputNumber
                placeholder={t('HomeRealEstateSearchToPrice')}
                min={0}
                className="w-full"
              />
            </Form.Item>
            <div className="mx-2 h-1/2 w-[1px] border border-r-black"></div>

            <Form.Item label={t('HomeRealEstateSearchFromToArea')} name="fromArea" className="mr-1">
              <InputNumber
                placeholder={t('HomeRealEstateSearchFromArea')}
                size="middle"
                className="w-full"
                min={0}
              />
            </Form.Item>
            <Form.Item name="toArea" className="mr-1" label=" ">
              <InputNumber
                placeholder={t('HomeRealEstateSearchToArea')}
                min={0}
                className="w-full"
              />
            </Form.Item>
            <div className="mx-2 h-1/2 w-[1px] border border-r-black"></div>

            <Form.Item label={t('HomeRealEstateSearchFromToRoom')} name="fromRoom" className="mr-1">
              <InputNumber
                placeholder={t('HomeRealEstateSearchFromRoom')}
                size="middle"
                className="w-full"
                min={0}
              />
            </Form.Item>
            <Form.Item name="toRoom" label=" ">
              <InputNumber
                placeholder={t('HomeRealEstateSearchToRoom')}
                min={0}
                className="w-full"
              />
            </Form.Item>
          </div>
          <div className="col-span-12 flex justify-center">
            <ButtonCore
              type="submit"
              className="px-6 !text-pmh-text"
              label={`${t('HomeRealEstateSearchFormSearch')}!`}
            />
          </div>
        </div>

        <div className="mb-3 grid grid-cols-12 lg:hidden">
          <div className="col-span-12">
            <Form.Item name="keyword">
              <Input
                className="w-full"
                placeholder={t('ProjectListingSearchPlaceholder')}
                prefix={<MagnifyingGlassIcon className="size-4" />}
              />
            </Form.Item>
          </div>
          <div className="col-span-12">
            <span onClick={() => setIsShowFilter(!isShowFilter)}>
              {isShowFilter ? comm('showLessFilter') : comm('showMoreFilter')}
            </span>
          </div>
          {isShowFilter && (
            <>
              <div className="col-span-12 flex items-center justify-around">
                <Form.Item
                  label={t('HomeRealEstateSearchFromToPrice')}
                  name="fromPrice"
                  className="mr-1"
                >
                  <InputNumber
                    placeholder={t('HomeRealEstateSearchFromPrice')}
                    size="middle"
                    className="w-full"
                    min={0}
                  />
                </Form.Item>

                <Form.Item label=" " name="toPrice" className="mr-1">
                  <InputNumber
                    placeholder={t('HomeRealEstateSearchToPrice')}
                    min={0}
                    className="w-full"
                  />
                </Form.Item>
              </div>
              <div className="col-span-12 flex items-center justify-around">
                <Form.Item
                  label={t('HomeRealEstateSearchFromToArea')}
                  name="fromArea"
                  className="mr-1"
                >
                  <InputNumber
                    placeholder={t('HomeRealEstateSearchFromArea')}
                    size="middle"
                    className="w-full"
                    min={0}
                  />
                </Form.Item>
                <Form.Item name="toArea" className="mr-1" label=" ">
                  <InputNumber
                    placeholder={t('HomeRealEstateSearchToArea')}
                    min={0}
                    className="w-full"
                  />
                </Form.Item>
              </div>
              <div className="col-span-12 flex items-center justify-around">
                <Form.Item
                  label={t('HomeRealEstateSearchFromToRoom')}
                  name="fromRoom"
                  className="mr-1"
                >
                  <InputNumber
                    placeholder={t('HomeRealEstateSearchFromRoom')}
                    size="middle"
                    className="w-full"
                    min={0}
                  />
                </Form.Item>
                <Form.Item name="toRoom" label=" ">
                  <InputNumber
                    placeholder={t('HomeRealEstateSearchToRoom')}
                    min={0}
                    className="w-full"
                  />
                </Form.Item>
              </div>
            </>
          )}
          <div className="col-span-12 flex justify-center">
            <ButtonCore
              type="submit"
              className="px-6 !text-pmh-text"
              label={`${t('HomeRealEstateSearchFormSearch')}!`}
            />
          </div>
        </div>
      </Form>
      <div>
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
          {total > 0 ? (
            <div className="mt-6">
              <div className="mt-3 flex w-full justify-center">
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
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewHomePageClient;
