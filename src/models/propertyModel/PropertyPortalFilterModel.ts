export interface PropertyPortalFilterModel {
  keyword?: string;
  status?: number;
  multipleStatusListting?: number[];
  createdBy?: string;
  fromDate?: string;
  toDate?: string;
  type?: number;
  projectId?: string;
  from?: number;
  userApproveOrReject: string;
}
