import { prisma } from '@/config';
import { Payment } from '@prisma/client';

function findPaymentByTicketId(ticketId: number) {
  return prisma.payment.findFirst({ where: { ticketId } });
}

function createPayment(payment: PaymentParams) {
  return prisma.payment.create({ data: payment });
}
type PaymentParams = Omit<Payment, 'id'>;

export const paymentRepository = {
  findPaymentByTicketId,
  createPayment,
};
