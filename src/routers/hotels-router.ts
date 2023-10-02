import { getHotels, getHotelsWithRooms } from '@/controllers';
import { authenticateToken } from '@/middlewares';
import { Router } from 'express';

export const hotelRouter = Router();
hotelRouter
  .all('/*', authenticateToken)
  .get('/', getHotels)
  .get('/:hotelId', getHotelsWithRooms);
