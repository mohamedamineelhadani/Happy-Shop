import { Link } from "react-router-dom";
import { Cart, Heart } from "../../lib/icons";
import { discountPercent } from "../../lib/format";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import Rating from "../ui/Rating";
import Price from "../ui/Price";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const toast = useToast();

  const discount = discountPercent(product.price, product.old_price);
  const soldOut = product.stock <= 0;

  function handleAdd() {
    if (soldOut) return;
    addItem(product, 1);
    toast.success(`${product.title} added to your bag.`, "Added to bag");
  }

  return (
    <article className="product-card">
      <div className="product-card__media">
        <Link
          to={`/product/${product.slug}`}
          className="product-card__link"
          aria-label={product.title}
        >
          <img src={product.image} alt={product.title} loading="lazy" />
        </Link>

        <span className="product-card__badges">
          {discount ? <span className="badge badge-solid">−{discount}%</span> : null}
          {product.featured ? <span className="badge">Featured</span> : null}
          {soldOut ? <span className="badge badge-danger">Sold out</span> : null}
        </span>

        <button
          type="button"
          className="product-card__wish"
          aria-label="Save for later"
        >
          <Heart size={17} />
        </button>

        <div className="product-card__quick">
          <button
            type="button"
            className="btn btn-gold btn-sm btn-block"
            onClick={handleAdd}
            disabled={soldOut}
          >
            <Cart size={16} />
            {soldOut ? "Sold out" : "Add to bag"}
          </button>
        </div>
      </div>

      <div className="product-card__body">
        {product.category ? (
          <span className="product-card__cat">{product.category.name}</span>
        ) : null}

        <Link to={`/product/${product.slug}`} className="product-card__title">
          {product.title}
        </Link>

        <Rating value={product.rating} count={product.review_count} />

        <div className="product-card__foot">
          <Price value={product.price} oldValue={product.old_price} size="sm" />
        </div>
      </div>
    </article>
  );
}
