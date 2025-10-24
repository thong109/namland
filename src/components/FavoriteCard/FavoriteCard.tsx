'use client';
import { likeIcon } from '@/libs/appComponents';
import { removeDiacritics } from '@/libs/appconst';
import { formatNumber } from '@/libs/helper';
import { PropertyFavoriteModel } from '@/models/propertyModel/propertyFavoriteModel';
import { useRouter } from 'next-intl/client';
import { FC } from 'react';
export interface Props {
  item: PropertyFavoriteModel;
  unFavorite: (id, isFavourite) => void;
  locale: any;
}

const FavoriteCard: FC<Props> = ({ item, unFavorite, locale }) => {
  const { push } = useRouter();

  const getPropertyLink = () => {
    let stringNotUniCode = removeDiacritics(item.title);
    let string = stringNotUniCode.replaceAll(/[^a-zA-Z ]/g, '').replaceAll(/ /g, '-');
    return push(`/property/${string + '-' + item.id}`);
  };

  return (
    <>
      {/*  DeskTop */}
      <div className="mt-3 hidden bg-portal-card px-4 lg:flex">
        <div className="flex w-full border-b border-[#E6E9EC] py-4">
          <div className="w-1/6 md:mr-2">
            <img
              className="h-[140px] w-[160px] border-2"
              src={item?.imageThumbnailUrl}
              content="image thumnai"
              onClick={getPropertyLink}
            />
          </div>
          <div className="flex w-5/6 flex-col items-start justify-center">
            <div className="w-full">
              <strong className="text-sm" onClick={getPropertyLink}>
                {item?.title}
              </strong>
            </div>
            <div className="my-2 w-full">
              <label className="text-xs text-portal-gray">{item?.location?.formattedAddress}</label>
            </div>
            <div className="w-full">
              <strong className="text-sm">
                {locale === 'vi'
                  ? 'VNĐ ' + formatNumber(item?.priceVnd) + `${item.type === 0 ? ' /tháng' : ''}`
                  : '$ ' + formatNumber(item?.priceUsd) + `${item.type === 0 ? ' /mth' : ''}`}
              </strong>
            </div>
          </div>
          <div className="flex w-1/6 flex-col items-start justify-center">
            <button
              className="flex w-fit justify-center"
              onClick={() => unFavorite(item?.id, item?.isFavourite)}
            >
              {likeIcon}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="col-span-12 mt-3 flex w-full bg-portal-card lg:hidden">
        <img
          className="mr-2 h-[140px] w-1/3 border"
          src={item?.imageThumbnailUrl}
          content="image thumnaii"
          onClick={getPropertyLink}
        />

        <div className="col-span-8 flex h-[140px] w-2/3 flex-col items-start justify-center pr-[3%]">
          <div className="line-clamp-2 h-[20%] w-full">
            <strong className="text-xs" onClick={getPropertyLink}>
              {item?.title}
            </strong>
          </div>
          <div className="h-[20%] w-full truncate">
            <label className="text-xs text-portal-gray">{item?.location?.formattedAddress}</label>
          </div>

          <div className="mt-3 flex h-[25%] w-full items-center justify-between">
            <div>
              <strong className="text-xs">
                {locale === 'vi'
                  ? 'VNĐ ' + formatNumber(item?.priceVnd) + `${item.type === 0 ? ' /tháng' : ''}`
                  : '$ ' + formatNumber(item?.priceUsd) + `${item.type === 0 ? ' /mth' : ''}`}
              </strong>
            </div>
            <div>
              <p onClick={() => unFavorite(item?.id, item?.isFavourite)}>{likeIcon}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FavoriteCard;
