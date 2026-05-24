// toolbar.js

import { DraggableNode } from './draggableNode';

export const PipelineToolbar = ({ onTextButtonClick }) => {

    return (
        <aside className="pipeline-toolbar">
            <div className="pipeline-toolbar__top">
                <span className="pipeline-toolbar__label">Build</span>
                <span className="pipeline-toolbar__title">Node Palette</span>
            </div>

            <div className="toolbar-section">
                <div className="toolbar-section__header">
                    <span className="toolbar-section__eyebrow">Core</span>
                    <span className="toolbar-section__title">Pipeline Nodes</span>
                </div>
                <div className="node-palette">
                    <DraggableNode type='customInput' label='Input' />
                    <DraggableNode type='llm' label='LLM' />
                    <DraggableNode type='customOutput' label='Output' />
                    <DraggableNode type='text' label='Text' onClick={onTextButtonClick} />
                </div>
            </div>

            <div className="toolbar-section">
                <div className="toolbar-section__header">
                    <span className="toolbar-section__eyebrow">Demo</span>
                    <span className="toolbar-section__title">Reusable Nodes</span>
                </div>
                <div className="node-palette">
                    <DraggableNode type='api' label='API' />
                    <DraggableNode type='database' label='Database' />
                    <DraggableNode type='filter' label='Filter' />
                    <DraggableNode type='math' label='Math' />
                    <DraggableNode type='delay' label='Delay' />
                </div>
            </div>
        </aside>
    );
};
