
import { createSlice } from "@reduxjs/toolkit";



const token =
  typeof window !== "undefined" ? localStorage.getItem("usertoken") : null;

let user = null;

if (typeof window !== "undefined") {
  const stored = localStorage.getItem("user");
  if (stored) {
    try {
      user = JSON.parse(stored);
    } catch (err) {
      console.warn("Invalid user in localStorage, resetting...");
      localStorage.removeItem("user"); // remove corrupted value
      user = null;
    }
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: user,
    token: token,
    loading: false,
    error: null as string | null,
  },
  reducers: {
    login: (state, action) => {
   
      state.user = action.payload.user;
      state.token = action.payload.token;

      localStorage.setItem("usertoken", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
  
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("usertoken");
      localStorage.removeItem("user");
    
    },
  },
 
});

export const { logout, login } = authSlice.actions;
export default authSlice.reducer;
