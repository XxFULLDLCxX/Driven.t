import { getPayments, postPayments } from "@/controllers";
import { authenticateToken, validateBody } from "@/middlewares";
import { paymentSchema } from "@/schemas";
import { Router } from "express";

const paymentsRouter = Router();

paymentsRouter
  .all('/*', authenticateToken)
  .get('/', getPayments)
  .post('/process', validateBody(paymentSchema), postPayments)

export { paymentsRouter };