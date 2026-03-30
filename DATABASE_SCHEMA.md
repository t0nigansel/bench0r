

# DATABASE_SCHEMA

## Purpose

This document defines the database schema for the **bench0r MVP**.

The MVP is a **web-based visual drawing bench** for agent systems.
The database must store modeled architectures in a structured relational form.
It must not treat JSON files as the primary persistence layer.

The schema should support:
- workspaces
- nodes
- node properties
- edges
- timestamps
- future growth without overcomplicating the MVP

---

## Database goals

1. **Structured persistence**
   The model should be stored in tables, not primarily in JSON blobs.

2. **Simple CRUD support**
   The schema should make create, update, delete, and load operations straightforward.

3. **Referential integrity**
   Invalid edges and orphaned properties must be prevented.

4. **MVP simplicity**
   The first version should stay small and practical.

5. **Future extensibility**
   The schema should allow later support for runtime metadata, tracing, and evaluation without forcing those concepts in now.

---

## Database choice

### Recommended database
- **PostgreSQL**

### Why PostgreSQL
- strong relational integrity
- solid support for UUIDs
- good fit for structured graph-like persistence
- reliable long-term choice for a Rust backend
- easy to evolve later

---

## Core tables

The bench0r MVP should use these core tables:

1. `workspaces`
2. `nodes`
3. `node_properties`
4. `edges`

That is enough for the MVP.

---

## Table: workspaces

### Purpose
Stores one saved architecture workspace.

### Columns
- `id`
- `name`
- `description`
- `created_at`
- `updated_at`

### Suggested SQL shape

```sql
create table workspaces (
    id uuid primary key,
    name text not null,
    description text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
```

### Notes
- `name` should be required.
- `description` is optional.
- timestamps should always be present.

---

## Table: nodes

### Purpose
Stores one visual node on the canvas.

### Columns
- `id`
- `workspace_id`
- `type`
- `label`
- `x_position`
- `y_position`
- `width`
- `height`
- `created_at`
- `updated_at`

### Suggested SQL shape

```sql
create table nodes (
    id uuid primary key,
    workspace_id uuid not null references workspaces(id) on delete cascade,
    type text not null,
    label text not null,
    x_position double precision not null,
    y_position double precision not null,
    width double precision,
    height double precision,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint nodes_type_check check (type in ('AGENT', 'DATASOURCE', 'TOOL', 'RULE'))
);
```

### Notes
- every node belongs to exactly one workspace
- deleting a workspace should delete its nodes
- `type` is stored as text with a check constraint for MVP simplicity
- positions must be persisted
- width and height are optional because the renderer may manage defaults

---

## Table: node_properties

### Purpose
Stores editable key-value metadata for nodes.

### Columns
- `id`
- `node_id`
- `key`
- `value`
- `value_type`
- `created_at`
- `updated_at`

### Suggested SQL shape

```sql
create table node_properties (
    id uuid primary key,
    node_id uuid not null references nodes(id) on delete cascade,
    key text not null,
    value text not null,
    value_type text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint node_properties_unique_key_per_node unique (node_id, key)
);
```

### Notes
- properties belong to exactly one node
- deleting a node should delete its properties
- a simple uniqueness rule on `(node_id, key)` avoids duplicate keys on one node
- `value_type` can initially be values like:
  - `string`
  - `number`
  - `boolean`
  - `text`

---

## Table: edges

### Purpose
Stores directed relationships between nodes.

### Columns
- `id`
- `workspace_id`
- `source_node_id`
- `target_node_id`
- `type`
- `label`
- `created_at`
- `updated_at`

### Suggested SQL shape

```sql
create table edges (
    id uuid primary key,
    workspace_id uuid not null references workspaces(id) on delete cascade,
    source_node_id uuid not null references nodes(id) on delete cascade,
    target_node_id uuid not null references nodes(id) on delete cascade,
    type text not null,
    label text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint edges_type_check check (type in ('RELATES_TO')),
    constraint edges_no_self_loop check (source_node_id <> target_node_id)
);
```

### Notes
- every edge belongs to exactly one workspace
- every edge connects two nodes
- the MVP uses only `RELATES_TO`
- self-loops should be blocked in the first version unless explicitly wanted later

---

## Recommended indexes

### On workspaces
```sql
create index idx_workspaces_updated_at on workspaces(updated_at);
```

### On nodes
```sql
create index idx_nodes_workspace_id on nodes(workspace_id);
create index idx_nodes_type on nodes(type);
```

### On node_properties
```sql
create index idx_node_properties_node_id on node_properties(node_id);
```

### On edges
```sql
create index idx_edges_workspace_id on edges(workspace_id);
create index idx_edges_source_node_id on edges(source_node_id);
create index idx_edges_target_node_id on edges(target_node_id);
```

These indexes are enough for MVP query patterns.

---

## Integrity rules

The database should enforce these rules:

1. A workspace must exist before nodes can belong to it.
2. A node must exist before properties can belong to it.
3. A node must exist before an edge can reference it.
4. Deleting a workspace should delete all dependent nodes, node properties, and edges.
5. Deleting a node should delete its properties and dependent edges.
6. Node type must be one of the allowed values.
7. Edge type must be one of the allowed values.
8. A node should not have duplicate property keys.

---

## Important cross-workspace rule

The database alone does not fully guarantee that:
- `edges.workspace_id`
- source node workspace
- target node workspace

all point to the same workspace.

This rule should be enforced in the **backend service layer**.

### Required backend validation
When creating or updating an edge, the backend must verify:
- source node exists
- target node exists
- source node belongs to the given workspace
- target node belongs to the given workspace
- the edge workspace matches both nodes

This is important.
It prevents invalid graph links across workspaces.

---

## UUID strategy

### Recommendation
Use UUIDs as primary keys for all core tables.

### Why
- stable identifiers
- safe for future import/export
- good for future collaboration or synchronization
- no dependence on sequence-based IDs

For PostgreSQL, UUID generation can be done in the application layer from Rust.
That keeps the DB simpler.

---

## Timestamps

All core tables should include:
- `created_at`
- `updated_at`

### Update strategy
The backend should update `updated_at` on every write.

For the MVP, this can be handled in application code instead of triggers.
That keeps the first version easier to understand.

---

## Enum strategy

For the MVP, enums can be stored as `text` plus `check` constraints.

### Why this is good for the first version
- easier migrations
- simpler SQLx mapping at the beginning
- avoids early PostgreSQL enum migration friction

### Examples
- node type: `AGENT`, `DATASOURCE`, `TOOL`, `RULE`
- edge type: `RELATES_TO`

Later, true PostgreSQL enums could be introduced if helpful.

---

## Suggested Rust-to-database mapping

Conceptually:

- `Uuid` -> `uuid`
- `String` -> `text`
- `Option<String>` -> nullable `text`
- `f32` or `f64` -> `double precision`
- `DateTime<Utc>` -> `timestamptz`

Recommendation:
- use `f64` / `double precision` for positions in persistence
- convert to frontend-friendly values at the API layer if needed

---

## CRUD query patterns the schema should support

### Workspace queries
- create workspace
- list workspaces
- get workspace by id
- update workspace metadata
- delete workspace

### Node queries
- create node
- update node
- delete node
- list nodes by workspace

### Node property queries
- create property
- update property
- delete property
- list properties by node

### Edge queries
- create edge
- update edge
- delete edge
- list edges by workspace

---

## Recommended load pattern for the MVP

When loading a workspace, the backend should typically return:
- workspace metadata
- all nodes in that workspace
- all node properties for those nodes
- all edges in that workspace

This is simple and efficient enough for the first version.

The frontend can then reconstruct the full canvas state.

---

## Migration strategy

Use SQLx migrations.

### Recommendation
Keep migrations simple and additive.

A likely first migration order:
1. create `workspaces`
2. create `nodes`
3. create `node_properties`
4. create `edges`
5. create indexes

---

## What should not be in the schema yet

The following should stay out of the MVP schema:
- user accounts
- auth tables
- runtime executions
- traces
- prompt logs
- benchmark results
- evaluation scenarios
- permissions tables
- collaboration tables
- version history
- LangChain-specific persistence

These concepts should only be added when the product actually needs them.

---

## Future extension path

The schema should later be extendable with tables like:
- `workspace_templates`
- `node_groups`
- `runs`
- `traces`
- `evaluations`
- `compliance_checks`
- `users`
- `workspace_members`

But none of these should distort the MVP schema now.

---

## Example full MVP schema

```sql
create table workspaces (
    id uuid primary key,
    name text not null,
    description text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table nodes (
    id uuid primary key,
    workspace_id uuid not null references workspaces(id) on delete cascade,
    type text not null,
    label text not null,
    x_position double precision not null,
    y_position double precision not null,
    width double precision,
    height double precision,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint nodes_type_check check (type in ('AGENT', 'DATASOURCE', 'TOOL', 'RULE'))
);

create table node_properties (
    id uuid primary key,
    node_id uuid not null references nodes(id) on delete cascade,
    key text not null,
    value text not null,
    value_type text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint node_properties_unique_key_per_node unique (node_id, key)
);

create table edges (
    id uuid primary key,
    workspace_id uuid not null references workspaces(id) on delete cascade,
    source_node_id uuid not null references nodes(id) on delete cascade,
    target_node_id uuid not null references nodes(id) on delete cascade,
    type text not null,
    label text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint edges_type_check check (type in ('RELATES_TO')),
    constraint edges_no_self_loop check (source_node_id <> target_node_id)
);

create index idx_workspaces_updated_at on workspaces(updated_at);
create index idx_nodes_workspace_id on nodes(workspace_id);
create index idx_nodes_type on nodes(type);
create index idx_node_properties_node_id on node_properties(node_id);
create index idx_edges_workspace_id on edges(workspace_id);
create index idx_edges_source_node_id on edges(source_node_id);
create index idx_edges_target_node_id on edges(target_node_id);
```

---

## Final summary

The bench0r MVP database schema should stay small, relational, and explicit.

The core persistence model is:
- `workspaces`
- `nodes`
- `node_properties`
- `edges`

That is enough to support:
- a web-based drawing bench
- persisted canvas layout
- editable node metadata
- directed relationships between elements

The schema should remain modeling-focused.
Runtime concerns can come later.