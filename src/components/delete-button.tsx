import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"
import { SportActivity } from "@/lib/db/schema"

const DleteBtn = ({activity}:{activity: SportActivity}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const handleDelete = async (id: string) => {
        if (!isAuthenticated) {
          toast("Vous devez être connecté pour supprimer une activité")
          return
        } 
    }
  return (
    <> 
          <AlertDialog>
                         <AlertDialogTrigger asChild>
                           
                         {/* <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(activity.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            {/* <Trash2 className="h-4 w-4" /> */}
                            {/* <Trash2 className="h-4 w-4" />
                            </Button> */} 
                            <Trash2 className="h-4 w-4" />
                          
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction asChild>
      <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(activity.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            {/* <Trash2 className="h-4 w-4" /> */}
                            Remove
                            </Button>
        </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
    </>
  )
}

export default DleteBtn