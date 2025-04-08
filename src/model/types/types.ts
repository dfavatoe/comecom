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
  id: string;
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

export type LoginCredentials = Pick<UserFull, "name" | "password" | "email">; // Attention '|' means 'and' here

export type RegisterCredentials = Omit<UserFull, "id">;

export type JWTToken = {
  id: string;
  name?: string;
  email?: string;
  image?: string;
};

export type Chat = {
  chatroomId: string;
  messageText: string;
  messageId: string;
  sender: string;
  participants: [];
  //   role: string;
  createdAt: string;
  updatedAt: string;
};

export type Message = {
  messageId: string;
  messageText: string;
  chatroomId: string;
  senderId: string; // SENDER here oder im chat?
  // participants:[] ;
  //   role: string;
  createdAt: string;
  updatedAt: string;
};
