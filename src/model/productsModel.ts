import mongoose from "mongoose";
import { ProductT, ReviewT } from "@/model/types/types";

const { Schema } = mongoose;

const reviewSchema = new Schema<ReviewT>({
  rating: { type: Number, require: true },
  comment: { type: String, require: true },
  date: { type: Date, default: Date.now },
  author: { type: String },
  email: { type: String },
});

const productsSchema = new Schema<ProductT>(
  {
    title: { type: String, require: true },
    description: String,
    category: String,
    price: { type: Number, require: true },
    discountPercentage: Number,
    rating: Number,
    stock: { type: Number, require: true },
    tags: [String],
    brand: String,
    sku: String,
    weight: Number,
    reservation: Boolean,
    reservationTime: Number,
    minReservationQty: Number,
    warranty: String,
    returnPolicy: String,
    width: Number,
    height: Number,
    depth: Number,
    reviews: [reviewSchema],
    thumbnail: String,
    images: [String],
    seller: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const ProductModel =
  mongoose.models.Product || mongoose.model("Product", productsSchema);

export default ProductModel;
