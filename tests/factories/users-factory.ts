import bcrypt from 'bcrypt';
import faker from '@faker-js/faker';
import { User } from '@prisma/client';
import { prisma } from '@/config';

async function createHashedPassword(params: Partial<User> = {}) {
  const incomingPassword = params.password || faker.internet.password(6);
  return await bcrypt.hash(incomingPassword, 10);
}

export async function createUser(params: Partial<User> = {}): Promise<User> {
  const hashedPassword = await createHashedPassword(params);
  return prisma.user.create({
    data: {
      email: params.email || faker.internet.email(),
      password: hashedPassword,
    },
  });
}

export async function buildUserInput(): Promise<UserInput> {
  const hashedPassword = await createHashedPassword();
  return {
    email: faker.internet.email(),
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

type UserInput = Omit<User, 'id'>;
