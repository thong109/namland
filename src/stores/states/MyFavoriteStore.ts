import ListingModel from '@/models/listingModel/listingModel';
import { StateCreator } from 'zustand';
import { RootStoreState } from './RootStore';

export interface MyFavoriteStoreStoreModel {
  myFavorites: ListingModel[];
  myFavoritesNewHome: ListingModel[];
  setFavorites: (favorites: ListingModel[]) => void;
  setFavoritesNewHome: (favorites: ListingModel[]) => void;
  addFavorite: (favorite: ListingModel) => void;
  addFavoriteNewHome: (favorite: ListingModel) => void;
  removeFavorite: (favorite: ListingModel) => void;
  removeFavoriteNewHome: (favorite: ListingModel) => void;
}

export const createMyFavoriteStoreStoreSlice: StateCreator<
  RootStoreState & MyFavoriteStoreStoreModel,
  [],
  [],
  MyFavoriteStoreStoreModel
> = (set): MyFavoriteStoreStoreModel => ({
  myFavorites: [],
  myFavoritesNewHome:[],
  setFavorites: (favorites) => set({ myFavorites: favorites }),
  setFavoritesNewHome: (favorites) => set({ myFavoritesNewHome: favorites }),
  addFavorite: (favorite) => set((state) => ({ myFavorites: [...state.myFavorites, favorite] })),
  addFavoriteNewHome: (favorite) => set((state) => ({ myFavoritesNewHome: [...state.myFavoritesNewHome, favorite] })),
  removeFavorite: (favorite) =>
    set((state) => ({
      myFavorites: [...state.myFavorites.filter((item) => item.id !== favorite.id)],
    })),
    removeFavoriteNewHome: (favorite) =>
      set((state) => ({
        myFavoritesNewHome: [...state.myFavoritesNewHome.filter((item) => item.id !== favorite.id)],
      })),
});
