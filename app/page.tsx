"use client";

import { useMemo, useState } from "react";

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

const returns = [
  { id: "RT-021", order: "PK-1038", customer: "Lebo M.", reason: "Wrong size", condition: "Awaiting inspection", status: "Open" },
  { id: "RT-020", order: "PK-1029", customer: "Sarah N.", reason: "Damaged item", condition: "Damaged", status: "Review" },
  { id: "RT-019", order: "PK-1017", customer: "Mpho T.", reason: "Changed mind", condition: "Good", status: "Restock" },
];

const dispatches = [
  { id: "DS-884", order: "PK-1046", carrier: "Packhouse Courier", destination: "Johannesburg", window: "14:30", status: "Ready" },
  { id: "DS-883", order: "PK-1045", carrier: "Pargo", destination: "Pretoria", window: "15:00", status: "Collected" },
  { id: "DS-882", order: "PK-1043", carrier: "The Courier Guy", destination: "Sandton", window: "15:30", status: "Exception" },
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
  const [orders, setOrders] = useState(initialOrders);
  const [selected, setSelected] = useState<Order | null>(null);

  const metrics = useMemo(() => ({
    open: orders.filter((o) => o.status !== "Dispatched").length,
    picking: orders.filter((o) => o.status === "Picking").length,
    packed: orders.filter((o) => o.status === "Packed").length,
    exceptions: orders.filter((o) => o.status === "Exception").length,
  }), [orders]);

  function advanceOrder(order: Order) {
    const next: Record<Status, Status> = { New: "Picking", Picking: "Packed", Packed: "Dispatched", Dispatched: "Dispatched", Exception: "Picking" };
    const status = next[order.status];
    setOrders((current) => current.map((o) => o.id === order.id ? { ...o, status } : o));
    setSelected((current) => current?.id === order.id ? { ...current, status } : current);
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
          <button className="nav-item"><span>⚙</span>Settings</button>
          <div className="user-card"><span className="avatar dark">LT</span><div><strong>Lerato</strong><small>Admin</small></div><span>•••</span></div>
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <div><span className="eyebrow">MONDAY, 23 NOVEMBER</span><h1>{active === "Overview" ? "Good morning, Lerato" : active}</h1></div>
          <div className="top-actions"><button className="icon-button">⌕</button><button className="icon-button">♢</button><button className="primary">+ New order</button></div>
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
                {inventory.slice(0, 3).map((item) => <div className="stock-row" key={item.sku}><div><strong>{item.name}</strong><small>{item.sku}</small></div><div className="stock-count"><strong>{item.available}</strong><span>available</span></div><div className={item.available < item.reorder ? "stock-bar low" : "stock-bar"}><i style={{width: `${Math.min(item.available, 100)}%`}} /></div></div>)}
              </div>
            </section>
          </>
        )}

        {active === "Orders" && <section className="panel full"><div className="panel-head"><div><span className="eyebrow">FULFILMENT QUEUE</span><h3>All orders</h3></div><div className="filters"><button className="filter active">All</button><button className="filter">Needs action</button><button className="filter">Dispatched</button></div></div><OrderTable orders={orders} onSelect={setSelected} /></section>}

        {active === "Inventory" && <section className="panel full"><div className="panel-head"><div><span className="eyebrow">STOCK CONTROL</span><h3>Inventory</h3></div><button className="primary small">+ Receive stock</button></div><div className="inventory-grid">{inventory.map((item) => <div className="inventory-card" key={item.sku}><span className="sku">{item.sku}</span><h4>{item.name}</h4><div className="big-stock">{item.available}<small>available</small></div><div className="split"><span>Allocated <b>{item.allocated}</b></span><span>Reorder at <b>{item.reorder}</b></span></div>{item.available < item.reorder && <div className="warning">Low stock · reorder recommended</div>}</div>)}</div></section>}

        {active === "Dispatch" && <section className="panel full"><div className="panel-head"><div><span className="eyebrow">OUTBOUND OPERATIONS</span><h3>Dispatch board</h3></div><button className="primary small">+ Create shipment</button></div><div className="dispatch-summary"><div><strong>{dispatches.filter(d => d.status === "Ready").length}</strong><span>ready for pickup</span></div><div><strong>14:30</strong><span>next collection</span></div><div><strong>3</strong><span>shipments today</span></div></div><div className="table"><div className="tr dispatch-tr th"><span>Shipment</span><span>Order</span><span>Carrier</span><span>Destination</span><span>Window</span><span>Status</span></div>{dispatches.map(d => <div className="tr dispatch-tr" key={d.id}><span className="mono"><b>{d.id}</b></span><span className="mono">{d.order}</span><span>{d.carrier}</span><span>{d.destination}</span><span>{d.window}</span><StatusPill status={d.status}/></div>)}</div></section>}

        {active === "Returns" && <section className="panel full"><div className="panel-head"><div><span className="eyebrow">REVERSE LOGISTICS</span><h3>Returns</h3></div><button className="primary small">+ Register return</button></div><div className="table"><div className="tr th"><span>Return</span><span>Order</span><span>Customer</span><span>Reason</span><span>Condition</span><span>Status</span></div>{returns.map(r => <div className="tr" key={r.id}><span className="mono">{r.id}</span><span className="mono">{r.order}</span><strong>{r.customer}</strong><span>{r.reason}</span><span>{r.condition}</span><StatusPill status={r.status}/></div>)}</div></section>}

        {selected && <div className="drawer-backdrop" onClick={() => setSelected(null)}><aside className="drawer" onClick={(e) => e.stopPropagation()}><button className="close" onClick={() => setSelected(null)}>×</button><span className="eyebrow">ORDER DETAIL</span><h2>{selected.id}</h2><StatusPill status={selected.status}/><div className="detail-block"><span>Customer</span><strong>{selected.customer}</strong></div><div className="detail-block"><span>Channel</span><strong>{selected.channel}</strong></div><div className="detail-block"><span>Items</span><strong>{selected.items} items · {selected.value}</strong></div><div className="detail-block"><span>Received</span><strong>{selected.age} ago</strong></div>{selected.status !== "Dispatched" && <button className="primary full-button" onClick={() => advanceOrder(selected)}>{selected.status === "New" ? "Start picking" : selected.status === "Picking" ? "Mark packed" : selected.status === "Packed" ? "Dispatch order" : "Resolve & resume"}</button>}</aside></div>}
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
