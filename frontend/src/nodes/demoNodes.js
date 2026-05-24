import { BaseNode } from './baseNode';

export const APINode = ({ id }) => (
  <BaseNode
    id={id}
    title="API"
    nodeType="Connector"
    className="base-node--connector"
    inputHandles={[{ id: `${id}-request` }]}
    outputHandles={[{ id: `${id}-response` }]}
  >
    <p className="node-description">Call an external service and pass along the response.</p>
  </BaseNode>
);

export const DatabaseNode = ({ id }) => (
  <BaseNode
    id={id}
    title="Database"
    nodeType="Storage"
    className="base-node--storage"
    inputHandles={[{ id: `${id}-query` }]}
    outputHandles={[{ id: `${id}-records` }]}
  >
    <p className="node-description">Read or write structured records for the pipeline.</p>
  </BaseNode>
);

export const FilterNode = ({ id }) => (
  <BaseNode
    id={id}
    title="Filter"
    nodeType="Logic"
    className="base-node--logic"
    inputHandles={[{ id: `${id}-input` }]}
    outputHandles={[
      { id: `${id}-matched` },
      { id: `${id}-rejected` },
    ]}
  >
    <p className="node-description">Route data based on a condition.</p>
  </BaseNode>
);

export const MathNode = ({ id }) => (
  <BaseNode
    id={id}
    title="Math"
    nodeType="Transform"
    className="base-node--transform"
    inputHandles={[
      { id: `${id}-a` },
      { id: `${id}-b` },
    ]}
    outputHandles={[{ id: `${id}-result` }]}
  >
    <p className="node-description">Calculate a derived numeric result.</p>
  </BaseNode>
);

export const DelayNode = ({ id }) => (
  <BaseNode
    id={id}
    title="Delay"
    nodeType="Timing"
    className="base-node--timing"
    inputHandles={[{ id: `${id}-input` }]}
    outputHandles={[{ id: `${id}-output` }]}
  >
    <p className="node-description">Pause execution before continuing to the next step.</p>
  </BaseNode>
);
