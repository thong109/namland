import ListingModel from './listingModel';

export default interface dataListingModel {
  from: number;
  size: number;
  total: number;
  data: ListingModel[];
}
