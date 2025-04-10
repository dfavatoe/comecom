"use server";

import { auth } from "./auth";
import { baseUrl } from "./urls";

export async function addProductToList(productId: string): Promise<void> {
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
      `${baseUrl}/api/shopping-list/add-product-to-list`,
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
