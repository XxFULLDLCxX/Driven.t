import faker from '@faker-js/faker';
import { Ticket, TicketStatus, TicketType } from '@prisma/client';
import { prisma } from '@/config';

export function buildTicketTypeInput(isRemote?: boolean, includesHotel?: boolean): Omit<TicketType, 'id'> {
  return {
    name: faker.name.findName(),
    price: faker.datatype.number(),
    isRemote: isRemote !== undefined ? isRemote : faker.datatype.boolean(),
    includesHotel: includesHotel !== undefined ? includesHotel : faker.datatype.boolean(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function buildTicketInput(enrollmentId: number, ticketTypeId: number, status: TicketStatus): Omit<Ticket, 'id'> {
  return {
    enrollmentId,
    ticketTypeId,
    status,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function createTicketType(isRemote?: boolean, includesHotel?: boolean) {
  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: isRemote !== undefined ? isRemote : faker.datatype.boolean(),
      includesHotel: includesHotel !== undefined ? includesHotel : faker.datatype.boolean(),
    },
  });
}

export async function createTicket(enrollmentId: number, ticketTypeId: number, status: TicketStatus) {
  return prisma.ticket.create({
    data: {
      enrollmentId,
      ticketTypeId,
      status,
    },
  });
}
