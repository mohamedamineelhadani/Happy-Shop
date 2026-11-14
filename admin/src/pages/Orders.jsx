import { useState } from "react";
import { Link } from "react-router-dom";
import { orderService } from "../services";
import useApi from "../hooks/useApi";
import { useToast } from "../context/ToastContext";
import { formatAmount, formatDate, ORDER_STATUSES, titleCase } from "../lib/format";
import { Cart, Search } from "../lib/icons";
import Loading from "../components/ui/Loading";
import EmptyState from "../components/ui/EmptyState";
import StatusPill from "../components/ui/StatusPill";

export default function Orders() {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState({ search: "", status: "" });
  const [savingId, setSavingId] = useState(null);

  const { data, loading, error, setData } = useApi(
    () =>
      orderService.list({
        search: query.search || undefined,
        status: query.status || undefined,
      }),
    [query]
  );

  const orders = data?.data ?? [];

  function applyFilters(event) {
    event.preventDefault();
    setQuery({ search: search.trim(), status });
  }

  async function changeStatus(order, nextStatus) {
    if (nextStatus === order.status) return;
    setSavingId(order.id);
    try {
      await orderService.updateStatus(order.id, nextStatus);
      setData((prev) =>
        prev
          ? {
              ...prev,
              data: prev.data.map((row) =>
                row.id === order.id ? { ...row, status: nextStatus } : row
              ),
            }
          : prev
      );
      toast.success(`${order.reference} marked as ${nextStatus}.`, "Status updated");
    } catch (err) {
      toast.error(err.message, "Could not update status");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="stack">
      <div className="toolbar">
        <form className="toolbar__filters" onSubmit={applyFilters}>
          <div className="search">
            <Search size={17} />
            <input
              className="input"
              placeholder="Reference, name or email…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <select className="input" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">All statuses</option>
            {ORDER_STATUSES.map((option) => (
              <option key={option} value={option}>
                {titleCase(option)}
              </option>
            ))}
          </select>
          <button type="submit" className="btn btn-ghost">
            Filter
          </button>
        </form>
      </div>

      <section className="panel">
        {loading ? (
          <Loading label="Loading orders…" />
        ) : error ? (
          <div className="alert alert--error">{error.message}</div>
        ) : orders.length === 0 ? (
          <EmptyState icon={Cart} title="No orders found" message="Adjust the filters or check back later." />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th className="ta-right">Items</th>
                  <th className="ta-right">Total</th>
                  <th className="ta-right">Placed</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Link to={`/orders/${order.reference}`} className="link">
                        {order.reference}
                      </Link>
                    </td>
                    <td>
                      <div className="cell-stack">
                        <strong>{order.customer_name}</strong>
                        <small className="dim">{order.email}</small>
                      </div>
                    </td>
                    <td>
                      <div className="status-cell">
                        <StatusPill status={order.status} />
                        <select
                          className="input input--sm"
                          value={order.status}
                          disabled={savingId === order.id}
                          onChange={(event) => changeStatus(order, event.target.value)}
                          aria-label={`Change status for ${order.reference}`}
                        >
                          {ORDER_STATUSES.map((option) => (
                            <option key={option} value={option}>
                              {titleCase(option)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="ta-right">{order.item_count}</td>
                    <td className="ta-right">{formatAmount(order.total)}</td>
                    <td className="ta-right dim">{formatDate(order.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && orders.length > 0 ? (
          <p className="table-foot dim">
            {orders.length} order{orders.length === 1 ? "" : "s"}
          </p>
        ) : null}
      </section>
    </div>
  );
}
