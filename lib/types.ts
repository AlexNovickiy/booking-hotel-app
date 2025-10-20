export type CheckSession = {
  success: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  photo: string;
};

export type NewUser = {
  name: string;
  email: string;
  password: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type Hotel = {
  id: string;
  title: string;
  location: string;
  price: number;
  description: string;
  imageUrl: string;
  ratings_summary: {
    average_rating: number;
    cleanliness_score: number;
    location_score: number;
    total_reviews: number;
  };
};

export type NewListing = {
  title: string;
  location: string;
  description: string;
  price: number;
  imageUrl?: File;
};

export interface Review {
  user: User;
  rating: number;
  text: string;
  date: string;
}

export interface HotelDetails extends Hotel {
  reviews: Review[];
}

export interface HotelsResponse {
  hotels: Hotel[];
  totalPages: number;
  currentPage: number;
}
