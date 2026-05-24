import { BaseNode } from './baseNode';

export const TextNode = ({ id }) => {
  return (
    <BaseNode
      id={id}
      title="Text"
      nodeType="Prompt"
      outputHandles={[{ id: `${id}-output` }]}
      className="base-node--prompt"
      bodyClassName="text-node"
    >
      <p className="node-description">Edit prompt text in the right-side panel.</p>
    </BaseNode>
  );
}
