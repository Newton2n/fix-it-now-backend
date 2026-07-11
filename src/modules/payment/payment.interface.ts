import { z } from "zod";
import { UserPaymentSearchSchema } from "./payment.schema";


//query type
export type TUserPaymentSearchQuery = z.infer<typeof UserPaymentSearchSchema>;