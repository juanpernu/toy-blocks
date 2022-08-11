import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import initialState from "./initialState";
import { Node, Block } from "../types";
import { RootState } from "../store/configureStore";
import fetch from "cross-fetch";

export interface BlocksState {
  [key: string]: Block;
}

export const getNodeBlocks = createAsyncThunk(
  "nodes/getNodeBlocks",
  async (node: Node) => {
    const response = await fetch(`${node.url}/api/v1/blocks`);
    const data: { data: Object } = await response.json();
    return data;
  }
);

export const getNodesAllBlocks = createAsyncThunk(
  "nodes/getNodesAllBlocks",
  async (nodes: Node[], thunkAPI) => {
    const { dispatch } = thunkAPI;
    nodes.forEach((node) => {
      dispatch(getNodeBlocks(node));
    });
  }
);

export const blocksSlice = createSlice({
  name: "blocks",
  initialState: initialState().blocks as BlocksState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getNodeBlocks.pending, (state, action) => {
      return {
        ...state,
        [action.meta.arg.url]: {
          ...state[action.meta.arg.url],
          loading: true,
        },
      };
    });
    builder.addCase(getNodeBlocks.fulfilled, (state, action) => {
      const blocks = action.payload.data;
      return {
        ...state,
        [action.meta.arg.url as any]: {
          blocks: blocks,
          loading: false,
          error: false,
        },
      };
    });
    builder.addCase(getNodeBlocks.rejected, (state, action) => {
      return {
        ...state,
        [action.meta.arg.url]: {
          blocks: [],
          loading: false,
          error: true,
        },
      };
    });
  },
});

export const selectBlocks = (state: RootState) => state.blocks;
export default blocksSlice.reducer;
