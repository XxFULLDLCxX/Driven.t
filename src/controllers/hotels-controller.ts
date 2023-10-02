import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import { hotelService } from '../services/hotels-service';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const result = await hotelService.getHotelsByUserId(req.userId);
  res.send(result);
}

export async function getHotelsWithRooms(req: AuthenticatedRequest, res: Response) {
  const hotelId = Number(req.params.hotelId);
  const result = await hotelService.getHotelsWithRoomsByUserId(hotelId, req.userId);
  res.send(result);
}

