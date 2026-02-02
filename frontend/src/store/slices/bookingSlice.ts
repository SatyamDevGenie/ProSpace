import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { bookingService } from "@/services/bookingService";
import { userService } from "@/services/userService";
import type {
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

const setRejected = (state: BookingState, action: { payload?: unknown }) => {
  state.isLoading = false;
  state.error = (action.payload as string) ?? "An error occurred";
};

export const createBooking = createAsyncThunk<
  IBooking,
  CreateBookingRequest,
  { rejectValue: string }
>("booking/create", async (data, { rejectWithValue }) => {
  try {
    return await bookingService.create(data);
  } catch (err: unknown) {
    return rejectWithValue((err as { message: string }).message);
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
  { rejectValue: string }
>("booking/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await userService.updateBooking(id, data);
    return res.booking;
  } catch (err: unknown) {
    return rejectWithValue((err as { message: string }).message);
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
  { rejectValue: string }
>("booking/adminCreate", async (data, { rejectWithValue }) => {
  try {
    return await bookingService.admin.create(data);
  } catch (err: unknown) {
    return rejectWithValue((err as { message: string }).message);
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
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        const idx = state.myBookings.findIndex((b: IBooking) => b._id === action.payload._id);
        if (idx !== -1) state.myBookings[idx] = action.payload;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload;
      })
      .addCase(adminCreateBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings.unshift(action.payload);
      })
      .addCase(approveBooking.fulfilled, (state, action) => {
        const idx = state.bookings.findIndex((b: IBooking) => b._id === action.payload._id);
        if (idx !== -1) state.bookings[idx] = action.payload;
      })
      .addCase(rejectBooking.fulfilled, (state, action) => {
        const idx = state.bookings.findIndex((b: IBooking) => b._id === action.payload._id);
        if (idx !== -1) state.bookings[idx] = action.payload;
      })
      .addCase(adminCancelBooking.fulfilled, (state, action) => {
        const idx = state.bookings.findIndex((b: IBooking) => b._id === action.payload._id);
        if (idx !== -1) state.bookings[idx] = action.payload;
      })
      .addCase(createBooking.rejected, setRejected)
      .addCase(fetchMyBookings.rejected, setRejected)
      .addCase(fetchBookingHistory.rejected, setRejected)
      .addCase(updateBooking.rejected, setRejected)
      .addCase(cancelBooking.rejected, setRejected)
      .addCase(fetchAllBookings.rejected, setRejected)
      .addCase(adminCreateBooking.rejected, setRejected);
  },
});

export const { clearError } = bookingSlice.actions;
export default bookingSlice.reducer;
