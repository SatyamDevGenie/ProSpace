import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { reviewService } from "@/services/reviewService";
import type { IReview, CreateReviewRequest, UpdateReviewRequest } from "@/types";
import type { ReviewState } from "@/types";

const initialState: ReviewState = {
  reviews: [],
  myReview: null,
  adminReviews: [],
  isLoading: false,
  error: null,
};

export const fetchReviews = createAsyncThunk<IReview[], void, { rejectValue: string }>(
  "review/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await reviewService.getAll();
    } catch (err: unknown) {
      return rejectWithValue((err as { message: string }).message);
    }
  }
);

export const fetchMyReview = createAsyncThunk<IReview | null, void, { rejectValue: string }>(
  "review/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      return await reviewService.getMyReview();
    } catch (err: unknown) {
      return rejectWithValue((err as { message: string }).message);
    }
  }
);

export const createReview = createAsyncThunk<IReview, CreateReviewRequest, { rejectValue: string }>(
  "review/create",
  async (data, { rejectWithValue }) => {
    try {
      return await reviewService.create(data);
    } catch (err: unknown) {
      return rejectWithValue((err as { message: string }).message);
    }
  }
);

export const updateReview = createAsyncThunk<
  IReview,
  { id: string; data: UpdateReviewRequest },
  { rejectValue: string }
>("review/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    return await reviewService.update(id, data);
  } catch (err: unknown) {
    return rejectWithValue((err as { message: string }).message);
  }
});

export const deleteReview = createAsyncThunk<string, string, { rejectValue: string }>(
  "review/delete",
  async (id, { rejectWithValue }) => {
    try {
      await reviewService.delete(id);
      return id;
    } catch (err: unknown) {
      return rejectWithValue((err as { message: string }).message);
    }
  }
);

export const toggleLike = createAsyncThunk<IReview, string, { rejectValue: string }>(
  "review/toggleLike",
  async (id, { rejectWithValue }) => {
    try {
      return await reviewService.toggleLike(id);
    } catch (err: unknown) {
      return rejectWithValue((err as { message: string }).message);
    }
  }
);

export const fetchAdminReviews = createAsyncThunk<IReview[], void, { rejectValue: string }>(
  "review/fetchAdmin",
  async (_, { rejectWithValue }) => {
    try {
      return await reviewService.admin.getAll();
    } catch (err: unknown) {
      return rejectWithValue((err as { message: string }).message);
    }
  }
);

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? null;
      })
      .addCase(fetchMyReview.fulfilled, (state, action) => {
        state.myReview = action.payload;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.myReview = action.payload;
        const idx = state.reviews.findIndex((r) => r._id === action.payload._id);
        if (idx === -1) state.reviews.unshift({ ...action.payload, likes: 0, likedByMe: false });
        toast.success("Review submitted!");
      })
      .addCase(createReview.rejected, (_, action) => {
        toast.error(action.payload ?? "Failed to submit review");
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.myReview = action.payload;
        const idx = state.reviews.findIndex((r) => r._id === action.payload._id);
        if (idx !== -1) state.reviews[idx] = { ...state.reviews[idx], ...action.payload };
        toast.success("Review updated!");
      })
      .addCase(updateReview.rejected, (_, action) => {
        toast.error(action.payload ?? "Failed to update review");
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.myReview = null;
        state.reviews = state.reviews.filter((r) => r._id !== action.payload);
        toast.success("Review deleted");
      })
      .addCase(deleteReview.rejected, (_, action) => {
        toast.error(action.payload ?? "Failed to delete review");
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const idx = state.reviews.findIndex((r) => r._id === action.payload._id);
        if (idx !== -1) {
          state.reviews[idx] = {
            ...state.reviews[idx],
            likes: action.payload.likes ?? 0,
            likedByMe: action.payload.likedByMe ?? false,
          };
        }
      })
      .addCase(fetchAdminReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAdminReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminReviews = action.payload.map((r) => ({
          ...r,
          likes: Array.isArray(r.likedBy) ? r.likedBy.length : 0,
        }));
      })
      .addCase(fetchAdminReviews.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload ?? "Failed to load reviews");
      });
  },
});

export const { clearError } = reviewSlice.actions;
export default reviewSlice.reducer;
