import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import { ticketService } from '../services/tickets-service';

export async function getTickets(req: AuthenticatedRequest, res: Response) {
  const result = await ticketService.getTicketsByUserId(req.userId);
  res.send(result);
}

export async function getTicketsTypes(req: AuthenticatedRequest, res: Response) {
  const result = await ticketService.getTicketsTypes();
  res.send(result);
}

export async function postTickets(req: AuthenticatedRequest, res: Response) {
  const ticketTypeId = req.body.ticketTypeId as number;
  const { userId } = req;

  const result = await ticketService.createTickets(ticketTypeId, userId);
  res.status(201).send(result);
}
