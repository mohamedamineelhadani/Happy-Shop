import { Link } from "react-router-dom";
import { Heart } from "../lib/icons";
import { useWishlist } from "../context/WishlistContext";
import ProductGrid from "../components/product/ProductGrid";
import EmptyState from "../components/ui/EmptyState";

export default function Favorites() {
  const { items, count, clear } = useWishlist();

  return (
    <div className="container section">
      <div className="page-head">
        <span className="eyebrow">Saved for later</span>
        <h1>Your favourites</h1>
        <p className="lead">
          {count > 0
            ? `${count} piece${count === 1 ? "" : "s"} you've saved.`
            : "Pieces you love, kept in one place."}
        </p>
      </div>

      {count === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favourites yet"
          message="Tap the heart on any product to save it here."
          action={
            <Link to="/shop" className="btn btn-gold btn-sm">
              Browse the shop
            </Link>
          }
        />
      ) : (
        <>
          <div className="results-bar">
            <span className="dim">
              {count} saved piece{count === 1 ? "" : "s"}
            </span>
            <button type="button" className="btn btn-ghost btn-sm" onClick={clear}>
              Clear all
            </button>
          </div>

          <ProductGrid products={items} />
        </>
      )}
    </div>
  );
}
