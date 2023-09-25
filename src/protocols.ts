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

export type ViaCEPAddressError = {
  error: boolean;
};

export type AddressEnrollment = {
  logradouro: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
};

export type CEP = {
  cep: string;
};

export type CardData = {
  issuer: string;
  number: string;
  name: string;
  expirationDate: string | Date;
  cvv: number;
};

export type CreatePayment = {
  ticketId: number;
  cardData: CardData;
};
