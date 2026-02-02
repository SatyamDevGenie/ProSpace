import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "@/services/authService";
import type { AuthState, LoginCredentials, RegisterCredentials, AuthUser } from "@/types";

const token = localStorage.getItem("token");

const initialState: AuthState = {
  user: null,
  token: token,
  isAuthenticated: !!token,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk<
  { user: AuthUser; token?: string },
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const data = await authService.login(credentials);
    return { user: data.user, token: data.token };
  } catch (err: unknown) {
    return rejectWithValue((err as { message: string }).message);
  }
});

export const register = createAsyncThunk<
  { user: AuthUser },
  RegisterCredentials,
  { rejectValue: string }
>("auth/register", async (credentials, { rejectWithValue }) => {
  try {
    const data = await authService.register(credentials);
    return { user: data.user };
  } catch (err: unknown) {
    return rejectWithValue((err as { message: string }).message);
  }
});

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (err: unknown) {
      return rejectWithValue((err as { message: string }).message);
    }
  }
);

export const fetchProfile = createAsyncThunk<
  AuthUser,
  void,
  { rejectValue: string }
>("auth/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const { userService } = await import("@/services/userService");
    const profile = await userService.getProfile();
    return { id: profile._id, name: profile.name, email: profile.email, role: profile.role };
  } catch (err: unknown) {
    return rejectWithValue((err as { message: string }).message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: { payload: AuthUser | null }) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token ?? state.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Login failed";
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Registration failed";
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // Fetch profile
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem("token");
      })
      .addCase(logout.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem("token");
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
