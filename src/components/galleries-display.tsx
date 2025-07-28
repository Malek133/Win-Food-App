

// import Image from 'next/image'
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "./ui/button";
// import { Eye, Pencil,ShoppingCart } from "lucide-react";
// import { getImages } from '@/lib/actions/galleries-action';
// import GallerieForm from './galleries-form';
// import DeleteGallerieButton from './delete-buton-gallerie';


// export default async function GalleriesDisplay() {
//   const photos = await getImages();


//   return (
//       <div className="container mx-auto p-6">
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold mb-2">Galerie Photos</h1>
//         <p className="text-muted-foreground">Une collection de {photos.length} photos</p>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {photos.map((photo) => (
//           <div
//             key={photo.id}
//             className="group relative overflow-hidden rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow"
//           >
//             {/* Image Container */}
//             <div className="aspect-square relative overflow-hidden">
//               <Image
//                 src={photo.imageUrl || "/placeholder.jpg"}
//                 alt={photo.title}
//                 fill
//                 className="object-cover transition-transform duration-300 group-hover:scale-105"
//               />

//               {/* Overlay avec actions */}
//               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
//                 {/* Bouton Voir */}
//                 <Dialog>
//                   <DialogTrigger asChild>
//                     <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
//                       <Eye className="size-4" />
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent className="max-w-2xl">
//                     <DialogHeader>
//                       <DialogTitle>{photo.title}</DialogTitle>
//                     </DialogHeader>
//                     <div className="space-y-4">
//                       <div className="aspect-video relative overflow-hidden rounded-lg">
//                         <Image
//                           src={photo.imageUrl || "/placeholder.jpg"}
//                           alt={photo.title}
//                           fill
//                           className="object-cover"
//                         />
//                       </div>
                      
//                     </div>
//                   </DialogContent>
//                 </Dialog>

//                 {/* Bouton Éditer */}
//                 <Dialog>
//                   <DialogTrigger asChild>
//                     <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
//                       <Pencil className="size-4" />
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent>
//                     <DialogHeader>
//                       <DialogTitle>Éditer la Photo</DialogTitle>
//                     </DialogHeader>
//                     <div className="space-y-4">
//                       <GallerieForm gallerie={photo} />
//                     </div>
//                   </DialogContent>
//                 </Dialog>

//                 {/* Bouton Supprimer */}
//                 <DeleteGallerieButton userId={photo.id!} /> 
//                 <Button><ShoppingCart /></Button>
//               </div>
//             </div>

           
//           </div>
//         ))}
//       </div>

//       {/* Message si aucune photo */}
//       {photos.length === 0 && (
//         <div className="text-center py-12">
//           <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
//             <Eye className="w-8 h-8 text-muted-foreground" />
//           </div>
//           <h3 className="text-lg font-semibold mb-2">Aucune photo</h3>
//           <p className="text-muted-foreground">Commencez par ajouter quelques photos à votre galerie.</p>
//         </div>
//       )}
//     </div>
//   );
// }

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Pencil, Eye, Trash2 } from "lucide-react"
import { getImages, deleteGallerie } from "@/lib/actions/galleries-action"
 import GallerieForm from "./galleries-form"
 import Image from "next/image"

export default async function GalleriesDisplay() {
  const galleries = await getImages()

  return (
    <div className="mt-8">
      {galleries.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Eye className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No images yet</h3>
          <p className="text-muted-foreground">Start by adding some pictures to your gallery.</p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            {galleries.length} image{galleries.length > 1 ? "s" : ""} in your gallery
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {galleries.map((gallery) => (
              <div
                key={gallery.id}
                className="group relative overflow-hidden rounded-lg border bg-card shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Image Container */}
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={gallery.imageUrl || "/placeholder.svg"}
                    alt={gallery.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Overlay avec actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    {/* Bouton Voir */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                          <Eye className="size-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>{gallery.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="aspect-video relative overflow-hidden rounded-lg">
                            <Image
                              src={gallery.imageUrl || "/placeholder.svg"}
                              alt={gallery.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                              Added on{" "}
                              {gallery.createdAt?.toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Created at{" "}
                              {gallery.createdAt?.toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Bouton Éditer */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                          <Pencil className="size-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Image</DialogTitle>
                        </DialogHeader>
                        <GallerieForm gallerie={gallery} />
                      </DialogContent>
                    </Dialog>

                    {/* Bouton Supprimer */}
                    <form
                      action={async () => {
                        "use server"
                        await deleteGallerie(gallery.id!)
                      }}
                    >
                      <Button size="sm" variant="destructive" className="h-8 w-8 p-0" type="submit">
                        <Trash2 className="size-4" />
                      </Button>
                    </form>
                  </div>
                </div>

                {/* Informations de l'image */}
                <div className="p-4">
                  <h3 className="font-semibold truncate mb-1 text-sm">{gallery.title}</h3>
                  <p className="text-xs text-muted-foreground">{gallery.createdAt?.toLocaleDateString("en-US")}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
