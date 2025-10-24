import { TaxonomyType } from '@/data/types';
import { Route } from '@/routers/types';
import Link from 'next/link';
import { FC } from 'react';

export interface TagProps {
  className?: string;
  tag: TaxonomyType;
  hideCount?: boolean;
}

const Tag: FC<TagProps> = ({ className = '', tag, hideCount = false }) => {
  return (
    <Link
      className={`nc-Tag inline-block rounded-lg border border-neutral-100 bg-white px-3 py-2 text-sm text-neutral-6000 hover:border-neutral-200 dark:border-neutral-700 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-6000 md:px-4 md:py-2.5 ${className}`}
      href={tag.href as Route}
    >
      {`${tag.name}`}
      {!hideCount && <span className="text-xs font-normal"> ({tag.count})</span>}
    </Link>
  );
};

export default Tag;
