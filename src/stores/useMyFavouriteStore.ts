import {
  postEcomListingFavoriteFavorite,
  postEcomListingFavoriteGetMyFavorite,
  postEcomListingFavoriteNewHome,
} from '@/ecom-sadec-api-client';
import ListingModel from '@/models/listingModel/listingModel';
import PageResultModel from '@/models/reponseModel/pageResultModel';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useAuthStore } from './useAuthStore';
import useGlobalStore from './useGlobalStore';
import favoriteApiService from '@/apiServices/externalApiServices/favoriteApiService';

export const useMyFavouriteStore = () => {
  const { status } = useAuthStore();

  const { addFavorite,addFavoriteNewHome, myFavorites,myFavoritesNewHome, removeFavorite,removeFavoriteNewHome, setFavorites,setFavoritesNewHome } = useGlobalStore();

  const initRequest = useCallback(async () => {
    if (status === 'unauthenticated') {
      return;
    } else {
      const result = (await postEcomListingFavoriteGetMyFavorite({
        authorization: null,
        requestBody: {
          from: 0,
          size: 999,
          keyword: '',
          type: 1, // TODO
        },
      })) as PageResultModel<ListingModel>;
      
      const response = await favoriteApiService.getListFarvoriteNewHome({
        from: 0,
        size: 999,
        keyword: '',
      });

      setFavorites(result?.data ?? []);


      setFavoritesNewHome((response as any).data??[]);
    }
  }, [status, setFavorites,setFavoritesNewHome]);

  const {} = useQuery({
    queryKey: ['myFavorites','myFavoritesNewHome'],
    queryFn: initRequest,
    enabled: status === 'authenticated',
  });

  const toggleFavorite = async (listingId: string, isAdd: boolean) => {
    if (status === 'unauthenticated') {
      console.error('Please login to add favourite');
      return false;
    } else {
      await postEcomListingFavoriteFavorite({
        authorization: null,
        requestBody: {
          isFavorite: isAdd,
          listingId,
        },
      });

      return true;
    }
  };

  const toggleFavoriteNewHome = async (newHomeId: string, isAdd: boolean) => {
    if (status === 'unauthenticated') {
      console.error('Please login to add favourite New Home');
      return false;
    } else {
      await postEcomListingFavoriteNewHome({
        authorization: null,
        requestBody: {
          isFavorite: isAdd,
          newHomeId,
        },
      });

    
      return true;
    }
  };

  return { myFavorites,myFavoritesNewHome, toggleFavorite,toggleFavoriteNewHome, addFavorite,addFavoriteNewHome, removeFavorite,removeFavoriteNewHome };
};
