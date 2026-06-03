import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { saveDashboard } from "../features/dashboard/dashboardSlice";
import { closeDashboardModal } from "../features/ui/uiSlice";
import { useImportDb } from "../features/io/useImportDb";

const today = () => new Date().toISOString().slice(0, 10);

/**
 * mode="create": blocking first-run form, collects all fields.
 * mode="edit":   modal that only allows editing description & comments
 *                (name / member_name / team / created_at are locked).
 */
export default function DashboardSetup({ mode }) {
  const dispatch = useDispatch();
  const existing = useSelector((s) => s.dashboard.data);
  const isEdit = mode === "edit";
  const importDb = useImportDb();
  const fileRef = useRef(null);

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      // On success the dashboard rehydrates and App leaves the first-run gate.
      const tasks = await importDb(file);
      alert(`Imported dashboard and ${tasks.length} tasks.`);
    } catch (err) {
      alert(
        `Import failed: ${err.message || err}. ` +
          `Make sure the backend is running on http://localhost:8000 and the file is valid JSON.`
      );
    } finally {
      e.target.value = "";
    }
  };

  const [form, setForm] = useState(
    isEdit
      ? { ...existing }
      : {
          name: "",
          member_name: "",
          team: "",
          created_at: today(),
          description: "",
          comments: "",
        }
  );

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      // Only editable fields are sent; the backend locks the rest anyway.
      await dispatch(
        saveDashboard({ description: form.description, comments: form.comments })
      );
      dispatch(closeDashboardModal());
    } else {
      await dispatch(saveDashboard(form));
    }
  };

  const body = (
    <form className="dashboard-form" onSubmit={handleSubmit}>
      <h2>{isEdit ? "Edit Dashboard" : "Set up your dashboard"}</h2>

      <label>
        Dashboard name
        <input value={form.name} onChange={set("name")} disabled={isEdit} required />
      </label>
      <label>
        New team member
        <input
          value={form.member_name}
          onChange={set("member_name")}
          disabled={isEdit}
          required
        />
      </label>
      <label>
        Team
        <input value={form.team} onChange={set("team")} disabled={isEdit} />
      </label>
      <label>
        Created at
        <input
          type="date"
          value={form.created_at}
          onChange={set("created_at")}
          disabled={isEdit}
        />
      </label>
      <label>
        Description
        <textarea value={form.description} onChange={set("description")} rows={2} />
      </label>
      <label>
        Comments
        <textarea value={form.comments} onChange={set("comments")} rows={2} />
      </label>

      {isEdit && (
        <p className="hint">
          Dashboard name, team member, team and creation date are locked after
          creation.
        </p>
      )}

      <div className="form-actions">
        {isEdit && (
          <button type="button" onClick={() => dispatch(closeDashboardModal())}>
            Cancel
          </button>
        )}
        <button type="submit" className="primary">
          {isEdit ? "Save" : "Create dashboard"}
        </button>
      </div>

      {!isEdit && (
        <>
          <div className="form-divider">
            <span>or</span>
          </div>
          <button
            type="button"
            className="import-existing"
            onClick={() => fileRef.current.click()}
          >
            Import existing dashboard (.json)
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            style={{ display: "none" }}
            onChange={handleImport}
          />
        </>
      )}
    </form>
  );

  // Edit mode renders inside a modal overlay; create mode fills the screen.
  if (isEdit) {
    return (
      <div className="modal-overlay" onClick={() => dispatch(closeDashboardModal())}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          {body}
        </div>
      </div>
    );
  }
  return <div className="setup-screen">{body}</div>;
}
