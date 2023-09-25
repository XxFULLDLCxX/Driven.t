import { notFoundError } from '@/errors';
import { enrollmentRepository, ticketRepository } from '@/repositories';

async function validateEnrollment(userId: number) {
  const enrollment = await enrollmentRepository.findByUserId(userId);
  if (!enrollment) throw notFoundError();
  return enrollment.id;
}

async function validateTicketType(id: number) {
  const ticketType = await ticketRepository.findFirstTicketTypeById(id);
  if (!ticketType) throw notFoundError();
  return ticketType.id;
}

async function getTicketsByUserId(userId: number) {
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
