export interface NotificationListModel {
  id: string;
  type?: string;
  idmemberId?: string;
  body: string;
  bodyEN: string;
  title: string;
  titleEN?: string;
  readStatus?: string;
  createdAt: any;
  objectId?: string;
  status?: number;
}
