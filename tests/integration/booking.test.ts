import faker from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import * as jwt from 'jsonwebtoken';
import { TicketStatus, User } from '@prisma/client';
import { createEnrollmentWithAddress, createTicket, createTicketType, createUser } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import { createBooking } from '../factories/booking-factory';
import { createHotel, createRoomWithHotelId } from '../factories/hotels-factory';
import app, { init } from '@/app';
import { prisma } from '@/config';

const BASE_URL = '/booking';
let session: { token: string; user: User };

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
  const user = await createUser();
  const token = await generateValidToken(user);
  session = { token, user };
});

const server = supertest(app);

const GET = async (url: string, token: string) => await server.get(url).set('Authorization', `Bearer ${token}`);
const PUT = async (url: string, token: string, body: object) =>
  await server.put(url).set('Authorization', `Bearer ${token}`).send(body);
const POST = async (url: string, token: string, body: object) =>
  await server.post(url).set('Authorization', `Bearer ${token}`).send(body);

describe(`Check Authorization on GET /booking, POST /booking and PUT /booking/:bookingId`, () => {
  it('should respond with status 401 if no token is given', async () => {
    expect((await server.get(BASE_URL)).status).toBe(httpStatus.UNAUTHORIZED);
    expect((await server.post(BASE_URL)).status).toBe(httpStatus.UNAUTHORIZED);
    expect((await server.put(`${BASE_URL}/${1}`)).status).toBe(httpStatus.UNAUTHORIZED);
  });
  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();
    expect((await GET(BASE_URL, token)).status).toBe(httpStatus.UNAUTHORIZED);
    expect((await POST(BASE_URL, token, {})).status).toBe(httpStatus.UNAUTHORIZED);
    expect((await PUT(`${BASE_URL}/${1}`, token, {})).status).toBe(httpStatus.UNAUTHORIZED);
  });
  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    expect((await GET(BASE_URL, token)).status).toBe(httpStatus.UNAUTHORIZED);
    expect((await POST(BASE_URL, token, {})).status).toBe(httpStatus.UNAUTHORIZED);
    expect((await PUT(`${BASE_URL}/${1}`, token, {})).status).toBe(httpStatus.UNAUTHORIZED);
  });
});
describe('when token is valid', () => {
  describe('GET /booking', () => {
    it('should respond with status 404', async () => {
      const response = await GET(BASE_URL, session.token);
      expect(response.status).toBe(404);
    });
    it('should respond with status 200', async () => {
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const booking = await createBooking(room.id, session.user.id);

      const response = await GET(BASE_URL, session.token);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: booking.id,
        Room: {
          id: room.id,
          name: room.name,
          capacity: room.capacity,
          hotelId: hotel.id,
          createdAt: room.createdAt.toISOString(),
          updatedAt: room.updatedAt.toISOString(),
        },
      });
    });
  });
  describe('POST /booking', () => {
    it('should respond with status 404', async () => {
      const { status } = await POST(BASE_URL, session.token, { roomId: 1 });
      expect(status).toBe(404);
    });
    it('should respond with status 403', async () => {
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const { status } = await POST(BASE_URL, session.token, { roomId: room.id });
      expect(status).toBe(403);
    });

    it('should respond with status 200', async () => {
      const enrollment = await createEnrollmentWithAddress(session.user);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const response = await POST(BASE_URL, session.token, { roomId: room.id });
      const booking = await prisma.booking.findUnique({ where: { userId: session.user.id } });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ bookingId: booking.id });
      expect(booking).toEqual(
        expect.objectContaining({
          roomId: booking.roomId,
          userId: booking.userId,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt,
        }),
      );
    });
  });
  describe('PUT /booking/:bookingId', () => {
    describe('should respond with status 404', () => {
      it('if the roomId is not found', async () => {
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);
        const booking = await createBooking(room.id, session.user.id);

        const { status } = await PUT(`${BASE_URL}/${booking.id}`, session.token, { roomId: room.id + 1 });
        expect(status).toBe(404);
      });
    });
    describe('should respond with status 403', () => {
      it('if the user does not have a booking', async () => {
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);
        const { status } = await PUT(`${BASE_URL}/1`, session.token, { roomId: room.id });
        expect(status).toBe(403);
      });
      it('if the new room has no vacancy', async () => {
        const user = await createUser();
        const hotel = await createHotel();
        const room = [await createRoomWithHotelId(hotel.id), await createRoomWithHotelId(hotel.id, 1)];
        const booking = await createBooking(room[0].id, session.user.id);
        await createBooking(room[1].id, user.id);
        const { status } = await PUT(`${BASE_URL}/${booking.id}`, session.token, { roomId: room[1].id });
        expect(status).toBe(403);
      });
    });

    it('should respond with status 200', async () => {
      const hotel = await createHotel();
      const room = [await createRoomWithHotelId(hotel.id), await createRoomWithHotelId(hotel.id)];
      const createdBooking = await createBooking(room[0].id, session.user.id);
      const response = await PUT(`${BASE_URL}/${createdBooking.id}`, session.token, { roomId: room[1].id });
      const updatedBooking = await prisma.booking.findUnique({ where: { id: response.body.bookingId } });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ bookingId: updatedBooking.id });
      expect(updatedBooking).toEqual(
        expect.objectContaining({
          roomId: room[1].id,
          userId: createdBooking.userId,
          createdAt: createdBooking.createdAt,
          updatedAt: updatedBooking.updatedAt,
        }),
      );
    });
  });
});
