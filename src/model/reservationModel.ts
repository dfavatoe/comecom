import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  startTime: { type: Date, required: true },
  expiresAt: { type: Date, required: true },
  status: {
    type: String,
    enum: ["active", "completed", "cancelled"],
    default: "active",
  },
});

export const ReservationModel =
  mongoose.models.Reservation ||
  mongoose.model("Reservation", ReservationSchema);
