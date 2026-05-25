import os
from typing import Any, Dict, List, Set

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

app = FastAPI()

def get_allowed_origins() -> List[str]:
    raw = os.getenv(
        "FRONTEND_ORIGINS",
        "https://ai-workflow-builder-xi.vercel.app,http://localhost:3000,http://127.0.0.1:3000",
    ).strip()
    if raw == "*":
        return ["*"]

    return [origin.strip() for origin in raw.split(",") if origin.strip()]


allowed_origins = get_allowed_origins()
allow_credentials = os.getenv("ALLOW_CREDENTIALS", "false").lower() == "true"

if "*" in allowed_origins:
    allow_credentials = False

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins or ["*"],
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PipelinePayload(BaseModel):
    nodes: List[Dict[str, Any]] = []
    edges: List[Dict[str, Any]] = []


def build_graph(nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]):
    node_ids = [node.get("id") for node in nodes if isinstance(node, dict) and node.get("id")]
    node_set: Set[str] = set(node_ids)
    adjacency: Dict[str, List[str]] = {node_id: [] for node_id in node_set}
    indegree: Dict[str, int] = {node_id: 0 for node_id in node_set}

    for edge in edges:
        if not isinstance(edge, dict):
            continue

        source = edge.get("source")
        target = edge.get("target")

        if source in node_set and target in node_set:
            adjacency[source].append(target)
            indegree[target] += 1

    return node_set, adjacency, indegree


def is_dag(node_set: Set[str], adjacency: Dict[str, List[str]], indegree: Dict[str, int]) -> bool:
    if not node_set:
        return True

    queue = [node_id for node_id in node_set if indegree.get(node_id, 0) == 0]
    visited = 0

    while queue:
        node_id = queue.pop()
        visited += 1

        for neighbor in adjacency.get(node_id, []):
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)

    return visited == len(node_set)

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
def parse_pipeline(payload: PipelinePayload):
    num_nodes = len(payload.nodes)
    num_edges = len(payload.edges)
    node_set, adjacency, indegree = build_graph(payload.nodes, payload.edges)
    dag_status = is_dag(node_set, adjacency, indegree)

    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag": dag_status,
    }
