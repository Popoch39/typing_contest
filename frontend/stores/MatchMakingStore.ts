import { Room } from "colyseus.js";
import { create } from "zustand"

export type MatchmakingState = {
  currentRoom: null | Room;
  status: "inactif" | "inQueue" | "gameFound" | "inGame"
}

type MatchmakingActions = {
  updateStatus: (status: MatchmakingState["status"]) => void
  updateRoom: (room: MatchmakingState["currentRoom"]) => void
  cancelQueue: () => void 
};

const useMatchmakingStore = create<MatchmakingState & MatchmakingActions>((set) => ({
  currentRoom: null,
  status: "inactif",
  updateStatus: (status) => set(() => ({ status: status })),
  updateRoom: (room) => set(() => ({ currentRoom: room })),
  cancelQueue: () => set((state) => {
    if (state.currentRoom) {
      state.currentRoom.leave();
      return { 
        currentRoom: null,
        status: "inactif"
      }
    }
    console.error("no room found when canceling matchmaking")
    return {}
  })
}))

export default useMatchmakingStore;
