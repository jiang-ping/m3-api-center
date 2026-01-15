// Auto-generated type declarations

export type UserRole = "admin" | "user" | "guest";

export type CompanyName = string;

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  company?: CompanyName;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  role: UserRole;
}

