import { ticketsRepository } from '@/repositories/tickets-repository';
import { notFoundError } from '@/errors';
import { ticketSchema } from '@/schemas';
import { enrollmentRepository } from '@/repositories';

async function validateEnrollment(userId: number) {
  const enrollment = await enrollmentRepository.findByUserId(userId);
  if (!enrollment) throw notFoundError();
  return enrollment.id;
}

async function validateTicketType(id: number) {
  const ticketType = await ticketsRepository.findOneTicketsTypesById(id);
  if (!ticketType) throw notFoundError();
  return ticketType.id;
}

async function getTicketsByUserId(userId: number) {
  const enrollmentId = await validateEnrollment(userId);
  const result = await ticketsRepository.findByEnrollmentId(enrollmentId);
  if (!result) throw notFoundError();
  return result;
}

function getTicketsTypes() {
  return ticketsRepository.findTicketsTypes();
}

async function createTickets(ticketTypeId: number, userId: number) {
  const validTicketTypeId = await validateTicketType(ticketTypeId);
  const validEnrollmentId = await validateEnrollment(userId);
  return ticketsRepository.create({
    status: 'RESERVED',
    ticketTypeId: validTicketTypeId,
    enrollmentId: validEnrollmentId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

export const ticketsService = {
  getTicketsByUserId,
  getTicketsTypes,
  createTickets,
};
