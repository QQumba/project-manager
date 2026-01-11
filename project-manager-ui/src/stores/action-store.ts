import { create } from 'zustand';

export type Action = {
  id: number;
  name: string;
  workingDir: string;
  command: string;
  args: Record<string, string>;
};

type ActionStore = {
  actions: Action[];
  setActions: (actions: Action[]) => void;
  addAction: (action: Action) => void;
  updateAction: (action: Action) => void;
  deleteAction: (actionId: number) => void;
};

export const useActionStore = create<ActionStore>((set) => ({
  actions: [],
  setActions: (actions) => set({ actions }),
  addAction: (action) =>
    set((state) => ({ actions: [...state.actions, action] })),
  updateAction: (action) =>
    set((state) => ({
      actions: state.actions.map((x) => (x.id === action.id ? action : x)),
    })),
  deleteAction: (actionId) =>
    set((state) => ({
      actions: state.actions.filter((x) => x.id !== actionId),
    })),
}));
