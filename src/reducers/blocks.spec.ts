import mockFetch from "cross-fetch";
import reducer, { getNodeBlocks } from "./blocks";
import { Node } from "../types/Node";
import initialState from "./initialState";

jest.mock("cross-fetch");

const mockedFech: jest.Mock<unknown> = mockFetch as any;

describe("Reducers::Blocks", () => {
  const getInitialState = () => {
    return initialState().blocks;
  };

  const nodeA: Node = {
    url: "http://localhost:3002",
    online: false,
    name: "Node 1",
    loading: false,
  };

  const nodeB = {
    url: "http://localhost:3003",
    online: false,
    name: "Node 2",
    loading: false,
  };

  const blocks = {
    "http://localhost:3002": {
      blocks: [],
      loading: false,
      error: false,
    },
    "http://localhost:3003": {
      blocks: [],
      loading: false,
      error: false,
    },
  };

  const nodeAResponseBlocks = [
    {
      id: "5",
      type: "blocks",
      attributes: {
        index: 1,
        timestamp: 1530679678,
        data: "The Human Torch",
        "previous-hash": "KsmmdGrKVDr43/OYlM/oFzr7oh6wHG+uM9UpRyIoVe8=",
        hash: "oHkxOJWOKy02vA9r4iRHVqTgqT+Afc6OYFcNYzyhGEc=",
      },
    },
  ];

  it("should set initial state by default", () => {
    const action = { type: "unknown" };
    const expected = getInitialState();

    expect(reducer(undefined, action)).toEqual(expected);
  });

  it("should handle getNodeBlocks.pending", () => {
    const appState = blocks;
    const action = { type: getNodeBlocks.pending, meta: { arg: nodeA } };

    const expected = {
      ...blocks,
      [nodeA.url]: {
        ...blocks[nodeA.url as keyof typeof blocks],
        loading: true,
      },
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it("should handle getNodeBlocks.fulfilled", () => {
    const appState = blocks;
    const action = {
      type: getNodeBlocks.fulfilled,
      meta: { arg: nodeA },
      payload: { data: nodeAResponseBlocks },
    };
    const expected = {
      ...blocks,
      [nodeA.url]: {
        blocks: action.payload.data,
        loading: false,
        error: false,
      },
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it("should handle getNodeBlocks.rejected", () => {
    const appState = blocks;
    const action = { type: getNodeBlocks.rejected, meta: { arg: nodeA } };
    const expected = {
      ...blocks,
      [nodeA.url]: {
        blocks: [],
        loading: false,
        error: true,
      },
    };

    expect(reducer(appState, action)).toEqual(expected);
  });
});

describe("Actions::Nodes", () => {
  const dispatch = jest.fn();

  afterAll(() => {
    dispatch.mockClear();
    mockedFech.mockClear();
  });

  const node: Node = {
    url: "http://localhost:3002",
    online: false,
    name: "Node 1",
    loading: false,
  };

  it("should fetch the node status", async () => {
    mockedFech.mockReturnValueOnce(
      Promise.resolve({
        status: 200,
        json() {
          return Promise.resolve({ node_name: "Secret Lowlands" });
        },
      })
    );
    await getNodeBlocks(node)(dispatch, () => {}, {});

    const expected = expect.arrayContaining([
      expect.objectContaining({
        type: getNodeBlocks.pending.type,
        meta: expect.objectContaining({ arg: node }),
      }),
      expect.objectContaining({
        type: getNodeBlocks.fulfilled.type,
        meta: expect.objectContaining({ arg: node }),
        payload: { node_name: "Secret Lowlands" },
      }),
    ]);
    expect(dispatch.mock.calls.flat()).toEqual(expected);
  });

  it("should fail to fetch the node status", async () => {
    mockedFech.mockReturnValueOnce(Promise.reject(new Error("Network Error")));
    await getNodeBlocks(node)(dispatch, () => {}, {});
    const expected = expect.arrayContaining([
      expect.objectContaining({
        type: getNodeBlocks.pending.type,
        meta: expect.objectContaining({ arg: node }),
      }),
      expect.objectContaining({
        type: getNodeBlocks.rejected.type,
        meta: expect.objectContaining({ arg: node }),
        error: expect.objectContaining({ message: "Network Error" }),
      }),
    ]);

    expect(dispatch.mock.calls.flat()).toEqual(expected);
  });
});
