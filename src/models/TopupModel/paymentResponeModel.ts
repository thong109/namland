export interface IModalPayment {
  code: number;
  message: string;
  partnerTransaction: string;
  transaction: string;
  url: string;
}

export class PaymentResponeModel implements IModalPayment {
  code: number;
  message: string;
  partnerTransaction: string;
  transaction: string;
  url: string;
  public static assign(obj) {
    if (!obj) return undefined;

    const newObj = Object.assign(new PaymentResponeModel(), obj);

    return newObj;
  }
}
