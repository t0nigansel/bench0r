# ARCHITECTURE

## Purpose

This document defines the technical architecture for the **bench0r MVP**.

The MVP is a **web-based visual drawing bench** for agent systems.
It is not yet a workflow runtime.
It is not yet a LangChain application.
It is not yet an orchestration engine.

Its main job is to let the user:
- create visual architecture elements
- place them on a canvas
- connect them with arrows
- edit their properties
- persist the modeled architecture in a database
- load and continue editing saved architectures

The system must be designed so that a later phase can attach a real runtime layer underneath it.
That later phase may use LangChain, but the MVP must not depend on LangChain.

---

## Architectural goals

The architecture should optimize for these goals:

1. **Fast MVP delivery**
   The first version should be simple to implement.

2. **Clear separation of concerns**
   UI, API, persistence, and later runtime concerns should be separated cleanly.

3. **Canvas-first modeling**
   The center of the product is the drawing bench.

4. **Database-backed state**
   The source of truth is the database, not local JSON files.

5. **Extensible domain model**
   The MVP model should be simple, but easy to extend later.

6. **Runtime-ready later**
   The architecture should allow a later LangChain-backed execution layer without forcing it into the MVP.

---

## Recommended stack

### Frontend
- **React**
- **TypeScript**
- **Vite**
- **React Flow** for the visual graph canvas
- **Tailwind CSS** for fast UI styling
- **Zustand** for local UI state

### Backend
- **Rust**
- **Axum**
- **Tokio**

Recommendation: use **Axum** for a clean, modern, async Rust API layer.

### Database
- **PostgreSQL**

### DB access
- **SQLx**

### Validation / serialization
- **Serde**
- **validator** or lightweight custom validation where needed

### API style
- Simple **REST API** for the MVP

### Deployment later
- Frontend: static hosting or container
- Backend: container
- Database: PostgreSQL container or managed PostgreSQL

---

## Why this stack

### React + TypeScript
The UI is the product.
React is the safest choice for a fast-moving web UI with a rich component ecosystem.
TypeScript keeps the domain model and API contracts strict.

### React Flow
The MVP needs a graph canvas with draggable nodes and visible edges.
React Flow is a strong fit because it already solves much of the graph interaction layer.
It reduces time spent building node/edge behavior from scratch.

### Rust + Axum
The backend should stay thin in the MVP.
Rust gives strong type safety, performance, and long-term maintainability.
Axum is a strong fit for a clean async HTTP API and works well for a backend that is mostly CRUD plus validation.

### PostgreSQL + SQLx
The user explicitly wants database persistence, not JSON file persistence.
PostgreSQL is reliable and flexible.
SQLx keeps database access explicit and type-safe without forcing a heavy ORM model into the MVP.

---

## High-level architecture

bench0r MVP consists of four major layers:

1. **Web UI**
2. **Canvas interaction layer**
3. **Backend API**
4. **Database persistence layer**

```text
+---------------------------+
|         Web UI            |
| React + TS + Tailwind     |
+-------------+-------------+
              |
              v
+---------------------------+
|   Canvas / Graph Layer    |
| React Flow + UI State     |
+-------------+-------------+
              |
              v
+---------------------------+
|       Backend API         |
| Axum + Serde + SQLx       |
+-------------+-------------+
              |
              v
+---------------------------+
|        PostgreSQL         |
|  nodes, edges, metadata   |
+---------------------------+
```

---

## Architectural decomposition

## 1. Frontend web UI

The frontend is responsible for:
- rendering the drawing bench
- rendering nodes and arrows
- handling user interactions
- opening detail panels
- editing properties
- calling the backend API
- loading and saving workspaces

The frontend should be split into these conceptual parts:

### 1.1 App shell
The shell contains:
- top bar
- optional left palette / toolbox
- main canvas area
- right-side detail panel

### 1.2 Canvas workspace
The central area where elements are placed.

Responsibilities:
- show nodes
- show edges
- support selection
- support drag
- support connect actions
- support zoom and pan

### 1.3 Node palette
A simple UI to add:
- Agent
- Data Source
- Tool
- Rule / Compliance Constraint

### 1.4 Detail panel
The side panel for the selected node or edge.

Responsibilities:
- show type
- show properties
- edit fields
- save changes
- possibly delete the selected object

### 1.5 Workspace actions
Simple actions such as:
- create workspace
- rename workspace
- save
- load
- delete

---

## 2. Canvas / graph interaction layer

This is the core of the MVP.

The canvas layer is responsible for mapping the domain model to visual elements.

### Node types
The first version should support these node types:

1. **Agent**
   Visual shape: rectangle

2. **Data Source**
   Visual shape: cylinder

3. **Tool**
   Visual shape: simple distinct tool node

4. **Rule / Compliance Constraint**
   Visual shape: simple distinct policy node

### Edge type
- Directed arrow

### Canvas behavior
The canvas should support:
- add node
- move node
- select node
- select edge
- connect nodes with directed arrows
- delete node
- delete edge
- open detail panel on selection
- persist node position

### Important design rule
The canvas is not yet a workflow builder.
Edges represent **relationships**, not executable control flow.

That distinction matters.
It keeps the MVP conceptually clean.

---

## 3. Backend API

The backend is intentionally thin.

Its responsibilities are:
- validate input
- persist and load workspaces
- persist and load nodes
- persist and load edges
- persist and load metadata / properties
- enforce simple integrity rules

The backend should not contain workflow execution logic in the MVP.

The Rust backend should remain intentionally small and explicit. It should expose a simple REST API, handle validation and persistence, and avoid premature abstraction.

### Backend modules

#### 3.1 Workspace module
Responsible for:
- create workspace
- list workspaces
- get workspace
- update workspace metadata
- delete workspace

#### 3.2 Node module
Responsible for:
- create node
- update node
- delete node
- list nodes in workspace

#### 3.3 Edge module
Responsible for:
- create edge
- update edge
- delete edge
- list edges in workspace

#### 3.4 Validation layer
Use Serde for request/response serialization and deserialization.
Use lightweight validation at the API boundary for:
- request validation
- response shaping where useful
- clear domain constraints before persistence

---

## 4. Database persistence layer

The database is the source of truth.

The MVP should store:
- workspaces
- nodes
- edges
- node properties
- timestamps

### Persistence rule
Do not persist the modeled architecture primarily as JSON blobs if avoidable.
Use structured relational tables.

Small metadata blobs may be acceptable where practical, but the main data should remain queryable and normalized enough for future growth.

---

## Proposed data model at architecture level

This section is intentionally high-level.
The exact tables belong in `DATABASE_SCHEMA.md`.

### Workspace
Represents one editable modeling space.

Example fields:
- id
- name
- description
- created_at
- updated_at

### Node
Represents one visual element.

Example fields:
- id
- workspace_id
- type
- label
- x_position
- y_position
- created_at
- updated_at

### NodeProperty
Represents editable attributes of a node.

Example fields:
- id
- node_id
- key
- value
- value_type

### Edge
Represents a connection between two nodes.

Example fields:
- id
- workspace_id
- source_node_id
- target_node_id
- relationship_type
- label
- created_at
- updated_at

This structure allows the MVP to stay flexible without overengineering a runtime model too early.

---

## Frontend architecture structure

Recommended frontend folder shape:

```text
src/
  app/
  components/
    canvas/
    layout/
    nodes/
    panels/
    forms/
  features/
    workspaces/
    nodes/
    edges/
  lib/
    api/
    contracts/
    utils/
  store/
  types/
  pages/
```

### Recommended frontend responsibilities

#### `components/canvas/`
Canvas rendering and React Flow wiring.

#### `components/nodes/`
Custom node renderers:
- AgentNode
- DataSourceNode
- ToolNode
- RuleNode

#### `components/panels/`
Detail panels and inspectors.

#### `features/workspaces/`
Workspace state and API integration.

#### `features/nodes/`
Node CRUD and mapping.

#### `features/edges/`
Edge CRUD and connection handling.

#### `store/`
Transient UI state only.
Examples:
- selected node
- selected edge
- panel visibility
- canvas interaction mode

Important: persistent data still comes from the backend.

---

## Backend architecture structure

Recommended backend folder shape:

```text
src/
  main.rs
  app.rs
  routes/
    workspaces.rs
    nodes.rs
    edges.rs
  modules/
    workspaces/
    nodes/
    edges/
  db/
    pool.rs
  models/
  schemas/
  services/
  utils/
```

### Recommended backend responsibilities

#### `routes/`
HTTP route registration.

#### `modules/...`
Feature-focused business logic.

#### models/
Rust domain and persistence models.

#### schemas/
Serde request/response payload types and validation boundary structs.

#### db/pool.rs
PostgreSQL connection pool setup.

#### `services/`
Shared reusable logic if needed.

---

## API boundary design

The frontend should not talk directly in database terms.
It should talk in UI/domain terms.

Example:
- frontend sends `type = AGENT`
- backend maps it to DB representation
- frontend sends node position and editable fields
- backend validates and persists

This keeps the database free to evolve without breaking the UI too early.

---

## Workspace lifecycle

A simple workspace lifecycle for the MVP:

1. User creates a workspace.
2. User opens the canvas.
3. User adds nodes.
4. User connects nodes with arrows.
5. User edits properties in the side panel.
6. Changes are persisted to the database.
7. User can later reload the workspace and continue editing.

This lifecycle should drive the first API and DB design.

---

## Shape system and rendering strategy

The node type must be separate from the rendering implementation.

Use a clear mapping like:

```text
AGENT       -> rectangle renderer
DATASOURCE  -> cylinder renderer
TOOL        -> tool renderer
RULE        -> rule renderer
```

This ensures that later visual redesign does not break the domain model.

---

## State management strategy

Use two levels of state:

### Local UI state
Use Zustand for transient interaction state such as:
- selected node
- selected edge
- panel open/closed state
- current drag state
- temporary unsaved form input if needed

### Server state
Use the Rust API as the source of persistent truth.

Optional later improvement:
- React Query / TanStack Query for server state caching

For the MVP, plain fetch wrappers are enough if kept clean.

---

## Error handling philosophy

The MVP should keep error handling simple but explicit.

### Frontend
- show inline form errors
- show save/load failure states
- avoid silent failures

### Backend
- validate all requests
- return clear HTTP error codes
- return structured validation errors where practical
- keep database and domain errors explicit and mappable to API responses

### Database
- enforce foreign keys
- prevent invalid edge references
- delete dependent records safely or block deletion explicitly

---

## Security considerations for the MVP

Even though the MVP is not yet an execution platform, it should avoid poor habits.

### Minimum expectations
- validate all inputs
- sanitize or safely render user-entered labels/text
- protect against invalid object references
- do not expose raw database internals
- prepare the system for future auth, even if auth is not in the first cut

If authentication is omitted in the very first local version, structure the app so auth can be inserted later without major rewrites.

---

## Non-goals for the MVP

The following are explicitly out of scope for the first version:
- LangChain execution
- prompt execution
- agent runtime orchestration
- background jobs
- live collaboration
- permissions model
- version history
- benchmark execution
- tracing
- evaluation harness
- graph analytics beyond basic display

These may come later, but they should not distort the MVP architecture.

---

## Future extension path

The architecture should make these future layers possible:

### Phase 2
- richer node properties
- semantic connection types
- workspace templates
- better visual grouping and layout

### Phase 3
- LangChain integration layer
- executable agents
- executable tool wiring
- retrieval-backed data source behavior
- simple run lifecycle

### Phase 4
- trace view
- evaluation / bench scenarios
- security and compliance validation
- governance features

---

## Key architectural rule

**In the MVP, bench0r models systems. It does not run them.**

This one rule should guide implementation decisions.
Whenever a decision adds runtime complexity without helping the modeling experience, it is probably too early.

---

## Suggested implementation order

1. Set up frontend shell and Rust backend skeleton.
2. Set up PostgreSQL + SQLx.
3. Implement workspace CRUD.
4. Implement node CRUD.
5. Implement edge CRUD.
6. Render nodes on the canvas.
7. Render arrows between nodes.
8. Add side-panel editing.
9. Persist positions and properties.
10. Clean up types, validation, and error mapping.

---

## Final summary

The bench0r MVP architecture is a **web-based canvas modeling system** with a thin Rust backend and structured database persistence.

Its core flow is:
- model architecture visually
- store it safely
- load it reliably
- prepare for a later runtime layer

The architecture should stay simple, typed, and modular.
The goal is not to build LangChain too early.
The goal is to build the best first drawing bench for agent systems.