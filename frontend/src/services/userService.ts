import { api } from "./api";
import type { IUser, IBooking, UpdateBookingRequest } from "@/types";

export const userService = {
  getProfile: async (): Promise<IUser> => {
    const res = await api.get<IUser>("/users/me");
    return res.data;
  },
  getMyBookings: async (): Promise<{ total: number; bookings: IBooking[] }> => {
    const res = await api.get<{ total: number; bookings: IBooking[] }>("/users/me/bookings");
    return res.data;
  },
  updateBooking: async (bookingId: string, data: UpdateBookingRequest): Promise<{ booking: IBooking }> => {
    const res = await api.patch<{ message: string; booking: IBooking }>(
      `/users/me/bookings/${bookingId}`,
      data
    );
    return { booking: res.data.booking };
  },
  admin: {
    getUserBookings: async (userId: string): Promise<{ total: number; bookings: IBooking[] }> => {
      const res = await api.get<{ total: number; bookings: IBooking[] }>(
        `/users/admin/${userId}/bookings`
      );
      return res.data;
    },
  },
};
