interface MemberPackages {
  packageType: number;
  numberOfPost: number;
  numberOfPush: number;
  type: number;
}

interface memberPackageDetails {
  package: number;
  packageType: number;
  type: number;
  numberOfPost: number;
  numberOfPush: number;
}

export default interface MemberPackageProfile {
  memberPackageDetails: memberPackageDetails[];
  memberPackages: MemberPackages[];
  totalPoint: number;
}
