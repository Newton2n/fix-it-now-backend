import { LoginTicket, OAuth2Client } from "google-auth-library";
import config from "../config";

const client = new OAuth2Client(config.google_client_id);
export const verifyGoogleToken = async (idToken: string) => {
  try {
    const ticket: LoginTicket = await client.verifyIdToken({
      idToken: idToken,
      audience: config.google_client_id,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error("Token payload is empty");
    }
    
    return payload;
  } catch (error) {
  
    throw new Error("Invalid Google ID Token");
  }
};
