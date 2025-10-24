export interface PackageModel {
  id: number;
  discountedPoint: number;
  percentDecrease: number;
  createdAt: string;
  numberOfPush: number;
  package: number;
  packageType: number;
  point: number;
  status: number;
  type: number;
  name: string;
}

export interface PushModel {
  id: number;
  createdAt: string;
  numberOfPush: number;
  point: number;
  type: number;
  package: number;
  packageType: number;
  status: number;
}
