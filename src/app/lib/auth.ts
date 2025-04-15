import NextAuth from "next-auth";
import { ZodError } from "zod";
import { signInSchema } from "./zod";
import UserModel from "@/model/usersModel";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "./dbConnect";
import { JWTToken } from "@/model/types/types";
import { Role } from "../../../nextauth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          if (!credentials) throw new Error("Missing credentials");

          const { email, password } = await signInSchema.parseAsync(
            credentials
          );

          await dbConnect();

          const user = await UserModel.findOne({ email }).select("+password");

          if (!user) {
            console.error("User not found with email:", email);
            throw new Error("Invalid credentials.");
          }
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            console.log("❌ Wrong password");
            throw new Error("Wrong Password");
          }

          console.log(`✅ User ${user.email} signed in successfully!`);
          return user;
        } catch (error) {
          if (error instanceof ZodError) {
            // Return `null` to indicate that the credentials are invalid
            return null;
          }
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      const typedToken = token as JWTToken;
      if (typedToken?.id && typedToken?.role) {
        session.user.id = typedToken.id;
        session.user.role = typedToken.role;
      }
      return session;
    },
  },
});
