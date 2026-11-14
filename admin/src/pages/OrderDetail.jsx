import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { orderService } from "../services";
import { useToast } from "../context/ToastContext";
import { formatAmount, formatDate, formatPrice, ORDER_STATUSES, titleCase } from "../lib/format";
import { ChevronLeft, Mail, MapPin, Phone } from "../lib/icons";
import Loading from "../components/ui/Loading";
import StatusPill from "../components/ui/StatusPill";

export default function OrderDetail() {
  const { reference } = useParams();
  const toast = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await orderService.get(reference);
        if (active) setOrder(response.data);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [reference]);

  async function changeStatus(status) {
    setUpdating(true);
    try {
      const response = await orderService.updateStatus(order.id, status);
      setOrder(response.data);
      toast.success(`Order marked as ${status}.`, "Updated");
    } catch (err) {
      toast.error(err.message, "Could not update");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <Loading label="Loading order…" />;
  if (error) return <div className="alert alert--error">{error.message}</div>;
  if (!order) return null;

  return (
    <div className="stack">
      <Link to="/orders" className="back-link">
        <ChevronLeft size={17} />
        Back to orders
      </Link>

      <section className="panel">
        <header className="panel__head">
          <div>
            <h2>{order.reference}</h2>
            <span className="dim">Placed {formatDate(order.created_at)}</span>
          </div>
          <div className="order-status">
            <StatusPill status={order.status} />
            <select
              className="input"
              value={order.status}
              disabled={updating}
              onChange={(event) => changeStatus(event.target.value)}
            >
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {titleCase(status)}
                </option>
              ))}
            </select>
          </div>
        </header>

        <div className="grid-2">
          <div className="panel panel--nested">
            <h3>Customer</h3>
            <ul className="detail-list">
              <li>
                <strong>{order.customer_name}</strong>
              </li>
              <li>
                <Mail size={16} /> <a href={`mailto:${order.email}`}>{order.email}</a>
              </li>
              <li>
                <Phone size={16} /> <a href={`tel:${order.phone}`}>{order.phone}</a>
              </li>
              <li>
                <MapPin size={16} /> {[order.address, order.city].filter(Boolean).join(", ") || "—"}
              </li>
            </ul>
            {order.note ? (
              <p className="note">
                <strong>Note:</strong> {order.note}
              </p>
            ) : null}
          </div>

          <div className="panel panel--nested">
            <h3>Summary</h3>
            <ul className="summary">
              <li>
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </li>
              <li>
                <span>Shipping</span>
                <span>{order.shipping > 0 ? formatPrice(order.shipping) : "Free"}</span>
              </li>
              <li className="summary__total">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </li>
            </ul>
          </div>
        </div>

        <h3 className="section-label">Items</h3>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th className="ta-right">Price</th>
                <th className="ta-right">Qty</th>
                <th className="ta-right">Line total</th>
              </tr>
            </thead>
            <tbody>
              {(order.items ?? []).map((item, index) => (
                <tr key={`${item.product_id}-${index}`}>
                  <td>
                    <div className="cell-product">
                      {item.image ? (
                        <img src={item.image} alt="" className="cell-product__thumb" />
                      ) : null}
                      <span>{item.title}</span>
                    </div>
                  </td>
                  <td className="ta-right">{formatAmount(item.price)}</td>
                  <td className="ta-right">{item.quantity}</td>
                  <td className="ta-right">{formatAmount(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
