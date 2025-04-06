import { signIn } from "@/app/lib/auth";
import { AuthError } from "next-auth";

export function SignIn() {
  return (
    <form
      action={async (formData) => {
        "use server";
        try {
          await signIn("credentials", formData);
        } catch (error) {
          if (error instanceof AuthError)
            // Handle auth errors
            throw error; // Rethrow all other errors
        }
      }}
    >
      <label>
        Email
        <input name="email" type="email" />
      </label>
      <label>
        Password
        <input name="password" type="password" />
      </label>
      <button>Sign In</button>
    </form>
  );
}
