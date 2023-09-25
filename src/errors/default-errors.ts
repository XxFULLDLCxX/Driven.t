import { ApplicationError } from '@/protocols';

export function badRequest(details = ''): ApplicationError {
  return {
    name: 'BadRequest',
    message: `Request could not be processed. ${details}`,
  };
}
