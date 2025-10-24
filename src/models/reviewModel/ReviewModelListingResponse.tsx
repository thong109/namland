import ReviewModelListing from './ReviewModelListing';
export default interface ModelListingReviewResponse {
  from: number;
  size: number;
  total: number;
  data: ReviewModelListing[];
}
