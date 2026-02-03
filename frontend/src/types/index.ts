/* ==================== API Models ==================== */

export type UserRole = "USER" | "ADMIN";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface IDesk {
  _id: string;
  deskNumber: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type BookingStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED"
  | "ADMIN_CANCELLED";

export interface IBooking {
  _id: string;
  user: string | IUser;
  desk: string | IDesk | null;
  date: string;
  status: BookingStatus;
  createdAt?: string;
  updatedAt?: string;
}

/* ==================== Auth ==================== */

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  message: string;
  token?: string;
  user: AuthUser;
}

/* ==================== API Request/Response ==================== */

export interface CreateBookingRequest {
  deskId: string;
  date: string;
}

export interface UpdateBookingRequest {
  deskId: string;
  date: string;
}

export interface AdminCreateBookingRequest {
  userId: string;
  deskId: string;
  date: string;
  status?: BookingStatus;
}

export interface CreateDeskRequest {
  deskNumber: string;
}

export interface UpdateDeskRequest {
  deskNumber?: string;
  isActive?: boolean;
}

export interface IReview {
  _id: string;
  user: string | IUser;
  rating: number;
  text: string;
  likedBy?: string[];
  likes?: number;
  likedByMe?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateReviewRequest {
  rating: number;
  text: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  text?: string;
}

/* ==================== Redux State ==================== */

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface DeskState {
  desks: IDesk[];
  selectedDesk: IDesk | null;
  isLoading: boolean;
  error: string | null;
}

export interface BookingState {
  bookings: IBooking[];
  myBookings: IBooking[];
  isLoading: boolean;
  error: string | null;
}

export interface UserState {
  profile: IUser | null;
  isLoading: boolean;
  error: string | null;
  allUsers: IUser[];
  allUsersLoading: boolean;
  allUsersError: string | null;
}

export interface ReviewState {
  reviews: IReview[];
  myReview: IReview | null;
  adminReviews: IReview[];
  isLoading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  desk: DeskState;
  booking: BookingState;
  user: UserState;
  review: ReviewState;
}

/* ==================== API Error ==================== */

export interface ApiError {
  message: string;
  error?: string;
  status?: number;
}
