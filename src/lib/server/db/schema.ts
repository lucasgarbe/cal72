import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	age: integer('age')
});

export const Events = sqliteTable("events", {
	id: integer("id").primaryKey().unique().notNull(),
	title: text("title").notNull().default(""),
	description: text("description").notNull().default(""),
	start: text("start_time").notNull(),
	end: text("end_time").notNull(),
	createdAt: integer("created_at").notNull(),
});

