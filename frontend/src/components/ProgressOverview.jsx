import { useSelector } from "react-redux";

import { selectProgress } from "../features/tasks/selectors";

export default function ProgressOverview() {
  const { totalTasks, completedTasks, totalHours, completedHours, percent } =
    useSelector(selectProgress);

  return (
    <section className="overview">
      <div className="card progress-card">
        <div className="progress-head">
          <span className="progress-title">Training progress</span>
          <span className="progress-pct">{percent}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
        <div className="progress-sub">
          {completedHours} of {totalHours} hours completed
        </div>
      </div>

      <div className="stat-cards">
        <div className="card stat-card">
          <div className="stat-label">Total tasks</div>
          <div className="stat-value">{totalTasks}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Completed tasks</div>
          <div className="stat-value">{completedTasks}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Hours completed</div>
          <div className="stat-value">{completedHours}</div>
        </div>
      </div>
    </section>
  );
}
