import { pgTable, serial, varchar, text, integer, jsonb } from 'drizzle-orm/pg-core';

export const recipes = pgTable('recipes', {
    id: serial('id').primaryKey(),
    externalId: varchar('external_id', { length: 50 }).unique(),
    name: varchar('name', { length: 255 }).notNull(),
    category: varchar('category', { length: 100 }).notNull(),
    area: varchar('area', { length: 100 }),
    instructions: text('instructions').notNull(),
    imageUrl: varchar('image_url', { length: 500 }),
    calories: integer('calories'),
    ingredients: jsonb('ingredients').notNull().default('[]'),
});