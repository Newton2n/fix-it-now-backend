import { LoginTicket, OAuth2Client } from "google-auth-library";
import config from "../config";

export const verifyGoogleToken = async (idToken: string) => {

   const client = new OAuth2Client(config.google_client_id);

   const verify :LoginTicket =await client.verifyIdToken({
     idToken :idToken,
     audience :config.google_client_id
   })
   console.log("verify google",verify)

};
