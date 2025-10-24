import { FC } from 'react';
import PageAgencyClient from './pageClients';
export interface PageAgencyDetailProps {
  params: any;
  searchParams: { [key: string]: string | string[] | undefined };
}
const ViewDetailAgency: FC<PageAgencyDetailProps> = ({ params, searchParams }) => {
  return <PageAgencyClient params={params || {}}></PageAgencyClient>;
};

export default ViewDetailAgency;
