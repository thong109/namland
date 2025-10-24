import { createGlobalState } from 'react-hooks-global-state';

const initialState = { isBuyPushPackageOpen: false };

const { useGlobalState } = createGlobalState(initialState);

export const ModalBuyPushPackageOpen = () => {
  return useGlobalState('isBuyPushPackageOpen');
};
