export interface TRegistrationPayload {
  name: string;
  phoneNumber: string;
  email?: string;
  password: string;
  roles: "CUSTOMER" | "TECHNICIAN";
  country?: string;
  profilePicture? :string;

}
