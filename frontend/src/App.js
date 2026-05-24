import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';

function App() {
  return (
    <div className="app-shell">
      <div className="workspace-shell">
        <PipelineToolbar />
        <main className="workspace-main">
          <PipelineUI />
          <SubmitButton />
        </main>
      </div>
    </div>
  );
}

export default App;
