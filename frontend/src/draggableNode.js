// draggableNode.js

export const DraggableNode = ({ type, label, onClick }) => {
    const onDragStart = (event, nodeType) => {
      const appData = { nodeType }
      event.currentTarget.classList.add('draggable-node--dragging');
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };
  
    return (
      <div
        className={`draggable-node ${type}`}
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={(event) => event.currentTarget.classList.remove('draggable-node--dragging')}
        onClick={onClick}
        draggable
      >
          <span>{label}</span>
      </div>
    );
  };
  
