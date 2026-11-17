import { create } from "zustand";

interface UiState {
  isSidebarOpen: boolean;
  isMobileNavOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleMobileNav: () => void;
  setMobileNavOpen: (open: boolean) => void;
  closeAllNav: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isSidebarOpen: true,
  isMobileNavOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) =>
    set((state) => (state.isSidebarOpen === open ? state : { isSidebarOpen: open })),
  toggleMobileNav: () => set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen })),
  setMobileNavOpen: (open) =>
    set((state) => (state.isMobileNavOpen === open ? state : { isMobileNavOpen: open })),
  closeAllNav: () =>
    set((state) => (state.isMobileNavOpen ? { isMobileNavOpen: false } : state)),
}));

