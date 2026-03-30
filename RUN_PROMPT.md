

# RUN_PROMPT

You are a coding agent working inside the **bench0r** repository.

Your task is to build the **bench0r MVP**.

Before you change any code, read these files carefully and treat them as the source of truth:

1. `MANIFEST.md`
2. `ARCHITECTURE.md`
3. `DOMAIN_MODEL.md`
4. `DATABASE_SCHEMA.md`
5. `MVP.md`
6. `CANVAS_BEHAVIOR.md`
7. `UI_SCREENS.md`
8. `BACKLOG.md`
9. `TASKS.md`
10. `AGENT_GUIDE.md`

## Product definition

bench0r is a **web-based visual drawing bench for agent-system architectures**.

The MVP is **not**:
- a LangChain app
- an agent runtime
- a workflow execution engine
- an observability platform
- a benchmark runner

The MVP **is**:
- a web UI
- a canvas
- four node types
- arrows between nodes
- a detail editor
- a Rust backend API
- PostgreSQL persistence

## Core user flow

Build a product where a user can:
- create a workspace
- open a workspace
- add these node types to a canvas:
  - Agent
  - Data Source
  - Tool
  - Rule / Compliance Constraint
- move nodes
- connect nodes with arrows
- edit node labels and descriptive properties
- persist the modeled architecture in PostgreSQL
- reload the workspace and see the same structure again

## Critical constraints

You must follow these rules:

1. **Do not add LangChain integration.**
2. **Do not add execution logic.**
3. **Do not add auth, collaboration, or versioning.**
4. **Do not use JSON files as the primary persistence model.**
5. **Do not reinterpret edges as runtime flow.** Edges mean relationship only.
6. **Keep the product limited to the MVP described in the docs.**
7. **Prefer small working vertical slices over big abstractions.**
8. **Use a Rust backend stack.**
9. **Use PostgreSQL for persistence.**
10. **Keep the canvas simple.**

## Required architecture direction

Follow this technical direction unless the repo already contains a clearly better implementation that still matches the docs:

### Frontend
- React
- TypeScript
- Vite
- React Flow
- Tailwind CSS or similarly lightweight styling

### Backend
- Rust
- Axum
- Tokio
- Serde
- SQLx

### Database
- PostgreSQL

## Core domain model

The MVP domain model is centered on:
- `Workspace`
- `Node`
- `NodeProperty`
- `Edge`

Node types:
- `AGENT`
- `DATASOURCE`
- `TOOL`
- `RULE`

Edge type for MVP:
- `RELATES_TO`

## Visual model

The canvas must show:
- Agent -> rectangle
- Data Source -> cylinder
- Tool -> distinct abstract tool shape
- Rule -> distinct abstract policy shape
- Edge -> directed arrow

## How to work

You must work in **phases**.

### Phase 1 — Read and align
- read all source-of-truth docs
- inspect the repo structure
- inspect existing code
- identify what already exists
- identify what is missing relative to the MVP docs

### Phase 2 — Plan against `TASKS.md`
- map the current repo state to the tasks in `TASKS.md`
- choose the next smallest meaningful unfinished vertical slice
- do not try to build everything at once

### Phase 3 — Implement
- implement the selected slice end to end
- keep code readable and explicit
- keep changes bounded
- avoid speculative abstractions

### Phase 4 — Verify
- verify the feature works in practice
- verify alignment with the docs
- verify no scope drift happened

### Phase 5 — Report
When you finish a slice, report:
- what you changed
- which task IDs were completed or advanced
- any deviations from the docs
- the next recommended slice

## Required execution order

Prefer this order unless the repo state strongly requires a slight variation:

1. foundation
2. DB setup
3. workspace CRUD
4. workspace list UI
5. canvas shell
6. workspace load into canvas
7. node creation
8. node editing
9. node dragging persistence
10. edge creation
11. validation and error handling
12. MVP cleanup

## Definition of success

The MVP is successful when this happy path works:

1. User creates a workspace.
2. User opens the workspace.
3. User adds an Agent node.
4. User adds a Tool node.
5. User adds a Data Source node.
6. User adds a Rule node.
7. User drags the nodes into place.
8. User connects them with arrows.
9. User edits labels and descriptive properties.
10. User reloads the workspace.
11. The same structure is still there.

## Anti-drift reminder

If you are unsure whether something belongs in the MVP, ask this question:

> Does this directly help the user model and persist an architecture on the canvas right now?

If the answer is no, it probably does not belong in the current implementation.

## Final instruction

Start by:
1. reading the source-of-truth docs
2. inspecting the current repository state
3. comparing the current state to `TASKS.md`
4. implementing the next smallest meaningful slice

Do not stop at theory.
Build the product step by step.