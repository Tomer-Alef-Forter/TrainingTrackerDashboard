import { useDispatch, useSelector } from "react-redux";

import { resetDashboard, fetchDashboard } from "../features/dashboard/dashboardSlice";
import { fetchTasks } from "../features/tasks/tasksSlice";
import { openCreateTask, openDashboardModal } from "../features/ui/uiSlice";
import ImportExport from "./ImportExport";

export default function Header() {
  const dispatch = useDispatch();
  const dashboard = useSelector((s) => s.dashboard.data);

  const handleNewDashboard = async () => {
    const ok = window.confirm(
      "Start a new dashboard? This clears all current data and cannot be undone."
    );
    if (!ok) return;
    await dispatch(resetDashboard());
    // Refresh tasks so the list empties along with the dashboard.
    dispatch(fetchTasks());
    dispatch(fetchDashboard());
  };

  return (
    <header className="topbar">
      <div className="topbar-titles">
        <h1>{dashboard.name}</h1>
        {dashboard.member_name && (
          <span className="member-name">Onboarding · {dashboard.member_name}</span>
        )}
      </div>
      <div className="topbar-actions">
        <button className="primary" onClick={() => dispatch(openCreateTask())}>
          + Add Task
        </button>
        <button onClick={() => dispatch(openDashboardModal())}>Edit Dashboard</button>
        <ImportExport />
        <button className="danger" onClick={handleNewDashboard}>
          New Dashboard
        </button>
      </div>
    </header>
  );
}
