import PageResultModel from '@/models/reponseModel/pageResultModel';
import { create } from 'zustand';

export interface INewsModel {
  id: string | null;
  category?: string | null;
  title: string | null;
  description: string | null;
  imageUrl: string | null;
  createdAt?: string | null;
  createdBy?: string | null;
  content?: string | null;
  shareLink?: string | null;
}
export type NewsState = {
  newsList: PageResultModel<INewsModel>;
  newsDetail: INewsModel;
};

export type NewsAction = {
  setNewsList: (newsList) => void;
  setNewsDetail: (newsDetail: INewsModel) => void;
};
const initialNewsDetail: INewsModel = {
  id: null,
  category: null,
  title: null,
  description: null,
  imageUrl: null,
  createdAt: null,
  createdBy: null,
  content: null,
  shareLink: null,
};
const initialNewsList: PageResultModel<INewsModel> = {
  total: 0,
  size: 0,
  from: 0,
  data: [],
};
export type NewsStoreModel = NewsState & NewsAction;

const newsStore = create<NewsStoreModel>()((set) => ({
  newsList: initialNewsList,
  newsDetail: initialNewsDetail,
  setNewsList: (value) => set({ newsList: value }),
  setNewsDetail: (value) => set({ newsDetail: value }),
}));

export default newsStore;
