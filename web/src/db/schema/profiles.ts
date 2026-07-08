import { pgTable, serial, integer, varchar, jsonb } from 'drizzle-orm/pg-core';
import { users } from './users';

export const profiles = pgTable('profiles', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).unique(),
    age: integer('age'),
    gender: varchar('gender', { length: 50 }),
    height: integer('height'),
    weight: integer('weight'),
    conditions: jsonb('conditions').default('[]'),
    diets: jsonb('diets').default('[]'),
    allergies: jsonb('allergies').default('[]'),
    likes: jsonb('likes').default('[]'),
    dislikes: jsonb('dislikes').default('[]'),
});