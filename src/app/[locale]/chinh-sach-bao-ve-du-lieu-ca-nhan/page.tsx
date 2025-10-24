import { useLocale } from 'next-intl';

import { FC } from 'react';
import PageClientVn from './PageClientVn';
import PageClientEN from './PageEnglish';

const PagePolicy: FC = () => {
  const locale = useLocale();

  return (
    <div className={`nc-PageSignUp`}>
      <div className="container mb-24 lg:mb-32">
        {locale == 'vi' ? <PageClientVn /> : <PageClientEN />}
      </div>
    </div>
  );
};

export default PagePolicy;
