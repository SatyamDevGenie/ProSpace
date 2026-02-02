import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { bookingService } from "@/services/bookingService";
import { userService } from "@/services/userService";
import type {
  ApiError,
  BookingState,
  IBooking,
  CreateBookingRequest,
  UpdateBookingRequest,
  AdminCreateBookingRequest,
} from "@/types";

const initialState: BookingState = {
  bookings: [],
  myBookings: [],
  isLoading: false,
  error: null,
};

const setLoading = (state: BookingState) => {
  state.isLoading = true;
  state.error = null;
};

const getErrorMessage = (payload: unknown): string => {
  if (typeof payload === "string") return payload;
  if (typeof payload === "object" && payload && "message" in payload)
    return String((payload as { message: string }).message);
  return "An error occurred";
};

const isConflictError = (payload: unknown): boolean =>
  typeof payload === "object" && payload !== null && (payload as { status?: number }).status === 409;

const setRejected = (state: BookingState, action: { payload?: unknown }) => {
  state.isLoading = false;
  state.error = getErrorMessage(action.payload);
};

export const createBooking = createAsyncThunk<
  IBooking,
  CreateBookingRequest,
  { rejectValue: { message: string; status?: number } }
>("booking/create", async (data, { rejectWithValue }) => {
  try {
    return await bookingService.create(data);
  } catch (err: unknown) {
    const e = err as ApiError;
    return rejectWithValue({ message: e.message, status: e.status });
  }
});

export const fetchMyBookings = createAsyncThunk<IBooking[], void, { rejectValue: string }>(
  "booking/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      const res = await userService.getMyBookings();
      return res.bookings;
    } catch (err: unknown) {
      return rejectWithValue((err as { message: string }).message);
    }
  }
);

export const fetchBookingHistory = createAsyncThunk<IBooking[], void, { rejectValue: string }>(
  "booking/fetchHistory",
  async (_, { rejectWithValue }) => {
    try {
      return await bookingService.myHistory();
    } catch (err: unknown) {
      return rejectWithValue((err as { message: string }).message);
    }
  }
);

export const updateBooking = createAsyncThunk<
  IBooking,
  { id: string; data: UpdateBookingRequest },
  { rejectValue: { message: string; status?: number } }
>("booking/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await userService.updateBooking(id, data);
    return res.booking;
  } catch (err: unknown) {
    const e = err as ApiError;
    return rejectWithValue({ message: e.message, status: e.status });
  }
});

export const cancelBooking = createAsyncThunk<IBooking, string, { rejectValue: string }>(
  "booking/cancel",
  async (id, { rejectWithValue }) => {
    try {
      return await bookingService.cancel(id);
    } catch (err: unknown) {
      return rejectWithValue((err as { message: string }).message);
    }
  }
);

export const fetchAllBookings = createAsyncThunk<IBooking[], void, { rejectValue: string }>(
  "booking/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await bookingService.admin.all();
    } catch (err: unknown) {
      return rejectWithValue((err as { message: string }).message);
    }
  }
);

export const adminCreateBooking = createAsyncThunk<
  IBooking,
  AdminCreateBookingRequest,
  { rejectValue: { message: string; status?: number } }
>("booking/adminCreate", async (data, { rejectWithValue }) => {
  try {
    return await bookingService.admin.create(data);
  } catch (err: unknown) {
    const e = err as ApiError;
    return rejectWithValue({ message: e.message, status: e.status });
  }
});

export const approveBooking = createAsyncThunk<IBooking, string, { rejectValue: string }>(
  "booking/approve",
  async (id, { rejectWithValue }) => {
    try {
      return await bookingService.admin.approve(id);
    } catch (err: unknown) {
      return rejectWithValue((err as { message: string }).message);
    }
  }
);

export const rejectBooking = createAsyncThunk<IBooking, string, { rejectValue: string }>(
  "booking/reject",
  async (id, { rejectWithValue }) => {
    try {
      return await bookingService.admin.reject(id);
    } catch (err: unknown) {
      return rejectWithValue((err as { message: string }).message);
    }
  }
);

export const adminCancelBooking = createAsyncThunk<IBooking, string, { rejectValue: string }>(
  "booking/adminCancel",
  async (id, { rejectWithValue }) => {
    try {
      return await bookingService.admin.cancel(id);
    } catch (err: unknown) {
      return rejectWithValue((err as { message: string }).message);
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, setLoading)
      .addCase(fetchMyBookings.pending, setLoading)
      .addCase(fetchBookingHistory.pending, setLoading)
      .addCase(updateBooking.pending, setLoading)
      .addCase(cancelBooking.pending, setLoading)
      .addCase(fetchAllBookings.pending, setLoading)
      .addCase(adminCreateBooking.pending, setLoading)
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myBookings.unshift(action.payload);
        state.bookings.unshift(action.payload);
        toast.success("Booking created! Awaiting approval.");
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myBookings = action.payload;
      })
      .addCase(fetchBookingHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myBookings = action.payload;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        const idx = state.myBookings.findIndex((b: IBooking) => b._id === action.payload._id);
        if (idx !== -1) state.myBookings[idx] = action.payload;
        const aidx = state.bookings.findIndex((b: IBooking) => b._id === action.payload._id);
        if (aidx !== -1) state.bookings[aidx] = action.payload;
        toast.success("Booking updated successfully.");
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        const idx = state.myBookings.findIndex((b: IBooking) => b._id === action.payload._id);
        if (idx !== -1) state.myBookings[idx] = action.payload;
        toast.success("Booking cancelled.");
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload;
      })
      .addCase(adminCreateBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings.unshift(action.payload);
        toast.success("Booking created for user.");
      })
      .addCase(approveBooking.fulfilled, (state, action) => {
        const idx = state.bookings.findIndex((b: IBooking) => b._id === action.payload._id);
        if (idx !== -1) state.bookings[idx] = action.payload;
        toast.success("Booking approved.");
      })
      .addCase(rejectBooking.fulfilled, (state, action) => {
        const idx = state.bookings.findIndex((b: IBooking) => b._id === action.payload._id);
        if (idx !== -1) state.bookings[idx] = action.payload;
        toast.success("Booking rejected.");
      })
      .addCase(adminCancelBooking.fulfilled, (state, action) => {
        const idx = state.bookings.findIndex((b: IBooking) => b._id === action.payload._id);
        if (idx !== -1) state.bookings[idx] = action.payload;
        toast.success("Booking cancelled by admin.");
      })
      .addCase(createBooking.rejected, (state, action) => {
        setRejected(state, action);
        const msg = getErrorMessage(action.payload);
        isConflictError(action.payload)
          ? toast.warning(msg)
          : toast.error(msg || "Failed to create booking");
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        setRejected(state, action);
        toast.error(action.payload ?? "Failed to load bookings");
      })
      .addCase(fetchBookingHistory.rejected, (state, action) => {
        setRejected(state, action);
        toast.error(action.payload ?? "Failed to load booking history");
      })
      .addCase(updateBooking.rejected, (state, action) => {
        setRejected(state, action);
        const msg = getErrorMessage(action.payload);
        isConflictError(action.payload)
          ? toast.warning(msg)
          : toast.error(msg || "Failed to update booking");
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        setRejected(state, action);
        toast.error(action.payload ?? "Failed to cancel booking");
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        setRejected(state, action);
        toast.error(action.payload ?? "Failed to load bookings");
      })
      .addCase(adminCreateBooking.rejected, (state, action) => {
        setRejected(state, action);
        const msg = getErrorMessage(action.payload);
        isConflictError(action.payload)
          ? toast.warning(msg)
          : toast.error(msg || "Failed to create booking");
      })
      .addCase(approveBooking.rejected, (_, action) => {
        toast.error(action.payload ?? "Failed to approve booking");
      })
      .addCase(rejectBooking.rejected, (_, action) => {
        toast.error(action.payload ?? "Failed to reject booking");
      })
      .addCase(adminCancelBooking.rejected, (_, action) => {
        toast.error(action.payload ?? "Failed to cancel booking");
      });
  },
});

export const { clearError } = bookingSlice.actions;
export default bookingSlice.reducer;
