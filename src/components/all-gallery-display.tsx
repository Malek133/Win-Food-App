import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Pencil, Eye, Trash2 } from "lucide-react"
 import GallerieForm from "./galleries-form"
 import Image from "next/image"
import { getAllImages } from "@/lib/actions/galleries-action"

export default async function AllGalleriesDisplay() {
  const galleries = await getAllImages()

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
