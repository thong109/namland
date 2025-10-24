export interface IRespone {
  code: number;
  data: DataQuery;
  message: string;
}

interface DataQuery {
  countId?: number;
  amount?: number;
  createdAt?: string;
  fee?: number;
  merchantId?: number;
  partnerTransaction?: string;
  payCode?: number | string;
  payMethod?: number | string;
  paymentId?: number | string;
  reason?: string;
  state?: 'SUCCEEDED' | 'FAILED' | 'PENDING' | 'EXPIRED' | 'CANCELED' | 'REFUNDED';
  storeId?: number;
  total?: number;
  transactionId?: number | string;
  updatedAt: string;
  transaction?: string;
}

export class ResponePaymentStatus implements IRespone {
  data: DataQuery;
  message: string;
  code: number;

  public static assign(obj) {
    const newObj = Object.assign(new ResponePaymentStatus(), obj);

    return newObj;
  }
}
