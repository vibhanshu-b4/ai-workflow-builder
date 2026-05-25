import { useState } from 'react';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { useStore } from './store';

const parseVariables = (text) => {
  const regex = /{{\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*}}/g;
  const variables = new Set();
  let match;

  while ((match = regex.exec(text)) !== null) {
    variables.add(match[1]);
  }

  return Array.from(variables);
};

const areArraysEqual = (left, right) =>
  left.length === right.length && left.every((value, index) => value === right[index]);

function App() {
  const [isTextEditorOpen, setIsTextEditorOpen] = useState(false);
  const [textEditorValue, setTextEditorValue] = useState('');
  const [parsedVariables, setParsedVariables] = useState([]);
  const addNodeAtCenter = useStore((state) => state.addNodeAtCenter);
  const setTextEditorVariables = useStore((state) => state.setTextEditorVariables);

  const handleTextButtonClick = () => {
    addNodeAtCenter('text');
    setIsTextEditorOpen(true);
  };

  const handleTextEditorClose = () => {
    setIsTextEditorOpen(false);
  };

  const handleTextEditorChange = (nextValue) => {
    setTextEditorValue(nextValue);
    const nextVariables = parseVariables(nextValue);
    setParsedVariables((prev) => (areArraysEqual(prev, nextVariables) ? prev : nextVariables));
    setTextEditorVariables(nextVariables);
  };

  return (
    <div className="app-shell">
      <div className="workspace-shell">
        <PipelineToolbar onTextButtonClick={handleTextButtonClick} />
        <main className="workspace-main">
          <PipelineUI
            isTextEditorOpen={isTextEditorOpen}
            textEditorValue={textEditorValue}
            parsedVariables={parsedVariables}
            onTextEditorChange={handleTextEditorChange}
            onCloseTextEditor={handleTextEditorClose}
          />
          <SubmitButton />
        </main>
      </div>
    </div>
  );
}

export default App;
