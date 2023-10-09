import faker from '@faker-js/faker';
import { Booking, Room } from '@prisma/client';
import { prisma } from '@/config';

export async function createBooking(roomId: number, userId: number) {
  return prisma.booking.create({ data: { roomId, userId } });
}

export function buildRoomInput(hotelId: number, capacity = 3): Omit<Room & { Booking: Booking[] }, 'id'> {
  return {
    name: '1020',
    capacity,
    hotelId,
    Booking: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
