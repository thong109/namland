import { createGlobalState } from 'react-hooks-global-state';

const initialState = { isTopupOpen: false };

const { useGlobalState } = createGlobalState(initialState);

export const ModalTopupOpen = () => {
  return useGlobalState('isTopupOpen');
};
