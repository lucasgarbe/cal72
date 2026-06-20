import { db } from './index';
import { Clubs, Events } from './schema';
import { and, desc, eq, gte, lte, lt, isNull, sql } from 'drizzle-orm';

type CreateEvent = typeof Events.$inferInsert;
type UpdateEvent = {
	id: string;
	title: string;
	description: string;
	start: string;
	end: string;
	club: number | null;
};
type CreateClub = typeof Clubs.$inferInsert;
type UpdateClub = { id: string; name: string; color: string | null };

const eventSelect = {
	id: Events.id,
	title: Events.title,
	description: Events.description,
	start: Events.start,
	end: Events.end,
	club: {
		id: Clubs.id,
		name: Clubs.name,
		color: Clubs.color
	},
	createdAt: Events.createdAt,
	updatedAt: Events.updatedAt,
	sequence: Events.sequence,
	deletedAt: Events.deletedAt
};

export const getAllEvents = async (from?: Date, to?: Date, includeDeleted = false) => {
	console.log('Fetching events from the database');
	const conditions = [];
	if (from) conditions.push(gte(Events.end, from.toISOString()));
	if (to) conditions.push(lte(Events.start, to.toISOString()));
	if (!includeDeleted) conditions.push(isNull(Events.deletedAt));
	const events = await db
		.select(eventSelect)
		.from(Events)
		.leftJoin(Clubs, eq(Events.club, Clubs.id))
		.where(conditions.length > 0 ? and(...conditions) : undefined)
		.orderBy(Events.start);
	console.log('Fetched events:', events.length);
	return events;
};

export const getFutureEvents = async () => {
	const now = new Date().toISOString();
	return await db
		.select(eventSelect)
		.from(Events)
		.leftJoin(Clubs, eq(Events.club, Clubs.id))
		.where(and(gte(Events.end, now), isNull(Events.deletedAt)))
		.orderBy(Events.start);
};

export const getPastEvents = async () => {
	const now = new Date().toISOString();
	return await db
		.select(eventSelect)
		.from(Events)
		.leftJoin(Clubs, eq(Events.club, Clubs.id))
		.where(and(lt(Events.end, now), isNull(Events.deletedAt)))
		.orderBy(desc(Events.start));
};

export const getEvent = async (id: string) => {
	console.log(`Fetching event with id: ${id}`);
	const events = await db
		.select()
		.from(Events)
		.where(eq(Events.id, parseInt(id)));
	const event = events[0];
	console.log('Fetched event:', event);
	return event;
};

export const createEvent = async (data: CreateEvent) => {
	const result = await db.insert(Events).values(data).returning();
	return result[0];
};

export const getAllClubs = async () => {
	console.log('Fetching all clubs from the database');
	const clubs = await db.select().from(Clubs);
	console.log('Fetched clubs:', clubs);
	return clubs;
};

export const getClub = async (id: string) => {
	console.log(`Fetching event with id: ${id}`);
	const clubs = await db
		.select()
		.from(Clubs)
		.where(eq(Clubs.id, parseInt(id)));
	const club = clubs[0];
	console.log('Fetched event:', club);
	return club;
};

export const createClub = async (data: CreateClub) => {
	const result = await db.insert(Clubs).values(data).returning();
	return result[0];
};

export const updateClub = async (data: UpdateClub) => {
	const result = await db
		.update(Clubs)
		.set({ name: data.name, color: data.color })
		.where(eq(Clubs.id, parseInt(data.id)))
		.returning();
	return result[0];
};

export const deleteClub = async (id: number) => {
	const result = await db.delete(Clubs).where(eq(Clubs.id, id)).returning();
	return result[0];
};

export const updateEvent = async (data: UpdateEvent) => {
	const result = await db
		.update(Events)
		.set({
			title: data.title,
			description: data.description,
			start: data.start,
			end: data.end,
			club: data.club,
			sequence: sql`${Events.sequence} + 1`
		})
		.where(eq(Events.id, parseInt(data.id)))
		.returning();
	return result[0];
};

export const deleteEvent = async (id: number) => {
	const result = await db
		.update(Events)
		.set({
			deletedAt: new Date(),
			sequence: sql`${Events.sequence} + 1`
		})
		.where(eq(Events.id, id))
		.returning();
	return result[0];
};
