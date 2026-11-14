import { Link } from "react-router-dom";
import {
  ArrowRight,
  Refresh,
  Shield,
  Sparkles,
  Truck,
  categoryIcon,
} from "../lib/icons";
import { productService, categoryService } from "../services";
import useApi from "../hooks/useApi";
import ProductGrid from "../components/product/ProductGrid";
import Reveal from "../components/ui/Reveal";
import SectionHeading from "../components/ui/SectionHeading";

const RIBBON = [
  "Complimentary shipping over 500 MAD",
  "Authenticity guaranteed",
  "30-day returns",
  "Secure checkout",
  "New season arrivals",
];

const FEATURES = [
  { icon: Truck, title: "Complimentary delivery", text: "Free over 500 MAD" },
  { icon: Refresh, title: "30-day returns", text: "No questions asked" },
  { icon: Shield, title: "Secure checkout", text: "Encrypted end to end" },
  { icon: Sparkles, title: "Curated quality", text: "Hand-picked pieces" },
];

export default function Home() {
  const { data: featuredData, loading: featuredLoading } = useApi(
    () => productService.list({ featured: 1, per_page: 8 }),
    []
  );
  const { data: categoryData, loading: categoryLoading } = useApi(
    () => categoryService.list(),
    []
  );

  const featured = featuredData?.data?.items ?? [];
  const categories = categoryData?.data ?? [];
  const productCount = categories.reduce(
    (sum, category) => sum + (category.product_count || 0),
    0
  );

  const heroImages = featured.slice(0, 2);
  const promoImage = featured[1]?.image || featured[0]?.image || "";

  return (
    <div>
      {/* Hero ------------------------------------------------- */}
      <section className="container hero">
        <div className="hero__content">
          <span className="eyebrow anim-fade-down">The house of essentials</span>
          <h1 className="hero__title anim-fade-up">
            Luxury, <span className="text-gold">refined</span> for the everyday.
          </h1>
          <p className="hero__text anim-fade-up delay-1">
            Discover a curated collection of watches, audio, fashion and objects
            for the home — chosen for craftsmanship, made to be lived with.
          </p>
          <div className="hero__actions anim-fade-up delay-2">
            <Link to="/shop" className="btn btn-gold btn-lg">
              Explore the collection <ArrowRight size={18} />
            </Link>
            <Link to="/categories" className="btn btn-outline btn-lg">
              Browse categories
            </Link>
          </div>

          <div className="hero__stats anim-fade-up delay-3">
            <div className="hero__stat">
              <strong>{productCount || 18}</strong>
              <span>Curated pieces</span>
            </div>
            <div className="hero__stat">
              <strong>{categories.length || 6}</strong>
              <span>Categories</span>
            </div>
            <div className="hero__stat">
              <strong>4.7</strong>
              <span>Average rating</span>
            </div>
          </div>
        </div>

        <div className="hero__visual">
          {(heroImages.length ? heroImages : [null, null, null]).map(
            (product, index) => (
              <figure
                className={`hero__card anim-scale-in delay-${index + 1}`}
                key={product?.id ?? index}
              >
                {product ? (
                  <>
                    <img src={product.image} alt={product.title} />
                    <figcaption>
                      <span>{product.category?.name}</span>
                      <strong>{product.title}</strong>
                    </figcaption>
                  </>
                ) : (
                  <div className="skeleton" style={{ aspectRatio: "3 / 4" }} />
                )}
              </figure>
            )
          )}
        </div>
      </section>

      {/* Ribbon ----------------------------------------------- */}
      <div className="ribbon" aria-hidden="true">
        <div className="ribbon__track">
          {[...RIBBON, ...RIBBON].map((item, index) => (
            <span key={index}>{item}</span>
          ))}
        </div>
      </div>

      {/* Features --------------------------------------------- */}
      <section className="container section">
        <div className="feature-row">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Reveal className="feature" key={feature.title} delay={index * 70}>
                <span className="feature__icon">
                  <Icon size={22} />
                </span>
                <div>
                  <h4>{feature.title}</h4>
                  <p>{feature.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Featured products ------------------------------------ */}
      <section className="container section">
        <Reveal>
          <SectionHeading
            eyebrow="Signature selection"
            title="Featured pieces"
            text="A hand-picked edit of the pieces defining the season."
            action={
              <Link to="/shop" className="btn btn-outline btn-sm">
                View all <ArrowRight size={16} />
              </Link>
            }
          />
        </Reveal>
        <ProductGrid products={featured} loading={featuredLoading} />
      </section>

      {/* Promo band ------------------------------------------- */}
      <section className="container section">
        <Reveal className="promo">
          <div>
            <span className="eyebrow">The Obsidian collection</span>
            <h2 className="mt-2">
              Crafted in <span className="text-gold">titanium</span>, finished by
              hand.
            </h2>
            <p className="lead mt-4">
              Matte cases, midnight dials and movements that last a lifetime.
              Explore the pieces built for those who notice the details.
            </p>
            <Link to="/shop?sort=price_desc" className="btn btn-gold mt-6">
              Discover premium <ArrowRight size={18} />
            </Link>
          </div>
          <div className="promo__media">
            {promoImage ? (
              <img src={promoImage} alt="Featured collection" loading="lazy" />
            ) : (
              <div className="skeleton" style={{ aspectRatio: "4 / 3" }} />
            )}
          </div>
        </Reveal>
      </section>

      {/* Categories ------------------------------------------- */}
      <section className="container section">
        <Reveal>
          <SectionHeading
            eyebrow="Browse by"
            title="Shop the categories"
            action={
              <Link to="/categories" className="btn btn-outline btn-sm">
                All categories <ArrowRight size={16} />
              </Link>
            }
          />
        </Reveal>

        {categoryLoading ? (
          <div className="cat-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="skeleton" style={{ height: 190 }} />
            ))}
          </div>
        ) : (
          <div className="cat-grid">
            {categories.map((category, index) => {
              const Icon = categoryIcon(category.icon);
              return (
                <Reveal key={category.id} delay={index * 60}>
                  <Link to={`/category/${category.slug}`} className="category-card">
                    <span className="category-card__icon">
                      <Icon size={24} />
                    </span>
                    <span className="category-card__name">{category.name}</span>
                    <span className="category-card__count">
                      {category.product_count} pieces
                    </span>
                    <span className="category-card__arrow">
                      Shop now <ArrowRight size={15} />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
