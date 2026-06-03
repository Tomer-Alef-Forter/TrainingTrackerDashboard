import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  category: "", // "" = all
  type: "",
  phase: "",
  status: "all", // all | complete | incomplete
  search: "",
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFacet: (state, action) => {
      const { facet, value } = action.payload; // facet: category|type|phase
      state[facet] = value;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    clearFilters: () => initialState,
  },
});

export const { setFacet, setStatus, setSearch, clearFilters } =
  filtersSlice.actions;
export default filtersSlice.reducer;
