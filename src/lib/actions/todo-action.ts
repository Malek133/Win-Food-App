"use server";

import { eq, desc,and } from "drizzle-orm";
import { todos, Todos } from "../db/schema";
import { db } from "../db";
import { auth } from "../auth";
import { headers } from "next/headers";

// Fonction utilitaire pour obtenir l'utilisateur connecté
async function getAuthenticatedUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

   if (!session?.user?.id) {
    throw new Error("Utilisateur non authentifié")
  }

  return session.user
}

export async function getTodos(): Promise<Todos[]> {
    try {
        const user = await getAuthenticatedUser()
        const allTodos = await db.select()
        .from(todos)
        .where(eq(todos.userId, user.id))
        .orderBy(desc(todos.createdAt))
        ;
        return allTodos;
    } catch (error) {
        console.error(error);
        throw error
    }
}

export async function createTodo(
    // todo:  Omit<Todos, "id" | "createdAt" | "updatedAt">
    todo:Pick<Todos, "title"  | "id">
) {
    try {
        const user = await getAuthenticatedUser()
        await db.insert(todos).values(
            {
                      
                   title: todo.title,
                    userId: user.id,
            }
        );
    } catch (error) {
        console.error(error);
        return { error: "Failed to create user" };
    }
}

export async function updateTodo(
    // id:string,todo: Omit<Todos, "createdAt" | "updatedAt">
    id: string, todo: Pick<Todos, "title">
) {
    try {
         const user = await getAuthenticatedUser()
        await db.update(todos).set(todo)
        // .where(eq(todos.id, todos.id))
        .where(and(eq(todos.id, id), eq(todos.userId, user.id)))
        ;
    } catch (error) {
        console.error(error);
        return { error: "Failed to update user" };
    }
}

export async function deleteTodo(id: string) {
    try {
        const user = await getAuthenticatedUser()
        await db.delete(todos)
        // .where(eq(todos.id, id))
        .where(and(eq(todos.id, id), eq(todos.userId, user.id)))
        ;
    } catch (error) {
        console.error(error);
        return { error: "Failed to delete user" };
    }
}