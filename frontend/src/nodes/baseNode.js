import { Handle, Position } from 'reactflow';

const defaultHandlePosition = {
  input: Position.Left,
  output: Position.Right,
};

const getHandleTop = (index, total) => `${((index + 1) * 100) / (total + 1)}%`;

const renderHandles = (nodeId, handles, kind) => {
  const handleType = kind === 'input' ? 'target' : 'source';

  return handles.map((handle, index) => {
    const position = handle.position || defaultHandlePosition[kind];
    const isVertical = position === Position.Left || position === Position.Right;
    const autoStyle = isVertical ? { top: getHandleTop(index, handles.length) } : {};

    return (
      <Handle
        key={handle.id || `${kind}-${index}`}
        type={handleType}
        position={position}
        id={handle.id || `${nodeId}-${kind}-${index}`}
        className={`base-node__handle base-node__handle--${kind} ${handle.className || ''}`}
        style={{ ...autoStyle, ...handle.style }}
        onClick={(event) => event.stopPropagation()}
      />
    );
  });
};

export const BaseNode = ({
  id,
  title,
  nodeType,
  inputHandles = [],
  outputHandles = [],
  children,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  style = {},
  onClick,
}) => {
  return (
    <div
      className={`base-node ${className}`}
      style={style}
      data-node-type={nodeType}
      onClick={onClick}
    >
      {renderHandles(id, inputHandles, 'input')}
      {renderHandles(id, outputHandles, 'output')}

      <div className={`base-node__header ${headerClassName}`}>
        <span className="base-node__title">{title}</span>
        {nodeType && <span className="base-node__type">{nodeType}</span>}
      </div>

      <div className={`base-node__body ${bodyClassName}`}>{children}</div>
    </div>
  );
};
