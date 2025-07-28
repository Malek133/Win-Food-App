

"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, Plus, Save, X, User, Shield, LogIn, BarChart3,Pencil } from "lucide-react"
import { toast } from "sonner"
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  addSportActivity,
  updateSportActivity,
  deleteSportActivity,
  getSportStatistics,
  getCurrentUser,
} from "@/lib/actions/traker-action"
import type { SportActivity } from "@/lib/db/schema"
import type { Statistics, UserType, FormData } from "@/types"

  

export default function Component() {
  const [activities, setActivities] = useState<SportActivity[]>([])
  const [statistics, setStatistics] = useState<Statistics>({
    totalCalories: 0,
    totalDistance: 0,
    totalDuration: 0,
    totalActivities: 0,
  })
  const [user, setUser] = useState<UserType | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showCharts, setShowCharts] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    type: "",
    duration: "",
    distance: "",
    calories: "",
    date: "",
  })

  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const sportTypes = ["Course", "Vélo", "Natation", "Musculation", "Yoga", "Football", "Basketball", "Tennis"]

  // Configuration des couleurs pour les graphiques


const pieColors: Record<string, string> = {
    Course: "#FF1744", // Rouge vif
    Vélo: "#D32F2F", // Rouge foncé
    Natation: "#F44336", // Rouge standard
    Musculation: "#E53935", // Rouge intense
    Yoga: "#EF5350", // Rouge clair
    Football: "#FF5252", // Rouge-rose
    Basketball: "#FF6B6B", // Rouge pastel
    Tennis: "#C62828", // Rouge bordeaux
  }

  // Configuration pour les graphiques
  const chartConfig = {
    calories: {
      label: "Calories",
      color: "#FF5733",
    },
    duration: {
      label: "Durée",
      color: "#3357FF",
    },
    distance: {
      label: "Distance",
      color: "#33FF57",
    },
    activities: {
      label: "Activités",
      color: "#8333FF",
    },
  }

  // Données pour les graphiques
  const chartData = useMemo(() => {
    if (!activities.length) return { byType: [], byMonth: [], pieData: [] }

    // Données par type d'activité
    const byType = activities.reduce(
      (acc, activity) => {
        const existing = acc.find((item) => item.type === activity.type)
        if (existing) {
          existing.calories += activity.calories
          existing.duration += activity.duration
          existing.distance += Number.parseFloat(activity.distance)
          existing.count += 1
        } else {
          acc.push({
            type: activity.type,
            calories: activity.calories,
            duration: activity.duration,
            distance: Number.parseFloat(activity.distance),
            count: 1,
          })
        }
        return acc
      },
      [] as Array<{ type: string; calories: number; duration: number; distance: number; count: number }>,
    )

    // Données par mois
    const byMonth = activities
      .reduce(
        (acc, activity) => {
          const date = new Date(activity.date)
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
          const monthName = date.toLocaleDateString("fr-FR", { year: "numeric", month: "short" })

          const existing = acc.find((item) => item.month === monthKey)
          if (existing) {
            existing.calories += activity.calories
            existing.activities += 1
          } else {
            acc.push({
              month: monthKey,
              monthName,
              calories: activity.calories,
              activities: 1,
            })
          }
          return acc
        },
        [] as Array<{ month: string; monthName: string; calories: number; activities: number }>,
      )
      .sort((a, b) => a.month.localeCompare(b.month))

    // Données pour le graphique en secteurs
    const pieData = byType.map((item, index) => ({
      name: item.type,
      value: item.count,
      fill: pieColors[item.type] || "#cccccc", // ✅ OK, fallback color
    //   fill: pieColors[index % pieColors.length],
    }))

    return { byType, byMonth, pieData }
  }, [activities])

  // Charger les données au montage du composant
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)

      // Vérifier l'authentification avec Better Auth
      const userResult = await getCurrentUser()

      if (!userResult.success || !userResult.authenticated || !userResult.user) {
        setIsAuthenticated(false)
        setUser(null)
        return
      }

      setIsAuthenticated(true)
      setUser(userResult.user)

      // Charger les statistiques personnelles de l'utilisateur
      const stats = await getSportStatistics()
      setActivities(stats.activities)
      setStatistics({
        totalCalories: stats.totalCalories,
        totalDistance: stats.totalDistance,
        totalDuration: stats.totalDuration,
        totalActivities: stats.totalActivities,
      })
    } catch (error) {
      console.error("Erreur lors du chargement:", error)
      setIsAuthenticated(false)
      setUser(null)

      if (error instanceof Error && error.message.includes("connecté")) {
        toast("Veuillez vous connecter pour accéder à votre tracker personnel")
      } else {
        toast("Impossible de charger vos données")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      toast("Vous devez être connecté pour ajouter une activité")
      return
    }

    if (!formData.type || !formData.duration || !formData.distance || !formData.calories || !formData.date) {
      toast("Veuillez remplir tous les champs")
      return
    }

    setSubmitting(true)

    try {
      const activityData = {
        type: formData.type,
        duration: Number.parseInt(formData.duration),
        distance: formData.distance,
        calories: Number.parseInt(formData.calories),
        date: formData.date,
      }

      let result

      if (editingId) {
        result = await updateSportActivity(editingId, activityData)
      } else {
        result = await addSportActivity(activityData)
      }

      if (result.success) {
        toast(editingId ? "Activité modifiée avec succès" : "Activité ajoutée avec succès")
        resetForm()
        await loadData() // Recharger les données personnelles
      } else {
        if (result.requireAuth) {
          setIsAuthenticated(false)
          setUser(null)
        }
        toast(result.error || "Une erreur est survenue")
      }
    } catch (error) {
      toast("Une erreur inattendue est survenue")
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      type: "",
      duration: "",
      distance: "",
      calories: "",
      date: "",
    })
    setShowForm(false)
    setEditingId(null)
  }

  const handleEdit = (activity: SportActivity) => {
    // Vérification supplémentaire côté client
    if (!isAuthenticated || activity.userId !== user?.id) {
      toast("Vous ne pouvez modifier que vos propres activités")
      return
    }

    setFormData({
      type: activity.type,
      duration: activity.duration.toString(),
      distance: activity.distance,
      calories: activity.calories.toString(),
      date: activity.date,
    })
    setEditingId(activity.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!isAuthenticated) {
      toast("Vous devez être connecté pour supprimer une activité")
      return
    }

    // Vérification supplémentaire côté client
    const activity = activities.find((a) => a.id === id)
    if (activity && activity.userId !== user?.id) {
      toast("Vous ne pouvez supprimer que vos propres activités")
      return
    }

    // if (!confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) {
    //   return
    // }

    try {
      const result = await deleteSportActivity(id)

      if (result.success) {
        toast("Activité supprimée avec succès")
           await loadData() // Recharger les données personnelles
      } else {
        if (result.requireAuth) {
          setIsAuthenticated(false)
          setUser(null)
        }
        toast(result.error || "Impossible de supprimer l'activité")
      }
    } catch (error) {
      toast("Une erreur inattendue est survenue")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement de votre tracker personnel...</div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle>Accès protégé</CardTitle>
            <CardDescription>
              Vous devez être connecté avec Google ou GitHub pour accéder à votre tracker sportif personnel.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Alert>
              <LogIn className="h-4 w-4" />
              <AlertDescription>
                Chaque utilisateur a son propre tracker privé et sécurisé. Vos données ne sont visibles que par vous.
              </AlertDescription>
            </Alert>

            <Button
              className="mt-4"
              onClick={() =>
                // window.location.reload()
                (window.location.href = "/sign-in")
              }
            >
              <LogIn className="h-4 w-4 mr-2" />
              Se connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mon Tracker Sportif</h1>
          <p className="text-muted-foreground">Votre espace personnel pour suivre vos activités sportives</p>
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>
              Connecté en tant que <strong>{user.name || user.email}</strong>
            </span>
            <Shield className="h-4 w-4 text-green-600" />
            <span className="text-green-600">Données protégées</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowCharts(!showCharts)} className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {showCharts ? "Masquer" : "Voir"} les graphiques
          </Button>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle activité
          </Button>
        </div>
      </div>

      {/* Statistiques personnelles */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Mes Activités</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalActivities}</div>
            <p className="text-xs text-muted-foreground">activités enregistrées</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Mes Calories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalCalories}</div>
            <p className="text-xs text-muted-foreground">calories brûlées</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ma Distance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalDistance.toFixed(1)} km</div>
            <p className="text-xs text-muted-foreground">distance parcourue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Mon Temps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(statistics.totalDuration / 60)}h {statistics.totalDuration % 60}min
            </div>
            <p className="text-xs text-muted-foreground">temps d'exercice</p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      {showCharts && activities.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Graphique en barres - Calories par type d'activité */}
          <Card>
            <CardHeader>
              <CardTitle>Calories par type d'activité</CardTitle>
              <CardDescription>Total des calories brûlées par sport</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <BarChart data={chartData.byType}>
                  <XAxis dataKey="type" tickLine={false} axisLine={false} angle={-45} textAnchor="end" height={80} />
                  <YAxis hide />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value, name) => [`${value} cal`, "Calories"]}
                  />
                  <Bar dataKey="calories" fill="var(--color-calories)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Graphique linéaire - Évolution mensuelle */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution mensuelle</CardTitle>
              <CardDescription>Calories brûlées par mois</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <LineChart data={chartData.byMonth}>
                  <XAxis dataKey="monthName" tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value, name) => [`${value} cal`, "Calories"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="calories"
                    stroke="var(--color-calories)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-calories)" }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Graphique en secteurs - Répartition des activités */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition des activités</CardTitle>
              <CardDescription>Nombre d'activités par type de sport</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <PieChart>
                  <Pie
                    data={chartData.pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {chartData.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value, name) => [`${value} activité${(value as number) > 1 ? "s" : ""}`, name]}
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Graphique en barres - Durée par type d'activité */}
          <Card>
            <CardHeader>
              <CardTitle>Temps d'exercice par sport</CardTitle>
              <CardDescription>Durée totale en minutes par type d'activité</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <BarChart data={chartData.byType}>
                  <XAxis dataKey="type" tickLine={false} axisLine={false} angle={-45} textAnchor="end" height={80} />
                  <YAxis hide />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value, name) => [`${value} min`, "Durée"]}
                  />
                  <Bar dataKey="duration" fill="var(--color-duration)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {showCharts && activities.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Ajoutez des activités pour voir vos graphiques de progression</p>
          </CardContent>
        </Card>
      )}

      {/* Formulaire */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Modifier mon activité" : "Nouvelle activité"}</CardTitle>
            <CardDescription>
              {editingId ? "Modifiez les détails de votre activité" : "Ajoutez une nouvelle activité à votre tracker"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type d'activité</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: string) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un sport" />
                    </SelectTrigger>
                    <SelectContent>
                      {sportTypes.map((sport) => (
                        <SelectItem key={sport} value={sport}>
                          {sport}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Durée (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="45"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distance">Distance (km)</Label>
                  <Input
                    id="distance"
                    type="number"
                    step="0.1"
                    placeholder="5.2"
                    value={formData.distance}
                    onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="calories">Calories brûlées</Label>
                  <Input
                    id="calories"
                    type="number"
                    placeholder="300"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={submitting} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {submitting ? "Enregistrement..." : editingId ? "Modifier" : "Ajouter"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} className="flex items-center gap-2">
                  <X className="h-4 w-4" />
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tableau des résultats personnels */}
      <Card>
        <CardHeader>
          <CardTitle>Mon historique d'activités</CardTitle>
          <CardDescription>Toutes vos activités sportives personnelles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activité</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>Calories</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Aucune activité enregistrée dans votre tracker personnel
                    </TableCell>
                  </TableRow>
                ) : (
                  activities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.type}</TableCell>
                      <TableCell>{new Date(activity.date).toLocaleDateString("fr-FR")}</TableCell>
                      <TableCell>{activity.duration} min</TableCell>
                      <TableCell>{activity.distance} km</TableCell>
                      <TableCell>{activity.calories} cal</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(activity)}
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          
                            <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(activity.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                             <Trash2 className="h-4 w-4" /> 
                             
                            </Button>  



                          
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

