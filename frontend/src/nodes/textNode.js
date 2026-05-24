import { useState } from 'react';
import { BaseNode } from './baseNode';

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
  };

  return (
    <BaseNode
      id={id}
      title="Text"
      nodeType="Prompt"
      outputHandles={[{ id: `${id}-output` }]}
      className="base-node--prompt"
      bodyClassName="text-node"
    >
      <label className="node-field">
        <span>Text</span>
        <textarea
          className="node-input node-textarea nodrag"
          value={currText}
          onChange={handleTextChange}
          rows={5}
          spellCheck="false"
          placeholder="Write prompt text..."
        />
      </label>
    </BaseNode>
  );
}
