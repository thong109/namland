export default interface ReviewModel {
  name: string;
  applyId?: string;
  email: string;
  message: string;
  scoreDetail: {
    cleanliness?: number;
    communication?: number;
    checkIn?: number;
    accuracy?: number;
    location?: number;
    value?: number;
  };
}
