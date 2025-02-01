import { create } from "zustand"

type State = {
  status: "inactif" | "inQueue" | "inGame"
}

type Actions = {
  updateStatus: (status: State["status"]) => void
};

const useGameStore = create<State & Actions>((set) => ({
  status: "inactif",
  updateStatus: (status) => set(() => ({status: status})) 
}))

export default useGameStore;
