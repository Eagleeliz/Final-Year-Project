import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  county: string;
  constituency: string;
  ward: string;
  userType: 'mother' | 'health_worker' | 'admin' | 'policy_maker';
  isActive: boolean;
  isEmailVerified: boolean;
  dateOfBirth?: string;
  profileImage?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    registerSuccess: (state) => {
      state.isLoading = false;
      state.error = null;
    },

    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        token: string;
      }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },

    updateUserData: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
      state.isLoading = false;
    },

    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },

    authError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    }
  },
});

export const {
  setCredentials,
  clearCredentials,
  updateUserData,
  authStart,
  authError,
  registerSuccess,
} = authSlice.actions;

export const logout = authSlice.actions.clearCredentials;

export default authSlice.reducer;