"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { addProductToList } from "@/app/lib/actions";
import { useToast } from "@/hooks/useToast";

type AddToShoppingListButtonProps = {
  productId: string;
};

export default function AddToShoppingListButton({
  productId,
}: AddToShoppingListButtonProps) {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleAddToList = async () => {
    if (!session) {
      showToast("Log in to add products to your shopping list", "warning");
      return;
    }

    setLoading(true);

    const userId = session?.user?.id;

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
        `api/products-list/add-product-to-list`,
        requestOptions
      );

      const data = await response.json();
      console.log("API response :>> ", response.status, data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to add product to list");
      }

      console.log("Product added successfully :>> ", data);
    } catch (error) {
      console.log("Error adding product to list :>> ", error);
      throw error;
    } finally {
      setLoading(false);
    }
    // try {
    //   // await addProductToList(productId);
    //   await fetch('/api/products-list/add-product-to-list')
    //   showToast("Product added to your shopping list!", "success");
    // } catch (err: unknown) {
    //   console.error("Error adding product: ", err);

    //   let message = "Failed to add product to the shopping list.";
    //   if (err instanceof Error) {
    //     message = err.message;
    //   }

    //   showToast(message, "danger");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div>
      <button
        onClick={handleAddToList}
        disabled={loading}
        className="btn btn-warning"
      >
        {loading ? "Adding..." : "Add to List"}
      </button>
    </div>
  );
}
