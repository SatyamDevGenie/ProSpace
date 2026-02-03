import { api } from "./api";
import type { IReview, CreateReviewRequest, UpdateReviewRequest } from "@/types";

export const reviewService = {
  getAll: async (): Promise<IReview[]> => {
    const res = await api.get<IReview[]>("/reviews");
    return res.data;
  },
  getMyReview: async (): Promise<IReview | null> => {
    const res = await api.get<IReview | null>("/reviews/me");
    return res.data;
  },
  create: async (data: CreateReviewRequest): Promise<IReview> => {
    const res = await api.post<IReview>("/reviews", data);
    return res.data;
  },
  update: async (id: string, data: UpdateReviewRequest): Promise<IReview> => {
    const res = await api.patch<IReview>(`/reviews/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/reviews/${id}`);
  },
  toggleLike: async (id: string): Promise<IReview> => {
    const res = await api.patch<IReview>(`/reviews/${id}/like`);
    return res.data;
  },
  admin: {
    getAll: async (): Promise<IReview[]> => {
      const res = await api.get<IReview[]>("/reviews/admin/all");
      return res.data;
    },
  },
};
