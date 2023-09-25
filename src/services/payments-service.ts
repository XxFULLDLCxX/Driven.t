import { badRequest, notFoundError, unauthorizedError } from '@/errors';
import { CreatePayment } from '@/protocols';
import { enrollmentRepository, paymentRepository, ticketRepository } from '@/repositories';

async function validateTicketId(ticketId: number) {
  if (isNaN(ticketId)) throw badRequest();
  const ticket = await ticketRepository.findByTicketId(ticketId);
  if (!ticket) throw notFoundError();
  return ticket;
}

async function validateAuthorization(enrollmentId: number, userId: number) {
  const enrollment = await enrollmentRepository.findByUserId(userId);
  if (enrollmentId !== enrollment.id) throw unauthorizedError();
}

async function getPaymentsByTicketId(ticketId: number, userId: number) {
  if (ticketId === undefined) throw badRequest(`\n"ticketId" query parameter is not defined.`);
  const { enrollmentId } = await validateTicketId(ticketId);
  await validateAuthorization(enrollmentId, userId);

  return paymentRepository.findPaymentByTicketId(ticketId);
}

async function createPayments(payment: CreatePayment, userId: number) {
  const {
    enrollmentId,
    TicketType: { price },
  } = await validateTicketId(payment.ticketId);
  await validateAuthorization(enrollmentId, userId);
  const {
    ticketId,
    cardData: { issuer, number },
  } = payment;
  await ticketRepository.updateTicketStatusToPAID(payment.ticketId);
  
  return paymentRepository.createPayment({
    ticketId,
    value: price,
    cardIssuer: issuer,
    cardLastDigits: number.slice(-4),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

export const paymentService = {
  getPaymentsByTicketId,
  createPayments,
};
