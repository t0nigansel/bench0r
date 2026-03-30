

# UI_SCREENS

## Purpose

This document defines the UI screens and panels required for the **bench0r MVP**.

The MVP is a **web-based visual drawing bench** for agent-system architectures.
The UI must stay simple and focused.
It should help the user model a system visually, not overwhelm them with product complexity.

This document defines:
- which screens exist
- what each screen is for
- what each screen must contain
- what interactions belong on each screen

---

## UI design principles

1. **Canvas first**
   The canvas is the main product surface.

2. **Few screens, clear roles**
   The MVP should use as few screens as possible.

3. **Directness over ceremony**
   The user should get to modeling quickly.

4. **Editing should feel local**
   Most editing should happen close to the canvas through a side panel.

5. **Workspace before runtime**
   The UI must reinforce that bench0r is modeling architecture, not executing it.

---

## MVP screen overview

The bench0r MVP should contain these main screens:

1. **Workspace List Screen**
2. **Workspace Canvas Screen**

The second screen contains important sub-areas:
- top bar
- node palette / add controls
- main canvas
- detail panel

That is enough for the MVP.

---

## 1. Workspace List Screen

### Purpose
This is the entry screen for the product.
It lets the user manage saved workspaces.

### User questions this screen answers
- What workspaces already exist?
- How do I create a new workspace?
- Which workspace do I want to open?

### Must contain
- page title or product header
- list of saved workspaces
- create workspace action
- open workspace action
- rename workspace action
- delete workspace action

### Recommended layout
A simple layout is enough:
- top header
- main list area
- primary button for “New Workspace”

### Workspace list item content
Each workspace item should show at least:
- workspace name
- optional description or short metadata
- updated timestamp or created timestamp
- open action
- rename action
- delete action

### Required interactions
The user must be able to:
- create a workspace
- open a workspace
- rename a workspace
- delete a workspace

### Empty state
If no workspaces exist:
- show a simple empty state
- include a clear call to action such as:
  - `Create your first workspace`

Do not overdesign this.

---

## 2. Workspace Canvas Screen

### Purpose
This is the main screen of bench0r.
It is where the user models an architecture visually.

### User questions this screen answers
- What does my architecture look like?
- Which nodes exist?
- How are they connected?
- How do I add new elements?
- How do I edit a selected element?

### Main regions of this screen
The screen should be divided into these main UI regions:

1. **Top bar**
2. **Node palette or add controls**
3. **Canvas area**
4. **Detail panel**

---

## 2.1 Top bar

### Purpose
The top bar provides context and basic workspace-level actions.

### Must contain
- product name or logo
- current workspace name
- navigation back to workspace list
- save state indicator or equivalent persistence feedback

### May contain
- rename workspace action
- delete workspace action
- fit-to-view action

### Interaction goals
The user should always know:
- where they are
- which workspace they are editing
- whether changes are being persisted

---

## 2.2 Node palette / add controls

### Purpose
This area lets the user add new modeling elements.

### Must contain
Create actions for these node types:
- Agent
- Data Source
- Tool
- Rule / Compliance Constraint

### Presentation options
For the MVP, any of these are acceptable:
- a vertical sidebar palette
- a compact top toolbar section
- a floating add menu

### Recommendation
Use a **simple left sidebar palette** or **compact top add bar**.
That is easiest to understand.

### Required interactions
When the user chooses one of these actions:
- a node is created
- it appears in a sensible default position on the canvas
- it becomes selected
- the detail panel opens

### Important UX rule
The creation affordance must be obvious.
The user should not have to guess how new elements appear.

---

## 2.3 Canvas area

### Purpose
The canvas is the central modeling surface.

### Must contain
- all nodes of the current workspace
- all edges of the current workspace
- visible node shapes by type
- visible arrows between connected nodes
- selection feedback
- zoom/pan support

### Required node shapes
- Agent -> rectangle
- Data Source -> cylinder
- Tool -> distinct abstract tool shape
- Rule -> distinct abstract policy shape

### Required edge style
- directed arrow

### Required interactions
The user must be able to:
- click nodes
- drag nodes
- connect nodes with arrows
- click edges
- delete selected nodes
- delete selected edges
- pan the canvas
- zoom the canvas

### Empty canvas state
If the workspace has no elements:
- show a clean empty canvas
- include a simple hint

Example:
- `Add your first Agent, Data Source, Tool, or Rule.`

### Important design rule
The canvas should communicate **architecture**, not **runtime sequence**.

That means:
- no execution arrows
- no step numbers
- no play-state visuals
- no runtime badges

---

## 2.4 Detail panel

### Purpose
The detail panel is the main editing surface for selected items.

### Behavior
The panel should react to selection.
It should show different content depending on whether the user selected:
- a node
- an edge
- nothing

---

### 2.4.1 Node detail panel

#### Must contain
- node type
- editable label field
- editable descriptive properties
- optional notes / metadata
- delete action

#### Example per node type

##### Agent
Possible visible fields:
- label
- role
- goal
- model
- notes

##### Data Source
Possible visible fields:
- label
- source kind
- location
- sensitivity
- notes

##### Tool
Possible visible fields:
- label
- tool kind
- description
- notes

##### Rule
Possible visible fields:
- label
- rule kind
- severity
- scope
- notes

#### Required behavior
When a node is selected:
- the panel opens or becomes active
- fields reflect the selected node
- edits can be saved reliably

---

### 2.4.2 Edge detail panel

#### Must contain
- source node reference
- target node reference
- optional edge label if supported
- delete action

#### Notes
The MVP does not need advanced edge semantics yet.
Edge editing can stay minimal.

---

### 2.4.3 Empty detail state

When nothing is selected:
- the panel may be empty
- or show a neutral message such as:
  - `Select an element to edit its details.`

This state should feel calm, not noisy.

---

## Navigation model

The MVP navigation model should stay very small.

### Required navigation
- from Workspace List Screen -> open Workspace Canvas Screen
- from Workspace Canvas Screen -> back to Workspace List Screen

That is enough.

### Explicitly not needed yet
- deep nested navigation
- multiple canvas tabs
- modal-heavy navigation
- multi-page editors for node types

---

## Minimal responsive behavior

The MVP is a web app, so the layout should degrade sensibly.

### Preferred target
The main target is desktop / laptop browser usage.

### Minimum responsive expectation
On smaller screens:
- the app should remain usable
- the detail panel may collapse or become overlay-style
- the canvas must still be reachable

### Not required for MVP
- polished mobile-first UX
- tablet-optimized interaction model

Desktop-first is acceptable.

---

## Screen-level acceptance criteria

### Workspace List Screen is complete when:
- the user can see saved workspaces
- the user can create a new workspace
- the user can open a workspace
- the user can rename a workspace
- the user can delete a workspace

### Workspace Canvas Screen is complete when:
- the current workspace is clearly visible in context
- the user can add nodes of all four types
- the canvas shows nodes and edges correctly
- the user can select nodes and edges
- the detail panel updates with current selection
- the user can edit node details
- the user can delete nodes and edges
- the UI makes save/load feel reliable

---

## Recommended MVP layout summary

A strong MVP layout would be:

### Workspace List Screen
- simple header
- list of workspaces
- new workspace button

### Workspace Canvas Screen
- top bar
- left add palette
- center canvas
- right detail panel

This is probably the clearest first product shape.

---

## Explicitly not needed as separate screens

Do **not** create separate full screens yet for:
- node editing
- edge editing
- runtime inspection
- trace view
- settings
- compliance dashboards
- user/profile pages
- analytics pages

These would add noise and dilute the MVP.

---

## Final summary

The bench0r MVP needs only a very small UI structure:

1. a screen to manage workspaces
2. a screen to model an architecture on a canvas

Inside the canvas screen, the core product surfaces are:
- top bar
- add controls
- canvas
- detail panel

That is enough to make the product real.