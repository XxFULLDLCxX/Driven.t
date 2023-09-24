import Joi from 'joi';

export const ticketSchema = Joi.object<{ ticketTypeId: number }>({
  ticketTypeId: Joi.number().greater(0).required(),
});
