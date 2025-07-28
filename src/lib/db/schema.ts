import { pgTable, text, timestamp,
   integer, decimal, uuid,
   boolean, 
   pgEnum} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const sportActivities = pgTable("sport_activities", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id"), // ID de l'utilisateur Better Auth (Google/GitHub)
  type: text("type").notNull(),
  duration: integer("duration").notNull(), // en minutes
  distance: decimal("distance", { precision: 5, scale: 2 }).notNull(), // en km
  calories: integer("calories").notNull(),
  date: text("date").notNull(), // format YYYY-MM-DD
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

 export const todos = pgTable("todo", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  title: text("title").notNull(),
  createdAt:timestamp("created_at").defaultNow(),
  updatedAt:timestamp("updated_at").defaultNow(),
  userId: text("user_id").notNull(),
});


export const galleries = pgTable("gallery", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),

  title: text("title").notNull(),

  imageUrl: text("image_url").notNull(), // le lien vers l'image

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),

  userId: text("user_id").notNull(), // référence à l'utilisateur
});







export type SportActivity = typeof sportActivities.$inferSelect
export type NewSportActivity = typeof sportActivities.$inferInsert
export type Todos = typeof todos.$inferInsert
export type Galleries = typeof galleries.$inferInsert

