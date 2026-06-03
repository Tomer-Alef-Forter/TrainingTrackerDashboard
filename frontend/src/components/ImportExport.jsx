import { useRef } from "react";

import client from "../api/client";
import { useImportDb } from "../features/io/useImportDb";

export default function ImportExport() {
  const importDb = useImportDb();
  const fileRef = useRef(null);

  const handleExport = async () => {
    try {
      const res = await client.get("/export", { responseType: "blob" });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "db.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(`Export failed: ${err.message}. Is the backend running on http://localhost:8000?`);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const tasks = await importDb(file);
      alert(`Imported ${tasks.length} tasks.`);
    } catch (err) {
      alert(
        `Import failed: ${err.message || err}. ` +
          `Make sure the backend is running on http://localhost:8000 and the file is valid JSON.`
      );
    } finally {
      e.target.value = ""; // allow re-importing the same file
    }
  };

  return (
    <>
      <button onClick={handleExport}>Export</button>
      <button onClick={() => fileRef.current.click()}>Import</button>
      <input
        ref={fileRef}
        type="file"
        accept=".json,application/json"
        style={{ display: "none" }}
        onChange={handleImport}
      />
    </>
  );
}
