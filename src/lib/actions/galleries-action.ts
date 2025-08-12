// "use server";

// import { eq, desc,and } from "drizzle-orm";
// import { galleries, Galleries, user } from "../db/schema";
// import { db } from "../db";
// import { auth } from "../auth";
// import { headers } from "next/headers";


// async function getAuthenticatedUser() {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   })

//    if (!session?.user?.id) {
//     throw new Error("Utilisateur non authentifié")
//   }

//   return session.user
// }

// export async function getAllImages(): Promise<
// {
//     id: string;
//     title: string;
//     urlmaps:string;
//     imageUrl: string;
//     createdAt: Date | null;
//     updatedAt: Date | null;
//     userId: string;
//     dispo:boolean;
//     userName: string | null; // le nom de l'utilisateur joint
//   }[]> {
//     try {
//       const allGalleries = await db
//         .select({
//             id: galleries.id,
//             title: galleries.title,
//             urlmaps:galleries.urlmaps,
//             imageUrl: galleries.imageUrl,
//             createdAt: galleries.createdAt,
//             updatedAt: galleries.updatedAt,
//             dispo:galleries.dispo,
//             userId: galleries.userId,
//             userName: user.name, // 👈 jointure avec nom de l'utilisateur
//           })
//         .from(galleries)
//         .innerJoin(user, eq(galleries.userId, user.id)) // 👈 jointure nécessaire
//         .orderBy(desc(galleries.createdAt));
  
//       return allGalleries;
//     } catch (error) {
//       console.error("Erreur lors de la récupération de toutes les images:", error);
//       throw new Error("Erreur serveur lors de la récupération des images.");
//     }
//   }

// export async function getImages(): Promise<Galleries[]> {
//     try {
//         const user = await getAuthenticatedUser()
//         const allGalleries = await db.select()
//         .from(galleries)
//         .where(eq(galleries.userId, user.id))
//         .orderBy(desc(galleries.createdAt))
//         ;
//         return allGalleries;
//     } catch (error) {
//         console.error(error);
//         throw error
//     }
// }

// export async function createImage(
//     // todo:  Omit<Todos, "id" | "createdAt" | "updatedAt">
//     gallerie:Pick<Galleries, "title"  | "id" | "imageUrl" | "urlmaps" | "dispo">
// ) {
//     try {
//         const user = await getAuthenticatedUser()
//         await db.insert(galleries).values(
//             {
                      
//                    title: gallerie.title,
//                    urlmaps: gallerie.urlmaps,
//                    imageUrl:gallerie.imageUrl,
//                    dispo:gallerie.dispo,
//                     userId: user.id,
//             }
//         );
//     } catch (error) {
//         console.error(error);
//         return { error: "Failed to create user" };
//     }
// }

// export async function updateGallerie(
//     // id:string,todo: Omit<Todos, "createdAt" | "updatedAt">
//     id: string, image: Pick<Galleries, "title" | "imageUrl">
// ) {
//     try {
//          const user = await getAuthenticatedUser()
//         await db.update(galleries).set(image)
//         // .where(eq(todos.id, todos.id))
//         .where(and(eq(galleries.id, id), eq(galleries.userId, user.id)))
//         ;
//     } catch (error) {
//         console.error(error);
//         return { error: "Failed to update user" };
//     }
// }

// export async function deleteGallerie(id: string) {
//     try {
//         const user = await getAuthenticatedUser()
//         await db.delete(galleries)
//         .where(and(eq(galleries.id, id), eq(galleries.userId, user.id)))
//         ;
//     } catch (error) {
//         console.error(error);
//         return { error: "Failed to delete user" };
//     }
// }


"use server";

import { eq, desc, and } from "drizzle-orm";
import { galleries, Galleries, user } from "../db/schema";
import { db } from "../db";
import { auth } from "../auth";
import { headers } from "next/headers";

async function getAuthenticatedUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Utilisateur non authentifié");
  }

  return session.user;
}

// 📌 Récupérer toutes les galeries avec la vidéo
export async function getAllImages(): Promise<
  {
    id: string;
    title: string;
    urlmaps: string;
    imageUrl: string;
    videoUrl: string | null; // <-- ajouté ici
    createdAt: Date | null;
    updatedAt: Date | null;
    userId: string;
    dispo: boolean;
    userName: string | null; // nom de l'utilisateur joint
  }[]
> {
  try {
    const allGalleries = await db
      .select({
        id: galleries.id,
        title: galleries.title,
        urlmaps: galleries.urlmaps,
        imageUrl: galleries.imageUrl,
        videoUrl: galleries.videoUrl, // <-- ajouté ici
        createdAt: galleries.createdAt,
        updatedAt: galleries.updatedAt,
        dispo: galleries.dispo,
        userId: galleries.userId,
        userName: user.name,
      })
      .from(galleries)
      .innerJoin(user, eq(galleries.userId, user.id))
      .orderBy(desc(galleries.createdAt));

    return allGalleries;
  } catch (error) {
    console.error("Erreur lors de la récupération de toutes les images:", error);
    throw new Error("Erreur serveur lors de la récupération des images.");
  }
}

// 📌 Récupérer seulement les galeries de l'utilisateur connecté
export async function getImages(): Promise<Galleries[]> {
  try {
    const user = await getAuthenticatedUser();
    const allGalleries = await db
      .select()
      .from(galleries)
      .where(eq(galleries.userId, user.id))
      .orderBy(desc(galleries.createdAt));
    return allGalleries;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// 📌 Création d'une galerie avec vidéo
export async function createImage(
  gallerie: Pick<Galleries, "title" | "id" | "imageUrl" | "videoUrl" | "urlmaps" | "dispo">
) {
  try {
    const user = await getAuthenticatedUser();
    await db.insert(galleries).values({
      title: gallerie.title,
      urlmaps: gallerie.urlmaps,
      imageUrl: gallerie.imageUrl,
      videoUrl: gallerie.videoUrl, // <-- ajouté ici
      dispo: gallerie.dispo,
      userId: user.id,
    });
  } catch (error) {
    console.error(error);
    return { error: "Failed to create gallerie" };
  }
}

// 📌 Mise à jour d'une galerie avec vidéo
export async function updateGallerie(
  id: string,
  gallerie: Pick<Galleries, "title" | "imageUrl" | "videoUrl" | "urlmaps" | "dispo">
) {
  try {
    const user = await getAuthenticatedUser();
    await db
      .update(galleries)
      .set({
        title: gallerie.title,
        urlmaps: gallerie.urlmaps,
        imageUrl: gallerie.imageUrl,
        videoUrl: gallerie.videoUrl, // <-- ajouté ici
        dispo: gallerie.dispo,
      })
      .where(and(eq(galleries.id, id), eq(galleries.userId, user.id)));
  } catch (error) {
    console.error(error);
    return { error: "Failed to update gallerie" };
  }
}

// 📌 Suppression
export async function deleteGallerie(id: string) {
  try {
    const user = await getAuthenticatedUser();
    await db
      .delete(galleries)
      .where(and(eq(galleries.id, id), eq(galleries.userId, user.id)));
  } catch (error) {
    console.error(error);
    return { error: "Failed to delete gallerie" };
  }
}
