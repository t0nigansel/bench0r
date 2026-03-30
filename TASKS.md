

# TASKS

## Purpose

This document breaks the **bench0r MVP backlog** into small, executable tasks.

It is written for coding agents and human developers who need a concrete implementation sequence.
Each task should be small enough to complete in a focused iteration.

The goal is not elegant planning.
The goal is steady delivery of a working MVP.

---

## Task execution rules

1. Complete tasks in order unless there is a strong reason not to.
2. Prefer end-to-end working slices over isolated abstractions.
3. Keep the implementation aligned with:
   - `MANIFEST.md`
   - `ARCHITECTURE.md`
   - `DOMAIN_MODEL.md`
   - `DATABASE_SCHEMA.md`
   - `MVP.md`
   - `CANVAS_BEHAVIOR.md`
   - `UI_SCREENS.md`
   - `BACKLOG.md`
4. Do not add runtime or LangChain logic.
5. Do not switch persistence to JSON files.
6. Keep the canvas simple.

---

## Phase 1 — Foundation

### T001 — Create repo structure
**Goal:** establish a clean project layout for frontend and backend.

**Do:**
- create frontend folder
- create backend folder
- create shared root-level docs structure if missing
- ensure the repo layout matches the architecture docs

**Done when:**
- the repo has a stable project structure

---

### T002 — Initialize frontend app
**Goal:** create the React frontend shell.

**Do:**
- initialize React + TypeScript + Vite app
- verify dev server starts
- add base app shell

**Done when:**
- frontend runs locally

---

### T003 — Initialize Rust backend app
**Goal:** create the Rust backend shell.

**Do:**
- initialize Rust backend project
- add Axum dependency setup
- add Tokio runtime
- add a basic HTTP server bootstrap

**Done when:**
- backend runs locally and serves a basic endpoint

---

### T004 — Add backend health endpoint
**Goal:** confirm backend is reachable.

**Do:**
- add a simple `/health` endpoint
- return a basic success response

**Done when:**
- frontend or browser can reach `/health`

---

### T005 — Add environment configuration
**Goal:** support local development safely.

**Do:**
- define environment variables for backend
- define DB connection variable
- add example env documentation if needed

**Done when:**
- backend can read config from environment

---

## Phase 2 — Database setup

### T006 — Set up PostgreSQL locally
**Goal:** provide a working database for development.

**Do:**
- configure local PostgreSQL instance
- verify connection manually

**Done when:**
- database is reachable from local environment

---

### T007 — Add SQLx to backend
**Goal:** enable typed DB access from Rust.

**Do:**
- add SQLx dependencies
- add connection pool setup
- verify backend can connect to DB

**Done when:**
- backend starts with live DB connection

---

### T008 — Create initial migration for `workspaces`
**Goal:** create the first persistence table.

**Do:**
- add SQL migration for `workspaces`
- include UUID PK and timestamps

**Done when:**
- migration runs successfully

---

### T009 — Create migration for `nodes`
**Goal:** persist canvas nodes.

**Do:**
- add SQL migration for `nodes`
- include workspace FK
- include node type check constraint
- include position fields

**Done when:**
- migration runs successfully

---

### T010 — Create migration for `node_properties`
**Goal:** persist editable node metadata.

**Do:**
- add SQL migration for `node_properties`
- include node FK
- include unique `(node_id, key)` constraint

**Done when:**
- migration runs successfully

---

### T011 — Create migration for `edges`
**Goal:** persist directed relationships.

**Do:**
- add SQL migration for `edges`
- include workspace FK
- include source/target node FKs
- include type check constraint
- include no-self-loop constraint if kept in schema

**Done when:**
- migration runs successfully

---

### T012 — Create indexes
**Goal:** support normal MVP query patterns.

**Do:**
- add indexes described in `DATABASE_SCHEMA.md`

**Done when:**
- index migration runs successfully

---

## Phase 3 — Backend skeleton

### T013 — Create backend module structure
**Goal:** align backend code with architecture docs.

**Do:**
- add route modules
- add db module
- add models module
- add schemas module
- add services/utils if needed

**Done when:**
- backend structure is ready for feature work

---

### T014 — Add shared API error format
**Goal:** make backend failures predictable.

**Do:**
- define basic error response shape
- map common errors to HTTP status codes

**Done when:**
- backend returns structured errors

---

### T015 — Add workspace request/response schemas
**Goal:** prepare workspace API payloads.

**Do:**
- create Serde request/response types for workspace CRUD

**Done when:**
- workspace payload types are defined

---

### T016 — Add node request/response schemas
**Goal:** prepare node API payloads.

**Do:**
- create Serde request/response types for node CRUD

**Done when:**
- node payload types are defined

---

### T017 — Add edge request/response schemas
**Goal:** prepare edge API payloads.

**Do:**
- create Serde request/response types for edge CRUD

**Done when:**
- edge payload types are defined

---

## Phase 4 — Workspace CRUD end to end

### T018 — Implement create workspace endpoint
**Goal:** create workspaces from API.

**Done when:**
- a POST endpoint creates a workspace row in DB

---

### T019 — Implement list workspaces endpoint
**Goal:** retrieve saved workspaces.

**Done when:**
- a GET endpoint returns saved workspaces

---

### T020 — Implement get workspace endpoint
**Goal:** load one workspace metadata record.

**Done when:**
- a GET endpoint returns one workspace by id

---

### T021 — Implement update workspace endpoint
**Goal:** rename/edit workspace metadata.

**Done when:**
- workspace metadata can be updated

---

### T022 — Implement delete workspace endpoint
**Goal:** remove a workspace cleanly.

**Done when:**
- deleting a workspace removes it and cascades dependent rows

---

## Phase 5 — Frontend workspace management

### T023 — Create frontend app shell
**Goal:** render the first visible product shell.

**Do:**
- create base layout
- add routing if used
- create placeholder pages

**Done when:**
- frontend has a visible application shell

---

### T024 — Build Workspace List Screen
**Goal:** create the entry screen.

**Do:**
- create workspace list view
- add title/header
- add empty state

**Done when:**
- screen renders correctly

---

### T025 — Connect workspace list API
**Goal:** load real data into the list screen.

**Done when:**
- workspace list shows backend data

---

### T026 — Add create workspace flow in UI
**Goal:** let the user create a workspace from frontend.

**Done when:**
- user can create a workspace from UI and see it in the list

---

### T027 — Add rename workspace flow in UI
**Goal:** let the user rename a workspace from frontend.

**Done when:**
- user can rename a workspace from UI

---

### T028 — Add delete workspace flow in UI
**Goal:** let the user delete a workspace from frontend.

**Done when:**
- user can delete a workspace from UI

---

### T029 — Add open workspace navigation
**Goal:** move from list screen to canvas screen.

**Done when:**
- user can open a workspace into the canvas screen

---

## Phase 6 — Canvas shell

### T030 — Create Workspace Canvas Screen shell
**Goal:** create the main product screen.

**Do:**
- add top bar
- add canvas region
- add placeholder palette
- add placeholder detail panel

**Done when:**
- canvas screen layout exists

---

### T031 — Integrate React Flow
**Goal:** provide the graph canvas foundation.

**Done when:**
- React Flow renders inside canvas area

---

### T032 — Add empty canvas state
**Goal:** make an empty workspace understandable.

**Done when:**
- empty workspace shows a clear usable blank state

---

### T033 — Add top bar workspace context
**Goal:** show current workspace clearly.

**Done when:**
- current workspace name is visible in canvas screen

---

### T034 — Add save-state feedback shell
**Goal:** prepare reliable persistence UX.

**Done when:**
- UI has a place for save/auto-save status

---

## Phase 7 — Load workspace into canvas

### T035 — Implement workspace load endpoint
**Goal:** return the full modeled state for a workspace.

**Do:**
- return workspace metadata
- return nodes
- return node properties
- return edges

**Done when:**
- one API call can load the full workspace state

---

### T036 — Load workspace data in frontend canvas screen
**Goal:** reconstruct canvas state from backend.

**Done when:**
- opening a workspace loads its nodes and edges into canvas

---

## Phase 8 — Node creation

### T037 — Implement create node endpoint
**Goal:** create nodes from API.

**Done when:**
- API can persist a new node

---

### T038 — Add node palette / add controls
**Goal:** give user visible node creation actions.

**Done when:**
- user can choose Agent, Data Source, Tool, or Rule

---

### T039 — Add create Agent flow
**Goal:** create Agent nodes from UI.

**Done when:**
- user can create an Agent node and see it on canvas

---

### T040 — Add create Data Source flow
**Goal:** create Data Source nodes from UI.

**Done when:**
- user can create a Data Source node and see it on canvas

---

### T041 — Add create Tool flow
**Goal:** create Tool nodes from UI.

**Done when:**
- user can create a Tool node and see it on canvas

---

### T042 — Add create Rule flow
**Goal:** create Rule nodes from UI.

**Done when:**
- user can create a Rule node and see it on canvas

---

### T043 — Add sensible default placement
**Goal:** place new nodes predictably.

**Done when:**
- new nodes appear in a sensible visible location

---

## Phase 9 — Node rendering

### T044 — Create Agent node renderer
**Goal:** display Agent nodes as rectangles.

**Done when:**
- Agent nodes render distinctly as rectangles

---

### T045 — Create Data Source node renderer
**Goal:** display Data Source nodes as cylinders.

**Done when:**
- Data Source nodes render distinctly as cylinders

---

### T046 — Create Tool node renderer
**Goal:** display Tool nodes in a distinct abstract shape.

**Done when:**
- Tool nodes render distinctly from other node types

---

### T047 — Create Rule node renderer
**Goal:** display Rule nodes in a distinct abstract shape.

**Done when:**
- Rule nodes render distinctly from other node types

---

### T048 — Display node labels on canvas
**Goal:** make nodes understandable at a glance.

**Done when:**
- each node shows its label on canvas

---

## Phase 10 — Node selection and editing

### T049 — Add node selection state
**Goal:** make selected node visible and editable.

**Done when:**
- clicking a node selects it and highlights it

---

### T050 — Build node detail panel
**Goal:** show editable node details.

**Done when:**
- selecting a node opens panel with node details

---

### T051 — Implement update node endpoint
**Goal:** persist node field changes.

**Done when:**
- node label and basic fields can be updated via API

---

### T052 — Add node label editing in UI
**Goal:** allow node rename from detail panel.

**Done when:**
- user can edit a node label and see it update on canvas

---

### T053 — Implement create/update node property endpoint
**Goal:** persist editable node metadata.

**Done when:**
- node properties can be created and updated via API

---

### T054 — Add node property editing in UI
**Goal:** allow descriptive metadata editing.

**Done when:**
- user can edit type-relevant properties in the detail panel

---

### T055 — Implement delete node endpoint
**Goal:** remove nodes safely.

**Done when:**
- node deletion removes node and dependent rows correctly

---

### T056 — Add node delete action in UI
**Goal:** let the user remove selected nodes.

**Done when:**
- user can delete a selected node from the detail panel or UI action

---

## Phase 11 — Node dragging and persistence

### T057 — Add node drag behavior on canvas
**Goal:** allow free positioning.

**Done when:**
- user can drag nodes smoothly

---

### T058 — Persist node position changes
**Goal:** save layout changes durably.

**Done when:**
- dragged node positions survive reload

---

## Phase 12 — Edge creation and rendering

### T059 — Implement create edge endpoint
**Goal:** persist new edges.

**Done when:**
- API can create edges between valid nodes

---

### T060 — Implement list edges endpoint
**Goal:** load edges by workspace.

**Done when:**
- workspace edges can be retrieved from API

---

### T061 — Enable connect interaction on canvas
**Goal:** let the user draw arrows between nodes.

**Done when:**
- user can create a connection from one node to another

---

### T062 — Render directed arrows
**Goal:** show persisted relationships visually.

**Done when:**
- created edges appear as arrows on canvas

---

### T063 — Add edge selection state
**Goal:** make selected edge visible and inspectable.

**Done when:**
- clicking an edge selects and highlights it

---

### T064 — Build edge detail panel view
**Goal:** show minimal edge info.

**Done when:**
- selected edge shows source, target, and delete option

---

### T065 — Implement delete edge endpoint
**Goal:** remove edges safely.

**Done when:**
- edge deletion works via API

---

### T066 — Add delete edge flow in UI
**Goal:** let user remove selected edges.

**Done when:**
- user can delete selected edge from UI

---

## Phase 13 — Validation and integrity

### T067 — Validate node type values in backend
**Goal:** reject invalid node types.

**Done when:**
- invalid node types return clear API errors

---

### T068 — Validate edge type values in backend
**Goal:** reject invalid edge types.

**Done when:**
- invalid edge types return clear API errors

---

### T069 — Validate edge source/target existence
**Goal:** prevent broken relationships.

**Done when:**
- edges cannot be created for missing nodes

---

### T070 — Validate same-workspace edge rule
**Goal:** prevent cross-workspace graph corruption.

**Done when:**
- backend rejects edges that connect nodes from other workspaces

---

### T071 — Validate duplicate property keys per node
**Goal:** keep node metadata consistent.

**Done when:**
- duplicate keys are rejected clearly

---

## Phase 14 — Error handling and UX reliability

### T072 — Add frontend load error state
**Goal:** avoid silent workspace load failure.

**Done when:**
- failed workspace load shows a clear user-visible error

---

### T073 — Add frontend save error feedback
**Goal:** make persistence failure visible.

**Done when:**
- failed save/update actions show clear user-visible error

---

### T074 — Add delete feedback and fallback selection behavior
**Goal:** keep canvas state understandable after deletion.

**Done when:**
- selection resets sensibly after deleting nodes or edges

---

### T075 — Add persistence status indicator
**Goal:** reassure user that changes are stored.

**Done when:**
- UI shows simple save / saving / error state

---

## Phase 15 — MVP polish pass

### T076 — Review canvas behavior against `CANVAS_BEHAVIOR.md`
**Goal:** ensure implementation matches intended interaction model.

**Done when:**
- major behavior mismatches are fixed

---

### T077 — Review screen layout against `UI_SCREENS.md`
**Goal:** ensure product shape matches documented MVP.

**Done when:**
- screen structure aligns with docs

---

### T078 — Review persistence against `DATABASE_SCHEMA.md`
**Goal:** ensure data layer matches schema decisions.

**Done when:**
- implementation matches DB doc

---

### T079 — Review domain alignment against `DOMAIN_MODEL.md`
**Goal:** ensure code matches domain concepts.

**Done when:**
- implementation aligns with documented entities

---

### T080 — Final happy-path manual verification
**Goal:** confirm the MVP is real.

**Verify this flow:**
- create workspace
- open workspace
- add Agent
- add Tool
- add Data Source
- add Rule
- move nodes
- connect nodes
- edit labels/properties
- reload workspace
- confirm structure is preserved

**Done when:**
- the full happy path works reliably end to end

---

## Milestone mapping

### Milestone A
- T001–T029
- T030–T039
- T049–T052
- T058

Result:
- user can create workspace, add one Agent, rename it, reload it

### Milestone B
- T040–T066

Result:
- user can create all node types, connect them, persist full architecture

### Milestone C
- T067–T080

Result:
- MVP is reliable enough for real use

---

## Explicit non-tasks

The following are not tasks for the MVP and should not be added here yet:
- LangChain integration
- runtime execution
- agent simulation
- trace view
- benchmark engine
- permissions system
- auth system
- workspace collaboration
- advanced graph semantics
- import/export framework
- analytics dashboards

---

## Final summary

These tasks are intentionally narrow.

The goal is not to build the final vision.
The goal is to build the first real version of bench0r:
- web UI
- drawing bench
- distinct node types
- arrows
- detail editing
- Rust API
- PostgreSQL persistence

Nothing more is needed for the MVP.