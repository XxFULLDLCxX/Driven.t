import { Booking } from '@prisma/client';
import { prisma } from '@/config';

async function findByUserId(userId: number) {
  return prisma.booking.findUnique({ where: { userId }, include: { Room: true } });
}

async function findById(bookingId: number) {
  return prisma.booking.findFirst({ where: { id: bookingId } });
}

async function create(booking: BookingParams) {
  return prisma.booking.create({ data: booking });
}

async function update(bookingId: number, roomId: number) {
  return prisma.booking.update({ data: { roomId }, where: { id: bookingId } });
}

type BookingParams = Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>;

export const bookingRepository = {
  findByUserId,
  findById,
  create,
  update,
};
