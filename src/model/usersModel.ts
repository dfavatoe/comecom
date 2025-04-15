import mongoose, { Schema, model, models } from "mongoose";
import { UserFull, Address } from "@/model/types/types";

const addressSchema = new Schema<Address>({
  streetName: { type: String, required: true },
  streetNumber: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: false },
  country: { type: String, required: false },
  postalcode: { type: String, required: true },
  latitude: Number,
  longitude: Number,
});

const usersSchema = new Schema<UserFull>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      validate: {
        validator: function (v: string) {
          return v.length > 2;
        },
        message: (props) =>
          `User name "${props.value}" should be longer than 2 characters!`,
      },
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email is invalid",
      ],
    },
    password: {
      type: String,
      required: true,
      select: false, // prevents password from being returned by default
    },

    address: addressSchema,

    image: {
      type: String,
      required: false,
      //Other possibility for providing default image
      default:
        "https://img.freepik.com/vecteurs-libre/homme-affaires-caractere-avatar-isole_24877-60111.jpg",
    },

    role: {
      type: String,
      enum: ["buyer", "seller"], //a set of related values with descriptive names, often used to represent fixed options
      default: "buyer",
      required: true,
    }, // Role-based access
    productsList: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const UserModel = mongoose.models.User || mongoose.model("User", usersSchema);

export default UserModel;
