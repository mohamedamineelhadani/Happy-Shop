import { Link } from "react-router-dom";
import { Trash } from "../../lib/icons";
import { formatPrice } from "../../lib/format";
import { useCart } from "../../context/CartContext";
import QtyStepper from "../ui/QtyStepper";

export default function CartLine({ item }) {
  const { setQuantity, removeItem } = useCart();

  return (
    <div className="cart-line">
      <Link to={`/product/${item.slug}`} className="cart-line__img">
        <img src={item.image} alt={item.title} />
      </Link>

      <div className="cart-line__info">
        <Link to={`/product/${item.slug}`} className="cart-line__title">
          {item.title}
        </Link>
        <span className="cart-line__price">{formatPrice(item.price)} each</span>
        <QtyStepper
          value={item.quantity}
          max={item.stock}
          onChange={(value) => setQuantity(item.id, value)}
          label={item.title}
        />
      </div>

      <div className="cart-line__right">
        <span className="cart-line__total">
          {formatPrice(item.price * item.quantity)}
        </span>
        <button
          type="button"
          className="link-danger"
          onClick={() => removeItem(item.id)}
        >
          <Trash size={14} /> Remove
        </button>
      </div>
    </div>
  );
}
