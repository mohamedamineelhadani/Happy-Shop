import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Cart as CartIcon, Close } from "../../lib/icons";
import { formatPrice } from "../../lib/format";
import { FREE_SHIPPING_FROM, useCart } from "../../context/CartContext";
import CartLine from "./CartLine";
import EmptyState from "../ui/EmptyState";

export default function CartDrawer() {
  const { isOpen, closeCart, items, count, subtotal, shipping, total } = useCart();

  useEffect(() => {
    if (!isOpen) return undefined;

    function onKeyDown(event) {
      if (event.key === "Escape") closeCart();
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const remaining = FREE_SHIPPING_FROM - subtotal;

  return (
    <>
      <div className="drawer-overlay" onClick={closeCart} aria-hidden="true" />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Shopping bag">
        <header className="drawer__head">
          <h3>
            Your bag{" "}
            {count > 0 ? <span className="badge badge-solid">{count}</span> : null}
          </h3>
          <button
            type="button"
            className="icon-btn"
            onClick={closeCart}
            aria-label="Close bag"
          >
            <Close size={20} />
          </button>
        </header>

        <div className="drawer__body">
          {items.length === 0 ? (
            <EmptyState
              icon={CartIcon}
              title="Your bag is empty"
              message="Discover something you love."
              action={
                <Link to="/shop" className="btn btn-gold btn-sm" onClick={closeCart}>
                  Browse the shop
                </Link>
              }
            />
          ) : (
            items.map((item) => <CartLine key={item.id} item={item} />)
          )}
        </div>

        {items.length > 0 ? (
          <footer className="drawer__foot">
            {shipping > 0 && remaining > 0 ? (
              <p className="dim" style={{ fontSize: "0.82rem" }}>
                Add {formatPrice(remaining)} more to unlock free shipping.
              </p>
            ) : (
              <span className="badge badge-success">Free shipping unlocked</span>
            )}

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

            <Link to="/checkout" className="btn btn-gold btn-block" onClick={closeCart}>
              Proceed to checkout
            </Link>
            <button
              type="button"
              className="btn btn-ghost btn-block btn-sm"
              onClick={closeCart}
            >
              Continue shopping
            </button>
          </footer>
        ) : null}
      </aside>
    </>
  );
}
