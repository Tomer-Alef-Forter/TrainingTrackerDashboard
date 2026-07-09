import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { createTask, updateTask } from "../features/tasks/tasksSlice";
import { closeTaskModal } from "../features/ui/uiSlice";
import { selectFacets } from "../features/tasks/selectors";

const EMPTY = {
  category: "",
  name: "",
  tutor: "",
  type: "",
  phase: "",
  duration: 0,
  recording: "",
  comments: "",
};

export default function TaskModal() {
  const dispatch = useDispatch();
  const editing = useSelector((s) => s.ui.editingTask);
  const facets = useSelector(selectFacets);
  const [form, setForm] = useState(editing ? { ...editing } : { ...EMPTY });

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const close = () => dispatch(closeTaskModal());

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, duration: Number(form.duration) || 0 };
    if (editing) {
      await dispatch(updateTask({ id: editing.id, fields: payload }));
    } else {
      await dispatch(createTask(payload));
    }
    close();
  };

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <form className="task-form" onSubmit={handleSubmit}>
          <h2>{editing ? "Edit task" : "New task"}</h2>

          <label>
            Task name
            <input value={form.name} onChange={set("name")} required />
          </label>
          <label>
            Category
            <input
              value={form.category}
              onChange={set("category")}
              list="category-options"
              required
            />
            <datalist id="category-options">
              {facets.category.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </label>
          <div className="form-row">
            <label>
              Tutor
              <input value={form.tutor} onChange={set("tutor")} />
            </label>
            <label>
              Duration (hrs)
              <input
                type="number"
                min="0"
                step="any"
                value={form.duration}
                onChange={set("duration")}
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              Type
              <input value={form.type} onChange={set("type")} />
            </label>
            <label>
              Phase
              <input value={form.phase} onChange={set("phase")} />
            </label>
          </div>
          <label>
            Recording URL
            <input value={form.recording} onChange={set("recording")} />
          </label>
          <label>
            Comments
            <textarea value={form.comments} onChange={set("comments")} rows={3} />
          </label>

          <div className="form-actions">
            <button type="button" onClick={close}>
              Cancel
            </button>
            <button type="submit" className="primary">
              {editing ? "Save" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
