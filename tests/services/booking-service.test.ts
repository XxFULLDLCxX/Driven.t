import { TicketStatus } from '@prisma/client';
import { buildHotelInput } from '../factories/hotels-factory';
import { buildRoomInput } from '../factories/booking-factory';
import { buildTicketInput, buildTicketTypeInput } from '../factories/tickets-factory';
import { buildAddressInput } from '../factories/enrollments-factory';
import { buildEnrollmentInput, buildUserInput } from '../factories';
import { bookingRepository, enrollmentRepository, roomRepository, ticketsRepository } from '@/repositories';
import { bookingService } from '@/services';

describe('Create Booking', () => {
  it('should do a booking for a room', async () => {
    const mockUser = { id: 1, ...(await buildUserInput()) };
    const mockEnrollment = { id: 1, ...buildEnrollmentInput(mockUser), Address: [{ id: 1, ...buildAddressInput(1) }] };
    const mockTicketType = { id: 1, ...buildTicketTypeInput(false, true) };
    const mockTicket = {
      id: 1,
      ...buildTicketInput(mockEnrollment.id, mockTicketType.id, TicketStatus.PAID),
      TicketType: mockTicketType,
    };
    const mockHotel = { id: 1, ...buildHotelInput() };
    const mockRoom = { id: 1, ...buildRoomInput(mockHotel.id) };
    const mockBooking = {
      id: 1,
      roomId: mockRoom.id,
      userId: mockUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockEnrollment);
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockTicket);
    jest.spyOn(roomRepository, 'findByIdWithBookings').mockResolvedValueOnce(mockRoom);
    jest.spyOn(bookingRepository, 'create').mockResolvedValueOnce(mockBooking);
    await bookingService.postBookingsByUserId(mockRoom.id, mockUser.id);
  });
  it('should throw an error when ticket is remote', async () => {
    const mockUser = { id: 1, ...(await buildUserInput()) };
    const mockEnrollment = { id: 1, ...buildEnrollmentInput(mockUser), Address: [{ id: 1, ...buildAddressInput(1) }] };
    const mockTicketType = { id: 1, ...buildTicketTypeInput(true, true) };
    const mockTicket = {
      id: 1,
      ...buildTicketInput(mockEnrollment.id, mockTicketType.id, TicketStatus.PAID),
      TicketType: mockTicketType,
    };
    const mockHotel = { id: 1, ...buildHotelInput() };
    const mockRoom = { id: 1, ...buildRoomInput(mockHotel.id) };
    const mockBooking = {
      id: 1,
      roomId: mockRoom.id,
      userId: mockUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockEnrollment);
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockTicket);
    jest.spyOn(roomRepository, 'findByIdWithBookings').mockResolvedValueOnce(mockRoom);
    jest.spyOn(bookingRepository, 'create').mockResolvedValueOnce(mockBooking);
    const promise = bookingService.postBookingsByUserId(mockRoom.id, mockUser.id);
    expect(promise).rejects.toEqual({
      name: 'Forbidden',
      message: `Access to the requested resource is forbidden.`,
    });
  });
  it('should throw an error when ticket doenst include hotel', async () => {
    const mockUser = { id: 1, ...(await buildUserInput()) };
    const mockEnrollment = { id: 1, ...buildEnrollmentInput(mockUser), Address: [{ id: 1, ...buildAddressInput(1) }] };
    const mockTicketType = { id: 1, ...buildTicketTypeInput(false, false) };
    const mockTicket = {
      id: 1,
      ...buildTicketInput(mockEnrollment.id, mockTicketType.id, TicketStatus.PAID),
      TicketType: mockTicketType,
    };
    const mockHotel = { id: 1, ...buildHotelInput() };
    const mockRoom = { id: 1, ...buildRoomInput(mockHotel.id) };
    const mockBooking = {
      id: 1,
      roomId: mockRoom.id,
      userId: mockUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockEnrollment);
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockTicket);
    jest.spyOn(roomRepository, 'findByIdWithBookings').mockResolvedValueOnce(mockRoom);
    jest.spyOn(bookingRepository, 'create').mockResolvedValueOnce(mockBooking);
    const promise = bookingService.postBookingsByUserId(mockRoom.id, mockUser.id);
    expect(promise).rejects.toEqual({
      name: 'Forbidden',
      message: `Access to the requested resource is forbidden.`,
    });
  });
  it('should throw an error when ticket is not paid', async () => {
    const mockUser = { id: 1, ...(await buildUserInput()) };
    const mockEnrollment = { id: 1, ...buildEnrollmentInput(mockUser), Address: [{ id: 1, ...buildAddressInput(1) }] };
    const mockTicketType = { id: 1, ...buildTicketTypeInput(true, false) };
    const mockTicket = {
      id: 1,
      ...buildTicketInput(mockEnrollment.id, mockTicketType.id, TicketStatus.RESERVED),
      TicketType: mockTicketType,
    };
    const mockHotel = { id: 1, ...buildHotelInput() };
    const mockRoom = { id: 1, ...buildRoomInput(mockHotel.id) };
    const mockBooking = {
      id: 1,
      roomId: mockRoom.id,
      userId: mockUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockResolvedValueOnce(mockEnrollment);
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockResolvedValueOnce(mockTicket);
    jest.spyOn(roomRepository, 'findByIdWithBookings').mockResolvedValueOnce(mockRoom);
    jest.spyOn(bookingRepository, 'create').mockResolvedValueOnce(mockBooking);
    const promise = bookingService.postBookingsByUserId(mockRoom.id, mockUser.id);
    expect(promise).rejects.toEqual({
      name: 'Forbidden',
      message: `Access to the requested resource is forbidden.`,
    });
  });
});
