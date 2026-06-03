import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import client from "../../api/client";

export const fetchDashboard = createAsyncThunk("dashboard/fetch", async () => {
  const res = await client.get("/dashboard");
  return res.data; // dashboard object or null
});

export const saveDashboard = createAsyncThunk("dashboard/save", async (fields) => {
  const res = await client.put("/dashboard", fields);
  return res.data;
});

export const resetDashboard = createAsyncThunk("dashboard/reset", async () => {
  await client.delete("/dashboard");
  return null;
});

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    data: null,
    loaded: false,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loaded = true;
        state.error = null;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        // Mark loaded so the UI can show an error instead of hanging on "Loading…".
        state.loaded = true;
        state.error = action.error.message;
      })
      .addCase(saveDashboard.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(resetDashboard.fulfilled, (state) => {
        state.data = null;
      });
  },
});

export default dashboardSlice.reducer;
