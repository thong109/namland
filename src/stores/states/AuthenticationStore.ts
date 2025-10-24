import MemberPackageProfile from '@/models/TopupModel/memberpackageProfileModel';
import AccountModel from '@/models/accountModel/accountModel';
import { StateCreator } from 'zustand';
import { RootStoreState } from './RootStore';

export interface AuthenticationStoreModel {
  token: string | null;
  setToken: (token: string) => void;
  userInfo: AccountModel | null;
  setUserInfo: (userInfo: AccountModel) => void;
  userPackage: MemberPackageProfile | null;
  setUserPackage: (userPackage: MemberPackageProfile) => void;
}

export const createAuthenticationStoreSlice: StateCreator<
  RootStoreState & AuthenticationStoreModel,
  [],
  [],
  AuthenticationStoreModel
> = (set): AuthenticationStoreModel => ({
  token: null,
  setToken: (token) => set({ token }),
  userInfo: null,
  setUserInfo: (userInfo) => set({ userInfo }),
  userPackage: null,
  setUserPackage: (userPackage) => set({ userPackage }),
});
