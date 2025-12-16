import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const Events = pgTable('events', {
	id: serial('id').primaryKey().notNull(),
	title: text('title').notNull().default(''),
	description: text('description').notNull().default(''),
	start: text('start_time').notNull(),
	end: text('end_time').notNull(),
	club: integer('club').references(() => Clubs.id),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export const Clubs = pgTable('clubs', {
	id: serial('id').primaryKey().notNull(),
	name: text('name').notNull().default(''),
	color: text('color')
});
