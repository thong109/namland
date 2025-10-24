'use server';
import { getEcomListingCategoryGetList } from '@/ecom-sadec-api-client';

import FooterContent from './FooterContent';
interface FooterProps {}

const Footer: React.FC<FooterProps> = async ({}) => {
  const rentCategories = ((await getEcomListingCategoryGetList({})) as any).data.data;

  return <FooterContent propertyTypes={rentCategories} />;
};

export default Footer;
