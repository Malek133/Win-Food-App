"use server"

import { db } from "@/lib/db"
import { sportActivities, type SportActivity, type NewSportActivity } from "@/lib/db/schema"
import { eq, desc, and } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

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

// Récupérer toutes les activités sportives de l'utilisateur connecté uniquement
export async function getSportActivities(): Promise<SportActivity[]> {
  try {
    const user = await getAuthenticatedUser()

    const activities = await db
      .select()
      .from(sportActivities)
      .where(eq(sportActivities.userId, user.id))
      .orderBy(desc(sportActivities.date), desc(sportActivities.createdAt))

    return activities
  } catch (error) {
    console.error("Erreur lors de la récupération des activités:", error)
    if (error instanceof Error && error.message === "Utilisateur non authentifié") {
      throw error
    }
    throw new Error("Impossible de récupérer les activités")
  }
}

// Ajouter une nouvelle activité sportive pour l'utilisateur connecté uniquement
export async function addSportActivity(data: Omit<NewSportActivity, "id" | "userId" | "createdAt" | "updatedAt">) {
  try {
    const user = await getAuthenticatedUser()

    const newActivity = await db
      .insert(sportActivities)
      .values({
        userId: user.id, // Associer l'activité à l'utilisateur connecté
        type: data.type,
        duration: data.duration,
        distance: data.distance,
        calories: data.calories,
        date: data.date,
      })
      .returning()

    revalidatePath("/")
    return { success: true, data: newActivity[0] }
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'activité:", error)

    if (error instanceof Error && error.message === "Utilisateur non authentifié") {
      return { success: false, error: "Vous devez être connecté pour ajouter une activité", requireAuth: true }
    }

    return { success: false, error: "Impossible d'ajouter l'activité" }
  }
}

// Modifier une activité sportive existante (seulement si elle appartient à l'utilisateur connecté)
export async function updateSportActivity(
  id: string,
  data: Partial<Omit<NewSportActivity, "id" | "userId" | "createdAt" | "updatedAt">>,
) {
  try {
    const user = await getAuthenticatedUser()

    // Double vérification : l'activité doit appartenir à l'utilisateur connecté
    const existingActivity = await db
      .select()
      .from(sportActivities)
      .where(and(eq(sportActivities.id, id), eq(sportActivities.userId, user.id)))
      .limit(1)

    if (existingActivity.length === 0) {
      return { success: false, error: "Activité non trouvée ou accès non autorisé" }
    }

    const updatedActivity = await db
      .update(sportActivities)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(sportActivities.id, id), eq(sportActivities.userId, user.id)))
      .returning()

    revalidatePath("/")
    return { success: true, data: updatedActivity[0] }
  } catch (error) {
    console.error("Erreur lors de la modification de l'activité:", error)

    if (error instanceof Error && error.message === "Utilisateur non authentifié") {
      return { success: false, error: "Vous devez être connecté pour modifier une activité", requireAuth: true }
    }

    return { success: false, error: "Impossible de modifier l'activité" }
  }
}

// Supprimer une activité sportive (seulement si elle appartient à l'utilisateur connecté)
export async function deleteSportActivity(id: string) {
  try {
    const user = await getAuthenticatedUser()

    // Vérifier que l'activité appartient bien à l'utilisateur avant suppression
    const activityToDelete = await db
      .select()
      .from(sportActivities)
      .where(and(eq(sportActivities.id, id), eq(sportActivities.userId, user.id)))
      .limit(1)

    if (activityToDelete.length === 0) {
      return { success: false, error: "Activité non trouvée ou accès non autorisé" }
    }

    const deletedActivity = await db
      .delete(sportActivities)
      .where(and(eq(sportActivities.id, id), eq(sportActivities.userId, user.id)))
      .returning()

    revalidatePath("/")
    return { success: true, data: deletedActivity[0] }
  } catch (error) {
    console.error("Erreur lors de la suppression de l'activité:", error)

    if (error instanceof Error && error.message === "Utilisateur non authentifié") {
      return { success: false, error: "Vous devez être connecté pour supprimer une activité", requireAuth: true }
    }

    return { success: false, error: "Impossible de supprimer l'activité" }
  }
}

// Récupérer une activité par ID (seulement si elle appartient à l'utilisateur connecté)
export async function getSportActivityById(id: string): Promise<SportActivity | null> {
  try {
    const user = await getAuthenticatedUser()

    const activity = await db
      .select()
      .from(sportActivities)
      .where(and(eq(sportActivities.id, id), eq(sportActivities.userId, user.id)))
      .limit(1)

    return activity[0] || null
  } catch (error) {
    console.error("Erreur lors de la récupération de l'activité:", error)
    if (error instanceof Error && error.message === "Utilisateur non authentifié") {
      throw error
    }
    throw new Error("Impossible de récupérer l'activité")
  }
}

// Obtenir les statistiques personnelles de l'utilisateur connecté uniquement
export async function getSportStatistics() {
  try {
    const user = await getAuthenticatedUser()

    // Récupérer uniquement les activités de l'utilisateur connecté
    const activities = await db
      .select()
      .from(sportActivities)
      .where(eq(sportActivities.userId, user.id))
      .orderBy(desc(sportActivities.date), desc(sportActivities.createdAt))

    const totalCalories = activities.reduce((sum, activity) => sum + activity.calories, 0)
    const totalDistance = activities.reduce((sum, activity) => sum + Number.parseFloat(activity.distance), 0)
    const totalDuration = activities.reduce((sum, activity) => sum + activity.duration, 0)
    const totalActivities = activities.length

    return {
      totalCalories,
      totalDistance,
      totalDuration,
      totalActivities,
      activities,
      user, // Inclure les infos utilisateur
    }
  } catch (error) {
    console.error("Erreur lors du calcul des statistiques:", error)

    if (error instanceof Error && error.message === "Utilisateur non authentifié") {
      throw new Error("Vous devez être connecté pour voir vos statistiques")
    }

    throw new Error("Impossible de calculer les statistiques")
  }
}

// Obtenir les informations de l'utilisateur connecté
export async function getCurrentUser() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return { success: false, user: null, authenticated: false }
    }

    return { success: true, user: session.user, authenticated: true }
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error)
    return { success: false, user: null, authenticated: false }
  }
}

// Vérifier si l'utilisateur est authentifié (utilitaire)
export async function checkAuthentication() {
  try {
    const user = await getAuthenticatedUser()
    return { authenticated: true, user }
  } catch (error) {
    return { authenticated: false, user: null }
  }
}


export async function getSportAllActivities(): Promise<SportActivity[]> {
    try {
      
  
      const activities = await db
        .select()
        .from(sportActivities)
        .orderBy(desc(sportActivities.date), desc(sportActivities.createdAt))
  
      return activities
    } catch (error) {
      console.error("Erreur lors de la récupération des activités:", error)
      if (error instanceof Error && error.message === "Utilisateur non authentifié") {
        throw error
      }
      throw new Error("Impossible de récupérer les activités")
    }
  }
