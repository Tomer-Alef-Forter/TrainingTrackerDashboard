import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import client from "../../api/client";

export const fetchTasks = createAsyncThunk("tasks/fetch", async () => {
  const res = await client.get("/tasks");
  return res.data;
});

export const createTask = createAsyncThunk("tasks/create", async (task) => {
  const res = await client.post("/tasks", task);
  return res.data;
});

export const updateTask = createAsyncThunk("tasks/update", async ({ id, fields }) => {
  const res = await client.put(`/tasks/${id}`, fields);
  return res.data;
});

export const deleteTask = createAsyncThunk("tasks/delete", async (id) => {
  await client.delete(`/tasks/${id}`);
  return id;
});

export const toggleTask = createAsyncThunk("tasks/toggle", async (task) => {
  const status = task.status === "complete" ? "incomplete" : "complete";
  const res = await client.put(`/tasks/${task.id}`, { status });
  return res.data;
});

export const importTasks = createAsyncThunk("tasks/import", async (file) => {
  const form = new FormData();
  form.append("file", file);
  const res = await client.post("/import", form);
  return res.data; // full task list after import
});

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const i = state.items.findIndex((t) => t.id === action.payload.id);
        if (i !== -1) state.items[i] = action.payload;
      })
      .addCase(toggleTask.fulfilled, (state, action) => {
        const i = state.items.findIndex((t) => t.id === action.payload.id);
        if (i !== -1) state.items[i] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      })
      .addCase(importTasks.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export default tasksSlice.reducer;
