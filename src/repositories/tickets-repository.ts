import { prisma } from '@/config';
import { Ticket, TicketStatus } from '@prisma/client';

function findByEnrollmentId(enrollmentId: number) {
  return prisma.ticket.findFirst({ where: { enrollmentId }, include: { TicketType: true } });
}

function findByTicketId(id: number) {
  return prisma.ticket.findFirst({ where: { id }, include: { TicketType: true } });
}

function findTicketsTypes() {
  return prisma.ticketType.findMany();
}

function findFirstTicketTypeById(id: number) {
  return prisma.ticketType.findFirst({ where: { id } });
}

function create(ticket: TicketParams) {
  return prisma.ticket.create({
    data: ticket,
    include: {
      TicketType: true,
    },
  });
}

function updateTicketStatusToPAID(id: number) {
  return prisma.ticket.update({ data: { status: 'PAID' }, where: { id } });
}

type TicketParams = Omit<Ticket, 'id'>;
// type ReturnTicketData =  & { TicketType: TicketType };

export const ticketRepository = {
  findByEnrollmentId,
  findByTicketId,
  findTicketsTypes,
  findFirstTicketTypeById,
  updateTicketStatusToPAID,
  create,
};
