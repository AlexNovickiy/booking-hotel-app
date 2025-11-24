export type CheckSession = {
  status: number;
  message: string;
  data: {
    accessToken: string;
  };
};

export type User = {
  _id: string;
  name: string;
  email: string;
  photo?: string;
};

export type UserResponse = {
  status: number;
  message: string;
  data: User;
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
  _id: string;
  title: string;
  location: string;
  price: number;
  description: string;
  imageUrl: string;
  maxGuests: number;
  ownerId: string;
  reviews: Review[];
  ratings_summary: {
    average_rating: number;
    cleanliness_score: number;
    location_score: number;
    total_reviews: number;
  };
};

export type HotelResponse = {
  status: number;
  message: string;
  data: Hotel;
};

export type OwnListingsResponse = {
  status: number;
  message: string;
  data: Hotel[];
};

export type NewListing = {
  title: string;
  location: string;
  description: string;
  price: number;
  imageUrl?: File;
};

export interface Review {
  _id: string;
  user: {
    name: string;
    photo: string;
  };
  rating: number;
  text: string;
  date: string;
  cleanliness_score: number;
  location_score: number;
}

export interface NewReview {
  hotelId: string;
  text: string;
  rating: number;
  cleanliness_score: number;
  location_score: number;
}

export interface ResponseReview {
  status: number;
  message: string;
  data: Review;
}

export interface HotelsResponse {
  status: number;
  message: string;
  data: {
    hotels: Hotel[];
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
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

export type ResponseClassificationAll = {
  status: number;
  message: string;
  data: ClassificationAll;
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
  _id: string;
  hotelId: string;
  userId: string;
  hotel: Pick<Hotel, '_id' | 'title' | 'imageUrl' | 'location' | 'price'>;
  user: Pick<User, '_id' | 'name' | 'email'>;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
  specialRequests?: string;
}

export interface BookingsResponse {
  status: number;
  message: string;
  data: Booking[];
}

export interface BookingResponse {
  status: number;
  message: string;
  data: Booking;
}
