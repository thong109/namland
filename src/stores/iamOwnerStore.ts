import { create } from 'zustand';

export interface IbannerModel {
  id?: string | null;
  fileName: string | null;
  url: string | null;
  name: string | null;
  typeName?: string | null;
  fileStream?: string | null;
  fileBytes?: string | null;
  mimeType?: string | null;
}

export type IamOwnerState = {
  banerImages: IbannerModel[];
  serviceContents: any[];
  contactUsContent: any;
};

export type IamOwnerAction = {
  setBanerImages: (newData) => void;
  setServiceContents: (newData) => void;
  setContactUsContent: (newData) => void;
};

export type IamOwnerStoreModel = IamOwnerState & IamOwnerAction;

const iamOwnerStore = create<IamOwnerStoreModel>()((set) => ({
  banerImages: [],
  serviceContents: [],
  contactUsContent: {},
  setBanerImages: (value) => set({ banerImages: value }),
  setServiceContents: (value) => set({ serviceContents: value }),
  setContactUsContent: (value) => set({ contactUsContent: value }),
}));

export default iamOwnerStore;
