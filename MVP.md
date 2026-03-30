# MVP

## Purpose

This document defines the exact scope of the **bench0r MVP**.

The MVP is the **first usable version** of bench0r.
Its job is not to execute agent systems.
Its job is to let a user **model** an agent-system architecture visually in a web UI and persist that model in a database.

This document answers four questions:
- what the MVP must do
- what the MVP must not do
- what the user experience should look like
- what counts as done

---

## MVP statement

The bench0r MVP is a **web-based drawing bench for agent systems**.

A user can:
- create a workspace
- place architecture elements on a canvas
- edit their properties
- connect them with arrows
- save the result in a database
- load the saved workspace later

The MVP is about **visual architecture modeling**, not runtime execution.

---

## Core user value

The MVP should give the user one clear value:

> “I can turn my mental model of an agent system into a visible architecture on a canvas.”

That is the whole point of the first version.

---

## Primary user story

> As a user, I want to open a web UI, create a workspace, place agents, data sources, tools, and rules on a canvas, connect them with arrows, edit their properties, and save the modeled architecture so I can return to it later.

---

## In scope

The MVP must include the following capabilities.

### 1. Web UI shell
The app must provide a usable web interface with:
- a main canvas area
- a simple palette or add-controls for new elements
- a detail panel or inspector for the selected item
- basic workspace actions

### 2. Workspace management
The user must be able to:
- create a workspace
- open an existing workspace
- rename a workspace
- delete a workspace
- see at least a simple list of saved workspaces

### 3. Node creation
The user must be able to create these node types:
- Agent
- Data Source
- Tool
- Rule / Compliance Constraint

### 4. Visual representation
The canvas must display these elements in distinct simple shapes:
- Agent -> rectangle
- Data Source -> cylinder
- Tool -> distinct abstract tool shape
- Rule -> distinct abstract rule/policy shape
- Edge -> directed arrow

### 5. Canvas interaction
The user must be able to:
- place nodes on the canvas
- move nodes
- select nodes
- select edges
- connect nodes with arrows
- delete nodes
- delete edges
- zoom and pan the canvas

### 6. Detail editing
The user must be able to edit core node fields such as:
- label
- type-specific descriptive properties
- optional notes or metadata

The user must also be able to inspect edge information.

### 7. Persistence
The app must:
- store workspaces in PostgreSQL
- store nodes in PostgreSQL
- store node properties in PostgreSQL
- store edges in PostgreSQL
- persist node positions
- load a workspace back into the canvas correctly

### 8. Thin backend API
The app must provide a backend API that supports:
- workspace CRUD
- node CRUD
- node property CRUD
- edge CRUD
- workspace load for canvas reconstruction

### 9. Validation and integrity
The MVP must prevent obviously invalid states such as:
- edge references to missing nodes
- nodes without a workspace
- invalid node type values
- invalid edge type values
- duplicate property keys on a single node

---

## Explicitly out of scope

The following things are **not** part of the MVP.

### Runtime / orchestration
- LangChain integration
- workflow execution
- agent execution
- prompt execution
- tool execution
- multi-agent orchestration
- background jobs

### Advanced product features
- live collaboration
- auth and user accounts
- permissions model
- version history
- undo/redo history beyond simple browser/session behavior
- comments
- notifications
- templates
- marketplace

### Advanced graph features
- automatic graph layout
- swimlanes
- containers / groups
- semantic edge validation rules
- graph analytics
- minimap complexity beyond what a library provides by default

### Evaluation / QA features
- trace view
- run view
- benchmarks
- evaluation scenarios
- scoring
- security checks
- compliance checks as executable logic

### Persistence extras
- JSON files as primary storage
- import/export as a required MVP feature

---

## MVP user flow

The expected happy path is:

1. User opens bench0r in the browser.
2. User creates a new workspace.
3. User enters the canvas.
4. User adds an Agent node.
5. User adds one or more Data Source, Tool, or Rule nodes.
6. User moves the nodes into a meaningful layout.
7. User connects them with arrows.
8. User selects nodes and edits their properties in the detail panel.
9. User saves or the system auto-persists changes.
10. User reloads the workspace later and sees the same architecture again.

If the app supports this well, the MVP works.

---

## Minimal UX expectations

The MVP does not need polished enterprise UX.
But it does need a clear and usable interaction model.

### Required UX qualities
- the canvas should feel responsive
- node creation should be obvious
- selected items should be visually clear
- editing should be straightforward
- save/load behavior should feel reliable
- shape differences should be easy to understand

### Not required yet
- perfect design system
- advanced onboarding
- animation-heavy UX
- highly polished empty states

---

## Technical MVP boundaries

### Frontend
Must include:
- React
- TypeScript
- canvas graph library integration
- side panel or detail editor

### Backend
Must include:
- Rust
- Axum
- REST API
- validation
- PostgreSQL access

### Database
Must include:
- workspaces
- nodes
- node_properties
- edges

---

## Suggested MVP data contract

At a minimum, the backend must be able to return a workspace with:
- workspace metadata
- all nodes
- all node properties
- all edges

This is enough for the frontend to reconstruct the drawing bench state.

---

## MVP acceptance criteria

The MVP is done when all of the following are true.

### Workspace criteria
- a user can create a workspace
- a user can list saved workspaces
- a user can open a workspace
- a user can rename a workspace
- a user can delete a workspace

### Canvas criteria
- a user can add Agent, Data Source, Tool, and Rule nodes
- each node type renders with its intended distinct shape
- a user can drag nodes to new positions
- node positions remain correct after reload
- a user can connect two nodes with a directed arrow
- a user can remove a node
- a user can remove an edge

### Editing criteria
- a user can select a node
- a detail view opens for the selected node
- a user can edit label and descriptive properties
- changes are persisted and visible after reload

### Persistence criteria
- all modeled elements are stored in PostgreSQL
- a saved workspace reloads without losing nodes, edges, properties, or positions
- deleting a workspace removes its dependent data cleanly

### Backend integrity criteria
- invalid node types are rejected
- invalid edge types are rejected
- edges cannot reference missing nodes
- duplicate property keys on one node are rejected
- cross-workspace invalid edges are rejected by backend validation

---

## Nice-to-have but not required

These are allowed only if they do not slow down the MVP too much:
- auto-save instead of explicit save
- simple search/filter for workspaces
- better node labels
- color hints by node type
- basic empty-state guidance
- basic keyboard delete support

If these features create drag, skip them.

---

## Risks that would endanger the MVP

The biggest risks are:

1. **Adding runtime logic too early**
   If the team starts building LangChain integration now, the MVP will drift.

2. **Overdesigning the data model**
   The first version needs a clean model, not a perfect future-proof ontology.

3. **Overcomplicating the canvas**
   The drawing bench should stay simple.

4. **Trying to solve permissions/auth now**
   That is not needed for the first proof of value.

5. **Building too many edge semantics too early**
   One generic relationship type is enough for the start.

---

## What success looks like

A successful MVP is one where a user can model something like this in a few minutes:

- one Agent node
- two Tool nodes
- one Data Source node
- one Rule node
- arrows between them
- edited labels and properties
- saved and reloaded successfully

If that works reliably in the browser, the MVP is real.

---

## One-line definition of done

**The MVP is done when bench0r lets a user model and persist an agent-system architecture visually in a web UI without any execution layer.**

---

## Final summary

The bench0r MVP is deliberately narrow.

It is:
- a web UI
- a drawing bench
- a canvas with simple node types and arrows
- a detail editor
- a Rust backend API
- a PostgreSQL-backed persistence layer

It is not yet:
- an agent runtime
- a workflow engine
- a LangChain system
- an observability platform

That focus is the strength of the MVP.
