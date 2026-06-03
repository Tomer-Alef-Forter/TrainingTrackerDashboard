import { createSelector } from "@reduxjs/toolkit";

const selectTasks = (state) => state.tasks.items;
const selectFilters = (state) => state.filters;

// Unique, sorted facet values across all tasks (for filter checkboxes + datalist).
const uniqueValues = (tasks, key) =>
  [...new Set(tasks.map((t) => t[key]).filter(Boolean))].sort();

export const selectFacets = createSelector([selectTasks], (tasks) => ({
  category: uniqueValues(tasks, "category"),
  type: uniqueValues(tasks, "type"),
  phase: uniqueValues(tasks, "phase"),
}));

export const selectFilteredTasks = createSelector(
  [selectTasks, selectFilters],
  (tasks, filters) => {
    const q = filters.search.trim().toLowerCase();
    return tasks.filter((t) => {
      if (filters.category && t.category !== filters.category) return false;
      if (filters.type && t.type !== filters.type) return false;
      if (filters.phase && t.phase !== filters.phase) return false;
      if (filters.status !== "all" && t.status !== filters.status) return false;
      if (q) {
        const haystack = [t.name, t.tutor, t.type, t.phase, t.category]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }
);

// Filtered tasks grouped into [{ category, tasks }] ordered by category name.
export const selectGroupedTasks = createSelector(
  [selectFilteredTasks],
  (tasks) => {
    const groups = {};
    for (const t of tasks) {
      (groups[t.category] = groups[t.category] || []).push(t);
    }
    return Object.keys(groups)
      .sort()
      .map((category) => ({ category, tasks: groups[category] }));
  }
);

// Progress aggregates computed over ALL tasks (not the filtered view).
export const selectProgress = createSelector([selectTasks], (tasks) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "complete").length;
  const totalHours = tasks.reduce((sum, t) => sum + (Number(t.duration) || 0), 0);
  const completedHours = tasks
    .filter((t) => t.status === "complete")
    .reduce((sum, t) => sum + (Number(t.duration) || 0), 0);
  const percent = totalHours > 0 ? Math.round((completedHours / totalHours) * 100) : 0;
  return { totalTasks, completedTasks, totalHours, completedHours, percent };
});
