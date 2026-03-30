CREATE TABLE edges (
    id UUID PRIMARY KEY,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    source_node_id UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
    target_node_id UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    label TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT edges_type_check CHECK (type IN ('RELATES_TO')),
    CONSTRAINT edges_no_self_loop CHECK (source_node_id <> target_node_id)
);

CREATE INDEX idx_edges_workspace_id ON edges(workspace_id);
CREATE INDEX idx_edges_source_node_id ON edges(source_node_id);
CREATE INDEX idx_edges_target_node_id ON edges(target_node_id);
