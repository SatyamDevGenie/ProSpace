import { api } from "./api";
import type { IDesk, CreateDeskRequest, UpdateDeskRequest } from "@/types";

export const deskService = {
  getAll: async (): Promise<IDesk[]> => {
    const res = await api.get<IDesk[]>("/desks");
    return res.data;
  },
  getById: async (id: string): Promise<IDesk> => {
    const res = await api.get<IDesk>(`/desks/${id}`);
    return res.data;
  },
  create: async (data: CreateDeskRequest): Promise<IDesk> => {
    const res = await api.post<{ desk: IDesk }>("/desks", data);
    return res.data.desk;
  },
  update: async (id: string, data: UpdateDeskRequest): Promise<IDesk> => {
    const res = await api.put<{ desk: IDesk }>(`/desks/${id}`, data);
    return res.data.desk;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/desks/${id}`);
  },
};
