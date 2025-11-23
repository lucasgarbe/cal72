import { db } from './index';
import { Events } from './schema';
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
