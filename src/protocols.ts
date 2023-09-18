export type ApplicationError = {
  name: string;
  message: string;
};

export type RequestError = {
  status: number;
  data: object | null;
  statusText: string;
  name: string;
  message: string;
};

export type AddressResult = {
  erro?: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
};
