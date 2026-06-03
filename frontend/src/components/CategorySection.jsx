import { useDispatch, useSelector } from "react-redux";

import { toggleCategory } from "../features/ui/uiSlice";
import TaskCard from "./TaskCard";

export default function CategorySection({ category, tasks }) {
  const dispatch = useDispatch();
  const collapsed = useSelector((s) => s.ui.collapsedCategories[category]);

  return (
    <section className="category-section">
      <button
        className="category-header"
        onClick={() => dispatch(toggleCategory(category))}
      >
        <span className={`chevron ${collapsed ? "collapsed" : ""}`}>▾</span>
        <span className="category-name">{category}</span>
        <span className="category-count">{tasks.length}</span>
      </button>

      {!collapsed && (
        <div className="task-list">
          {tasks.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </div>
      )}
    </section>
  );
}
