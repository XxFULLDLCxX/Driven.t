import { badRequest, notFoundError } from '@/errors';
import { ticketRepository } from '@/repositories';
import { validateEnrollment } from './enrollments-service';

async function validateTicketType(id: number) {
  const ticketType = await ticketRepository.findFirstTicketTypeById(id);
  if (!ticketType) throw notFoundError();
  return ticketType.id;
}

export async function getTicketsByUserId(userId: number) {
  const enrollmentId = await validateEnrollment(userId);
  const result = await ticketRepository.findByEnrollmentId(enrollmentId);
  if (!result) throw notFoundError();
  return result;
}

function getTicketsTypes() {
  return ticketRepository.findTicketsTypes();
}

async function createTickets(ticketTypeId: number, userId: number) {
  const validTicketTypeId = await validateTicketType(ticketTypeId);
  const validEnrollmentId = await validateEnrollment(userId);
  return ticketRepository.create({
    status: 'RESERVED',
    ticketTypeId: validTicketTypeId,
    enrollmentId: validEnrollmentId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

export const ticketService = {
  getTicketsByUserId,
  getTicketsTypes,
  createTickets,
};
