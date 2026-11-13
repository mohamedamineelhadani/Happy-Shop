import { Link } from "react-router-dom";
import { ArrowRight, categoryIcon } from "../lib/icons";
import { categoryService } from "../services";
import useApi from "../hooks/useApi";
import Reveal from "../components/ui/Reveal";

export default function Categories() {
  const { data, loading, error } = useApi(() => categoryService.list(), []);
  const categories = data?.data ?? [];

  return (
    <div className="container section">
      <div className="page-head">
        <span className="eyebrow">Explore</span>
        <h1>All categories</h1>
        <p className="lead">
          Six worlds of carefully chosen objects — find yours.
        </p>
      </div>

      {error ? <p className="badge badge-danger">{error.message}</p> : null}

      {loading ? (
        <div className="cat-hero">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="skeleton" style={{ height: 220 }} />
          ))}
        </div>
      ) : (
        <div className="cat-hero">
          {categories.map((category, index) => {
            const Icon = categoryIcon(category.icon);
            return (
              <Reveal key={category.id} delay={index * 60}>
                <Link
                  to={`/category/${category.slug}`}
                  className="category-card"
                  style={{ minHeight: 220 }}
                >
                  <span className="category-card__icon">
                    <Icon size={26} />
                  </span>
                  <span className="category-card__name">{category.name}</span>
                  <span className="category-card__count">
                    {category.product_count} pieces
                  </span>
                  {category.description ? (
                    <p style={{ fontSize: "0.9rem" }}>{category.description}</p>
                  ) : null}
                  <span className="category-card__arrow">
                    Browse <ArrowRight size={15} />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
