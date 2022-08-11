export interface Block {
  blocks: Array<[]>;
  loading: boolean;
  error: boolean;
}

export interface NodeBlock {
  blocks: {
    attributes: {};
    id: string;
    type: string;
    map: (block: any) => any;
  };
}
