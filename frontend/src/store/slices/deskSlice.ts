import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { deskService } from "@/services/deskService";
import type { DeskState, IDesk, CreateDeskRequest, UpdateDeskRequest } from "@/types";

const initialState: DeskState = {
  desks: [],
  selectedDesk: null,
  isLoading: false,
  error: null,
};

export const fetchDesks = createAsyncThunk<IDesk[], void, { rejectValue: string }>(
  "desk/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await deskService.getAll();
    } catch (err: unknown) {
      return rejectWithValue((err as { message: string }).message);
    }
  }
);

export const fetchDeskById = createAsyncThunk<IDesk, string, { rejectValue: string }>(
  "desk/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await deskService.getById(id);
    } catch (err: unknown) {
      return rejectWithValue((err as { message: string }).message);
    }
  }
);

export const createDesk = createAsyncThunk<IDesk, CreateDeskRequest, { rejectValue: string }>(
  "desk/create",
  async (data, { rejectWithValue }) => {
    try {
      return await deskService.create(data);
    } catch (err: unknown) {
      return rejectWithValue((err as { message: string }).message);
    }
  }
);

export const updateDesk = createAsyncThunk<
  IDesk,
  { id: string; data: UpdateDeskRequest },
  { rejectValue: string }
>("desk/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    return await deskService.update(id, data);
  } catch (err: unknown) {
    return rejectWithValue((err as { message: string }).message);
  }
});

export const deleteDesk = createAsyncThunk<string, string, { rejectValue: string }>(
  "desk/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deskService.delete(id);
      return id;
    } catch (err: unknown) {
      return rejectWithValue((err as { message: string }).message);
    }
  }
);

const deskSlice = createSlice({
  name: "desk",
  initialState,
  reducers: {
    clearSelected: (state) => {
      state.selectedDesk = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDesks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDesks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.desks = action.payload;
      })
      .addCase(fetchDesks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to fetch desks";
        toast.error(action.payload ?? "Failed to load desks");
      })
      .addCase(fetchDeskById.fulfilled, (state, action) => {
        state.selectedDesk = action.payload;
      })
      .addCase(createDesk.fulfilled, (state, action) => {
        state.desks.push(action.payload);
        toast.success("Desk added successfully.");
      })
      .addCase(createDesk.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to create desk";
        toast.error(action.payload ?? "Failed to create desk");
      })
      .addCase(updateDesk.fulfilled, (state, action) => {
        const idx = state.desks.findIndex((d) => d._id === action.payload._id);
        if (idx !== -1) state.desks[idx] = action.payload;
        if (state.selectedDesk?._id === action.payload._id) {
          state.selectedDesk = action.payload;
        }
        toast.success("Desk updated successfully.");
      })
      .addCase(updateDesk.rejected, (_, action) => {
        toast.error(action.payload ?? "Failed to update desk");
      })
      .addCase(deleteDesk.fulfilled, (state, action) => {
        state.desks = state.desks.filter((d) => d._id !== action.payload);
        if (state.selectedDesk?._id === action.payload) {
          state.selectedDesk = null;
        }
        toast.success("Desk removed.");
      })
      .addCase(deleteDesk.rejected, (_, action) => {
        toast.error(action.payload ?? "Failed to delete desk");
      });
  },
});

export const { clearSelected, clearError } = deskSlice.actions;
export default deskSlice.reducer;
