import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";

export interface ApplicationState {
  connectionString: string;
  currentCollectionName: string;
  updateConnectionString: (newConnectionString: string) => void
}

export const useApplicationStore = create<ApplicationState>()(
  persist(
    (set) => ({
      connectionString: '',
      currentCollectionName: '',
      updateConnectionString: (newConnectionString) => set(() => ({connectionString: newConnectionString}))
    }),
    {
      name: 'application-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
)
