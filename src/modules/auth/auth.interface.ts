export interface TRegistrationPayload {
  name: string;
  phoneNumber: string;
  email?: string;
  password: string;
  roles: "CUSTOMER" | "TECHNICIAN";
  country?: string;
  profilePicture?: string;
}

export interface TLoginPayload {
  phoneNumber: string;
  email?: string;
  password: string;
}

export interface TWhereClause {
    email? :string,
    phoneNumber? :string
}
