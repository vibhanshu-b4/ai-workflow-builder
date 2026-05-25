import { useEffect } from 'react';
import { Position, useUpdateNodeInternals } from 'reactflow';
import { BaseNode } from './baseNode';
import { useStore } from '../store';

const getHandleTop = (index, total) => `${((index + 1) * 100) / (total + 1)}%`;

export const TextNode = ({ id }) => {
  const variables = useStore((state) => state.textEditorVariables);
  const updateNodeInternals = useUpdateNodeInternals();
  const inputHandles = variables.map((variable) => ({
    id: `var-${variable}`,
    position: Position.Left,
  }));

  useEffect(() => {
    updateNodeInternals(id);
  }, [id, variables, updateNodeInternals]);

  return (
    <BaseNode
      id={id}
      title="Text"
      nodeType="Prompt"
      inputHandles={inputHandles}
      outputHandles={[{ id: `${id}-output` }]}
      className="base-node--prompt"
      bodyClassName="text-node"
    >
      {variables.length > 0 && (
        <div className="text-node__variable-labels">
          {variables.map((variable, index) => (
            <span
              key={variable}
              className="text-node__variable-label"
              style={{ top: getHandleTop(index, variables.length) }}
            >
              {variable}
            </span>
          ))}
        </div>
      )}
      <p className="node-description">Edit prompt text in the right-side panel.</p>
    </BaseNode>
  );
}
