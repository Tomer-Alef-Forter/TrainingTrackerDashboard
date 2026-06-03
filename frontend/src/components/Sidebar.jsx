import { useDispatch, useSelector } from "react-redux";

import { selectFacets } from "../features/tasks/selectors";
import { setFacet } from "../features/filters/filtersSlice";

function CheckMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 13l4 4L19 7"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 6a2 2 0 012-2h6l8 8-8 8-8-8V6z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="8.5" cy="8.5" r="1.3" fill="currentColor" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export default function Sidebar() {
  const dispatch = useDispatch();
  const dashboard = useSelector((s) => s.dashboard.data);
  const items = useSelector((s) => s.tasks.items);
  const categories = useSelector(selectFacets).category;
  const active = useSelector((s) => s.filters.category);

  const countFor = (c) => items.filter((t) => t.category === c).length;

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <CheckMark />
        </div>
        <div className="brand-text">
          <div className="brand-name">{dashboard.name}</div>
          {dashboard.member_name && (
            <div className="brand-sub">{dashboard.member_name}</div>
          )}
        </div>
      </div>

      <nav className="nav">
        <div className="nav-group-label">Categories</div>

        <button
          className={`nav-item ${active === "" ? "active" : ""}`}
          onClick={() => dispatch(setFacet({ facet: "category", value: "" }))}
        >
          <GridIcon />
          <span>All tasks</span>
          <span className="nav-count">{items.length}</span>
        </button>

        {categories.map((c) => (
          <button
            key={c}
            className={`nav-item ${active === c ? "active" : ""}`}
            onClick={() => dispatch(setFacet({ facet: "category", value: c }))}
          >
            <TagIcon />
            <span>{c}</span>
            <span className="nav-count">{countFor(c)}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
