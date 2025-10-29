import GalleryPrimaryShowOnlyOne from '@/app/[locale]/_components/BigGalleryShowOnlyOne/BigGalleryShowOnlyOne';
import { getTranslator } from 'next-intl/server';
import React from 'react';
import './style.css';
interface Props {
  layouts: any[];
  locale: string;
}
const LayoutImage: React.FC<Props> = async ({ layouts, locale }) => {
  const t = await getTranslator(locale);
  return (
    <>
      <div className="my-3 flex w-full justify-center text-lg font-semibold">
        {t('webLabel.EcomProjectDetailLayouts', {
          total: layouts.length,
        })}
      </div>

      {/* Mobile */}
      <div className="custom-scroll flex gap-x-2 overflow-x-auto whitespace-nowrap lg:hidden">
        {layouts.map((item) => {
          return (
            <div key={item?.id} className="flex flex-col">
              <div className="h-24 w-36">
                <GalleryPrimaryShowOnlyOne images={item?.files ?? []} />
              </div>
              <span className="text-xs font-semibold">{item?.name}</span>
              <span className="text-xs font-semibold text-gray-400">{item?.area}</span>
            </div>
          );
        })}
      </div>

      {/* Desktop */}
      <div className="custom-scroll hidden gap-x-4 overflow-x-auto whitespace-nowrap lg:flex">
        {layouts.map((item) => {
          return (
            <div key={item?.id} className="flex flex-col">
              <div className="lg:h-[172px] lg:w-[320px]">
                <GalleryPrimaryShowOnlyOne images={item?.files ?? []} />
              </div>
              <span className="text-xs font-semibold">{item?.name}</span>
              <span className="text-xs font-semibold text-gray-400">{item?.area}</span>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default LayoutImage;
