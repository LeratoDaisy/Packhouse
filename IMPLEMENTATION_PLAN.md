# Packhouse Implementation Plan

## Objective

Build a focused MVP that demonstrates the core Packhouse fulfilment workflow from order intake to dispatch and returns.

## Phase 1 — Foundation

- Set up the frontend application structure.
- Establish reusable layout and UI components.
- Create representative fulfilment data.
- Implement navigation between operational views.

## Phase 2 — Core fulfilment workflow

### F1 Orders
- Order list
- Order detail
- Fulfilment status

### F2 Inventory
- Stock overview
- Available vs allocated quantity
- Low-stock state

### F3 Pick & Pack
- Order packing checklist
- Progress state
- Ready-to-dispatch state

### F4 Dispatch
- Dispatch record
- Carrier/reference field
- Delivery status

### F5 Returns
- Return record
- Reason
- Condition
- Return status

## Phase 3 — Quality

- Responsive mobile layout
- Empty/error states
- Accessible controls
- Consistent status labels
- Basic form validation

## Technical approach

The MVP prioritises a working frontend with realistic data and clear domain states. External integrations are intentionally deferred until the fulfilment workflow is proven.

## Delivery evidence

Work is organised around PRD features and GitHub issues/PRs so each major feature can be traced from requirement to implementation.
