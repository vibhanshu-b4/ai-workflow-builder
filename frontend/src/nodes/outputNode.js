// outputNode.js

import { useState } from 'react';
import { BaseNode } from './baseNode';

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data?.outputType || 'Text');

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
  };

  const handleTypeChange = (e) => {
    setOutputType(e.target.value);
  };

  return (
    <BaseNode
      id={id}
      title="Output"
      nodeType="Sink"
      className="base-node--sink"
      inputHandles={[{ id: `${id}-value` }]}
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
        <select className="node-input nodrag" value={outputType} onChange={handleTypeChange}>
          <option value="Text">Text</option>
          <option value="File">Image</option>
        </select>
      </label>
    </BaseNode>
  );
}
