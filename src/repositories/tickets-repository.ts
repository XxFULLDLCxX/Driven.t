import { prisma } from '@/config';
import { Ticket, TicketType } from '@prisma/client';

function findByEnrollmentId(enrollmentId: number) {
  return prisma.ticket.findFirst({ where: { enrollmentId }, include: { TicketType: true } });
}

function findTicketsTypes() {
  return prisma.ticketType.findMany();
}

function findOneTicketsTypesById(id: number) {
  return prisma.ticketType.findFirst({ where: { id } })
}

function create(ticket: TicketParams) {
  return prisma.ticket.create({
    data: ticket,
    include: {
      TicketType: true
    }
  });
}

type TicketParams = Omit<Ticket, 'id'>;
// type ReturnTicketData =  & { TicketType: TicketType };

export const ticketsRepository = {
  findByEnrollmentId,
  findTicketsTypes,
  findOneTicketsTypesById,
  create,
};
