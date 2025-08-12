"use client";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

const formSchema = z.object({
  title: z.string().min(2).max(50),
  urlmaps:z.string().min(5).max(500),
   imageUrl: z.string().url({ message: "URL invalide" }),
   videoUrl: z.string().url({ message: "URL vidéo invalide" }),
   dispo:z.boolean()

});

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
//  import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Galleries } from "@/lib/db/schema";
import { createImage, updateGallerie } from "@/lib/actions/galleries-action";
  import ImageUploader from "./ImageUploader";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import VideoUploader from "./VideoUploader";


interface GallerieFormProps {
  gallerie?: Galleries;
}

export default function GallerieForm({ gallerie }: GallerieFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: gallerie?.title || "",
      urlmaps: gallerie?.urlmaps || "",
      imageUrl: gallerie?.imageUrl || "",
      videoUrl: gallerie?.videoUrl || "", // ajouté ici
      dispo:gallerie?.dispo || false
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const userData = {
        ...values,
      };

      if (gallerie) {
         await updateGallerie(gallerie.id!, userData);
      
      } else {
        
         await createImage(userData);
      }

      form.reset();

      //  toast.success(`User ${todo ? "updated" : "added"} successfully`);
      router.refresh();
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    //   toast.error(`Failed to ${todo ? "update" : "add"} user`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Bruce Wayne" {...field}
                 />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

<FormField
          control={form.control}
          name="urlmaps"
          render={({ field }) => (
            <FormItem>
              <FormLabel>geo-localisation</FormLabel>
              <FormControl>
                <Input placeholder="Bruce Wayne" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

<FormField
          control={form.control}
          name="dispo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>order</FormLabel>
              <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} name={field.name} ref={field.ref} />
              {/* <Checkbox id="terms" {...field} /> */}
              {/* <Label htmlFor="terms">Accept terms and conditions</Label> */}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Url</FormLabel>
              <FormControl>
                <ImageUploader
          onChange={field.onChange}
          value={field.value}
        />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> 



         {/* <ImageUploader /> */}
         <FormField
  control={form.control}
  name="videoUrl"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Vidéo</FormLabel>
      <FormControl>
        <VideoUploader
          value={field.value} // valeur actuelle du champ vidéo
          onChange={(url) => field.onChange(url)} // quand une vidéo est uploadée
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

{/* 
         <FormField
  control={form.control}
  name="videoUrl"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Vidéo</FormLabel>
      <FormControl>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              // ici tu peux uploader sur Cloudinary et récupérer l’URL
              field.onChange(e.target.files[0]);
            }
          }}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/> */}



        <Button disabled={isLoading} type="submit">
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            `${gallerie ? "Update" : "Add"} Image`
          )}
        </Button>
      </form>
    </Form>
  );
}

