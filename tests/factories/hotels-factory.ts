import { User } from '@prisma/client';
import { generateValidToken } from '../helpers';
import { createUser } from './users-factory';
import { prisma } from '@/config';
import faker from '@faker-js/faker';

const session = async () => {
  const user = await createUser();
  const token = await generateValidToken(user);
  return { user, token };
};

export async function createHotel(user?: User) {
  const incomingUser = user || (await createUser());

  return prisma.hotel.create({
    data: {
      name: faker.company.companyName(),
      image: faker.image.city(),
      Rooms: {
        create: {
          name: faker.commerce.department(),
          capacity: Number(faker.random.numeric()),
          Booking: {
            create: {
              userId: incomingUser.id,
            },
          },
        },
      },
    },
    include: { Rooms: { include: { Booking: true } } },
  });
}

export async function deleteHotel() {
  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();
  await prisma.hotel.deleteMany();
}

export const hotelBuild = {
  session,
};
