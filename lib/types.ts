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
  rating: number;
  text: string;
  cleanliness_score: number;
  location_score: number;
}

export interface NewReview extends Review {
  hotelId: string;
}

export interface ResponseRewiew {
  user: User;
  date: string;
  rating: number;
  text: string;
  cleanliness_score: number;
  location_score: number;
}

export interface HotelDetails extends Hotel {
  reviews: ResponseRewiew[];
}

export interface HotelsResponse {
  hotels: Hotel[];
  totalPages: number;
  currentPage: number;
}

export type BookingFormData = {
  checkIn: string;
  checkOut: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  specialRequests?: string;
};

export type SessionResponse = {
  data: {
    accessToken: string;
  };
};

export type ClassificationHotel = { id: string; title: string; score: number };
export type ClassificationAll = {
  average: ClassificationHotel[];
  cleanliness: ClassificationHotel[];
  location: ClassificationHotel[];
};
export type ClassificationTab = 'average' | 'cleanliness' | 'location';

export interface NewBooking {
  hotelId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

export interface Booking {
  id: string;
  hotel: Pick<Hotel, 'id' | 'title' | 'imageUrl' | 'location' | 'price'>;
  user: Pick<User, 'id' | 'name' | 'email'>;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  specialRequests?: string;
}
