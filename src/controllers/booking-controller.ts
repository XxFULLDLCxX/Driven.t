import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import { bookingService } from '@/services';
import { notFoundError } from '@/errors';

export async function getBookings(req: AuthenticatedRequest, res: Response) {
  const result = await bookingService.getBookingsByUserId(req.userId);
  if (!result) throw notFoundError();
  res.send(result);
}

export async function postBookings(req: AuthenticatedRequest, res: Response) {
  const roomId = Number(req.body.roomId);
  const result = await bookingService.postBookingsByUserId(roomId, req.userId);
  res.send(result);
}

export async function putBookings(req: AuthenticatedRequest, res: Response) {
  const [bookingId, roomId] = [Number(req.params.bookingId), Number(req.body.roomId)];
  const result = await bookingService.putBookingsByUserId(bookingId, roomId, req.userId);
  res.send(result);
}
