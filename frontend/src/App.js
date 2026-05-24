import { useState } from 'react';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { useStore } from './store';

function App() {
  const [isTextEditorOpen, setIsTextEditorOpen] = useState(false);
  const [textEditorValue, setTextEditorValue] = useState('');
  const addNodeAtCenter = useStore((state) => state.addNodeAtCenter);

  const handleTextButtonClick = () => {
    addNodeAtCenter('text');
    setIsTextEditorOpen(true);
  };

  const handleTextEditorClose = () => {
    setIsTextEditorOpen(false);
  };

  return (
    <div className="app-shell">
      <div className="workspace-shell">
        <PipelineToolbar onTextButtonClick={handleTextButtonClick} />
        <main className="workspace-main">
          <PipelineUI
            isTextEditorOpen={isTextEditorOpen}
            textEditorValue={textEditorValue}
            onTextEditorChange={setTextEditorValue}
            onCloseTextEditor={handleTextEditorClose}
          />
          <SubmitButton />
        </main>
      </div>
    </div>
  );
}

export default App;
