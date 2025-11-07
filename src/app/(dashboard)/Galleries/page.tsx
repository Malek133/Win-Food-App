import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import GallerieForm from "@/components/galleries-form";
 import GalleriesDisplay from "@/components/galleries-display";
import { getImages } from "@/lib/actions/galleries-action";

export const revalidate = 3600
const Page = async () =>
 {
  const product = await getImages()

 
  return (
    <div className="mx-auto max-w-4xl p-6 text-lg">
      <h1 className="mb-4 text-center text-3xl font-bold">
        Galleries Of Pictures</h1>
       
     <div className="flex justify-end">
     
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              Add Image <UserPlus className="size-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Image</DialogTitle>
              <DialogDescription>
                Add a new picture to the database.
              </DialogDescription>

                <GallerieForm /> 
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      {/* <GalleriesDisplayServer /> */}

       <GalleriesDisplay />

    </div>
  )
}

export default Page