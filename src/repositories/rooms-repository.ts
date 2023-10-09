import { prisma } from '@/config';

function findByIdWithBookings(roomId: number) {
  return prisma.room.findFirst({ where: { id: roomId }, include: { Booking: true } });
}

export const roomRepository = {
  findByIdWithBookings,
};
