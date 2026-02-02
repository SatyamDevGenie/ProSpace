import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { userService } from "@/services/userService";
import type { UserState, IUser } from "@/types";

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
  allUsers: [],
  allUsersLoading: false,
  allUsersError: null,
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

export const fetchAllUsers = createAsyncThunk<IUser[], void, { rejectValue: string }>(
  "user/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      return await userService.admin.getAllUsers();
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
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.allUsersLoading = true;
        state.allUsersError = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.allUsersLoading = false;
        state.allUsers = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.allUsersLoading = false;
        state.allUsersError = action.payload ?? "Failed to fetch users";
        toast.error(action.payload ?? "Failed to load users");
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
