# AI Workflow Builder

## Live Demo
- Live: https://ai-workflow-builder1.vercel.app

## Overview
AI Workflow Builder is a visual pipeline editor for designing AI workflows and prompt-driven systems. Users assemble workflows on a React Flow canvas, connect modular nodes, and build dynamic prompts where variables automatically generate input handles. A FastAPI backend validates the submitted graph, reporting node/edge counts and DAG correctness.

## Key Highlights
- Reusable node abstraction architecture with consistent rendering and behavior
- Dynamic React Flow handle generation driven by prompt variables
- Variable parsing system that keeps handles in sync with text content
- Draggable, in-canvas editor panel for prompt authoring
- DAG/cycle detection engine for structural validation

## Features
- Drag-and-drop node system with React Flow
- Reusable node abstraction for consistent UI and behavior
- Dynamic TextNode variable parsing with auto-generated handles
- Draggable, in-canvas floating text editor panel
- Responsive, futuristic UI styling
- Live pipeline validation (node/edge counts + DAG detection)
- FastAPI + React architecture with clean separation of concerns

## Tech Stack
**Frontend**
- React
- React Flow
- Zustand
- CSS

**Backend**
- FastAPI
- Python

**Deployment**
- Vercel (frontend)
- Render (backend)

## Architecture Overview
The frontend manages node rendering, connections, and workflow state via React Flow and Zustand. On submit, the backend validates the graph structure and returns counts plus DAG status.

## Screenshots
- UI overview (placeholder)
- TextNode editor panel (placeholder)
- DAG validation response (placeholder)

## Local Setup

### Clone Repository
```bash
git clone <your-repo-url>
cd frontend_technical_assessment
```

### Frontend
```bash
cp .env.example .env
```

If port 3000 is already in use, update `PORT` inside `frontend/.env` before starting the dev server.

```bash
cd frontend
npm install
npm start
```

### Backend
```bash
cp .env.example .env
```

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## API Endpoint
`POST /pipelines/parse`

**Request**
```json
{
	"nodes": [
		{ "id": "text-1", "type": "text" },
		{ "id": "llm-1", "type": "llm" }
	],
	"edges": [
		{ "id": "e1", "source": "text-1", "target": "llm-1" }
	]
}
```

**Response**
```json
{
	"num_nodes": 2,
	"num_edges": 1,
	"is_dag": true
}
```

## Future Improvements
- Workflow execution engine
- Persistence and versioning for pipelines
- Authentication and team workspaces
- Real AI provider integrations
- Collaborative editing and shared canvases