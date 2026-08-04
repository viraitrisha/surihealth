import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  jsonb,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const users = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  role: text('role').notNull().default('user'),
  blocked: boolean('blocked').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const sessions = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const accounts = pgTable('account', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  idToken: text('id_token'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const verifications = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const profiles = pgTable('profile', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  age: integer('age'),
  gender: varchar('gender', { length: 20 }),
  height: integer('height'),
  weight: integer('weight'),
  conditions: jsonb('conditions').$type<string[]>().default([]),
  diets: jsonb('diets').$type<string[]>().default([]),
  allergies: jsonb('allergies').$type<string[]>().default([]),
  likes: jsonb('likes').$type<string[]>().default([]),
  dislikes: jsonb('dislikes').$type<string[]>().default([]),
});

export const contacts = pgTable('contact', {
  id: text('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const recipes = pgTable('recipe', {
  id: text('id').primaryKey(),
  externalId: varchar('external_id', { length: 100 }).unique(),
  name: varchar('name', { length: 255 }).notNull(),
  nameNl: varchar('name_nl', { length: 255 }),
  category: varchar('category', { length: 100 }).notNull(),
  mealTypes: jsonb('meal_types').$type<string[]>().default([]).notNull(),
  isTopPick: boolean('is_top_pick').default(false).notNull(),
  area: varchar('area', { length: 100 }),
  instructions: text('instructions').notNull(),
  instructionsNl: text('instructions_nl'),
  imageUrl: varchar('image_url', { length: 500 }).notNull(),
  calories: integer('calories'),
  ingredients: jsonb('ingredients').$type<string[]>().notNull(),
  ingredientsNl: jsonb('ingredients_nl').$type<string[]>(),
});


export const favorites = pgTable(
  'favorite',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    recipeId: text('recipe_id')
      .notNull()
      .references(() => recipes.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    userRecipeUnique: uniqueIndex('user_recipe_unique').on(
      table.userId,
      table.recipeId
    ),
  })
);

export const shoppingListItems = pgTable('shopping_list_item', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  quantity: varchar('quantity', { length: 100 }),
  checked: boolean('checked').default(false).notNull(),
});

export const userHistory = pgTable('user_history', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  recipeId: text('recipe_id')
    .notNull()
    .references(() => recipes.id, { onDelete: 'cascade' }),
  viewedAt: timestamp('viewed_at').defaultNow().notNull(),
});