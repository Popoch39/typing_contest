import {
  AlertDialog as AlertDialogs,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface AlertDialogInterface {
  open: boolean, 
}

const AlertDialog = (props: AlertDialogInterface) => {
  return (
    <AlertDialogs open={props.open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Match found !
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Accept</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogs>
  )
};


export default AlertDialog; 
