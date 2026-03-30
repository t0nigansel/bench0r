

# BACKLOG

## Purpose

This document defines the implementation backlog for the **bench0r MVP**.

The backlog translates the product vision into a practical build order.
It is optimized for coding agents and human developers who need a clear sequence of work.

The guiding rule is:

**Build the smallest complete drawing bench first.**

That means:
- do not start with LangChain
- do not start with runtime execution
- do not start with advanced governance logic
- do not start with observability or tracing

Start with the smallest product that lets a user model and persist an agent-system architecture visually.

---

## Backlog principles

1. **Thin vertical slices first**
   Prefer end-to-end functionality over isolated technical depth.

2. **Modeling before execution**
   Anything related to runtime is out of scope until the drawing bench works.

3. **Database before fake persistence**
   Do not waste time with JSON-file persistence.

4. **Canvas before polish**
   Make the drawing bench work before optimizing visual detail.

5. **Simple types before semantic complexity**
   One generic edge type is enough for the MVP.

---

## MVP epic overview

The bench0r MVP backlog is organized into these epics:

1. **Project Foundation**
2. **Backend Foundation**
3. **Database and Persistence**
4. **Workspace Management**
5. **Canvas Rendering**
6. **Node Creation and Editing**
7. **Edge Creation and Editing**
8. **Persistence Integration**
9. **Validation and Error Handling**
10. **MVP Cleanup and Hardening**

---

## Epic 1: Project Foundation

### Goal
Set up the repo, frontend shell, backend shell, and development environment.

### Tasks
- Create frontend app with React + TypeScript + Vite.
- Create backend app with Rust + Axum.
- Set up basic monorepo or repo structure for frontend and backend.
- Add shared documentation entry points.
- Add basic environment configuration.
- Add linting / formatting setup where practical.
- Add a simple way to run frontend and backend locally.

### Done when
- frontend starts locally
- backend starts locally
- repo structure is stable enough for feature work

---

## Epic 2: Backend Foundation

### Goal
Create the basic Rust backend structure and API skeleton.

### Tasks
- Create Axum app bootstrap.
- Add route modules for workspaces, nodes, edges, and properties.
- Add request/response schema structure with Serde.
- Add basic error response format.
- Add health endpoint.
- Add DB connection pool setup.

### Done when
- backend has a clear modular structure
- HTTP server starts
- route registration exists
- DB connection setup is in place

---

## Epic 3: Database and Persistence

### Goal
Implement the PostgreSQL schema and persistence foundation.

### Tasks
- Set up PostgreSQL locally.
- Set up SQLx.
- Create initial migrations for:
  - workspaces
  - nodes
  - node_properties
  - edges
- Create indexes.
- Verify migrations run cleanly.
- Add Rust models / DB row mappings.

### Done when
- database schema exists
- migrations run successfully
- backend can connect to database

---

## Epic 4: Workspace Management

### Goal
Allow the user to manage workspaces.

### Tasks
- Implement backend endpoint: create workspace.
- Implement backend endpoint: list workspaces.
- Implement backend endpoint: get workspace.
- Implement backend endpoint: rename/update workspace.
- Implement backend endpoint: delete workspace.
- Build Workspace List Screen in frontend.
- Render list of workspaces.
- Add create workspace action.
- Add open workspace action.
- Add rename workspace action.
- Add delete workspace action.
- Add empty state for no workspaces.

### Done when
- a user can create, list, open, rename, and delete workspaces from the UI

---

## Epic 5: Canvas Rendering

### Goal
Render the workspace as a visual drawing bench.

### Tasks
- Integrate React Flow.
- Create Workspace Canvas Screen.
- Add top bar.
- Add add-controls / node palette.
- Add canvas area.
- Add detail panel shell.
- Load workspace data into canvas.
- Render nodes by type.
- Render edges.
- Add zoom and pan support.
- Add selection state for nodes and edges.

### Done when
- a saved workspace can be opened
- nodes and edges render correctly
- the canvas is navigable

---

## Epic 6: Node Creation and Editing

### Goal
Support creation, display, movement, and editing of nodes.

### Tasks
- Implement backend endpoint: create node.
- Implement backend endpoint: update node.
- Implement backend endpoint: delete node.
- Implement backend endpoint: list nodes by workspace.
- Implement backend endpoint: create/update/delete node property.
- Build add-node actions for:
  - Agent
  - Data Source
  - Tool
  - Rule
- Create custom node renderers for each node type.
- Support default labels on creation.
- Support node selection.
- Open detail panel on node selection.
- Support editing node label.
- Support editing node properties.
- Support dragging nodes.
- Persist node position changes.
- Support node deletion.

### Done when
- the user can create all four node types
- node shapes render distinctly
- node details can be edited
- node positions persist after reload

---

## Epic 7: Edge Creation and Editing

### Goal
Support creation, display, selection, and deletion of edges.

### Tasks
- Implement backend endpoint: create edge.
- Implement backend endpoint: update edge if needed.
- Implement backend endpoint: delete edge.
- Implement backend endpoint: list edges by workspace.
- Support connect interaction on canvas.
- Persist new edges.
- Render directed arrows.
- Support edge selection.
- Show basic edge details in detail panel.
- Support edge deletion.

### Done when
- the user can connect nodes with arrows
- edges persist after reload
- edges can be selected and deleted

---

## Epic 8: Persistence Integration

### Goal
Make the whole canvas behave like durable storage, not temporary UI state.

### Tasks
- Implement workspace load endpoint that returns:
  - workspace metadata
  - nodes
  - node properties
  - edges
- Wire frontend load flow for opening a workspace.
- Ensure node creation persists correctly.
- Ensure node edits persist correctly.
- Ensure node movement persists correctly.
- Ensure edge creation persists correctly.
- Ensure deletion flows persist correctly.
- Add basic save state feedback or auto-save behavior.

### Done when
- the user can close and reopen a workspace and see the same modeled system again

---

## Epic 9: Validation and Error Handling

### Goal
Prevent bad states and make failures understandable.

### Tasks
- Reject invalid node types in backend.
- Reject invalid edge types in backend.
- Reject edges that reference missing nodes.
- Reject cross-workspace invalid edges.
- Reject duplicate property keys per node.
- Add frontend error feedback for failed save/load actions.
- Add clear failure behavior for workspace load errors.
- Add clear failure behavior for invalid edge creation.

### Done when
- invalid persistence states are blocked
- users see understandable feedback instead of silent failures

---

## Epic 10: MVP Cleanup and Hardening

### Goal
Make the MVP stable, consistent, and ready for first real use.

### Tasks
- Clean up naming consistency across frontend and backend.
- Review UI against `UI_SCREENS.md`.
- Review canvas behavior against `CANVAS_BEHAVIOR.md`.
- Review DB alignment against `DATABASE_SCHEMA.md`.
- Review domain alignment against `DOMAIN_MODEL.md`.
- Fix obvious UX friction.
- Fix obvious persistence bugs.
- Improve empty states where needed.
- Add basic save-state feedback if still missing.
- Ensure deletion behavior is predictable.

### Done when
- the product behaves consistently with the written MVP docs
- the main happy path works smoothly

---

## Priority order

The priority order should be:

### P0 — must happen first
1. Project Foundation
2. Backend Foundation
3. Database and Persistence
4. Workspace Management

### P1 — makes the product real
5. Canvas Rendering
6. Node Creation and Editing
7. Edge Creation and Editing

### P2 — makes it durable and reliable
8. Persistence Integration
9. Validation and Error Handling

### P3 — final pass
10. MVP Cleanup and Hardening

---

## Suggested implementation sequence

A practical implementation order for agents is:

1. Create repo structure.
2. Stand up frontend shell.
3. Stand up Rust backend shell.
4. Stand up PostgreSQL + SQLx.
5. Implement workspace CRUD end to end.
6. Build Workspace List Screen.
7. Build empty Workspace Canvas Screen.
8. Render loaded nodes.
9. Add node creation.
10. Add node editing.
11. Add node dragging + persistence.
12. Add edge creation.
13. Add edge deletion.
14. Add validation and error handling.
15. Do MVP cleanup pass.

This order keeps the product moving in visible slices.

---

## Smallest meaningful milestone

The first milestone that proves the product is real is:

### Milestone A
- user creates a workspace
- opens the canvas
- adds one Agent node
- edits its label
- refreshes the page
- sees the node again

If this works, the product has crossed from concept into reality.

---

## Second meaningful milestone

### Milestone B
- user creates a workspace
- adds Agent, Tool, Data Source, and Rule nodes
- drags them into place
- connects them with arrows
- reloads the workspace
- sees the same architecture again

If this works, the MVP core exists.

---

## Explicit anti-backlog

Do **not** pull these into active work before the MVP is complete:
- LangChain integration
- prompt execution
- runtime engine
- observability dashboards
- trace view
- benchmark runner
- permissions system
- multi-user collaboration
- versioning system
- import/export framework
- advanced edge semantics
- auto-layout systems

These are future work.
Not backlog priorities for now.

---

## Agent execution guidance

Coding agents working from this backlog should follow these rules:

1. Finish vertical slices, not isolated abstractions.
2. Do not invent extra product scope.
3. Keep persistence relational and explicit.
4. Keep the canvas simple.
5. Prefer working functionality over elegant overengineering.
6. Keep the product aligned with `MVP.md`, `ARCHITECTURE.md`, `DOMAIN_MODEL.md`, `DATABASE_SCHEMA.md`, `UI_SCREENS.md`, and `CANVAS_BEHAVIOR.md`.

---

## Final summary

The backlog for bench0r MVP is simple on purpose.

Build order is:
- foundation
- persistence
- workspaces
- canvas
- nodes
- edges
- reliability
- cleanup

That is enough to get to a real first product.