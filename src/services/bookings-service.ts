import { TicketStatus } from '@prisma/client';
import { forbidden, notFoundError } from '@/errors';
import { bookingRepository, enrollmentRepository, roomRepository, ticketsRepository } from '@/repositories';

async function validateTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw forbidden();
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw forbidden();

  return ticket;
}

async function validateRoom(roomId: number) {
  const room = await roomRepository.findByIdWithBookings(roomId);
  if (!room) throw notFoundError();
  if (room.Booking.length === room.capacity) throw forbidden();
  return room;
}

async function getBookingsByUserId(userId: number) {
  const result = await bookingRepository.findByUserId(userId);
  if (!result) throw notFoundError();
  return { id: result.id, Room: result.Room };
}

async function postBookingsByUserId(roomId: number, userId: number) {
  await validateRoom(roomId);
  const {
    status,
    TicketType: { isRemote, includesHotel },
  } = await validateTicket(userId);

  if (status === TicketStatus.RESERVED || isRemote || !includesHotel) throw forbidden();
  const result = await bookingRepository.create({ roomId, userId });
  return { bookingId: result.id };
}

async function putBookingsByUserId(bookingId: number, roomId: number, userId: number) {
  await validateRoom(roomId);
  const booking = await bookingRepository.findById(bookingId);
  if (booking.userId !== userId) throw forbidden();
  const result = await bookingRepository.update(bookingId, roomId);
  return { bookingId: result.id };
}

export const bookingService = {
  getBookingsByUserId,
  postBookingsByUserId,
  putBookingsByUserId,
};
