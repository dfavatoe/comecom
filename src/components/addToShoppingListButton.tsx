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

    try {
      await addProductToList(productId);
      showToast("Product added to your shopping list!", "success");
    } catch (err: unknown) {
      console.error("Error adding product: ", err);

      let message = "Failed to add product to the shopping list.";
      if (err instanceof Error) {
        message = err.message;
      }

      showToast(message, "danger");
    } finally {
      setLoading(false);
    }
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
