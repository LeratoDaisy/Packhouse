"use client";

import { useMemo, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";

type Status = "New" | "Picking" | "Packed" | "Dispatched" | "Exception";

type Order = {
  id: string;
  customer: string;
  channel: string;
  items: number;
  value: string;
  status: Status;
  age: string;
  priority?: boolean;
};

const initialOrders: Order[] = [
  { id: "PK-1048", customer: "Thandi M.", channel: "Shopify", items: 3, value: "R1,240", status: "New", age: "12 min", priority: true },
  { id: "PK-1047", customer: "Amahle K.", channel: "Instagram", items: 2, value: "R680", status: "Picking", age: "28 min" },
  { id: "PK-1046", customer: "Liam S.", channel: "WhatsApp", items: 5, value: "R2,150", status: "Packed", age: "41 min" },
  { id: "PK-1045", customer: "Nandi P.", channel: "Shopify", items: 1, value: "R390", status: "Dispatched", age: "1 hr" },
  { id: "PK-1044", customer: "Zanele D.", channel: "Instagram", items: 4, value: "R1,890", status: "Exception", age: "2 hrs" },
];

const inventory = [
  { sku: "SK-TEE-01", name: "Essential Tee — Black", available: 82, allocated: 14, reorder: 20 },
  { sku: "SK-BAG-07", name: "Everyday Tote", available: 46, allocated: 8, reorder: 15 },
  { sku: "SK-CAP-03", name: "Core Cap — Stone", available: 12, allocated: 9, reorder: 15 },
  { sku: "SK-HOOD-02", name: "Heavyweight Hoodie", available: 31, allocated: 5, reorder: 10 },
];



const nav = [
  { key: "Overview", icon: "⌂" },
  { key: "Orders", icon: "↗" },
  { key: "Inventory", icon: "▦" },
  { key: "Dispatch", icon: "⇢" },
  { key: "Returns", icon: "↩" },
];

function StatusPill({ status }: { status: string }) {
  return <span className={`pill pill-${status.toLowerCase().replaceAll(" ", "-")}`}>{status}</span>;
}

export default function Home() {
  const [active, setActive] = useState("Overview");
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
  async function loadOrders() {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load orders:", error);
      return;
    }

    console.log("SUPABASE ORDERS:", data);
    console.log("SUPABASE ERROR:", error);

    if (data) {
      setOrders(
        data.map((order) => ({
          id: order.order_number,
          customer: order.customer_name,
          channel: "Online",
          items: 1,
          value: "—",
          status:
            order.status === "new"
              ? "New"
              : order.status === "picking"
                ? "Picking"
                : order.status === "packed"
                  ? "Packed"
                  : order.status === "dispatched"
                    ? "Dispatched"
                    : "Exception",
          age: "Today",
        }))
      );
    }
    const { data: dispatchData, error: dispatchError } = await supabase
      .from("dispatches")
      .select("*, orders(order_number)")
      .order("created_at", { ascending: false });

    if (dispatchError) {
      console.error("Failed to load dispatches:", dispatchError);
    } else {
      setDispatches(
        (dispatchData ?? []).map((d: any) => ({
          id: d.id,
          order: d.orders?.order_number ?? "—",
          carrier: d.carrier,
          destination: d.destination,
          window: d.pickup_window ?? "—",
          status: d.dispatch_date ? "Collected" : "Ready",
        }))
      );
    }

    const { data: returnData, error: returnError } = await supabase
      .from("returns")
      .select("*")
      .order("created_at", { ascending: false });

    if (returnError) {
      console.error("Failed to load returns:", returnError);
    } else {
      setReturnRows(returnData ?? []);
    }

    const { data: inventoryData, error: inventoryError } = await supabase
  .from("inventory")
  .select("*")
  .order("product_name");

console.log("SUPABASE INVENTORY:", inventoryData);
console.log("SUPABASE INVENTORY ERROR:", inventoryError);

if (inventoryError) {
  console.error("Failed to load inventory:", inventoryError);
  return;
}

if (inventoryData) {
  setInventoryRows(
    inventoryData.map((item) => ({
      sku: item.sku,
      name: item.product_name,
      available: item.stock_available,
      allocated: item.stock_allocated,
      reorder: item.reorder_threshold,
    }))
  );
}
  }

  loadOrders();
}, []);

  useEffect(() => {
    if (active !== "Settings") return;
    async function loadTeam() {
      const response = await fetch("/api/employees");
      if (response.ok) {
        const data = await response.json();
        setTeam(data.employees ?? []);
      }
    }
    loadTeam();
  }, [active]);

  const [selected, setSelected] = useState<Order | null>(null);
  const [packed, setPacked] = useState<Record<string, boolean[]>>({});
  const [dispatches, setDispatches] = useState<any[]>([]);
  const [inventoryRows, setInventoryRows] = useState<{ sku: string; name: string; available: number; allocated: number; reorder: number }[]>([]);
  const [returnRows, setReturnRows] = useState<any[]>([]);
  const [returnOpen, setReturnOpen] = useState(false);
  const [newOrderOpen, setNewOrderOpen] = useState(false);
  const [newOrderForm, setNewOrderForm] = useState({ customer: "", email: "" });
  const [returnForm, setReturnForm] = useState({ order: "", customer: "", reason: "Wrong size" });
  const [team, setTeam] = useState<any[]>([]);
  const [employeeOpen, setEmployeeOpen] = useState(false);
  const [employeeForm, setEmployeeForm] = useState({ name: "", email: "", password: "" });
  const [employeeError, setEmployeeError] = useState("");
  const [employeeLoading, setEmployeeLoading] = useState(false);

  function togglePackItem(orderId: string, index: number, total: number) {
    setPacked((current) => {
      const next = [...(current[orderId] ?? Array(total).fill(false))];
      next[index] = !next[index];
      return { ...current, [orderId]: next };
    });
  }

  const metrics = useMemo(() => ({
    open: orders.filter((o) => o.status !== "Dispatched").length,
    picking: orders.filter((o) => o.status === "Picking").length,
    packed: orders.filter((o) => o.status === "Packed").length,
    exceptions: orders.filter((o) => o.status === "Exception").length,
  }), [orders]);

  async function advanceOrder(order: Order) {
  const next: Record<Status, Status> = {
    New: "Picking",
    Picking: "Packed",
    Packed: "Dispatched",
    Dispatched: "Dispatched",
    Exception: "Picking",
  };

  const status = next[order.status];

  const supabase = createClient();

  const { error } = await supabase
    .from("orders")
    .update({
      status: status.toLowerCase(),
    })
    .eq("order_number", order.id);

  if (error) {
    console.error("Failed to update order:", error);
    return;
  }

  setOrders((current) =>
    current.map((o) =>
      o.id === order.id ? { ...o, status } : o
    )
  );

  setSelected((current) =>
    current?.id === order.id ? { ...current, status } : current
  );
}

  async function createShipment() {
    const supabase = createClient();

    const { data: packedOrders } = await supabase
      .from("orders")
      .select("id, order_number, customer_name")
      .eq("status", "packed")
      .order("created_at", { ascending: true });

    const { data: existingDispatches } = await supabase
      .from("dispatches")
      .select("order_id");

    const dispatchedOrderIds = new Set((existingDispatches ?? []).map((d: any) => d.order_id));
    const order = (packedOrders ?? []).find((o: any) => !dispatchedOrderIds.has(o.id));

    if (!order) {
      alert("No packed order is available for dispatch.");
      return;
    }

    const { data, error } = await supabase
      .from("dispatches")
      .insert({
        order_id: order.id,
        carrier: "Packhouse Courier",
        carrier_reference: `PK-${Date.now()}`,
        destination: order.customer_name,
        pickup_window: "Today · 14:30–16:00",
      })
      .select("*, orders(order_number)")
      .single();

    if (error) {
      console.error("Failed to create shipment:", error);
      alert(error.message);
      return;
    }

    setDispatches((current) => [
      {
        id: data.id,
        order: data.orders?.order_number ?? order.order_number,
        carrier: data.carrier,
        destination: data.destination,
        window: data.pickup_window ?? "—",
        status: data.dispatch_date ? "Collected" : "Ready",
      },
      ...current,
    ]);
  }

  async function collectShipment(shipment: any) {
    const supabase = createClient();

    const { error } = await supabase
      .from("dispatches")
      .update({ dispatch_date: new Date().toISOString() })
      .eq("id", shipment.id);

    if (error) {
      console.error("Failed to collect shipment:", error);
      alert(error.message);
      return;
    }

    if (shipment.order) {
      await supabase
        .from("orders")
        .update({ status: "dispatched" })
        .eq("order_number", shipment.order);
    }

    setDispatches((current) =>
      current.map((d) =>
        d.id === shipment.id ? { ...d, status: "Collected" } : d
      )
    );

    setOrders((current) =>
      current.map((o) =>
        o.id === shipment.order ? { ...o, status: "Dispatched" } : o
      )
    );
  }

  async function createOrder() {
    const customer = newOrderForm.customer.trim();
    const email = newOrderForm.email.trim();

    if (!customer) return;

    const supabase = createClient();
    const orderNumber = `PK-${Date.now().toString().slice(-6)}`;

    const { data, error } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: customer,
        customer_email: email || null,
        status: "new",
      })
      .select("*")
      .single();

    if (error) {
      console.error("Failed to create order:", error);
      alert(error.message);
      return;
    }

    const newOrder: Order = {
      id: data.order_number,
      customer: data.customer_name,
      channel: "Online",
      items: 1,
      value: "—",
      status: "New",
      age: "Just now",
    };

    setOrders((current) => [newOrder, ...current]);
    setNewOrderForm({ customer: "", email: "" });
    setNewOrderOpen(false);
  }

  async function registerReturn() {
    const supabase = createClient();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, order_number, customer_name")
      .eq("order_number", returnForm.order.trim())
      .maybeSingle();

    if (orderError) {
      console.error("Failed to find order:", orderError);
      alert(orderError.message);
      return;
    }

    if (!order) {
      alert("Order not found. Enter an existing Packhouse order ID.");
      return;
    }

    const { data, error } = await supabase
      .from("returns")
      .insert({
        order_id: order.id,
        customer_name: returnForm.customer.trim(),
        reason: returnForm.reason,
        condition: "Pending inspection",
        status: "registered",
      })
      .select("*")
      .single();

    if (error) {
      console.error("Failed to register return:", error);
      alert(error.message);
      return;
    }

    setReturnRows((current) => [data, ...current]);
    setReturnForm({ order: "", customer: "", reason: "Wrong size" });
    setReturnOpen(false);
  }

  async function createEmployee() {
    setEmployeeError("");
    setEmployeeLoading(true);

    const response = await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employeeForm),
    });

    const data = await response.json();

    if (!response.ok) {
      setEmployeeError(data.error ?? "Could not create employee account.");
      setEmployeeLoading(false);
      return;
    }

    setTeam((current) => [data.employee, ...current]);
    setEmployeeForm({ name: "", email: "", password: "" });
    setEmployeeOpen(false);
    setEmployeeLoading(false);
  }

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  async function advanceReturn(returnRow: any) {
    const next: Record<string, string> = {
      registered: "inspecting",
      inspecting: "approved",
      approved: "restocked",
      rejected: "registered",
      restocked: "restocked",
    };

    const status = next[returnRow.status] ?? "registered";
    const supabase = createClient();

    const { error } = await supabase
      .from("returns")
      .update({ status })
      .eq("id", returnRow.id);

    if (error) {
      console.error("Failed to update return:", error);
      alert(error.message);
      return;
    }

    setReturnRows((current) =>
      current.map((r) => (r.id === returnRow.id ? { ...r, status } : r))
    );
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">P</span><span>packhouse</span></div>
        <div className="workspace"><span className="avatar">L</span><div><strong>Packhouse HQ</strong><small>Operations</small></div><span className="chevron">⌄</span></div>
        <nav>
          {nav.map((item) => (
            <button key={item.key} className={active === item.key ? "nav-item active" : "nav-item"} onClick={() => { setActive(item.key); setSelected(null); }}>
              <span>{item.icon}</span>{item.key}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button className={active === "Settings" ? "nav-item active" : "nav-item"} onClick={() => { setActive("Settings"); setSelected(null); }}><span>⚙</span>Settings</button>
          <button className="user-card" onClick={logout}><span className="avatar dark">LT</span><div><strong>Lerato</strong><small>Admin · Log out</small></div><span>↪</span></button>
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <div><span className="eyebrow">{new Date().toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long" }).toUpperCase()}</span><h1>{active === "Overview" ? "Good morning, Lerato" : active}</h1></div>
          <div className="top-actions"><button className="icon-button">⌕</button><button className="icon-button">♢</button><button className="primary" onClick={() => setNewOrderOpen(true)}>+ New order</button></div>
        </header>

        {active === "Overview" && (
          <>
            <section className="hero">
              <div><span className="live-dot"></span><span>LIVE OPERATIONS</span><h2>Your fulfilment floor at a glance.</h2><p>Stay ahead of every parcel from order received to customer delivery.</p></div>
              <div className="hero-number"><strong>94%</strong><span>on-time dispatch rate</span></div>
            </section>
            <div className="metrics">
              <Metric label="Open orders" value={metrics.open.toString()} note="2 need attention" />
              <Metric label="Picking now" value={metrics.picking.toString()} note="Avg. 18 min" />
              <Metric label="Ready to ship" value={metrics.packed.toString()} note="Next pickup 14:30" />
              <Metric label="Exceptions" value={metrics.exceptions.toString()} note="1 needs review" danger />
            </div>
            <section className="grid-two">
              <div className="panel">
                <div className="panel-head"><div><span className="eyebrow">FULFILMENT QUEUE</span><h3>Orders needing action</h3></div><button className="text-button" onClick={() => setActive("Orders")}>View all →</button></div>
                <OrderTable compact orders={orders} onSelect={setSelected} />
              </div>
              <div className="panel">
                <div className="panel-head"><div><span className="eyebrow">INVENTORY HEALTH</span><h3>Stock watch</h3></div><button className="text-button" onClick={() => setActive("Inventory")}>Inventory →</button></div>
                {inventoryRows.slice(0, 3).map((item) => <div className="stock-row" key={item.sku}><div><strong>{item.name}</strong><small>{item.sku}</small></div><div className="stock-count"><strong>{item.available}</strong><span>available</span></div><div className={item.available < item.reorder ? "stock-bar low" : "stock-bar"}><i style={{width: `${Math.min(item.available, 100)}%`}} /></div></div>)}
              </div>
            </section>
          </>
        )}

        {active === "Orders" && <section className="panel full"><div className="panel-head"><div><span className="eyebrow">FULFILMENT QUEUE</span><h3>All orders</h3></div><div className="filters"><button className="filter active">All</button><button className="filter">Needs action</button><button className="filter">Dispatched</button></div></div><OrderTable orders={orders} onSelect={setSelected} /></section>}

        {active === "Inventory" && <section className="panel full"><div className="panel-head"><div><span className="eyebrow">STOCK CONTROL</span><h3>Inventory</h3></div><button className="primary small">+ Receive stock</button></div><div className="inventory-grid">{inventoryRows.map((item) => <div className="inventory-card" key={item.sku}><span className="sku">{item.sku}</span><h4>{item.name}</h4><div className="big-stock">{item.available}<small>available</small></div><div className="split"><span>Allocated <b>{item.allocated}</b></span><span>Reorder at <b>{item.reorder}</b></span></div>{item.available < item.reorder && <div className="warning">Low stock · reorder recommended</div>}</div>)}</div></section>}

        {active === "Dispatch" && <section className="panel full"><div className="panel-head"><div><span className="eyebrow">OUTBOUND OPERATIONS</span><h3>Dispatch board</h3></div><button className="primary small" onClick={createShipment}>+ Create shipment</button></div><div className="dispatch-summary"><div><strong>{dispatches.filter(d => d.status === "Ready").length}</strong><span>ready for pickup</span></div><div><strong>{dispatches.filter(d => d.status === "Collected").length}</strong><span>collected</span></div><div><strong>{dispatches.length}</strong><span>shipments</span></div></div><div className="table"><div className="tr dispatch-tr th"><span>Shipment</span><span>Order</span><span>Carrier</span><span>Destination</span><span>Window</span><span>Status</span></div>{dispatches.map(d => <button className="tr dispatch-tr row-button" key={d.id} onClick={() => d.status === "Ready" && collectShipment(d)}><span className="mono"><b>{String(d.id).slice(0,8)}</b></span><span className="mono">{d.order}</span><span>{d.carrier}</span><span>{d.destination}</span><span>{d.window}</span><StatusPill status={d.status}/></button>)}</div></section>}

        {active === "Returns" && <section className="panel full"><div className="panel-head"><div><span className="eyebrow">REVERSE LOGISTICS</span><h3>Returns</h3></div><button className="primary small" onClick={() => setReturnOpen(true)}>+ Register return</button></div><div className="table"><div className="tr th"><span>Return</span><span>Order</span><span>Customer</span><span>Reason</span><span>Condition</span><span>Status</span></div>{returnRows.map(r => <button className="tr row-button" key={r.id} onClick={() => advanceReturn(r)}><span className="mono">{String(r.id).slice(0,8)}</span><span className="mono">{r.order}</span><strong>{r.customer}</strong><span>{r.reason}</span><span>{r.condition}</span><StatusPill status={r.status}/></button>)}</div></section>}

        {active === "Settings" && <section className="panel full">
          <div className="panel-head">
            <div><span className="eyebrow">WORKSPACE SETTINGS</span><h3>Team & access</h3></div>
            <button className="primary small" onClick={() => { setEmployeeError(""); setEmployeeOpen(true); }}>+ Add employee</button>
          </div>
          <p className="modal-copy">Create individual staff accounts so every Packhouse employee can sign in with their own credentials.</p>
          <div className="inventory-grid">
            {team.map((member) => (
              <div className="inventory-card" key={member.id}>
                <span className="sku">{member.role === "admin" ? "ADMIN" : "STAFF"}</span>
                <h4>{member.full_name || "Packhouse employee"}</h4>
                <div className="split"><span>{member.email}</span><span><b>{member.role}</b></span></div>
              </div>
            ))}
          </div>
          <div className="panel" style={{marginTop: 16}}>
            <div className="panel-head"><div><span className="eyebrow">ACCOUNT</span><h3>Lerato</h3></div><button className="filter" onClick={logout}>Log out</button></div>
            <p className="modal-copy">You are signed in as the Packhouse administrator. Log out here when handing the workspace to another employee.</p>
          </div>
        </section>}

        {selected && <div className="drawer-backdrop" onClick={() => setSelected(null)}><aside className="drawer" onClick={(e) => e.stopPropagation()}><button className="close" onClick={() => setSelected(null)}>×</button><span className="eyebrow">ORDER DETAIL</span><h2>{selected.id}</h2><StatusPill status={selected.status}/><div className="detail-block"><span>Customer</span><strong>{selected.customer}</strong></div><div className="detail-block"><span>Channel</span><strong>{selected.channel}</strong></div><div className="detail-block"><span>Items</span><strong>{selected.items} items · {selected.value}</strong></div><div className="detail-block"><span>Received</span><strong>{selected.age} ago</strong></div>{selected.status !== "Dispatched" && <><div className="pack-section"><span className="eyebrow">PICK & PACK CHECKLIST</span>{Array.from({ length: selected.items }, (_, i) => <label className="check-row" key={i}><input type="checkbox" checked={packed[selected.id]?.[i] ?? false} onChange={() => togglePackItem(selected.id, i, selected.items)} /><span>Item {i + 1} verified and packed</span></label>)}</div><button className="primary full-button" disabled={selected.status === "Picking" && !(packed[selected.id]?.every(Boolean))} onClick={() => advanceOrder(selected)}>{selected.status === "New" ? "Start picking" : selected.status === "Picking" ? "Mark packed" : selected.status === "Packed" ? "Dispatch order" : "Resolve & resume"}</button></>}</aside></div>}
        {newOrderOpen && <div className="modal-backdrop" onClick={() => setNewOrderOpen(false)}><div className="modal" onClick={(e) => e.stopPropagation()}><button className="close" onClick={() => setNewOrderOpen(false)}>×</button><span className="eyebrow">ORDER INTAKE</span><h2>Create a new order</h2><p className="modal-copy">Add a real order to the Packhouse fulfilment queue.</p><label className="field"><span>Customer</span><input value={newOrderForm.customer} onChange={(e) => setNewOrderForm({...newOrderForm, customer:e.target.value})} placeholder="Customer name" /></label><label className="field"><span>Email</span><input type="email" value={newOrderForm.email} onChange={(e) => setNewOrderForm({...newOrderForm, email:e.target.value})} placeholder="customer@example.com" /></label><div className="modal-actions"><button className="filter" onClick={() => setNewOrderOpen(false)}>Cancel</button><button className="primary" disabled={!newOrderForm.customer.trim()} onClick={createOrder}>Create order</button></div></div></div>}
        {employeeOpen && <div className="modal-backdrop" onClick={() => setEmployeeOpen(false)}><div className="modal" onClick={(e) => e.stopPropagation()}>
          <button className="close" onClick={() => setEmployeeOpen(false)}>×</button>
          <span className="eyebrow">TEAM ACCESS</span>
          <h2>Add an employee</h2>
          <p className="modal-copy">Create a separate staff login for a Packhouse employee.</p>
          <label className="field"><span>Full name</span><input value={employeeForm.name} onChange={(e) => setEmployeeForm({...employeeForm, name:e.target.value})} placeholder="Employee name" /></label>
          <label className="field"><span>Email</span><input type="email" value={employeeForm.email} onChange={(e) => setEmployeeForm({...employeeForm, email:e.target.value})} placeholder="employee@company.com" /></label>
          <label className="field"><span>Temporary password</span><input type="password" value={employeeForm.password} onChange={(e) => setEmployeeForm({...employeeForm, password:e.target.value})} placeholder="At least 8 characters" /></label>
          {employeeError && <p className="login-error">{employeeError}</p>}
          <div className="modal-actions"><button className="filter" onClick={() => setEmployeeOpen(false)}>Cancel</button><button className="primary" disabled={!employeeForm.name.trim() || !employeeForm.email.trim() || employeeForm.password.length < 8 || employeeLoading} onClick={createEmployee}>{employeeLoading ? "Creating..." : "Create employee"}</button></div>
        </div></div>}

        {returnOpen && <div className="modal-backdrop" onClick={() => setReturnOpen(false)}><div className="modal" onClick={(e) => e.stopPropagation()}><button className="close" onClick={() => setReturnOpen(false)}>×</button><span className="eyebrow">REVERSE LOGISTICS</span><h2>Register a return</h2><p className="modal-copy">Capture the parcel so Packhouse can inspect, resolve and restock it.</p><label className="field"><span>Order ID</span><input value={returnForm.order} onChange={(e) => setReturnForm({...returnForm, order:e.target.value})} placeholder="e.g. PK-1042" /></label><label className="field"><span>Customer</span><input value={returnForm.customer} onChange={(e) => setReturnForm({...returnForm, customer:e.target.value})} placeholder="Customer name" /></label><label className="field"><span>Reason</span><select value={returnForm.reason} onChange={(e) => setReturnForm({...returnForm, reason:e.target.value})}><option>Wrong size</option><option>Damaged item</option><option>Changed mind</option><option>Incorrect item</option></select></label><div className="modal-actions"><button className="filter" onClick={() => setReturnOpen(false)}>Cancel</button><button className="primary" disabled={!returnForm.order || !returnForm.customer} onClick={registerReturn}>Register return</button></div></div></div>}
      </section>
    </main>
  );
}

function Metric({label,value,note,danger=false}:{label:string,value:string,note:string,danger?:boolean}) {
  return <div className="metric"><span>{label}</span><strong className={danger ? "danger-text" : ""}>{value}</strong><small>{note}</small></div>
}

function OrderTable({compact=false,orders,onSelect}:{compact?:boolean,orders:Order[],onSelect:(o:Order)=>void}) {
  const shown=compact ? orders.slice(0,4) : orders;
  return <div className="table"><div className="tr th"><span>Order</span><span>Customer</span><span>Channel</span><span>Items</span><span>Status</span></div>{shown.map(o=><button className="tr row-button" key={o.id} onClick={()=>onSelect(o)}><span className="mono"><b>{o.id}</b>{o.priority && <em>Priority</em>}</span><strong>{o.customer}</strong><span>{o.channel}</span><span>{o.items}</span><StatusPill status={o.status}/></button>)}</div>
}
