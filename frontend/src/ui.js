// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { Controls, Background, MiniMap, useStore as useRFStore } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { APINode, DatabaseNode, FilterNode, MathNode, DelayNode } from './nodes/demoNodes';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  api: APINode,
  database: DatabaseNode,
  filter: FilterNode,
  math: MathNode,
  delay: DelayNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  setAddNodeAtCenter: state.setAddNodeAtCenter,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = ({
    isTextEditorOpen,
    textEditorValue,
    onTextEditorChange,
    onCloseTextEditor,
  }) => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const panelRef = useRef(null);
    const dragOffsetRef = useRef({ x: 0, y: 0 });
    const dragPointerIdRef = useRef(null);
    const [panelPosition, setPanelPosition] = useState({ x: 24, y: 24 });
    const [isPanelDragging, setIsPanelDragging] = useState(false);
    const {
      nodes,
      edges,
      getNodeID,
      addNode,
      setAddNodeAtCenter,
      onNodesChange,
      onEdgesChange,
      onConnect
    } = useStore(selector, shallow);

    const getInitNodeData = (nodeID, type) => {
      let nodeData = { id: nodeID, nodeType: `${type}` };
      return nodeData;
    }

    useEffect(() => {
      if (!isTextEditorOpen || !reactFlowWrapper.current || !panelRef.current || !reactFlowInstance) {
        return;
      }

      const centerPanel = () => {
        if (!reactFlowWrapper.current || !panelRef.current || !reactFlowInstance) {
          return;
        }

        const canvasRect = reactFlowWrapper.current.getBoundingClientRect();
        const panelRect = panelRef.current.getBoundingClientRect();
        const zoom = reactFlowInstance.getViewport?.().zoom || 1;
        const centerFlow = reactFlowInstance.project({
          x: canvasRect.width / 2,
          y: canvasRect.height / 2,
        });
        const panelWidthFlow = panelRect.width / zoom;
        const panelHeightFlow = panelRect.height / zoom;
        const nextX = centerFlow.x - panelWidthFlow / 2;
        const nextY = centerFlow.y - panelHeightFlow / 2;

        setPanelPosition({ x: nextX, y: nextY });
      };

      const frame = window.requestAnimationFrame(centerPanel);

      return () => window.cancelAnimationFrame(frame);
    }, [isTextEditorOpen, reactFlowInstance]);

    useEffect(() => {
      if (!isPanelDragging) {
        return;
      }

      const handlePointerMove = (event) => {
        if (dragPointerIdRef.current !== event.pointerId) {
          return;
        }

        if (!reactFlowWrapper.current || !panelRef.current || !reactFlowInstance) {
          return;
        }

        const canvasRect = reactFlowWrapper.current.getBoundingClientRect();
        const panelRect = panelRef.current.getBoundingClientRect();
        const zoom = reactFlowInstance.getViewport?.().zoom || 1;
        const pointerFlow = reactFlowInstance.project({
          x: event.clientX - canvasRect.left,
          y: event.clientY - canvasRect.top,
        });
        const topLeftFlow = reactFlowInstance.project({ x: 0, y: 0 });
        const bottomRightFlow = reactFlowInstance.project({
          x: canvasRect.width,
          y: canvasRect.height,
        });
        const panelWidthFlow = panelRect.width / zoom;
        const panelHeightFlow = panelRect.height / zoom;
        const padding = 12 / zoom;
        let nextX = pointerFlow.x - dragOffsetRef.current.x;
        let nextY = pointerFlow.y - dragOffsetRef.current.y;

        const minX = topLeftFlow.x + padding;
        const minY = topLeftFlow.y + padding;
        const maxX = bottomRightFlow.x - panelWidthFlow - padding;
        const maxY = bottomRightFlow.y - panelHeightFlow - padding;

        if (maxX >= minX) {
          nextX = Math.min(Math.max(nextX, minX), maxX);
        }

        if (maxY >= minY) {
          nextY = Math.min(Math.max(nextY, minY), maxY);
        }

        setPanelPosition({ x: nextX, y: nextY });
      };

      const handlePointerUp = (event) => {
        if (dragPointerIdRef.current !== event.pointerId) {
          return;
        }

        dragPointerIdRef.current = null;
        setIsPanelDragging(false);
      };

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);

      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };
    }, [isPanelDragging]);

    const handlePanelHeaderPointerDown = (event) => {
      if (!panelRef.current) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (event.currentTarget.setPointerCapture) {
        event.currentTarget.setPointerCapture(event.pointerId);
      }

      if (reactFlowWrapper.current && reactFlowInstance) {
        const canvasRect = reactFlowWrapper.current.getBoundingClientRect();
        const pointerFlow = reactFlowInstance.project({
          x: event.clientX - canvasRect.left,
          y: event.clientY - canvasRect.top,
        });
        dragOffsetRef.current = {
          x: pointerFlow.x - panelPosition.x,
          y: pointerFlow.y - panelPosition.y,
        };
      }
      dragPointerIdRef.current = event.pointerId;
      setIsPanelDragging(true);
    };

    const FloatingPanel = () => {
      const viewportTransform = useRFStore((state) => state.transform);
      const [vx, vy, vZoom] = viewportTransform;

      return (
        <div
          className="pipeline-floating-panel__viewport"
          style={{ transform: `translate(${vx}px, ${vy}px) scale(${vZoom})` }}
        >
          <section
            ref={panelRef}
            className="pipeline-floating-panel nodrag nopan"
            style={{ transform: `translate(${panelPosition.x}px, ${panelPosition.y}px)` }}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <header
              className="pipeline-floating-panel__header"
              onPointerDown={handlePanelHeaderPointerDown}
            >
              <div>
                <span className="pipeline-floating-panel__eyebrow">Editor</span>
                <h2 className="pipeline-floating-panel__title">Text Node</h2>
              </div>
              <button
                className="pipeline-floating-panel__close"
                type="button"
                onClick={onCloseTextEditor}
                aria-label="Close text editor"
              >
                x
              </button>
            </header>
            <textarea
              className="pipeline-floating-panel__textarea"
              value={textEditorValue}
              onChange={(event) => onTextEditorChange(event.target.value)}
              rows={10}
              spellCheck="false"
              placeholder="Write prompt text..."
            />
          </section>
        </div>
      );
    };

    useEffect(() => {
      if (!reactFlowInstance || !reactFlowWrapper.current) {
        return;
      }

      const addNodeAtCenter = (type) => {
        if (!reactFlowInstance || !reactFlowWrapper.current) {
          return;
        }

        const bounds = reactFlowWrapper.current.getBoundingClientRect();
        const position = reactFlowInstance.project({
          x: bounds.width / 2,
          y: bounds.height / 2,
        });
        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        };

        addNode(newNode);
      };

      setAddNodeAtCenter(() => addNodeAtCenter);

      return () => {
        setAddNodeAtCenter(() => () => {});
      };
    }, [reactFlowInstance, addNode, getNodeID, setAddNodeAtCenter]);

    const onDrop = useCallback(
        (event) => {
          event.preventDefault();

          if (!reactFlowInstance || !reactFlowWrapper.current) {
            return;
          }
    
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          if (event?.dataTransfer?.getData('application/reactflow')) {
            const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
            const type = appData?.nodeType;
      
            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
              return;
            }
      
            const position = reactFlowInstance.project({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            });

            const nodeID = getNodeID(type);
            const newNode = {
              id: nodeID,
              type,
              position,
              data: getInitNodeData(nodeID, type),
            };
      
            addNode(newNode);
          }
        },
        [reactFlowInstance, getNodeID, addNode]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    return (
        <>
        <div ref={reactFlowWrapper} className="pipeline-canvas">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                proOptions={proOptions}
                snapGrid={[gridSize, gridSize]}
                connectionLineType='smoothstep'
            >
                <Background color="#6f5cff" gap={gridSize} size={1.25} variant="dots" />
                <Controls />
                <MiniMap
                  nodeColor="#7c3aed"
                  maskColor="rgba(6, 3, 18, 0.72)"
                  pannable
                  zoomable
                />
                {isTextEditorOpen && <FloatingPanel />}
            </ReactFlow>
        </div>
        </>
    )
}
