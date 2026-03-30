CREATE TABLE nodes (
    id UUID PRIMARY KEY,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    label TEXT NOT NULL,
    x_position DOUBLE PRECISION NOT NULL,
    y_position DOUBLE PRECISION NOT NULL,
    width DOUBLE PRECISION,
    height DOUBLE PRECISION,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT nodes_type_check CHECK (type IN ('AGENT', 'DATASOURCE', 'TOOL', 'RULE'))
);

CREATE INDEX idx_nodes_workspace_id ON nodes(workspace_id);
CREATE INDEX idx_nodes_type ON nodes(type);
