import { Room } from "colyseus.js";
import { create } from "zustand"

type State = {
  currentRoom: null | Room;
  status: "inactif" | "inQueue" | "inGame"
}

type Actions = {
  updateStatus: (status: State["status"]) => void
  updateRoom: (room: State["currentRoom"]) => void 
};

const useGameStore = create<State & Actions>((set) => ({
  currentRoom: null,
  status: "inactif",
  updateStatus: (status) => set(() => ({status: status})), 
  updateRoom: (room) => set(() => ({currentRoom: room}))
}))

export default useGameStore;
