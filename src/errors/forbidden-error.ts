import { ApplicationError } from '@/protocols';

export function forbidden(details = ''): ApplicationError {
  return {
    name: 'Forbidden',
    message: `Access to the requested resource is forbidden. ${details}`,
  };
}
