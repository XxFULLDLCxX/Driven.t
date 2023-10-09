import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createBooking(roomId: number, userId: number) {
  return prisma.booking.create({ data: { roomId, userId } });
}
