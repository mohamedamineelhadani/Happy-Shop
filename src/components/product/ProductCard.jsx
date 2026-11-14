import { Link } from "react-router-dom";
import { Cart, Heart } from "../../lib/icons";
import { discountPercent } from "../../lib/format";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useToast } from "../../context/ToastContext";
import Rating from "../ui/Rating";
import Price from "../ui/Price";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const toast = useToast();

  const discount = discountPercent(product.price, product.old_price);
  const soldOut = product.stock <= 0;
  const saved = has(product.id);

  function handleAdd() {
    if (soldOut) return;
    addItem(product, 1);
    toast.success(`${product.title} added to your bag.`, "Added to bag");
  }

  function handleWish() {
    const added = toggle(product);
    if (added) {
      toast.success(`${product.title} saved to your favourites.`, "Saved");
    } else {
      toast.info(`${product.title} removed from your favourites.`, "Removed");
    }
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
          className={`product-card__wish${saved ? " is-active" : ""}`}
          aria-label={saved ? "Remove from favourites" : "Save for later"}
          aria-pressed={saved}
          onClick={handleWish}
        >
          <Heart size={17} fill={saved ? "currentColor" : "none"} />
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
