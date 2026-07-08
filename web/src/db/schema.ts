import { pgTable, serial, varchar, integer, boolean, jsonb, timestamp, text, uniqueIndex, foreignKey } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').unique().notNull().references(() => users.id, { onDelete: 'cascade' }),
  age: integer('age'),
  gender: varchar('gender', { length: 50 }),
  height: integer('height'),
  weight: integer('weight'),
  conditions: jsonb('conditions').$type<string[]>(),
  diets: jsonb('diets').$type<string[]>(),
  allergies: jsonb('allergies').$type<string[]>(),
  likes: jsonb('likes').$type<string[]>(),
  dislikes: jsonb('dislikes').$type<string[]>(),
});

export const recipes = pgTable('recipes', {
  id: serial('id').primaryKey(),
  externalId: varchar('external_id', { length: 50 }).unique(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  area: varchar('area', { length: 100 }),
  instructions: text('instructions').notNull(),
  imageUrl: varchar('image_url', { length: 500 }).notNull(),
  calories: integer('calories'),
  ingredients: jsonb('ingredients').$type<string[]>().notNull(),
});

export const favorites = pgTable('favorites', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  recipeId: integer('recipe_id').notNull().references(() => recipes.id, { onDelete: 'cascade' }),
}, (table) => ({
  unique: uniqueIndex('favorite_unique').on(table.userId, table.recipeId),
}));

export const shoppingListItems = pgTable('shopping_list_items', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  quantity: varchar('quantity', { length: 100 }),
  checked: boolean('checked').default(false),
});

export const contacts = pgTable('contacts', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});