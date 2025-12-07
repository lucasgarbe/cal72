import { db } from './index';
import { Clubs, Events } from './schema';
import { eq } from 'drizzle-orm';

export const getAllEvents = async () => {
	console.log('Fetching all events from the database');
	const events = await db
		.select({
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
			createdAt: Events.createdAt
		})
		.from(Events)
		.leftJoin(Clubs, eq(Events.club, Clubs.id));
	console.log('Fetched events:', events);
	return events;
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

export const createEvent = async (data: any) => {
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

export const createClub = async (data: any) => {
	const result = await db.insert(Clubs).values(data).returning();
	return result[0];
};

export const updateClub = async (data: any) => {
	const result = await db
		.update(Clubs)
		.set({ name: data.name, color: data.color })
		.where(eq(Clubs.id, data.id))
		.returning();
	return result[0];
};

export const deleteClub = async (id: number) => {
	const result = await db.delete(Clubs).where(eq(Clubs.id, id)).returning();
	return result[0];
};

export const updateEvent = async (data: any) => {
	const result = await db
		.update(Events)
		.set({
			title: data.title,
			description: data.description,
			start: data.start,
			end: data.end,
			club: data.club
		})
		.where(eq(Events.id, data.id))
		.returning();
	return result[0];
};

export const deleteEvent = async (id: number) => {
	const result = await db.delete(Events).where(eq(Events.id, id)).returning();
	return result[0];
};
