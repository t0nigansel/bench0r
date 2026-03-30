

# DOMAIN_MODEL

## Purpose

This document defines the core domain model for the **bench0r MVP**.

The MVP is a visual modeling system, not yet an execution runtime.
That means the domain model should describe:
- what kinds of elements exist
- what properties they have
- how they relate to each other
- what must be persisted
- what should remain out of scope for now

The model must support a **web-based drawing bench** where users place abstract architecture elements on a canvas and connect them with arrows.

---

## Domain model principles

1. **Model first, runtime later**
   The domain model should describe architecture, not execution.

2. **Small number of core concepts**
   The MVP should use only a few stable object types.

3. **Visual element = domain object**
   Every visible node on the canvas corresponds to a real domain entity.

4. **Connections are first-class**
   Relationships between elements are part of the model, not just UI artifacts.

5. **Properties are editable metadata**
   In the MVP, properties are primarily descriptive and configuration-oriented.

6. **Future extensibility matters**
   The model must be easy to extend toward LangChain-backed execution later.

---

## Core entity overview

The bench0r MVP contains these core entities:

1. **Workspace**
2. **Node**
3. **NodeType**
4. **NodeProperty**
5. **Edge**
6. **EdgeType**

The visible modeling objects on the canvas are represented through `Node`.
The relationship between nodes is represented through `Edge`.

---

## Workspace

### Definition
A `Workspace` is a saved modeling space.
It contains a set of nodes and edges that together describe one agent-system architecture.

### Purpose
The workspace is the top-level boundary for persistence and editing.

### Responsibilities
A workspace:
- groups nodes and edges
- provides a save/load boundary
- holds basic metadata
- represents one editable modeling document

### Suggested fields
- `id`
- `name`
- `description`
- `created_at`
- `updated_at`

### Notes
The MVP should assume that every node and edge belongs to exactly one workspace.

---

## Node

### Definition
A `Node` is a visual architecture element placed on the canvas.

### Purpose
The node is the main domain object in the MVP.
It represents one element in the modeled system.

### Responsibilities
A node:
- belongs to one workspace
- has one node type
- has a label
- has a position on the canvas
- can have editable properties
- can be connected to other nodes through edges

### Suggested fields
- `id`
- `workspace_id`
- `type`
- `label`
- `x_position`
- `y_position`
- `width` (optional)
- `height` (optional)
- `created_at`
- `updated_at`

### Notes
The MVP should persist node positions so the visual layout survives reloads.

---

## NodeType

### Definition
`NodeType` defines the semantic kind of a node.

### Allowed MVP values
- `AGENT`
- `DATASOURCE`
- `TOOL`
- `RULE`

### Meaning of each type

#### `AGENT`
Represents an agent in the modeled system.

Visual shape:
- rectangle

Conceptual meaning:
- actor
- responsibility holder
- system participant

#### `DATASOURCE`
Represents a data source that can be connected to agents.

Visual shape:
- cylinder

Conceptual meaning:
- knowledge source
- operational data source
- retrievable information source

#### `TOOL`
Represents a tool that can be attached to an agent.

Visual shape:
- distinct abstract tool node

Conceptual meaning:
- capability provider
- external action mechanism
- callable functionality

#### `RULE`
Represents a global or local policy/compliance concept.

Visual shape:
- distinct abstract policy node

Conceptual meaning:
- rule
- governance constraint
- compliance boundary
- architectural restriction

---

## NodeProperty

### Definition
A `NodeProperty` is a key-value attribute attached to a node.

### Purpose
Properties allow the MVP to stay flexible without creating separate tables for every future detail too early.

### Responsibilities
A node property:
- belongs to one node
- stores an editable attribute
- has a typed or type-like value

### Suggested fields
- `id`
- `node_id`
- `key`
- `value`
- `value_type`
- `created_at`
- `updated_at`

### Example properties by node type

#### Agent properties
- `role`
- `goal`
- `model`
- `system_prompt`
- `temperature`
- `status`
- `notes`

#### Data source properties
- `source_kind`
- `location`
- `description`
- `sensitivity`
- `owner`

#### Tool properties
- `tool_kind`
- `description`
- `input_mode`
- `output_mode`

#### Rule properties
- `rule_kind`
- `description`
- `severity`
- `scope`

### Notes
In the MVP, `NodeProperty` is mostly descriptive.
Later, some of these properties may become execution-relevant.

---

## Edge

### Definition
An `Edge` is a directed relationship between two nodes.

### Purpose
Edges make the modeled architecture readable.
They show how elements relate to one another.

### Responsibilities
An edge:
- belongs to one workspace
- connects one source node to one target node
- has a relationship type
- may have a label

### Suggested fields
- `id`
- `workspace_id`
- `source_node_id`
- `target_node_id`
- `type`
- `label` (optional)
- `created_at`
- `updated_at`

### Notes
In the MVP, edges represent **relationships**, not execution order.
That distinction must remain explicit.

---

## EdgeType

### Definition
`EdgeType` defines the meaning of a connection.

### MVP approach
For the first version, the system can either:

#### Option A — keep it minimal
Use a single generic relationship type:
- `RELATES_TO`

#### Option B — allow a few semantic types early
Use a small set such as:
- `CONNECTS_TO`
- `USES`
- `READS_FROM`
- `CONSTRAINED_BY`

### Recommendation
For the very first cut, use **one generic type**:
- `RELATES_TO`

This keeps the MVP simple.
Semantic edge types can come later.

---

## Entity relationships

### Workspace relationships
- one workspace has many nodes
- one workspace has many edges

### Node relationships
- one node belongs to one workspace
- one node has many properties
- one node can be the source of many edges
- one node can be the target of many edges

### Edge relationships
- one edge belongs to one workspace
- one edge references exactly one source node
- one edge references exactly one target node

### Property relationships
- one node property belongs to one node

---

## Cardinality summary

- `Workspace 1 -> N Node`
- `Workspace 1 -> N Edge`
- `Node 1 -> N NodeProperty`
- `Node 1 -> N Edge (outgoing)`
- `Node 1 -> N Edge (incoming)`

---

## Visual model mapping

The UI should render domain objects like this:

- `Node(type = AGENT)` -> rectangle
- `Node(type = DATASOURCE)` -> cylinder
- `Node(type = TOOL)` -> abstract tool shape
- `Node(type = RULE)` -> abstract rule/policy shape
- `Edge` -> directed arrow

This mapping must remain separate from persistence logic.
The domain model defines what something **is**.
The renderer defines how it **looks**.

---

## Allowed MVP connections

The first version should stay permissive.
The system may allow any node type to connect to any other node type.

That said, the intended meaningful patterns are:

- `AGENT -> AGENT`
- `AGENT -> TOOL`
- `AGENT -> DATASOURCE`
- `RULE -> AGENT`
- `RULE -> TOOL`
- `RULE -> DATASOURCE`

### Recommendation
For the MVP:
- allow broad connection flexibility
- keep validation simple
- avoid complex graph rules too early

Later, the app can add stronger semantic constraints.

---

## Domain invariants

The following rules should always hold:

1. Every node belongs to exactly one workspace.
2. Every edge belongs to exactly one workspace.
3. Every edge source node must exist.
4. Every edge target node must exist.
5. The source and target of an edge should belong to the same workspace as the edge.
6. Every node property belongs to exactly one node.
7. Node type must be one of the allowed enum values.
8. Edge type must be one of the allowed enum values.

These invariants should be enforced by the backend and database.

---

## Identity strategy

Use stable IDs for all persisted entities.

Recommended:
- UUIDs for `Workspace`, `Node`, `NodeProperty`, and `Edge`

This keeps the system safe for future sync, collaboration, import/export, and runtime attachment.

---

## What is deliberately not in the MVP domain model

The following concepts are intentionally excluded from the first version:

- prompt execution
- runtime state
- conversation history
- task runs
- traces
- evaluations
- benchmarks
- version history
- users / auth model
- permissions model
- LangChain-specific classes
- memory systems
- vector indexing behavior

These can be added later without polluting the initial model.

---

## Future extension path

The MVP domain model should later be extendable toward:

### Phase 2 extensions
- richer property typing
- semantic edge types
- grouping / containers
- tags and categories
- workspace templates

### Phase 3 extensions
- executable agent definitions
- tool runtime bindings
- datasource runtime adapters
- rule enforcement metadata
- orchestration metadata

### Phase 4 extensions
- runs
- traces
- evaluation scenarios
- benchmark results
- governance checks

---

## Recommended Rust model shape

This is only a conceptual example, not the final code.

```rust
pub enum NodeType {
    Agent,
    Datasource,
    Tool,
    Rule,
}

pub enum EdgeType {
    RelatesTo,
}

pub struct Workspace {
    pub id: Uuid,
    pub name: String,
    pub description: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

pub struct Node {
    pub id: Uuid,
    pub workspace_id: Uuid,
    pub node_type: NodeType,
    pub label: String,
    pub x_position: f32,
    pub y_position: f32,
    pub width: Option<f32>,
    pub height: Option<f32>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

pub struct NodeProperty {
    pub id: Uuid,
    pub node_id: Uuid,
    pub key: String,
    pub value: String,
    pub value_type: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

pub struct Edge {
    pub id: Uuid,
    pub workspace_id: Uuid,
    pub source_node_id: Uuid,
    pub target_node_id: Uuid,
    pub edge_type: EdgeType,
    pub label: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
```

---

## Final summary

The bench0r MVP domain model is intentionally small.

It is built around:
- workspaces
- nodes
- node types
- node properties
- edges
- edge types

This is enough to support a first drawing bench where users can model agent-system architectures visually and persist them cleanly.

The model should stay architecture-focused.
Execution can come later.