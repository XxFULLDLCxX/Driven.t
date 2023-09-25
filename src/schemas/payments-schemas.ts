import { CardData, CreatePayment } from '@/protocols';
import Joi from 'joi';

const cardDataSchema = Joi.object<CardData>({
  issuer: Joi.string().required(),
  number: Joi.string().required(),
  name: Joi.string().required(),
  expirationDate: Joi.string().required(),
  cvv: Joi.string().required(),
});

export const paymentSchema = Joi.object<CreatePayment>({
  ticketId: Joi.number().greater(0).required(),
  cardData: cardDataSchema,
});
