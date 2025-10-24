export default interface registerModel {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  accountType: string;
  verifyCode: string;
  ownershipType: string;
  extraInfo?: {
    address?: string;
    taxCode?: string;
    taxCodeDateOfIssue?: string;
    taxCodePlaceOfIssue?: string;
  } | null;
}
