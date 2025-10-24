export default interface SearchResponseModel<T> {
  items: T[];
  total: number;
  from: number;
  size: number;
}
