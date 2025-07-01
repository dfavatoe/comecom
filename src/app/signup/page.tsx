"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Container, Form, Image, InputGroup } from "react-bootstrap";
import { register } from "@/app/lib/actions";
import { useToast } from "@/hooks/useToast";
import { useSession } from "next-auth/react";
import "@/app/globals.css";

export default function Register() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();
  const ref = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    image: null as File | null, // Store the selected image file
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, image: file }));

      // Generate a preview of the image
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`/api/upload/image-users`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    const data = await response.json();
    return data.url; // Return the uploaded image URL
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let uploadedImageUrl = "";
      if (formData.image) {
        uploadedImageUrl = await uploadImageToCloudinary(formData.image);
      }

      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        image: uploadedImageUrl, // Pass the Cloudinary image URL
      });

      if (result.error) {
        throw new Error(result.error);
      }
      showToast("Registration successful!", "success");
      ref.current?.reset();
      setImagePreview(null);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred during registration.";

      showToast(errorMessage, "danger");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* <div
        style={{
          background: "var(--secondary)",
          padding: "2rem",
          border: "3px solid var(--primary)",
          borderRadius: "25px",
        }}
      ></div> */}
      <Container
        className="justify-content-center"
        style={{ maxWidth: "600px" }}
      >
        <h1 className="m-4 mb-2" style={{ textAlign: "center" }}>
          Sign Up
        </h1>
        <br />
        <div className="combox mb-2">
          {!session?.user ? (
            <p>
              Join us today for exclusive deals, fast checkout, and a seamless
              shopping experience!
            </p>
          ) : (
            <div>
              <h2>Welcome!</h2>
              <h3>
                Congratulations, you have successfully created an account!!! 🙌
              </h3>
            </div>
          )}

          <Form ref={ref} onSubmit={handleSubmit}>
            {imagePreview && (
              <Image
                className="mb-4"
                width={200}
                src={imagePreview}
                alt="user's image preview"
                rounded
              />
            )}

            <Form.Group className="mb-3 justify-content-center">
              <Form.Label>User name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                id="signup-user-name"
                placeholder="Enter a user name"
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3 justify-content-center">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                id="signup-email"
                placeholder="Enter your email"
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                id="signup-password"
                placeholder="Choose a password"
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Upload your profile picture</Form.Label>
              <Form.Group controlId="formFile" className="mb-3">
                <InputGroup className="mb-4">
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </InputGroup>
              </Form.Group>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="d-block">Sign up as:</Form.Label>
              <Form.Check
                inline
                type="radio"
                label="Buyer"
                name="role"
                value="buyer"
                checked={formData.role === "buyer"}
                onChange={handleInputChange}
              />
              <Form.Check
                inline
                type="radio"
                label="Seller"
                name="role"
                value="seller"
                checked={formData.role === "seller"}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Text className="d-block mb-4" muted>
              Selecting &apos;Buyer&apos; allows you to browse products and
              create a shopping list. <br /> As a &apos;Seller&apos; you can
              register your physical store and list products on our online
              platform.
            </Form.Text>

            <Button
              type="submit"
              className="mb-4"
              variant="warning"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </Button>
          </Form>
        </div>
      </Container>
    </>
  );
}
