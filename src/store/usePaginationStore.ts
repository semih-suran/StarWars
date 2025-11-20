import {create} from 'zustand';

type PaginationState = {
  pages: Record<string, number>;
  setPage: (resourceKey: string, page: number) => void;
  getPage: (resourceKey: string) => number;
};

export const usePaginationStore = create<PaginationState>((set, get) => ({
  pages: {},
  setPage: (resourceKey: string, page: number) =>
    set((s) => ({ pages: { ...s.pages, [resourceKey]: page } })),
  getPage: (resourceKey: string) => get().pages[resourceKey] ?? 1,
}));
