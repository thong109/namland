export default interface ApiResponseModel<T> {
  success: boolean;
  message?: string;
  messageEN?: string;
  errorCode?: string;
  data?: T;
}
