import { useState } from "react";
import { useDispatch } from "react-redux";

import { toggleTask, deleteTask, updateTask } from "../features/tasks/tasksSlice";
import { openEditTask } from "../features/ui/uiSlice";

export default function TaskCard({ task }) {
  const dispatch = useDispatch();
  const isComplete = task.status === "complete";

  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState(task.comments || "");
  const [saving, setSaving] = useState(false);

  const handleDelete = () => {
    if (window.confirm(`Delete task "${task.name}"?`)) {
      dispatch(deleteTask(task.id));
    }
  };

  const toggleExpand = () => {
    // Re-sync the draft with the stored value whenever we (re)open.
    if (!expanded) setDraft(task.comments || "");
    setExpanded((v) => !v);
  };

  const saveComment = async () => {
    setSaving(true);
    try {
      await dispatch(updateTask({ id: task.id, fields: { comments: draft } }));
      setExpanded(false);
    } finally {
      setSaving(false);
    }
  };

  const dirty = draft !== (task.comments || "");

  return (
    <div className={`task-card ${isComplete ? "complete" : ""}`}>
      <div className="task-card-top">
        <button
          className="task-expand-toggle"
          onClick={toggleExpand}
          aria-expanded={expanded}
          title={expanded ? "Collapse" : "Expand to add a comment"}
        >
          <span className={`chevron ${expanded ? "" : "collapsed"}`}>▾</span>
        </button>
        <label className="task-check">
          <input
            type="checkbox"
            checked={isComplete}
            onChange={() => dispatch(toggleTask(task))}
          />
        </label>
        <h3 className="task-name" onClick={toggleExpand}>
          {task.name}
        </h3>
        <div className="task-card-actions">
          {task.comments && !expanded && <span className="comment-badge">💬</span>}
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

      {expanded ? (
        <div className="task-expand">
          <label className="comment-label">
            Comments
            <textarea
              rows={3}
              value={draft}
              placeholder="Add a comment…"
              onChange={(e) => setDraft(e.target.value)}
            />
          </label>
          <div className="comment-actions">
            <button onClick={() => setExpanded(false)}>Cancel</button>
            <button className="primary" onClick={saveComment} disabled={!dirty || saving}>
              {saving ? "Saving…" : "Save comment"}
            </button>
          </div>
        </div>
      ) : (
        task.comments && <p className="task-comments">{task.comments}</p>
      )}
    </div>
  );
}
