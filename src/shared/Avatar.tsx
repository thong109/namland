import AvatarDefault from '@/assets/images/avarta-default.png';
import { avatarColors } from '@/libs/constants/avatarColorsContant';
import { FC } from 'react';
export interface AvatarProps {
  containerClassName?: string;
  sizeClass?: string;
  radius?: string;
  imgUrl?: string;
  userName?: string;
  hasChecked?: boolean;
  hasCheckedClass?: string;
}

const Avatar: FC<AvatarProps> = ({
  containerClassName = 'ring-1 ring-white dark:ring-neutral-900',
  sizeClass = 'h-6 w-6 text-sm',
  radius = 'rounded-full',
  imgUrl,
  userName,
  hasChecked,
  hasCheckedClass = 'w-4 h-4 -top-0.5 -right-0.5',
}) => {
  const url = imgUrl || '';
  const name = userName || 'John Doe';
  const _setBgColor = (name: string) => {
    const backgroundIndex = Math.floor(name.charCodeAt(0) % avatarColors.length);
    return avatarColors[backgroundIndex];
  };

  return (
    <div
      className={`wil-avatar relative inline-flex flex-shrink-0 items-center justify-center font-semibold uppercase text-neutral-100 shadow-inner ${radius} ${sizeClass} ${containerClassName}`}
      // style={{ backgroundColor: url ? undefined : _setBgColor(name) }}
    >
      {url ? (
        <img
          className={`absolute inset-0 h-full w-full object-cover ${radius}`}
          src={url}
          alt={name}
        />
      ) : (
        <img
          className={`h-[75%] w-[75%] object-fill ${radius}`}
          src={AvatarDefault?.src}
          alt={name}
        />
      )}

      {hasChecked && (
        <span
          className={`absolute flex items-center justify-center rounded-full bg-teal-500 text-xs text-white ${hasCheckedClass}`}
        >
          <i className="las la-check"></i>
        </span>
      )}
    </div>
  );
};

export default Avatar;
