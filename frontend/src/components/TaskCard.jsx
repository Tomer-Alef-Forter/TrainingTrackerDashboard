import { useDispatch } from "react-redux";

import { toggleTask, deleteTask } from "../features/tasks/tasksSlice";
import { openEditTask } from "../features/ui/uiSlice";

export default function TaskCard({ task }) {
  const dispatch = useDispatch();
  const isComplete = task.status === "complete";

  const handleDelete = () => {
    if (window.confirm(`Delete task "${task.name}"?`)) {
      dispatch(deleteTask(task.id));
    }
  };

  return (
    <div className={`task-card ${isComplete ? "complete" : ""}`}>
      <div className="task-card-top">
        <label className="task-check">
          <input
            type="checkbox"
            checked={isComplete}
            onChange={() => dispatch(toggleTask(task))}
          />
        </label>
        <h3 className="task-name">{task.name}</h3>
        <div className="task-card-actions">
          <button onClick={() => dispatch(openEditTask(task))}>Edit</button>
          <button className="danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>

      <div className="task-meta">
        {task.tutor && (
          <span>
            <strong>Tutor:</strong> {task.tutor}
          </span>
        )}
        {task.type && (
          <span>
            <strong>Type:</strong> {task.type}
          </span>
        )}
        {task.phase && (
          <span>
            <strong>Phase:</strong> {task.phase}
          </span>
        )}
        {task.duration != null && (
          <span>
            <strong>Duration:</strong> {task.duration} hrs
          </span>
        )}
        {task.recording && (
          <span>
            <strong>Recording:</strong>{" "}
            <a href={task.recording} target="_blank" rel="noreferrer">
              link
            </a>
          </span>
        )}
      </div>

      {task.comments && <p className="task-comments">{task.comments}</p>}
    </div>
  );
}
