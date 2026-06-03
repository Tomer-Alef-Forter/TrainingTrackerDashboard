import { configureStore } from "@reduxjs/toolkit";

import dashboardReducer from "../features/dashboard/dashboardSlice";
import tasksReducer from "../features/tasks/tasksSlice";
import filtersReducer from "../features/filters/filtersSlice";
import uiReducer from "../features/ui/uiSlice";

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    tasks: tasksReducer,
    filters: filtersReducer,
    ui: uiReducer,
  },
});
