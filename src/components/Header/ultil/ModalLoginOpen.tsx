import { createGlobalState } from 'react-hooks-global-state';

const initialState = { isModalOpen: false };
const { useGlobalState } = createGlobalState(initialState);

export const ModalLoginOpen = () => {
  return useGlobalState('isModalOpen');
};
