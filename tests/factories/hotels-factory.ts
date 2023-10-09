import faker from '@faker-js/faker';
import { prisma } from '@/config';
import { Hotel } from '@prisma/client';

export async function createHotel() {
  return await prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.imageUrl(),
    },
  });
}

export async function createRoomWithHotelId(hotelId: number, capacity = 3) {
  return prisma.room.create({
    data: {
      name: '1020',
      capacity,
      hotelId,
    },
  });
}

export function buildHotelInput(): Partial<Hotel> {
  return {
    name: faker.name.findName(),
    image: faker.image.imageUrl(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
