// Redux Auth Slice
// Handles authentication state management

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  IAuthState,
  IUser,
  ILoginRequest,
  ISignupRequest,
  IAuthResponse,
} from "../../interfaces";
import { axiosInstance } from "../../config";
import { CookieService } from "../../config/cookies";

// Async Thunks
export const loginUser = createAsyncThunk<
  IAuthResponse,
  ILoginRequest,
  { rejectValue: string }
>("auth/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    console.log("📤 Sending login request:", credentials);
    const response = await axiosInstance.post<any>(
      "/user/auth/login",
      credentials,
    );

    console.log("📨 Raw response:", JSON.stringify(response.data, null, 2));

    // Handle different response structures
    let authData = response.data;

    // If nested under .data, extract it
    if (response.data?.data && typeof response.data.data === "object") {
      authData = response.data.data;
    }

    console.log("🔍 Extracted auth data:", JSON.stringify(authData, null, 2));

    const { user, token, refreshToken } = authData;

    // Validate required fields - refreshToken is optional
    if (!user) {
      console.error("❌ User is missing:", {
        fullResponse: JSON.stringify(authData, null, 2),
      });
      return rejectWithValue("Invalid response: user data missing");
    }

    if (!token) {
      console.error("❌ Token is missing:", {
        fullResponse: JSON.stringify(authData, null, 2),
      });
      return rejectWithValue("Invalid response: token missing");
    }

    console.log("✅ Valid response received");
    console.log("   - User:", JSON.stringify(user, null, 2));
    console.log("   - Token present:", !!token);
    console.log("   - RefreshToken present:", !!refreshToken);

    // Store tokens in cookies
    CookieService.setAuthToken(token);
    if (refreshToken) {
      CookieService.setRefreshToken(refreshToken);
    }
    CookieService.setUserData(user);

    console.log("✅ Returning to Redux:", {
      user: user?.email,
      token: "present",
      refreshToken: refreshToken ? "present" : "using-token-as-refresh",
    });

    // Return the auth response with user data
    return {
      user,
      token,
      refreshToken: refreshToken || token,
    } as IAuthResponse;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || error.message || "Login failed";
    console.error("❌ Login error:", errorMessage);
    console.error(
      "❌ Full error:",
      JSON.stringify(
        {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        },
        null,
        2,
      ),
    );
    return rejectWithValue(errorMessage);
  }
});

export const signupUser = createAsyncThunk<
  IAuthResponse,
  ISignupRequest,
  { rejectValue: string }
>("auth/signupUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<{ data: IAuthResponse }>(
      "/user/auth/signup",
      userData,
    );

    // Extract user, token, and refreshToken from response
    const authData = response.data.data;
    const { user, token, refreshToken } = authData;

    // Store tokens in cookies
    CookieService.setAuthToken(token);
    CookieService.setRefreshToken(refreshToken);
    CookieService.setUserData(user);

    // Return the auth response with user data
    return authData;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || error.message || "Signup failed";
    console.error("Signup error:", errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const checkAuth = createAsyncThunk<IUser, void, { rejectValue: string }>(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      console.log("🔍 checkAuth - checking for saved token in cookies");
      const token = CookieService.getAuthToken();
      const userData = CookieService.getUserData();

      if (!token) {
        console.log("❌ checkAuth - no token found in cookies");
        return rejectWithValue("No token found");
      }

      console.log("✅ Token found:", token ? "present" : "missing");
      console.log("✅ User data in cookies:", userData);

      // If we have user data in cookies, return it immediately (offline mode)
      if (userData && userData.id) {
        console.log("✅ Using cached user data from cookies:", userData);
        return userData as IUser;
      }

      // Otherwise, verify with backend
      console.log("📤 Verifying token with backend...");
      const response = await axiosInstance.get<{ data: { user: IUser } }>(
        "/user/auth/me",
      );
      console.log("✅ User verified from backend:", response.data.data.user);
      return response.data.data.user;
    } catch (error: any) {
      console.error("❌ checkAuth error:", error);
      CookieService.removeAuthCookies();
      return rejectWithValue(
        error.response?.data?.message || "Auth check failed",
      );
    }
  },
);

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logoutUser",
  async () => {
    try {
      await axiosInstance.post("/user/auth/logout", {});
    } catch (error: any) {
      console.error("Logout error:", error);
    } finally {
      CookieService.removeAuthCookies();
    }
  },
);

const initialState: IAuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login User
    builder
      .addCase(loginUser.pending, (state) => {
        console.log("⏳ loginUser.pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<IAuthResponse>) => {
          console.log(
            "✅ loginUser.fulfilled - action.payload:",
            action.payload,
          );
          console.log(
            "✅ loginUser.fulfilled - action.payload.user:",
            action.payload?.user,
          );
          state.loading = false;
          // Ensure user data is properly set from the payload
          if (action.payload && action.payload.user) {
            console.log("✅ Setting user in Redux state:", action.payload.user);
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.error = null;
          } else {
            console.error("❌ No user in action.payload:", {
              payload: action.payload,
              user: action.payload?.user,
            });
          }
        },
      )
      .addCase(loginUser.rejected, (state, action) => {
        console.error("❌ loginUser.rejected:", action.payload);
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
      });

    // Signup User
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        signupUser.fulfilled,
        (state, action: PayloadAction<IAuthResponse>) => {
          state.loading = false;
          // Ensure user data is properly set from the payload
          if (action.payload && action.payload.user) {
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.error = null;
          }
        },
      )
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Signup failed";
        state.isAuthenticated = false;
      });

    // Check Auth
    builder
      .addCase(checkAuth.pending, (state) => {
        console.log("⏳ checkAuth.pending - restoring session from cookies");
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action: PayloadAction<IUser>) => {
        console.log("✅ checkAuth.fulfilled - user restored:", action.payload);
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state) => {
        console.log("❌ checkAuth.rejected - no valid session");
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      });

    // Logout User
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        state.loading = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
