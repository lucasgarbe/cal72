import { db } from './index';
import { Clubs, Events } from './schema';
import { eq } from 'drizzle-orm';

export const getAllEvents = async () => {
	console.log('Fetching all events from the database');
	const events = await db.select().from(Events);
	console.log('Fetched events:', events);
	return events;
}

export const getEvent = async (id: string) => {
	console.log(`Fetching event with id: ${id}`);
	const event = await db.select().from(Events).where(eq(Events.id, parseInt(id))).get();
	console.log('Fetched event:', event);
	return event;
}

export const createEvent = (data: any) => {
	return db.insert(Events).values(data).returning().get();
};

export const getAllClubs = async () => {
	console.log('Fetching all clubs from the database');
	const clubs = await db.select().from(Clubs);
	console.log('Fetched clubs:', clubs);
	return clubs;
}

export const getClub = async (id: string) => {
	console.log(`Fetching event with id: ${id}`);
	const club = await db.select().from(Clubs).where(eq(Clubs.id, parseInt(id))).get();
	console.log('Fetched event:', club);
	return club;
}

export const createClub = (data: any) => {
	return db.insert(Clubs).values(data).returning().get();
};

export const updateClub = (data: any) => {
	return db.update(Clubs)
		.set({ name: data.name, color: data.color })
		.where(eq(Clubs.id, data.id))
		.returning()
		.get();
}

export const deleteClub = async (id: number) => {
	return db.delete(Clubs)
		.where(eq(Clubs.id, id))
		.returning()
		.get();
}
