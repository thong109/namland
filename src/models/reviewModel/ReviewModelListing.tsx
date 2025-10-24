export default interface ReviewModelListing {
  id: string;
  applyId?: string;
  name?: string;
  phone?: string;
  email: string;
  message: string;
  status: number;
  isShow?: boolean;
  createdById?: string;
  createdBy?: string;
  createdAt?: string;
  scoreDetail?: {
    cleanliness?: number;
    communication?: number;
    checkIn?: number;
    accuracy?: number;
    location?: number;
    value?: number;
  };
}
