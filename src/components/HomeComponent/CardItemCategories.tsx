import { PropertyTypeModel } from '@/models/propertyModel/propertyTypeModel';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';
import Link from 'next/link';
import { FC } from 'react';
export interface CardItemCategories {
  className?: string;
  taxonomy: PropertyTypeModel;
}

const CardItemCategories: FC<CardItemCategories> = ({ className = '', taxonomy }) => {
  const router = useRouter();
  const { name, id, imageUrl, iconUrl } = taxonomy;
  const t = useTranslations('webLabel');
  const onClick = () => {
    router.replace(``);
  };
  return (
    <Link href={`/tin-dang-ban?categoryIds=${id}`} className="h-full w-full">
      {' '}
      <div
        onClick={onClick}
        className={`nc-CardItemCategories flex flex-col ${className} relative cursor-pointer`}
      >
        {' '}
        <div className="absolute z-10 h-full w-full bg-black opacity-20"></div>
        <div
          className={`group aspect-h-5 aspect-w-5 relative h-full w-full flex-shrink-0 overflow-hidden rounded-sm`}
        >
          <img src={imageUrl} className="object-cover" alt="places" loading="lazy" />
          <span className="opacity-1 absolute inset-0 bg-black bg-opacity-10 transition-opacity group-hover:opacity-100"></span>
        </div>
        <img
          src={iconUrl}
          alt="iconUrl"
          className="absolute left-1/2 top-1/2 z-20 h-[40px] w-[40px] -translate-x-1/2 -translate-y-1/2 transform md:h-[60px] md:w-[60px]"
        ></img>
        <span className="text-one-line absolute bottom-2 left-1/2 z-20 w-full -translate-x-1/2 transform text-center text-[12px] text-white md:bottom-5 lg:text-[15px]">
          {name}
        </span>
      </div>
    </Link>
  );
};

export default CardItemCategories;
