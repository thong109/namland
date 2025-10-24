import { createGlobalState } from 'react-hooks-global-state';

const initialState = { isBuyPackageOpen: false };

const { useGlobalState } = createGlobalState(initialState);

export const ModalBuyPackageOpen = () => {
  return useGlobalState('isBuyPackageOpen');
};
