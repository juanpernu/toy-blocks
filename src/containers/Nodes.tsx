import React, { useState, useEffect } from "react";
import { Node as NodeType, NodeBlock } from "../types";
import Node from "../components/Node";
import { Typography, Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../store/configureStore";
import { checkNodesStatus, selectNodes } from "../reducers/nodes";
import { getNodesAllBlocks, selectBlocks } from "../reducers/blocks";

export const Nodes: React.FC = () => {
  const [expandedNodeURL, setExpandedNodeURL] = useState<null | string>(null);
  const dispatch = useDispatch();
  const nodes = useAppSelector(selectNodes);
  const blocks = useAppSelector(selectBlocks);

  useEffect(() => {
    dispatch(checkNodesStatus(nodes));
    dispatch(getNodesAllBlocks(nodes));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleNodeExpanded(node: NodeType) {
    setExpandedNodeURL(node.url === expandedNodeURL ? null : node.url);
  }

  return (
    <Box paddingTop={7}>
      <Typography variant="h4" component="h1">
        <strong style={{ color: "#000" }}>Nodes</strong>
      </Typography>
      {nodes.map((node) => (
        <Node
          node={node}
          key={node.url}
          blocks={blocks[node.url] as unknown as NodeBlock}
          expanded={node.url === expandedNodeURL}
          toggleNodeExpanded={toggleNodeExpanded}
        />
      ))}
    </Box>
  );
};

export default Nodes;
