interface Attachment {
  bannerId: string;
  bannerImageUrl: string;
  bannerName: string;
  bannerLink: string;
  sequence: number;
}

interface UserInfo {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  avatarUrl: string;
}

export default interface Banner {
  attachments: Attachment[];
  title: string;
  position: number;
  startDate: string;
  endDate: string;
  switchAfterSeconds: number;
  status: boolean;
  userInfo: UserInfo;
  createdBy: string;
}
