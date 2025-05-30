import { DefaultSession, DefaultUser } from "next-auth";
// Define a role enum
export enum Role {
  buyer = "buyer",
  seller = "seller",
}
// common interface for JWT and Session
interface IUser extends DefaultUser {
  role?: Role;
  avatar?: string;
}
declare module "next-auth" {
  interface User extends IUser {}
  interface Session {
    user?: User;
  }
}
declare module "next-auth/jwt" {
  interface JWT extends IUser {}
}
