import { ObjectId } from "mongoose";
import { Role } from "../../../nextauth";

export type UserFull = {
  _id: string;
  name: string;
  email: string;
  password: string;
  image: string;
  storeCoverImage: string;
  avatar: string;
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
  storeCoverImage: string;
  avatar: string;
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
  _id: string;
};

export type Reservation = {
  _id: string;
  buyerId: string;
  sellerId: string;
  productId: ProductT;
  startTime: string;
  expiresAt: string;
  status: Status;
};

export enum Status {
  active = "active",
  completed = "completed",
  cancelled = "cancelled",
}

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

export type RegisterValues = Pick<
  UserFull,
  "name" | "password" | "email" | "image" | "role"
>;

export type JWTToken = {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  role?: Role;
  avatar?: string;
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

//Cloudinary Types
export type CloudinaryUploadError = Error & {
  http_code?: number;
  name?: string;
  message: string;
};

export type CloudinaryUploadResult = {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  original_filename: string;
  folder?: string;
};

// Reviews Responses
export interface PostNewReviewResponse {
  message: string;
  product: ProductT;
  error: string;
}

export interface GetReviewsResponse {
  message: string;
  reviews: ReviewT[];
  error: string;
}

//Chat with Seller

export type Chatroom = {
  _id: string;
  messageId: ObjectId | null;
  participants: UserFull[];
  created_at: string;
  updated_at: string;
};

export type ChatroomAsString = {
  _id: string;
  messageId: ObjectId | null;
  participants: string[];
  created_at: string;
  updated_at: string;
};

export type Message = {
  _id: string;
  chatroomId: ObjectId;
  messageText: string;
  authorId: ObjectId | null;
  authorName?: string;
  created_at: string;
  updated_at: string;
};

//Post - Social

export interface Comment {
  _id: string;
  user: {
    _id: string;
    name: string;
  } | null;
  text: string;
}

export interface Post {
  _id: string;
  imageUrl: string;
  caption: string;
  user: {
    _id: string;
    name: string;
    image?: string;
    avatar?: string;
  };
  likes: string[];
  comments: Comment[];
  createdAt: string;
}
