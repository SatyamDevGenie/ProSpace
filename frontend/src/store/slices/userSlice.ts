import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { userService } from "@/services/userService";
import type { UserState, IUser } from "@/types";

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
};

export const fetchProfile = createAsyncThunk<IUser, void, { rejectValue: string }>(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getProfile();
    } catch (err: unknown) {
      return rejectWithValue((err as { message: string }).message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to fetch profile";
        toast.error(action.payload ?? "Failed to load profile");
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
