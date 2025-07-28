"use server";

import { eq, desc,and } from "drizzle-orm";
import { galleries, Galleries } from "../db/schema";
import { db } from "../db";
import { auth } from "../auth";
import { headers } from "next/headers";


async function getAuthenticatedUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

   if (!session?.user?.id) {
    throw new Error("Utilisateur non authentifié")
  }

  return session.user
}

export async function getAllImages(): Promise<Galleries[]> {
    try {
      const allGalleries = await db
        .select()
        .from(galleries)
        .orderBy(desc(galleries.createdAt));
  
      return allGalleries;
    } catch (error) {
      console.error("Erreur lors de la récupération de toutes les images:", error);
      throw new Error("Erreur serveur lors de la récupération des images.");
    }
  }

export async function getImages(): Promise<Galleries[]> {
    try {
        const user = await getAuthenticatedUser()
        const allGalleries = await db.select()
        .from(galleries)
        .where(eq(galleries.userId, user.id))
        .orderBy(desc(galleries.createdAt))
        ;
        return allGalleries;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function createImage(
    // todo:  Omit<Todos, "id" | "createdAt" | "updatedAt">
    gallerie:Pick<Galleries, "title"  | "id" | "imageUrl">
) {
    try {
        const user = await getAuthenticatedUser()
        await db.insert(galleries).values(
            {
                      
                   title: gallerie.title,
                   imageUrl:gallerie.imageUrl,
                    userId: user.id,
            }
        );
    } catch (error) {
        console.error(error);
        return { error: "Failed to create user" };
    }
}

export async function updateGallerie(
    // id:string,todo: Omit<Todos, "createdAt" | "updatedAt">
    id: string, todo: Pick<Galleries, "title" | "imageUrl">
) {
    try {
         const user = await getAuthenticatedUser()
        await db.update(galleries).set(todo)
        // .where(eq(todos.id, todos.id))
        .where(and(eq(galleries.id, id), eq(galleries.userId, user.id)))
        ;
    } catch (error) {
        console.error(error);
        return { error: "Failed to update user" };
    }
}

export async function deleteGallerie(id: string) {
    try {
        const user = await getAuthenticatedUser()
        await db.delete(galleries)
        .where(and(eq(galleries.id, id), eq(galleries.userId, user.id)))
        ;
    } catch (error) {
        console.error(error);
        return { error: "Failed to delete user" };
    }
}
