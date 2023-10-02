import { ApplicationError } from '@/protocols';

export function badRequest(details = ''): ApplicationError {
  return {
    name: 'BadRequest',
    message: `Request could not be processed. ${details}`,
  };
}

export function paymentRequired(details = ''): ApplicationError {
  return {
    name: 'PaymentRequired',
    message: `Your request cannot be processed until payment is received. ${details}`
  }
}

export function notFound(): ApplicationError {
  return {
    name: 'NotFound',
    message: 'No result for this search.',
  };
}