import {create} from "zustand";

export interface ApplicationState {
  connectionString: string;
  currentCollectionName: string;
  updateConnectionString: (newConnectionString: string) => void
}

export const useApplicationStore = create<ApplicationState>()((set) => ({
  connectionString: '',
  currentCollectionName: '',
  updateConnectionString: (newConnectionString) => set(() => ({connectionString: newConnectionString}))
}))
