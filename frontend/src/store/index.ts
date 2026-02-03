import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import deskReducer from "./slices/deskSlice";
import bookingReducer from "./slices/bookingSlice";
import userReducer from "./slices/userSlice";
import reviewReducer from "./slices/reviewSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    desk: deskReducer,
    booking: bookingReducer,
    user: userReducer,
    review: reviewReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
