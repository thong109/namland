import AuthConstant from '@/libs/constants/authConstant';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  AuthenticationStoreModel,
  createAuthenticationStoreSlice,
} from './states/AuthenticationStore';
import {
  MyFavoriteStoreStoreModel,
  createMyFavoriteStoreStoreSlice,
} from './states/MyFavoriteStore';
import { RootStoreState } from './states/RootStore';

const useGlobalStore = create<
  RootStoreState & AuthenticationStoreModel & MyFavoriteStoreStoreModel
>()((set, get, ...a) => ({
  ...persist(createAuthenticationStoreSlice, {
    name: AuthConstant.LocalStorageAuthKey,
  })(set, get, ...a),

  ...createMyFavoriteStoreStoreSlice(set, get, ...a),
}));

export default useGlobalStore;
