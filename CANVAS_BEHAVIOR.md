# CANVAS_BEHAVIOR

## Purpose

This document defines how the **bench0r MVP canvas** should behave.

The canvas is the heart of the product.
It is the main place where the user turns an abstract understanding of an agent system into a visible structure.

The MVP canvas is a **drawing bench**, not a workflow runtime editor.
That distinction matters.

Nodes and arrows represent **relationships and architecture**, not executable process logic.

---

## Canvas principles

1. **Direct manipulation first**
   The canvas should feel like a place where objects are placed and connected directly.

2. **Simple mental model**
   The first version should be easy to understand after a few seconds.

3. **Visible structure over hidden logic**
   The user should understand the architecture by looking at the canvas.

4. **Low-friction editing**
   Adding, moving, selecting, connecting, and editing should be obvious.

5. **Modeling, not orchestration**
   The canvas must not imply execution semantics too early.

---

## Core canvas objects

The canvas must support these visible object types:

### 1. Agent node
- visual shape: rectangle
- meaning: an agent / actor in the system

### 2. Data Source node
- visual shape: cylinder
- meaning: a source of knowledge or operational data

### 3. Tool node
- visual shape: distinct simple abstract tool shape
- meaning: a callable capability or external mechanism

### 4. Rule / Compliance node
- visual shape: distinct simple abstract policy shape
- meaning: a policy, compliance rule, or architectural constraint

### 5. Edge
- visual shape: directed arrow
- meaning: a relationship between two nodes

---

## Default canvas layout behavior

### Initial canvas state
When a workspace opens:
- the canvas should load all saved nodes and edges
- the viewport should show the modeled graph in a usable way
- if the workspace is empty, the user should see a clean empty canvas ready for the first element

### Empty state
If no nodes exist:
- show a clean empty canvas
- show a simple hint such as:
  - “Add your first Agent, Data Source, Tool, or Rule”

Do not overdesign the empty state.

---

## Node creation behavior

The user must be able to create nodes from a palette, toolbar, or clearly visible add control.

### Required behavior
When a user adds a node:
- the node is created immediately
- the node appears at a sensible default position
- the node gets a default label based on type, such as:
  - `New Agent`
  - `New Data Source`
  - `New Tool`
  - `New Rule`
- the node becomes selected
- the detail panel opens so the user can rename or edit it

### Initial placement rule
Use a predictable placement strategy.
For example:
- place the node near the center of the current viewport
- or offset from the last created node

The behavior should feel intentional, not random.

---

## Node selection behavior

### Single selection
When the user clicks a node:
- that node becomes selected
- any previously selected edge becomes deselected
- the selected node is visually highlighted
- the detail panel opens for that node

### Reselect behavior
If the user clicks the already selected node again:
- keep it selected
- do not toggle selection off automatically unless there is a strong reason

### Deselect behavior
When the user clicks on empty canvas space:
- clear node and edge selection
- close the detail panel or reset it to an empty state

---

## Edge selection behavior

When the user clicks an edge:
- that edge becomes selected
- any selected node becomes deselected
- the edge is visually highlighted
- the detail panel opens with edge information

The MVP does not need complex edge editing.
But edge selection must be visible and understandable.

---

## Node movement behavior

The user must be able to drag nodes freely on the canvas.

### Drag behavior
When the user drags a node:
- the node follows pointer movement smoothly
- connected edges update visually during drag
- the new position is retained after drag ends

### Persistence behavior
After a node move:
- the new position should be persisted
- persistence can be immediate or short-delay auto-save
- reloading the workspace must restore the same position

### Constraint behavior
Do not introduce strict layout constraints in the MVP.
Free positioning is better for the first version.

---

## Node connection behavior

The user must be able to create directed edges between nodes.

### Required connection flow
A user should be able to:
- start a connection from one node
- drag to another node
- release to create a directed arrow

### Connection result
When a connection is created:
- the new edge appears immediately
- the edge is stored in the backend
- the edge direction is visible

### Validation
The MVP should keep connection validation light.
It should at least prevent:
- connections to missing nodes
- invalid persistence state
- self-loops if self-loops are disallowed by schema

### Semantic rule
In the MVP, edges mean:
- “is related to”

They do **not** yet mean:
- “runs before”
- “executes after”
- “calls automatically”

This distinction must stay clear in wording and UI.

---

## Node deletion behavior

The user must be able to delete a selected node.

### Required behavior
When a node is deleted:
- the node disappears from the canvas
- connected edges are removed as well
- the detail panel closes or resets
- the deletion is persisted to the backend

### Confirmation
For the MVP:
- a lightweight confirmation is optional
- if deletion is too easy to do accidentally, use a simple confirm step

Do not overcomplicate this.

---

## Edge deletion behavior

The user must be able to delete a selected edge.

### Required behavior
When an edge is deleted:
- the edge disappears from the canvas
- the deletion is persisted to the backend
- the selection is cleared or moved to a sensible fallback state

---

## Detail panel behavior

The detail panel is the main editing companion to the canvas.

### For node selection
When a node is selected, the panel should show:
- node type
- label
- editable properties
- optional notes/metadata
- delete action

### For edge selection
When an edge is selected, the panel should show:
- source node
- target node
- edge label if supported
- delete action

### For empty selection
When nothing is selected:
- the panel may be hidden
- or show a neutral empty state

### Editing behavior
When the user edits a field in the panel:
- the UI updates clearly
- the change is saved reliably
- the canvas reflects the updated label or metadata where relevant

---

## Zoom and pan behavior

The canvas must support basic spatial navigation.

### Pan
The user must be able to move around the canvas view.

### Zoom
The user must be able to zoom in and out.

### Minimum requirement
- navigation should feel smooth
- navigation should not interfere with basic editing

### Fit behavior
Optional but useful:
- support “fit view” to show all nodes in the workspace

This is a nice-to-have, but likely worth including if the graph library makes it easy.

---

## Label behavior

### Default labels
New nodes should receive a default label by type.

### Editing labels
The user must be able to rename nodes from the detail panel.

### Display
The label should be visible directly on the canvas node.

### Overflow rule
If labels are long:
- allow truncation or wrapping depending on the chosen visual style
- but keep it readable enough for the MVP

---

## Visual feedback behavior

The canvas must provide basic visual feedback.

### Selection feedback
- selected nodes should be visibly highlighted
- selected edges should be visibly highlighted

### Hover feedback
Hover feedback is optional for the MVP, but if implemented it should be subtle.

### Connection feedback
During edge creation:
- the temporary line should be visible
- the user should understand what is being connected

### Save feedback
The user should not be left wondering whether changes were stored.

Possible solutions:
- subtle saved indicator
- auto-save indicator
- last saved timestamp

Keep it simple.

---

## Persistence behavior

The canvas must behave as if it is backed by durable storage.

### Required persistence scope
Persist at least:
- node existence
- node type
- node label
- node position
- node properties
- edge existence
- edge source/target

### Reload expectation
After reload, the user should see the same modeled structure again.

That includes:
- the same nodes
- the same arrows
- the same positions
- the same editable metadata

---

## Error behavior

The canvas must fail in understandable ways.

### Load failure
If a workspace cannot be loaded:
- show a clear error state
- do not silently show an empty canvas as if nothing existed

### Save failure
If a change cannot be persisted:
- show a visible error or retry state
- do not pretend the change is safely stored when it is not

### Validation failure
If an invalid edge or invalid node update is attempted:
- show a clear message
- leave the user in a recoverable state

---

## Behavior that is intentionally excluded for the MVP

The canvas should **not** include these behaviors yet:
- execution flow animation
- runtime indicators
- token/cost displays
- collaboration cursors
- comments on nodes
- grouping containers
- semantic lane systems
- nested graphs
- automatic graph layout as a required feature
- complex multi-select editing
- copy/paste as a required feature
- undo/redo as a required feature

These can come later.

---

## Recommended interaction model summary

The MVP canvas interaction model should feel like this:

1. Add a node.
2. It appears in a sensible place.
3. Select it.
4. Rename it and edit properties.
5. Drag it where it belongs.
6. Connect it to another node with an arrow.
7. Repeat until the architecture feels right.
8. Reload later and find the same structure again.

If the product does that well, it succeeds.

---

## Acceptance criteria for canvas behavior

The canvas behavior is good enough for the MVP when:

- nodes can be added reliably
- nodes can be selected reliably
- edges can be created reliably
- labels can be edited reliably
- positions persist reliably
- deleting nodes and edges behaves predictably
- the detail panel always reflects the current selection
- zoom/pan feel usable
- the user understands that the canvas models structure, not execution

---

## Final summary

The bench0r MVP canvas should feel like a simple, dependable architectural drawing bench.

It should let the user:
- place core elements
- connect them
- edit them
- move them
- save them
- reload them

That is enough for the first version.
Anything beyond that should be treated with suspicion until the core modeling experience is solid.
