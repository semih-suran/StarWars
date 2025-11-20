import { create } from "zustand";

type ModalState = {
  open: boolean;
  resource?: string;
  url?: string;
  openModal: (resource: string, url: string) => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalState>((set) => ({
  open: false,
  resource: undefined,
  url: undefined,
  openModal: (resource: string, url: string) =>
    set({ open: true, resource, url }),
  closeModal: () => set({ open: false, resource: undefined, url: undefined }),
}));
