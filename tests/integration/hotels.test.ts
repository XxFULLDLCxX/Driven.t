import app, { init } from '@/app';
import faker from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import * as jwt from 'jsonwebtoken';
import { createEnrollmentWithAddress, createTicket, createTicketType, createUser } from '../factories';
import { cleanDb } from '../helpers';
import { Hotel, Room, TicketStatus, User } from '@prisma/client';
import { createHotel, deleteHotel, hotelBuild } from '../factories/hotels-factory';


let BASE_URL = '/hotels';
let hotel: Hotel & { Rooms: Room[] };
let session: { user: User; token: string };

beforeAll(async () => {
  await init();
  await cleanDb();
});

beforeEach(async () => {
  session = await hotelBuild.session();
  hotel = await createHotel(session.user);
});

afterEach(async () => {
  await deleteHotel();
});

const server = supertest(app);

describe(`GET ${BASE_URL} and GET ${BASE_URL}/:hotelId`, () => {
  const GET = async (url: string, token: string) => await server.get(url).set('Authorization', `Bearer ${token}`);

  it('should respond with status 401 if no token is given', async () => {
    expect((await server.get(BASE_URL)).status).toBe(httpStatus.UNAUTHORIZED);
    expect((await server.get(`${BASE_URL}/${hotel.id}`)).status).toBe(httpStatus.UNAUTHORIZED);
  });
  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();
    expect((await GET(BASE_URL, token)).status).toBe(httpStatus.UNAUTHORIZED);
    expect((await GET(`${BASE_URL}/${hotel.id}`, token)).status).toBe(httpStatus.UNAUTHORIZED);
  });
  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    expect((await GET(BASE_URL, token)).status).toBe(httpStatus.UNAUTHORIZED);
    expect((await GET(`${BASE_URL}/${hotel.id}`, token)).status).toBe(httpStatus.UNAUTHORIZED);
  });
  describe('when token is valid', () => {
    describe('should respond with a 404 status', () => {
      it('if there is no enrollment', async () => {
        expect((await GET(BASE_URL, session.token)).status).toBe(httpStatus.NOT_FOUND);
        expect((await GET(`${BASE_URL}/${hotel.id}`, session.token)).status).toBe(httpStatus.NOT_FOUND);
      });
      it('if there is no ticket', async () => {
        await createEnrollmentWithAddress(session.user);
        expect((await GET(BASE_URL, session.token)).status).toBe(httpStatus.NOT_FOUND);
        expect((await GET(`${BASE_URL}/${hotel.id}`, session.token)).status).toBe(httpStatus.NOT_FOUND);
      });
      it('if there is no hotels', async () => {
        const enrollment = await createEnrollmentWithAddress(session.user);
        const ticketType = await createTicketType({ isRemote: false, includesHotel: true });
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        await deleteHotel();
        expect((await GET(BASE_URL, session.token)).status).toBe(httpStatus.NOT_FOUND);
        expect((await GET(`${BASE_URL}/${hotel.id}`, session.token)).status).toBe(httpStatus.NOT_FOUND);
      });
    });
    describe('should respond with a 402 status', () => {
      it('if the ticket is not paid', async () => {
        const enrollment = await createEnrollmentWithAddress(session.user);
        const ticketType = await createTicketType();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
        expect((await GET(BASE_URL, session.token)).status).toBe(httpStatus.PAYMENT_REQUIRED);
        expect((await GET(`${BASE_URL}/${hotel.id}`, session.token)).status).toBe(httpStatus.PAYMENT_REQUIRED);
      });
      it('if the ticket is remote', async () => {
        const enrollment = await createEnrollmentWithAddress(session.user);
        const ticketType = await createTicketType({ isRemote: true });
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        expect((await GET(BASE_URL, session.token)).status).toBe(httpStatus.PAYMENT_REQUIRED);
        expect((await GET(`${BASE_URL}/${hotel.id}`, session.token)).status).toBe(httpStatus.PAYMENT_REQUIRED);
      });
      it('if the ticket does not include a hotel', async () => {
        const enrollment = await createEnrollmentWithAddress(session.user);
        const ticketType = await createTicketType({ isRemote: false, includesHotel: false });
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        expect((await GET(BASE_URL, session.token)).status).toBe(httpStatus.PAYMENT_REQUIRED);
        expect((await GET(`${BASE_URL}/${hotel.id}`, session.token)).status).toBe(httpStatus.PAYMENT_REQUIRED);
      });
    });
    describe('should respond with a 200 status', () => {
      it('if GET /hotels return a expected body.', async () => {
        const enrollment = await createEnrollmentWithAddress(session.user);
        const ticketType = await createTicketType({ isRemote: false, includesHotel: true });
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const response = await GET(BASE_URL, session.token);
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: hotel.id,
              name: hotel.name,
              image: hotel.image,
              createdAt: hotel.createdAt.toISOString(),
              updatedAt: hotel.updatedAt.toISOString(),
            }),
          ])
        );
      });
      it(`if GET /hotels/:hotelId return a expected body.`, async () => {
        const enrollment = await createEnrollmentWithAddress(session.user);
        const ticketType = await createTicketType({ isRemote: false, includesHotel: true });
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        
        const response = await GET(`${BASE_URL}/${hotel.id}`, session.token);
        expect(response.status).toBe(httpStatus.OK);

        expect(response.body).toEqual(
          expect.objectContaining({
            id: hotel.id,
            name: hotel.name,
            image: hotel.image,
            createdAt: hotel.createdAt.toISOString(),
            updatedAt: hotel.updatedAt.toISOString(),
            Rooms: expect.arrayContaining([
              expect.objectContaining({
                id: hotel.Rooms[0].id,
                name: hotel.Rooms[0].name,
                capacity: hotel.Rooms[0].capacity,
                hotelId: hotel.Rooms[0].hotelId,
                createdAt: hotel.Rooms[0].createdAt.toISOString(),
                updatedAt: hotel.Rooms[0].updatedAt.toISOString(),
              }),
            ]),
          })
        );
      });
    });
  });
});
