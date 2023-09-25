import { getTickets, getTicketsTypes, postTickets } from '@/controllers';
import { authenticateToken, validateBody } from '@/middlewares';
import { ticketSchema } from '@/schemas';
import { Router } from 'express';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/types', getTicketsTypes)
  .get('/', getTickets)
  .post('/', validateBody(ticketSchema), postTickets);

export { ticketsRouter };
