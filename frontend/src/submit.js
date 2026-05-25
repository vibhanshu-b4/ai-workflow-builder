// submit.js

import { useState } from 'react';
import { useStore } from './store';

const formatResult = (result) =>
    `Nodes: ${result.num_nodes} | Edges: ${result.num_edges} | DAG: ${result.is_dag ? 'Yes' : 'No'}`;

export const SubmitButton = () => {
    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [result, setResult] = useState(null);

    const handleSubmit = async () => {
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');
        setResult(null);

        try {
            const response = await fetch('/pipelines/parse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nodes, edges }),
            });

            if (!response.ok) {
                throw new Error(`Request failed (${response.status})`);
            }

            const data = await response.json();
            setResult(data);
            window.alert(`Nodes: ${data.num_nodes}\nEdges: ${data.num_edges}\nDAG: ${data.is_dag ? 'Yes' : 'No'}`);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unexpected error';
            setSubmitError(message);
            window.alert(`Submit failed: ${message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="submit-controls">
            <button className="submit-button" type="button" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
            {submitError ? (
                <p className="submit-status submit-status--error">{submitError}</p>
            ) : result ? (
                <p className="submit-status submit-status--success">{formatResult(result)}</p>
            ) : null}
        </div>
    );
}
