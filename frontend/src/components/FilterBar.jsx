import { useSelector, useDispatch } from "react-redux";

import { selectFacets } from "../features/tasks/selectors";
import {
  setFacet,
  setStatus,
  setSearch,
  clearFilters,
} from "../features/filters/filtersSlice";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function FacetSelect({ label, facet, options }) {
  const dispatch = useDispatch();
  const value = useSelector((s) => s.filters[facet]);
  if (options.length === 0) return null;
  return (
    <div className="facet-group">
      <label className="facet-label" htmlFor={`filter-${facet}`}>
        {label}
      </label>
      <select
        id={`filter-${facet}`}
        value={value}
        onChange={(e) => dispatch(setFacet({ facet, value: e.target.value }))}
      >
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function FilterBar() {
  const dispatch = useDispatch();
  const facets = useSelector(selectFacets);
  const search = useSelector((s) => s.filters.search);
  const status = useSelector((s) => s.filters.status);

  return (
    <div className="card filter-bar">
      <div className="search-wrap">
        <SearchIcon />
        <input
          className="search-input"
          type="search"
          placeholder="Search name, tutor, type, phase, category…"
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
        />
      </div>

      <div className="status-toggle">
        {["all", "incomplete", "complete"].map((s) => (
          <button
            key={s}
            className={status === s ? "active" : ""}
            onClick={() => dispatch(setStatus(s))}
          >
            {s}
          </button>
        ))}
      </div>

      <FacetSelect label="Type" facet="type" options={facets.type} />
      <FacetSelect label="Phase" facet="phase" options={facets.phase} />

      <button className="link-btn" onClick={() => dispatch(clearFilters())}>
        Clear filters
      </button>
    </div>
  );
}
