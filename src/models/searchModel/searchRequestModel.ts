export default interface SearchRequestModel {
  size: number;
  from: number;
  terms?: any[] | [];
  range?: any;
  must?: any[];
  isActive?: boolean;
  query?: SearchRequestQueryModel;
  sort?: SearchRequestSortModel;
  keyword?: string;
}

interface SearchRequestQueryModel {
  bool?: {
    must?: {
      term: {
        [Key: string]: any;
      };
    }[];
    must_not?: {
      term: {
        [Key: string]: any;
      };
    }[];
  };
}

interface SearchRequestSortModel {
  label?: string;
  field: string;
  sortOrder?: number;
  isDefault?: boolean;
}
