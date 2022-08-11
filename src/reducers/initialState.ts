const initialState = () => ({
  nodes: {
    list: [
      {
        url: "https://thawing-springs-53971.herokuapp.com",
        online: false,
        name: "Node 1",
        loading: false,
      },
      {
        url: "https://secret-lowlands-62331.herokuapp.com",
        online: false,
        name: "Node 2",
        loading: false,
      },
      {
        url: "https://calm-anchorage-82141.herokuapp.com",
        online: false,
        name: "Node 3",
        loading: false,
      },
      {
        url: "http://localhost:3002",
        online: false,
        name: "Node 4",
        loading: false,
      },
    ],
  },
  blocks: {
    "https://thawing-springs-53971.herokuapp.com": {
      blocks: [],
      loading: false,
      error: false,
    },
    "https://secret-lowlands-62331.herokuapp.com": {
      blocks: [],
      loading: false,
      error: false,
    },
    "https://calm-anchorage-82141.herokuapp.com": {
      blocks: [],
      loading: false,
      error: false,
    },
    "http://localhost:3002": {
      blocks: [],
      loading: false,
      error: false,
    },
  },
});
export default initialState;
