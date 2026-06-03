import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    // Task create/edit modal. editingTask = null -> create mode.
    taskModalOpen: false,
    editingTask: null,
    // Dashboard edit modal (after first-run creation).
    dashboardModalOpen: false,
    // Categories collapsed by name (default: all expanded -> not present here).
    collapsedCategories: {},
  },
  reducers: {
    openCreateTask: (state) => {
      state.taskModalOpen = true;
      state.editingTask = null;
    },
    openEditTask: (state, action) => {
      state.taskModalOpen = true;
      state.editingTask = action.payload;
    },
    closeTaskModal: (state) => {
      state.taskModalOpen = false;
      state.editingTask = null;
    },
    openDashboardModal: (state) => {
      state.dashboardModalOpen = true;
    },
    closeDashboardModal: (state) => {
      state.dashboardModalOpen = false;
    },
    toggleCategory: (state, action) => {
      const name = action.payload;
      state.collapsedCategories[name] = !state.collapsedCategories[name];
    },
  },
});

export const {
  openCreateTask,
  openEditTask,
  closeTaskModal,
  openDashboardModal,
  closeDashboardModal,
  toggleCategory,
} = uiSlice.actions;
export default uiSlice.reducer;
