import { AuthenticatedRequest } from '@/middlewares';
import { CreatePayment } from '@/protocols';
import { paymentService } from '@/services/payments-service';
import { Response } from 'express';

export async function getPayments(req: AuthenticatedRequest, res: Response) {
  const ticketId = Number(req.query.ticketId) as number;
  const result = await paymentService.getPaymentsByTicketId(ticketId, req.userId);
  res.send(result);
}

export async function postPayments(req: AuthenticatedRequest, res: Response) {
  const { ticketId, cardData } = req.body as CreatePayment;
  const result = await paymentService.createPayments({ ticketId, cardData }, req.userId);
  res.send(result);
}
