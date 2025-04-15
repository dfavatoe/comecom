"use client";

import { signIn } from "next-auth/react";
import { useState, useRef } from "react";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import Link from "next/link";

function Login() {
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const ref = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const handleLogin = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    setError(null);
    setSuccess(null);

    const result = await signIn("credentials", {
      redirect: false, //If set to `false`, the `signIn` method will return the URL to redirectTo instead of redirecting automatically to the same page.
      email,
      password,
    });

    if (result?.error) {
      setError("Invalid credentials. Please try again.");
    } else if (result?.ok) {
      setSuccess("Successfully logged in!");

      //Reset form
      if (ref.current) {
        ref.current.reset();
      }

      // Redirect after login
      setTimeout(() => {
        router.push("/products");
      }, 5000);
    }
  };

  return (
    <Container style={{ maxWidth: "600px" }}>
      <h1 className="m-4 text-center">Login</h1>

      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      {session?.user ? (
        <div>
          <h3>You are logged in. 🔌</h3>
          <p>Hi {session.user.name} Welcome!</p>
        </div>
      ) : (
        <p>Log in to access your account and continue shopping.</p>
      )}
      <Form
        ref={ref}
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          await handleLogin(formData);
        }}
      >
        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            id="email"
            placeholder="Enter email"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            required
          />
        </Form.Group>
        {session?.user ? (
          <>
            <p>
              Click on the Products button to continue your shopping experience.
            </p>

            <Button
              onClick={() => {
                redirect("/products");
              }}
              type="button"
              className="mb-2"
              variant="warning"
            >
              Products
            </Button>
            <p className="mb-0">or</p>
            <Button onClick={() => router.back()} variant="link">
              or click here to go to the previous page.
            </Button>
          </>
        ) : (
          <>
            <Button className="mb-2" variant="warning" type="submit">
              Login
            </Button>
            <div>Still not registered?</div>
            <Link href={"/signup"}>Sign Up</Link>
          </>
        )}
      </Form>
      {/* <ModalAlert
          showAlert={showAlert}
          alertText={alertText}
          setShowAlert={setShowAlert}
        /> */}
    </Container>
  );
}

export default Login;
