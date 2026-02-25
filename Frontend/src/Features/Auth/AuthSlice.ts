import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// 1. User Interface aligned with your Drizzle schema and AuthController
export interface User {
  id: string; // or number, based on your backend
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  county: string;
  userType: 'mother' | 'health_worker' | 'admin' | 'policy_maker';
  isActive: boolean;
  isEmailVerified: boolean;

  dateOfBirth?: string;
  subCounty?: string;
  village?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  requireProfileCompletion: boolean; 
  isLoading: boolean;
  error: string | null;
}

// 2. Simplified Initial State
// Redux Persist handles the loading of data from storage automatically
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  requireProfileCompletion: false, 
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
    // 1. ADDED: This stops the "Generating account..." spinner in Register.tsx
    registerSuccess: (state) => {
      state.isLoading = false; 
      state.error = null;
    },

    // 3. SET CREDENTIALS
    // Logic included to auto-bypass profile completion for non-mothers
    setCredentials: (
      state,
      action: PayloadAction<{ 
        user: User; 
        token: string; 
        requireProfileCompletion: boolean 
      }>
    ) => {
      const { user, token, requireProfileCompletion } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isLoading = false;

      // RULE: Only mothers are forced to complete profiles. 
      // Admins and Policy Makers go straight to dashboard.
      if (user.userType === 'admin' || user.userType === 'policy_maker') {
        state.requireProfileCompletion = false;
      } else {
        state.requireProfileCompletion = requireProfileCompletion;
      }
    },

    // 4. COMPLETE PROFILE: Called when a Mother finishes onboarding
    completeProfile: (state) => {
      state.requireProfileCompletion = false;
      state.isLoading = false;
    },

    // 5. UPDATE DATA: For profile edits
    updateUserData: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
      state.isLoading = false;  // FIX: Stops spinners during profile updates
    },

    // 6. CLEAR CREDENTIALS: Logout logic
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.requireProfileCompletion = false;
      state.isLoading = false; // Always reset on logout
      state.error = null;
      // Note: Redux Persist will clear the storage when it sees this state change
    },

    authError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;// Stops spinners when an error occurs
      state.error = action.payload;
    }
  },
});

export const { 
  setCredentials, 
  clearCredentials, 
  updateUserData, 
  completeProfile, 
  authStart, 
  authError,
  registerSuccess 
} = authSlice.actions;

export default authSlice.reducer;