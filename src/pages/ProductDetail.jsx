import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Cart,
  Check,
  Heart,
  Refresh,
  Shield,
  Sparkles,
  Star,
  Truck,
} from "../lib/icons";
import { formatDate } from "../lib/format";
import { productService } from "../services";
import useApi from "../hooks/useApi";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import Rating from "../components/ui/Rating";
import Price from "../components/ui/Price";
import QtyStepper from "../components/ui/QtyStepper";
import ProductGrid from "../components/product/ProductGrid";
import SectionHeading from "../components/ui/SectionHeading";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const toast = useToast();

  const { data, loading, error, refetch } = useApi(
    () => productService.get(slug),
    [slug]
  );

  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState("description");
  const [review, setReview] = useState({ author: "", rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  const product = data?.data;

  if (loading) {
    return (
      <div className="container section">
        <div className="pdp">
          <div className="skeleton" style={{ aspectRatio: "1 / 1", borderRadius: 24 }} />
          <div className="stack">
            <div className="skeleton skeleton-line" style={{ width: "40%", height: 14 }} />
            <div className="skeleton skeleton-line" style={{ width: "80%", height: 34 }} />
            <div className="skeleton skeleton-line" style={{ width: "30%", height: 26 }} />
            <div className="skeleton" style={{ height: 160, borderRadius: 16 }} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container section">
        <div className="empty-state">
          <h3>Product not found</h3>
          <p className="muted">{error?.message || "This product is unavailable."}</p>
          <Link to="/shop" className="btn btn-gold btn-sm">
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  const soldOut = product.stock <= 0;
  const saved = has(product.id);

  function handleAdd(goToCheckout = false) {
    if (soldOut) return;
    addItem(product, quantity);
    if (goToCheckout) {
      navigate("/checkout");
    } else {
      toast.success(`${quantity} × ${product.title} added to your bag.`, "Added");
    }
  }

  function handleWish() {
    const added = toggle(product);
    if (added) {
      toast.success(`${product.title} saved to your favourites.`, "Saved");
    } else {
      toast.info(`${product.title} removed from your favourites.`, "Removed");
    }
  }

  async function handleReviewSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await productService.addReview(slug, {
        author: review.author.trim(),
        rating: review.rating,
        comment: review.comment.trim(),
      });
      toast.success("Thank you — your review is now live.", "Review published");
      setReview({ author: "", rating: 5, comment: "" });
      refetch();
    } catch (err) {
      toast.error(err.message, "Could not publish review");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container section">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="sep">/</span>
        <Link to="/shop">Shop</Link>
        {product.category ? (
          <>
            <span className="sep">/</span>
            <Link to={`/category/${product.category.slug}`}>
              {product.category.name}
            </Link>
          </>
        ) : null}
        <span className="sep">/</span>
        <span>{product.title}</span>
      </nav>

      <div className="pdp mt-4">
        <div className="gallery">
          <div className="gallery__main">
            <img src={product.image} alt={product.title} />
          </div>
        </div>

        <div className="pdp__info">
          {product.category ? (
            <Link
              to={`/category/${product.category.slug}`}
              className="product-card__cat"
            >
              {product.category.name}
            </Link>
          ) : null}

          <h1 className="pdp__title">{product.title}</h1>

          <div className="flex items-center gap-4">
            <Rating value={product.rating} count={product.review_count} />
            {soldOut ? (
              <span className="badge badge-danger">Sold out</span>
            ) : (
              <span className="badge badge-success">
                <Check size={13} /> In stock — {product.stock} left
              </span>
            )}
          </div>

          <div className="pdp__price">
            <Price value={product.price} oldValue={product.old_price} size="lg" />
          </div>

          <p className="pdp__desc">{product.description}</p>

          <dl className="pdp__meta">
            <div>
              <dt>Category</dt>
              <dd>{product.category?.name || "Uncategorised"}</dd>
            </div>
            <div>
              <dt>Availability</dt>
              <dd>{soldOut ? "Out of stock" : `${product.stock} in stock`}</dd>
            </div>
            <div>
              <dt>Reference</dt>
              <dd>HS-{String(product.id).padStart(4, "0")}</dd>
            </div>
            <div>
              <dt>Reviews</dt>
              <dd>{product.review_count} reviews</dd>
            </div>
          </dl>

          <div className="pdp__buy">
            <QtyStepper
              value={quantity}
              max={Math.max(1, product.stock)}
              onChange={setQuantity}
            />
            <button
              type="button"
              className="btn btn-gold btn-lg"
              onClick={() => handleAdd(false)}
              disabled={soldOut}
            >
              <Cart size={18} /> Add to bag
            </button>
            <button
              type="button"
              className="btn btn-outline btn-lg"
              onClick={() => handleAdd(true)}
              disabled={soldOut}
            >
              Buy now
            </button>
            <button
              type="button"
              className={`btn btn-outline btn-icon${saved ? " is-saved" : ""}`}
              onClick={handleWish}
              aria-label={saved ? "Remove from favourites" : "Save to favourites"}
              aria-pressed={saved}
            >
              <Heart size={20} fill={saved ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="pdp__assurances">
            <span>
              <Truck size={17} /> Free shipping over 500 MAD
            </span>
            <span>
              <Refresh size={17} /> 30-day returns
            </span>
            <span>
              <Shield size={17} /> Secure checkout
            </span>
            <span>
              <Sparkles size={17} /> Authenticity guaranteed
            </span>
          </div>
        </div>
      </div>

      {/* Tabs ------------------------------------------------- */}
      <div className="section">
        <div className="tabs">
          <button
            type="button"
            className={tab === "description" ? "is-active" : undefined}
            onClick={() => setTab("description")}
          >
            Description
          </button>
          <button
            type="button"
            className={tab === "reviews" ? "is-active" : undefined}
            onClick={() => setTab("reviews")}
          >
            Reviews ({product.reviews?.length ?? 0})
          </button>
        </div>

        {tab === "description" ? (
          <div className="container-narrow" style={{ paddingInline: 0 }}>
            <p className="pdp__desc">{product.description}</p>
            <ul className="stack mt-4">
              <li className="muted">• Ships within 24 hours from Casablanca.</li>
              <li className="muted">• Presented in signature HappyShop packaging.</li>
              <li className="muted">• Backed by our two-year quality guarantee.</li>
            </ul>
          </div>
        ) : (
          <div>
            {product.reviews?.length ? (
              <div className="grid" style={{ gridTemplateColumns: "1fr" }}>
                {product.reviews.map((item) => (
                  <div className="review" key={item.id}>
                    <div className="review__head">
                      <span className="review__author">{item.author}</span>
                      <Rating value={item.rating} showValue={false} />
                    </div>
                    {item.comment ? <p>{item.comment}</p> : null}
                    <span className="review__date">{formatDate(item.created_at)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted">No reviews yet — be the first to share your thoughts.</p>
            )}

            <form className="review-form" onSubmit={handleReviewSubmit}>
              <h3>Write a review</h3>

              <div className="field">
                <label htmlFor="author">Your name</label>
                <input
                  id="author"
                  className="input"
                  required
                  maxLength={150}
                  value={review.author}
                  onChange={(event) =>
                    setReview({ ...review, author: event.target.value })
                  }
                />
              </div>

              <div className="field">
                <label>Rating</label>
                <div className="star-picker">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={value <= review.rating ? "is-on" : undefined}
                      onClick={() => setReview({ ...review, rating: value })}
                      aria-label={`${value} star${value > 1 ? "s" : ""}`}
                    >
                      <Star size={26} filled={value <= review.rating} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="field">
                <label htmlFor="comment">Comment</label>
                <textarea
                  id="comment"
                  className="textarea"
                  maxLength={600}
                  value={review.comment}
                  onChange={(event) =>
                    setReview({ ...review, comment: event.target.value })
                  }
                />
              </div>

              <button type="submit" className="btn btn-gold" disabled={submitting}>
                {submitting ? "Publishing…" : "Publish review"}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Related --------------------------------------------- */}
      {product.related?.length ? (
        <section className="section">
          <SectionHeading eyebrow="You may also like" title="Related pieces" />
          <ProductGrid products={product.related} />
        </section>
      ) : null}
    </div>
  );
}
