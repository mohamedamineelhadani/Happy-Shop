import { Link } from "react-router-dom";
import { statsService } from "../services";
import useApi from "../hooks/useApi";
import { formatAmount, formatDate, formatPrice, ORDER_STATUSES } from "../lib/format";
import {
  Alert,
  Cart,
  Layers,
  Mail,
  Package,
  Star,
  Users,
} from "../lib/icons";
import Loading from "../components/ui/Loading";
import StatusPill from "../components/ui/StatusPill";
import EmptyState from "../components/ui/EmptyState";

export default function Dashboard() {
  const { data, loading, error } = useApi(() => statsService.overview(), []);

  if (loading) return <Loading label="Loading dashboard…" />;
  if (error) return <div className="alert alert--error">{error.message}</div>;

  const totals = data?.totals ?? {};
  const byStatus = data?.orders_by_status ?? {};
  const lowStock = data?.low_stock ?? [];
  const recent = data?.recent_orders ?? [];
  const maxStatus = Math.max(1, ...Object.values(byStatus));

  const cards = [
    { key: "products", label: "Products", value: totals.products, icon: Package, to: "/products" },
    { key: "categories", label: "Categories", value: totals.categories, icon: Layers, to: "/categories" },
    { key: "orders", label: "Orders", value: totals.orders, icon: Cart, to: "/orders" },
    { key: "messages", label: "Messages", value: totals.messages, icon: Mail, to: "/messages", badge: totals.unread },
    { key: "subscribers", label: "Subscribers", value: totals.subscribers, icon: Users, to: "/subscribers" },
  ];

  return (
    <div className="stack">
      <section className="stat-grid">
        <article className="stat-card stat-card--revenue">
          <span className="stat-card__label">Revenue</span>
          <strong className="stat-card__value">{formatPrice(totals.revenue ?? 0)}</strong>
          <span className="stat-card__foot">Across all non-cancelled orders</span>
        </article>

        {cards.map(({ key, label, value, icon: Icon, to, badge }) => (
          <Link key={key} to={to} className="stat-card">
            <span className="stat-card__icon">
              <Icon size={20} />
            </span>
            <span className="stat-card__label">{label}</span>
            <strong className="stat-card__value">{value ?? 0}</strong>
            {badge ? <span className="stat-card__badge">{badge} unread</span> : null}
          </Link>
        ))}
      </section>

      <div className="grid-2">
        <section className="panel">
          <header className="panel__head">
            <h2>Orders by status</h2>
            <Link to="/orders" className="link">
              View all
            </Link>
          </header>
          <div className="bars">
            {ORDER_STATUSES.map((status) => {
              const value = byStatus[status] ?? 0;
              return (
                <div key={status} className="bars__row">
                  <span className="bars__label">
                    <StatusPill status={status} />
                  </span>
                  <span className="bars__track">
                    <span
                      className={`bars__fill bars__fill--${status}`}
                      style={{ width: `${(value / maxStatus) * 100}%` }}
                    />
                  </span>
                  <span className="bars__value">{value}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="panel">
          <header className="panel__head">
            <h2>Low stock</h2>
            <Link to="/products" className="link">
              Manage
            </Link>
          </header>
          {lowStock.length === 0 ? (
            <EmptyState icon={Star} title="Everything is stocked" message="No products are running low." />
          ) : (
            <ul className="list">
              {lowStock.map((product) => (
                <li key={product.id} className="list__item">
                  <img src={product.image} alt="" className="list__thumb" />
                  <span className="list__main">
                    <strong>{product.title}</strong>
                    <small className="dim">{product.category?.name ?? "Uncategorised"}</small>
                  </span>
                  <span className="list__meta">
                    <span className={product.stock <= 0 ? "text-danger" : "text-warning"}>
                      {product.stock} left
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="panel">
        <header className="panel__head">
          <h2>Recent orders</h2>
          <Link to="/orders" className="link">
            View all
          </Link>
        </header>
        {recent.length === 0 ? (
          <EmptyState icon={Cart} title="No orders yet" message="New orders will appear here." />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th className="ta-right">Total</th>
                  <th className="ta-right">Placed</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Link to={`/orders/${order.reference}`} className="link">
                        {order.reference}
                      </Link>
                    </td>
                    <td>{order.customer_name}</td>
                    <td>
                      <StatusPill status={order.status} />
                    </td>
                    <td className="ta-right">{formatAmount(order.total)}</td>
                    <td className="ta-right dim">{formatDate(order.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {totals.unread > 0 ? (
        <div className="alert alert--warning">
          <Alert size={17} />
          You have {totals.unread} unread message{totals.unread === 1 ? "" : "s"}.{" "}
          <Link to="/messages" className="link">
            Review now
          </Link>
        </div>
      ) : null}
    </div>
  );
}
