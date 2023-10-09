import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getBookings, postBookings, putBookings } from '@/controllers';

export const bookingRouter = Router();
bookingRouter
  .all('/*', authenticateToken)
  .get('/', getBookings)
  .post('/', postBookings)
  .put('/:bookingId', putBookings);
