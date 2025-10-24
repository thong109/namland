import { setGoogleMapsApiKey } from '@/app/googlemap';
import firebase from 'firebase';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export type CoreAppConfig = {
  backEndApiUrl?: string;
  googleMapsApiKey?: string;

  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  measurementId?: string;

  urlSocket?:string
};

export interface CoreAppConfigStoreModel {
  config?: CoreAppConfig;
  setConfig: (config: CoreAppConfig) => void;
}

const useCoreAppConfigStore = create<CoreAppConfigStoreModel>()(
  persist(
    (set) => ({
      config: null,
      setConfig: (key: CoreAppConfig) => {
        if (key.googleMapsApiKey) {
          setGoogleMapsApiKey(key.googleMapsApiKey);
        }
    
  
        set({ config: { backEndApiUrl: key.backEndApiUrl,urlSocket:key.urlSocket } });

        if (key.apiKey && !firebase.apps.length) {
          firebase.initializeApp(key);
          firebase.auth().languageCode = 'vi';
          console.log('Firebase initialized');
        }
      },
    }),
    {
      name: 'coreAppConfig',
    },
  ),
);

export default useCoreAppConfigStore;
