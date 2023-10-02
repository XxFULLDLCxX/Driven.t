import { prisma } from '@/config';

export async function findMany() {
  return prisma.hotel.findMany();
}

export async function findByIdWithRooms(id: number) {

  return prisma.hotel.findFirst({ where: { id }, include: { Rooms: true } });
}

export const hotelRepository = {
  findMany,
  findByIdWithRooms,
};
