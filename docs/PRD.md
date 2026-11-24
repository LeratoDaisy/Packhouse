# Packhouse Product Requirements Document

## 1. Product

Packhouse is a fulfilment management platform and operating layer for small online businesses. It helps sellers outsource the operational work between receiving an order and getting it to the customer.

## 2. Goal

Give small online businesses a reliable fulfilment operation without requiring them to build and manage their own storage, picking, packing and dispatch infrastructure.

## 3. Primary users

Packhouse has two primary user groups:

### 3.1 Small online seller / business owner
The seller is the **customer and payer** of Packhouse.

They use Packhouse to:
- send or hold stock with Packhouse;
- have incoming orders fulfilled;
- see order and fulfilment progress;
- understand stock availability;
- track dispatch and returns;
- rely on Packhouse for the operational work required to get orders to customers.

Typical businesses include growing online sellers selling through channels such as Shopify, Instagram and WhatsApp.

### 3.2 Packhouse fulfilment operator / staff member
The fulfilment operator is the **daily operational user** of the Packhouse application.

They use the system to:
- receive and process orders;
- pick and pack items;
- monitor inventory;
- prepare and record dispatches;
- handle fulfilment exceptions;
- register and inspect returns.

Operational access is controlled through Packhouse user roles, with administrative users able to manage the operation and staff users performing day-to-day fulfilment work.

### 3.3 End customer — indirect user
The seller's customer is **not a primary application user** in the MVP. They are the recipient of the fulfilled order. Packhouse supports their experience indirectly by making fulfilment, dispatch and returns more reliable.

## 4. Customer and payer

The small online seller / business owner is the commercial customer and pays Packhouse for fulfilment services.

Packhouse can charge through a combination of:
- fulfilment fees per order;
- storage fees;
- delivery and returns services;
- optional service plans as the business grows.

## 5. MVP features

### F1 — Order queue
The fulfilment operator can view orders and their fulfilment status.

**Acceptance criteria**
- Orders have a clear status.
- Orders can be opened to see customer and item details.
- The queue distinguishes orders awaiting fulfilment from completed orders.
- Order status updates persist in the hosted database.

### F2 — Inventory
The fulfilment operator can view stock levels and allocation.

**Acceptance criteria**
- Products show SKU/name and quantity.
- Allocated stock is distinguishable from available stock.
- Low-stock items are visually identifiable.
- Inventory is loaded from the hosted database.

### F3 — Pick & pack
The fulfilment operator can open an order and complete its fulfilment checklist.

**Acceptance criteria**
- Items required for the order are listed.
- Packing progress can be recorded.
- An order cannot be marked packed until required items are verified.
- An order can move to ready-for-dispatch.

### F4 — Dispatch
The fulfilment operator can record the handoff to a delivery provider/driver.

**Acceptance criteria**
- Dispatch status is visible.
- A tracking/reference value can be recorded.
- Dispatch date is visible.

### F5 — Returns
The fulfilment operator can register and inspect a returned order.

**Acceptance criteria**
- Return reason can be recorded.
- Returned item condition can be recorded.
- Return status is visible.

## 6. Non-goals for MVP

- Automated courier integrations
- Payments
- Advanced analytics
- Route optimisation
- Multi-warehouse optimisation
- Automated customer notifications

## 7. Success measures

- A small online seller can use Packhouse as an outsourced fulfilment operation instead of building the full operation themselves.
- A fulfilment operator can understand the day's work at a glance.
- A user can process a sample order from new → picking → packed → dispatched.
- Order status changes persist after refresh.
- A returned order can be recorded without losing its original order information.
- Inventory and fulfilment states are visible and understandable.

## 8. Product principles

1. Operational clarity over decorative complexity.
2. Every order should have an obvious next action.
3. Inventory and fulfilment states must be explicit.
4. The MVP should represent a real fulfilment operation rather than a generic e-commerce dashboard.
5. The product should reduce the operational burden on small online sellers, not simply give them another dashboard to manage.
