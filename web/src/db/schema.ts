import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  jsonb,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const users = pgTable('user', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const sessions = pgTable('session', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
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
  id: serial('id').primaryKey(),
  userId: integer('user_id')
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
  id: serial('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const profiles = pgTable('profile', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
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
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const recipes = pgTable('recipe', {
  id: serial('id').primaryKey(),
  externalId: varchar('external_id', { length: 100 }).unique(),
  name: varchar('name', { length: 255 }).notNull(),
  nameNl: varchar('name_nl', { length: 255 }),
  category: varchar('category', { length: 100 }).notNull(),
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
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    recipeId: integer('recipe_id')
      .notNull()
      .references(() => recipes.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    unique: uniqueIndex('fav_unique').on(table.userId, table.recipeId),
  })
);

export const shoppingListItems = pgTable('shopping_list_item', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  quantity: varchar('quantity', { length: 100 }),
  checked: boolean('checked').default(false).notNull(),
});

export const userHistory = pgTable('user_history', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  recipeId: integer('recipe_id')
    .notNull()
    .references(() => recipes.id, { onDelete: 'cascade' }),
  viewedAt: timestamp('viewed_at').defaultNow().notNull(),
});