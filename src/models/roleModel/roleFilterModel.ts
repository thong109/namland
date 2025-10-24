import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
dayjs.extend(utc);
export interface ISRolelterModelInAdmin {
  keyword?: string;
  status?: number;
  createdBy?: string;
  fromDate?: string;
  toDate?: string;
  type?: number;
  from?: number;
  size?: number;
  isActive?: boolean;
}
