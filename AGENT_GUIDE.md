

# AGENT_GUIDE

## Purpose

This document tells coding agents how to work inside the **bench0r** repository.

It exists to reduce drift.
bench0r has a clear MVP shape.
Agents should help build that shape, not reinterpret it.

This guide defines:
- how agents should read the project
- what they should prioritize
- what they should avoid
- how they should break work down
- how they should decide when something is finished

---

## First rule

**bench0r is a visual modeling tool first. It is not an execution engine in the MVP.**

If a coding agent forgets this, the project will drift.

Everything in the MVP should support this core product:
- a web UI
- a drawing bench
- nodes on a canvas
- arrows between nodes
- editable properties
- Rust backend
- PostgreSQL persistence

Not more.

---

## Source-of-truth documents

Before making changes, coding agents must align with these files:

1. `MANIFEST.md`
2. `ARCHITECTURE.md`
3. `DOMAIN_MODEL.md`
4. `DATABASE_SCHEMA.md`
5. `MVP.md`
6. `CANVAS_BEHAVIOR.md`
7. `UI_SCREENS.md`
8. `BACKLOG.md`
9. `TASKS.md`

### Rule
If code and docs conflict, agents should prefer the documented MVP intent unless the docs are clearly outdated.

If a document seems outdated, update the docs deliberately rather than silently drifting in code.

---

## What the MVP is

The MVP is a **web-based drawing bench for agent-system architectures**.

A user must be able to:
- create a workspace
- open a workspace
- place nodes on a canvas
- create these node types:
  - Agent
  - Data Source
  - Tool
  - Rule / Compliance Constraint
- connect nodes with arrows
- edit node details
- persist the architecture in PostgreSQL
- reload it later

That is the MVP.

---

## What the MVP is not

Coding agents must not pull these concepts into active implementation unless explicitly instructed:

- LangChain integration
- runtime execution
- agent orchestration
- prompt execution
- trace view
- benchmark execution
- observability dashboards
- auth system
- collaboration features
- advanced permissions model
- complex edge semantics
- versioning system
- import/export framework
- analytics pages

These are future concerns.
They are not part of the first product.

---

## Required implementation mindset

### 1. Prefer thin vertical slices
A feature is more valuable when it works end to end than when a deep abstraction exists in isolation.

Good:
- create workspace from UI and persist it fully

Less useful early:
- elaborate generic abstraction layers with no visible product value

### 2. Keep the canvas simple
The canvas is not a runtime editor.
It is a visual modeling surface.

Edges mean:
- relationship

Edges do not yet mean:
- execution order
- scheduling
- runtime control flow

### 3. Keep persistence relational
The source of truth is PostgreSQL.
Do not replace it with JSON files.
Do not build around local file persistence first.

### 4. Favor clarity over cleverness
bench0r is a product where mental clarity matters.
Keep code readable and explicit.

### 5. Build what is needed now
Do not overbuild for imagined future complexity.
Future runtime support should remain possible, but it must not distort the MVP.

---

## Repo expectations

Coding agents should preserve a clean separation between:
- frontend web UI
- backend API
- database access
- domain model
- canvas rendering logic

### Frontend expectations
The frontend should remain focused on:
- workspace list screen
- workspace canvas screen
- node palette
- detail panel
- canvas interactions

### Backend expectations
The backend should remain focused on:
- workspace CRUD
- node CRUD
- node property CRUD
- edge CRUD
- validation
- persistence

### Database expectations
The database should remain focused on:
- workspaces
- nodes
- node_properties
- edges

---

## How coding agents should start work

Before implementing a task, an agent should do this:

1. Identify the relevant task in `TASKS.md`.
2. Read the related sections in the relevant docs.
3. Confirm the change supports the MVP directly.
4. Implement the smallest complete version of the feature.
5. Avoid introducing unrelated abstractions.

### Example
If the task is about node creation:
- read `MVP.md`
- read `DOMAIN_MODEL.md`
- read `CANVAS_BEHAVIOR.md`
- read `UI_SCREENS.md`
- then implement only what is needed for node creation and display

---

## How coding agents should break work down

Agents should prefer tasks that are:
- visible
- testable
- bounded
- reversible if necessary

### Good task shape
- add create workspace endpoint
- build workspace list screen
- add create Agent button
- render Tool node shape
- persist node position changes

### Bad task shape
- build generalized architecture platform for future agent ecosystems
- implement comprehensive orchestration-ready domain engine

That kind of wording creates drift.

---

## Change-size guidance

Agents should prefer **small to medium changes**.

### Good
- one API endpoint set
- one screen
- one detail panel section
- one node renderer
- one persistence flow

### Risky
- redesigning frontend and backend architecture at once
- mixing persistence refactors with UI redesign in one step
- introducing multiple speculative future systems together

If the change is large, split it.

---

## Frontend guidance

### Screen model
The MVP frontend should revolve around exactly two major screens:
1. Workspace List Screen
2. Workspace Canvas Screen

Avoid creating extra screens unless clearly necessary.

### Canvas guidance
The canvas must support:
- node creation
- node rendering
- node dragging
- node selection
- node editing
- edge creation
- edge selection
- deletion
- zoom/pan

Nothing about the canvas should imply a running workflow engine.

### Detail panel guidance
The detail panel is the local editor for the selected node or edge.
Keep editing there.
Do not scatter editing across many screens.

---

## Backend guidance

### API style
The backend should expose a simple REST API.
Keep route naming and payloads straightforward.

### Validation
Validate at the API boundary.
Reject invalid states clearly.

At minimum, protect against:
- invalid node types
- invalid edge types
- edges referencing missing nodes
- cross-workspace invalid edges
- duplicate property keys per node

### Error handling
Return structured and understandable errors.
Avoid silent failures.

### Business logic
Keep business logic explicit.
Do not hide simple CRUD behind unnecessary complexity.

---

## Database guidance

### Persistence model
The DB schema should stay aligned with `DATABASE_SCHEMA.md`.

Core tables are:
- `workspaces`
- `nodes`
- `node_properties`
- `edges`

### Important rule
Do not introduce JSON blob persistence as the primary storage model.
Small metadata fields are fine when needed, but the architecture itself should remain relational and queryable.

---

## Rust guidance

### Backend philosophy
Use Rust for clarity, safety, and explicitness.
Do not write Rust in an overabstracted style just because it can be abstracted.

### Desired qualities
- small handlers
- clear types
- explicit validation
- explicit DB queries
- understandable error mapping

### Avoid
- speculative trait hierarchies
- framework-like internal overengineering
- runtime-system abstractions that the MVP does not yet need

---

## Definition of done for coding agents

A task is done when:

1. it works in the product, not just in theory
2. it aligns with the MVP docs
3. it does not introduce unrelated scope
4. it does not break persistence or core flows
5. it is understandable by the next agent or developer

If a feature exists but does not work end to end, it is not done.

---

## Testing mindset

Coding agents should test the thing they just built in the most direct way possible.

### Examples
- if adding workspace creation, verify it can be created from the UI
- if adding node persistence, verify the node survives reload
- if adding edge creation, verify the edge renders and reloads

The core question is always:

> Does this improve the actual product flow?

---

## Red flags

If an agent starts doing one of these, it is probably drifting:

- adding LangChain now
- inventing execution semantics for edges
- adding prompt runners
- introducing complex user/account systems
- adding import/export before persistence is solid
- building benchmark engines before the drawing bench works
- creating many screens beyond the two MVP screens
- replacing relational structure with loose JSON blobs

When in doubt, return to `MVP.md`.

---

## Preferred order of work

Agents should generally follow this order:

1. foundation
2. DB setup
3. workspace CRUD
4. workspace list UI
5. canvas shell
6. node loading
7. node creation
8. node editing
9. node dragging persistence
10. edge creation
11. validation
12. cleanup

That order keeps visible progress high.

---

## Communication style for coding agents

When summarizing changes, agents should be concrete.

Good:
- added workspace create/list/delete endpoints
- added Agent node renderer
- persisted node drag position changes

Less useful:
- improved architectural robustness
- enhanced system flexibility
- laid groundwork for future orchestration

bench0r benefits from plain speech.

---

## Final instruction

If there is a choice between:
- a smaller implementation that clearly supports the MVP
- a larger implementation that anticipates the future

choose the smaller implementation.

The first victory is not elegance.
The first victory is a working drawing bench.

---

## Final summary

Coding agents working on bench0r should act like disciplined product builders.

Their mission is simple:
- build the web UI
- build the drawing bench
- build the Rust API
- persist the model in PostgreSQL
- stop before runtime complexity begins

That discipline is what will make the MVP real.