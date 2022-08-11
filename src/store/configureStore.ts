import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { nodesReducer, blocksReducers } from "../reducers";

export const store = configureStore({
  reducer: {
    nodes: nodesReducer,
    blocks: blocksReducers,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
