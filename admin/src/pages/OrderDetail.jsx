import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { orderService } from "../services";
import { useToast } from "../context/ToastContext";
import { formatAmount, formatDate, formatPrice, ORDER_STATUSES, titleCase } from "../lib/format";
import { ChevronLeft, Edit, Mail, MapPin, Phone } from "../lib/icons";
import Loading from "../components/ui/Loading";
import StatusPill from "../components/ui/StatusPill";
import Modal from "../components/ui/Modal";
import Field from "../components/ui/Field";

export default function OrderDetail() {
  const { reference } = useParams();
  const toast = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [formErrors, setFormErrors] = useState(null);
  const [saving, setSaving] = useState(false);

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

  function openEditor() {
    setForm({
      customer_name: order.customer_name ?? "",
      email: order.email ?? "",
      phone: order.phone ?? "",
      address: order.address ?? "",
      city: order.city ?? "",
      note: order.note ?? "",
    });
    setFormErrors(null);
    setEditing(true);
  }

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function saveDetails(event) {
    event.preventDefault();
    setSaving(true);
    setFormErrors(null);
    try {
      const response = await orderService.update(order.id, {
        customer_name: form.customer_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        note: form.note.trim(),
      });
      setOrder(response.data);
      setEditing(false);
      toast.success("Order details updated.", "Saved");
    } catch (err) {
      setFormErrors(err.errors);
      toast.error(err.message, "Could not save");
    } finally {
      setSaving(false);
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
            <div className="panel__head panel__head--tight">
              <h3>Customer</h3>
              <button type="button" className="btn btn-ghost btn-sm" onClick={openEditor}>
                <Edit size={16} />
                Edit details
              </button>
            </div>
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

      <Modal
        open={editing}
        title="Edit order details"
        onClose={saving ? undefined : () => setEditing(false)}
        footer={
          <>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setEditing(false)}
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" form="order-details-form" className="btn btn-gold" disabled={saving}>
              {saving ? <Loading label="Saving…" inline /> : "Save changes"}
            </button>
          </>
        }
      >
        {form ? (
          <form id="order-details-form" className="form" onSubmit={saveDetails}>
            <Field label="Customer name" htmlFor="o-name" error={formErrors?.customer_name}>
              <input
                id="o-name"
                className="input"
                value={form.customer_name}
                onChange={(event) => setField("customer_name", event.target.value)}
                required
              />
            </Field>

            <div className="form__row">
              <Field label="Email" htmlFor="o-email" error={formErrors?.email}>
                <input
                  id="o-email"
                  type="email"
                  className="input"
                  value={form.email}
                  onChange={(event) => setField("email", event.target.value)}
                  required
                />
              </Field>
              <Field label="Phone" htmlFor="o-phone" error={formErrors?.phone}>
                <input
                  id="o-phone"
                  className="input"
                  value={form.phone}
                  onChange={(event) => setField("phone", event.target.value)}
                  required
                />
              </Field>
            </div>

            <div className="form__row">
              <Field label="Address" htmlFor="o-address" error={formErrors?.address}>
                <input
                  id="o-address"
                  className="input"
                  value={form.address}
                  onChange={(event) => setField("address", event.target.value)}
                />
              </Field>
              <Field label="City" htmlFor="o-city" error={formErrors?.city}>
                <input
                  id="o-city"
                  className="input"
                  value={form.city}
                  onChange={(event) => setField("city", event.target.value)}
                />
              </Field>
            </div>

            <Field label="Note" htmlFor="o-note" error={formErrors?.note}>
              <textarea
                id="o-note"
                className="input textarea"
                rows={3}
                value={form.note}
                onChange={(event) => setField("note", event.target.value)}
              />
            </Field>
          </form>
        ) : null}
      </Modal>
    </div>
  );
}
