export default interface ReportResultModel<> {
  fromDate?: Date;
  toDate?: Date;
  totalAccessCount?: number | 0;
  totalAmount?: number | 0;
  totalListing?: number | 0;
  totalNewListing?: number | 0;
  totalNewUsers?: number | 0;
  totalTransaction?: number | 0;
  totalTransactionFailedCount?: number | 0;
  totalTransactionSuccessCount?: number | 0;
  totalUsers?: number | 0;
  totalOwner?: number | 0;
  totalNewOwner?: number | 0;
}
