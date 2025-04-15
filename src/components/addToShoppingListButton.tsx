"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { addProductToList } from "@/app/lib/actions";

type AddToShoppingListButtonProps = {
  productId: string;
};

export default function AddToShoppingListButton({
  productId,
}: AddToShoppingListButtonProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddToList = async () => {
    if (!session) {
      setError("Log in to add products to your shopping list");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await addProductToList(productId);
      alert("Product added to your shopping list!");
    } catch (err: unknown | any | string) {
      setError(err.message || "Failed to add product to the shopping list.");
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
        Add to List
      </button>
      <div style={{ color: "red", marginTop: "10px" }}>{error} </div>
    </div>
  );
}
