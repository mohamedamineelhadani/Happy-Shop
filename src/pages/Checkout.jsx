import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Cart as CartIcon, Check, Shield } from "../lib/icons";
import { formatPrice } from "../lib/format";
import { orderService } from "../services";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import EmptyState from "../components/ui/EmptyState";

const EMPTY = {
  customer_name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  note: "",
};

export default function Checkout() {
  const { items, checkoutItems, subtotal, shipping, total, clear } = useCart();
  const toast = useToast();

  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState(null);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    try {
      const response = await orderService.create({
        ...form,
        items: checkoutItems,
      });
      setPlaced(response.data);
      clear();
      toast.success("Your order has been placed.", "Order confirmed");
    } catch (err) {
      toast.error(err.message, "Order could not be placed");
    } finally {
      setSubmitting(false);
    }
  }

  if (placed) {
    return (
      <div className="container section">
        <div className="order-success panel">
          <span className="order-success__icon">
            <Check size={40} />
          </span>
          <span className="eyebrow">Thank you</span>
          <h1>Your order is confirmed</h1>
          <p className="lead" style={{ marginInline: "auto" }}>
            A confirmation email is on its way to {placed.email}. We’ll notify you
            as soon as it ships.
          </p>
          <span className="order-success__ref">{placed.reference}</span>
          <div className="summary-row" style={{ width: "100%", maxWidth: 320 }}>
            <span>Order total</span>
            <span className="amount">{formatPrice(placed.total)}</span>
          </div>
          <Link to="/shop" className="btn btn-gold">
            Continue shopping <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container section">
        <div className="page-head">
          <span className="eyebrow">Checkout</span>
          <h1>Your bag is empty</h1>
        </div>
        <EmptyState
          icon={CartIcon}
          title="Nothing to check out yet"
          message="Add a few pieces to your bag and return here."
          action={
            <Link to="/shop" className="btn btn-gold btn-sm">
              Browse the shop
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container section">
      <div className="page-head">
        <span className="eyebrow">Checkout</span>
        <h1>Complete your order</h1>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form panel" style={{ padding: "1.75rem" }} onSubmit={handleSubmit}>
          <fieldset>
            <legend>Delivery details</legend>

            <div className="form-grid">
              <div className="field span-2">
                <label htmlFor="customer_name">Full name</label>
                <input
                  id="customer_name"
                  className="input"
                  required
                  maxLength={200}
                  value={form.customer_name}
                  onChange={(event) => update("customer_name", event.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  required
                  maxLength={200}
                  value={form.email}
                  onChange={(event) => update("email", event.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  className="input"
                  required
                  maxLength={50}
                  value={form.phone}
                  onChange={(event) => update("phone", event.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  className="input"
                  maxLength={120}
                  value={form.city}
                  onChange={(event) => update("city", event.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="address">Address</label>
                <input
                  id="address"
                  className="input"
                  maxLength={400}
                  value={form.address}
                  onChange={(event) => update("address", event.target.value)}
                />
              </div>

              <div className="field span-2">
                <label htmlFor="note">Order note (optional)</label>
                <textarea
                  id="note"
                  className="textarea"
                  maxLength={600}
                  value={form.note}
                  onChange={(event) => update("note", event.target.value)}
                />
              </div>
            </div>
          </fieldset>

          <p className="dim" style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
            <Shield size={16} /> Totals are verified securely on our server.
          </p>

          <button type="submit" className="btn btn-gold btn-lg" disabled={submitting}>
            {submitting ? "Placing order…" : `Place order — ${formatPrice(total)}`}
          </button>
        </form>

        <aside className="order-summary panel">
          <h3>Order summary</h3>

          <div className="order-summary__items">
            {items.map((item) => (
              <div className="mini-line" key={item.id}>
                <div className="mini-line__img">
                  <img src={item.image} alt={item.title} />
                </div>
                <div>
                  <div className="mini-line__title">{item.title}</div>
                  <div className="mini-line__qty">Qty {item.quantity}</div>
                </div>
                <span className="mini-line__price">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <hr className="rule" />

          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span className="amount">{formatPrice(total)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
