import { ObjectId } from "mongoose";
import { Dispatch } from "react";
import { Role } from "../../../nextauth";

export type UserFull = {
  _id: string;
  name: string;
  email: string;
  password: string;
  image: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  address: Address;
  productsList: ProductT[];
};

interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  address: Address;
  productsList: ProductT[];
}

export type Address = {
  streetName: string;
  streetNumber: string;
  city: string;
  state: string;
  country: string;
  postalcode: string;
  latitude: number;
  longitude: number;
};

export interface ProductT {
  width: number;
  height: number;
  depth: number;
  reviews: ReviewT[];
  _id: string;
  title: string;
  description: string;
  category: string;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  thumbnail: string;
  images: string[];
  price: number;
  seller: User;
  reservation: boolean;
  reservationTime: number;
  minReservationQty: number;
  warranty: string;
  returnPolicy: string;
}

export type ReviewT = {
  author: string;
  email: string;
  rating: number | null;
  comment: string;
  date: Date;
  id: string;
};

export type addProductT = Pick<
  ProductT,
  | "title"
  | "brand"
  | "description"
  | "category"
  | "price"
  | "stock"
  | "images"
  | "warranty"
  | "returnPolicy"
  | "reservation"
  | "minReservationQty"
  | "reservationTime"
  | "discountPercentage"
  | "rating"
  | "width"
  | "height"
  | "depth"
> & { seller: string };

export type LoginCredentials = Pick<UserFull, "name" | "password" | "email">; // Attention '|' means 'and' here

export type RegisterCredentials = Omit<UserFull, "id">;

export type JWTToken = {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  role?: Role;
};

export type ModalAlertProps = {
  showAlert: boolean;
  setShowAlert: Dispatch<React.SetStateAction<boolean>>;
  alertText: string;
};

export interface UpdateAddressOkResponse {
  message: string;
  user: UserFull;
  error: string;
}

export interface GetShopInfo {
  message: string;
  amount: number;
  sellerInfo: UserFull;
  productsBySeller: ProductT[];
  error: string;
}

//For getShoppingList

export interface GetProductsListResponse {
  message: string;
  amount: number;
  records: ProductsList[];
}

export interface ProductsList {
  _id: string;
  title: string;
  price: number;
  rating?: number;
  seller: User;
  images: string[];
  reservation: boolean;
  reservationTime: number;
}

export interface GETSellersProdutsResponse {
  message: string;
  amount: number;
  products: ProductT[];
}

export type Chatroom = {
  _id: string;
  messageId: ObjectId | null;
  participants: [{}];
  created_at: string;
  updated_at: string;
};

export type Message = {
  _id: string;
  chatroomId: ObjectId;
  messageText: string;
  authorId: ObjectId | null;
  created_at: string;
  updated_at: string;
};
