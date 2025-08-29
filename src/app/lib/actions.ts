"use server";

import { auth } from "./auth";
import dbConnect from "@/app/lib/dbConnect";
import { RegisterValues } from "@/model/types/types";
import UserModel from "@/model/usersModel";
import bcrypt from "bcryptjs";

// Registration =============================================================

export const register = async (values: RegisterValues) => {
  const { email, password, name, image, role } = values;

  try {
    await dbConnect();

    // Check if the user already exists
    const userFound = await UserModel.findOne({ email });
    if (userFound) {
      return {
        error: "Email already exists!",
      };
    }

    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the user
    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
      image,
      role,
    });
    const savedUser = await user.save();

    // Convert the Mongoose document to a plain object
    const plainUser = savedUser.toObject();

    // Serialize the plain object
    const serializedUser = {
      ...plainUser,
      _id: plainUser._id.toString(), // Convert ObjectId to string
      created_at: plainUser.created_at.toISOString(), // Convert Date to string
      updated_at: plainUser.updated_at.toISOString(), // Convert Date to string
    };

    return { success: true, user: serializedUser };
  } catch (err) {
    console.error("Error during registration:", err);
    return {
      error: "An error occurred during registration.",
    };
  }
};

// Add Products to the Shopping List =========================================

export async function addProductToList(productId: string): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const session = await auth();

  if (!session || !session.user?.id) {
    throw new Error("Log in to add a product to the shopping list");
  }

  const userId = session.user.id;

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      productsList: productId,
    }),
  };

  try {
    const response = await fetch(
      `${baseUrl}/api/products-list/add-product-to-list`,
      requestOptions
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to add product to list");
    }

    console.log("Product added successfully :>> ", data);
  } catch (error) {
    console.log("Error adding product to list :>> ", error);
    throw error;
  }
}
