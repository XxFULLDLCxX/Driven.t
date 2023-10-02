import { hotelRepository } from '@/repositories/hotels-repository';
import { getTicketsByUserId } from './tickets-service';
import { TicketStatus } from '@prisma/client';
import { notFound, paymentRequired } from '@/errors';

async function beforeEachGET(userId: number) {
  const { status, TicketType: { isRemote, includesHotel } } = await getTicketsByUserId(userId);
  if (status === TicketStatus.RESERVED || isRemote || !includesHotel) throw paymentRequired();
}

async function getHotelsByUserId(userId: number) {
  await beforeEachGET(userId);
  const result = await hotelRepository.findMany();
  if (result.length === 0) throw notFound();
  return result
}

async function getHotelsWithRoomsByUserId(id: number, userId: number) {
  await beforeEachGET(userId);
  if (isNaN(id)) throw notFound();
  const result = await hotelRepository.findByIdWithRooms(id);
  if (!result || Object.keys(result).length === 0) throw notFound();
  return result;
}

export const hotelService = {
  getHotelsByUserId,
  getHotelsWithRoomsByUserId,
};
