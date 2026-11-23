# Packhouse Product Requirements Document

## 1. Product

Packhouse is a fulfilment management platform for small online businesses.

## 2. Goal

Give a seller one place to see what needs to happen to each order from receipt through dispatch and returns.

## 3. MVP users

- Seller / business owner
- Fulfilment operator

## 4. MVP features

### F1 — Order queue
The user can view orders and their fulfilment status.

**Acceptance criteria**
- Orders have a clear status.
- Orders can be opened to see customer and item details.
- The queue distinguishes orders awaiting fulfilment from completed orders.

### F2 — Inventory
The user can view stock levels and allocation.

**Acceptance criteria**
- Products show SKU/name and quantity.
- Allocated stock is distinguishable from available stock.
- Low-stock items are visually identifiable.

### F3 — Pick & pack
The user can open an order and complete its fulfilment checklist.

**Acceptance criteria**
- Items required for the order are listed.
- Packing progress can be recorded.
- An order can move to ready-for-dispatch.

### F4 — Dispatch
The user can record the handoff to a delivery provider/driver.

**Acceptance criteria**
- Dispatch status is visible.
- A tracking/reference value can be recorded.
- Dispatch date is visible.

### F5 — Returns
The user can register and inspect a returned order.

**Acceptance criteria**
- Return reason can be recorded.
- Returned item condition can be recorded.
- Return status is visible.

## 5. Non-goals for MVP

- Automated courier integrations
- Payments
- Advanced analytics
- Route optimisation
- Multi-warehouse optimisation
- Automated customer notifications

## 6. Success measures

- Fulfilment status is understandable at a glance.
- A user can process a sample order from new → packed → dispatched.
- A returned order can be recorded without losing its original order information.

## 7. Product principles

1. Operational clarity over decorative complexity.
2. Every order should have an obvious next action.
3. Inventory and fulfilment states must be explicit.
4. The MVP should represent a real fulfilment operation rather than a generic e-commerce dashboard.
