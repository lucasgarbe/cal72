import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const Events = sqliteTable("events", {
	id: integer("id").primaryKey().unique().notNull(),
	title: text("title").notNull().default(""),
	description: text("description").notNull().default(""),
	start: text("start_time").notNull(),
	end: text("end_time").notNull(),
	club: integer("club").references(() => Clubs.id),
	createdAt: integer("created_at").notNull(),
});

export const Clubs = sqliteTable("clubs", {
	id: integer("id").primaryKey().unique().notNull(),
	name: text("name").notNull().default(""),
	color: text("color"),
});

