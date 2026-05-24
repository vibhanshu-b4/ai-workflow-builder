// inputNode.js

import { useState } from 'react';
import { BaseNode } from './baseNode';

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data?.inputType || 'Text');

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
  };

  const handleTypeChange = (e) => {
    setInputType(e.target.value);
  };

  return (
    <BaseNode
      id={id}
      title="Input"
      nodeType="Source"
      className="base-node--source"
      outputHandles={[{ id: `${id}-value` }]}
    >
      <label className="node-field">
        <span>Name</span>
        <input
          className="node-input nodrag"
          type="text"
          value={currName}
          onChange={handleNameChange}
        />
      </label>
      <label className="node-field">
        <span>Type</span>
        <select className="node-input nodrag" value={inputType} onChange={handleTypeChange}>
          <option value="Text">Text</option>
          <option value="File">File</option>
        </select>
      </label>
    </BaseNode>
  );
}
