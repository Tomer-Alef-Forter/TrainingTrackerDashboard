import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchDashboard } from "./features/dashboard/dashboardSlice";
import { fetchTasks } from "./features/tasks/tasksSlice";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardSetup from "./components/DashboardSetup";
import ProgressOverview from "./components/ProgressOverview";
import FilterBar from "./components/FilterBar";
import CategorySection from "./components/CategorySection";
import TaskModal from "./components/TaskModal";
import { selectGroupedTasks } from "./features/tasks/selectors";

export default function App() {
  const dispatch = useDispatch();
  const dashboard = useSelector((s) => s.dashboard.data);
  const loaded = useSelector((s) => s.dashboard.loaded);
  const loadError = useSelector((s) => s.dashboard.error);
  const taskModalOpen = useSelector((s) => s.ui.taskModalOpen);
  const dashboardModalOpen = useSelector((s) => s.ui.dashboardModalOpen);
  const groups = useSelector(selectGroupedTasks);
  const totalTasks = useSelector((s) => s.tasks.items.length);

  useEffect(() => {
    dispatch(fetchDashboard());
    dispatch(fetchTasks());
  }, [dispatch]);

  if (!loaded) {
    return <div className="loading">Loading…</div>;
  }

  // The backend was unreachable on load -> tell the user instead of pretending
  // the database is empty.
  if (loadError) {
    return (
      <div className="loading">
        Couldn’t reach the backend at http://localhost:8000.
        <br />
        Start it with <code>./run.sh</code> (or{" "}
        <code>cd backend &amp;&amp; ./venv/bin/uvicorn main:app --port 8000</code>),
        then reload.
      </div>
    );
  }

  // First-run gate: no dashboard yet -> blocking setup form.
  if (!dashboard) {
    return <DashboardSetup mode="create" />;
  }

  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <Header />
        <main className="content">
          <ProgressOverview />
          <FilterBar />

          {groups.length === 0 ? (
            <div className="empty-state">
              <svg className="empty-icon" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
                <path
                  d="M20 20l-3.5-3.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              <p>
                {totalTasks === 0
                  ? "No tasks yet. Click “Add Task” to create your first one."
                  : "No tasks match the active filters."}
              </p>
            </div>
          ) : (
            groups.map((g) => (
              <CategorySection key={g.category} category={g.category} tasks={g.tasks} />
            ))
          )}
        </main>
      </div>

      {taskModalOpen && <TaskModal />}
      {dashboardModalOpen && <DashboardSetup mode="edit" />}
    </div>
  );
}
