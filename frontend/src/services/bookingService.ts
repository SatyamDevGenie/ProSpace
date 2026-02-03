import { api } from "./api";
import type {
  IBooking,
  CreateBookingRequest,
  UpdateBookingRequest,
  AdminCreateBookingRequest,
} from "@/types";

export const bookingService = {
  create: async (data: CreateBookingRequest): Promise<IBooking> => {
    const res = await api.post<IBooking>("/bookings/create", data);
    return res.data;
  },
  myHistory: async (): Promise<IBooking[]> => {
    const res = await api.get<IBooking[]>("/bookings/me/history");
    return res.data;
  },
  update: async (id: string, data: UpdateBookingRequest): Promise<IBooking> => {
    const res = await api.patch<IBooking>(`/bookings/me/${id}`, data);
    return res.data;
  },
  cancel: async (id: string, reason?: string): Promise<IBooking> => {
    const res = await api.patch<IBooking>(`/bookings/me/${id}/cancel`, {
      reason: reason ?? "",
    });
    return res.data;
  },
  admin: {
    create: async (data: AdminCreateBookingRequest): Promise<IBooking> => {
      const res = await api.post<IBooking>("/bookings/admin/create", data);
      return res.data;
    },
    all: async (): Promise<IBooking[]> => {
      const res = await api.get<IBooking[]>("/bookings/admin/all");
      return res.data;
    },
    approve: async (id: string): Promise<IBooking> => {
      const res = await api.patch<IBooking>(`/bookings/admin/approve/${id}`);
      return res.data;
    },
    reject: async (id: string, reason?: string): Promise<IBooking> => {
      const res = await api.patch<IBooking>(`/bookings/admin/reject/${id}`, {
        reason: reason ?? "",
      });
      return res.data;
    },
    cancel: async (id: string, reason?: string): Promise<IBooking> => {
      const res = await api.patch<IBooking>(`/bookings/admin/cancel/${id}`, {
        reason: reason ?? "",
      });
      return res.data;
    },
  },
};
