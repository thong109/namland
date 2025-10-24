export default interface PageResultModel<T> {
  total: number | 0;
  size: number | 0;
  from: number | 0;
  data?: T[];
}
