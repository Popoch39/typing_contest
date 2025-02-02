"use client"

import {
  AlertDialog as AlertDialogs,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import useMatchmakingStore from "@/stores/MatchMakingStore";


const MatchFoundDialog = () => {
  const status = useMatchmakingStore(state => state.status)
  const room = useMatchmakingStore(state => state.currentRoom)
  const cancelQueue = useMatchmakingStore(state => state.cancelQueue)

  const handleAccept = () => {
    if (!room) {
      // TODO : show toast message or something bcause something went wrong here
      return
    }
    room.send("acceptMatch");
  }

  const handleReject = () => {
    if (!room) {
      // TODO : show toast message or something bcause something went wrong here
      return
    }
    cancelQueue();
  }

  return (
    <AlertDialogs open={status === "gameFound"}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>MATCH FOUND ! </AlertDialogTitle>
          <AlertDialogDescription>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onMouseDown={handleReject}>Cancel</AlertDialogCancel>
          <AlertDialogAction onMouseDown={handleAccept}>Accept</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogs>
  )
};

export default MatchFoundDialog; 
