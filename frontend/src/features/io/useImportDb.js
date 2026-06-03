import { useDispatch } from "react-redux";

import { importTasks } from "../tasks/tasksSlice";
import { fetchDashboard } from "../dashboard/dashboardSlice";

/**
 * Returns an `importDb(file)` function that uploads a db.json to the backend,
 * then rehydrates both tasks and the dashboard from the imported data.
 * Throws (via .unwrap()) on failure so callers can surface the error.
 */
export function useImportDb() {
  const dispatch = useDispatch();
  return async function importDb(file) {
    const tasks = await dispatch(importTasks(file)).unwrap();
    // Rehydrate the dashboard from the freshly imported DB as well.
    await dispatch(fetchDashboard());
    return tasks;
  };
}
