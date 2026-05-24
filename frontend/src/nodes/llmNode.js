import { BaseNode } from './baseNode';

export const LLMNode = ({ id }) => {

  return (
    <BaseNode
      id={id}
      title="LLM"
      nodeType="Model"
      className="base-node--model"
      inputHandles={[
        { id: `${id}-system` },
        { id: `${id}-prompt` },
      ]}
      outputHandles={[{ id: `${id}-response` }]}
    >
      <p className="node-description">Generates a response from system and prompt inputs.</p>
    </BaseNode>
  );
}
