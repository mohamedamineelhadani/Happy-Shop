import { Link, useParams, useSearchParams } from "react-router-dom";
import { categoryIcon } from "../lib/icons";
import { categoryService } from "../services";
import useApi from "../hooks/useApi";
import ProductGrid from "../components/product/ProductGrid";
import Pagination from "../components/ui/Pagination";

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];

export default function CategoryDetail() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const sort = searchParams.get("sort") || "newest";
  const page = Number(searchParams.get("page") || 1);

  const { data, loading, error } = useApi(
    () => categoryService.get(slug),
    [slug, sort, page]
  );

  const category = data?.data;
  const products = category?.products ?? [];
  const meta = category?.meta ?? { page: 1, pages: 0, total: 0 };

  function updateParams(patch, keepPage = false) {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) => next.set(key, String(value)));
    if (!keepPage) next.delete("page");
    setSearchParams(next);
  }

  if (error) {
    return (
      <div className="container section">
        <div className="empty-state">
          <h3>Category not found</h3>
          <p className="muted">{error.message}</p>
          <Link to="/categories" className="btn btn-gold btn-sm">
            Back to categories
          </Link>
        </div>
      </div>
    );
  }

  const Icon = category ? categoryIcon(category.icon) : null;

  return (
    <div className="container section">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="sep">/</span>
        <Link to="/categories">Categories</Link>
        <span className="sep">/</span>
        <span>{category?.name ?? "…"}</span>
      </nav>

      <div className="page-head" style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
        {Icon ? (
          <span className="category-card__icon" style={{ marginBottom: 0 }}>
            <Icon size={26} />
          </span>
        ) : null}
        <div>
          <span className="eyebrow">Category</span>
          <h1 style={{ marginTop: "0.5rem" }}>{category?.name ?? "Loading…"}</h1>
          {category?.description ? <p className="lead">{category.description}</p> : null}
        </div>
      </div>

      <div className="results-bar">
        <span className="dim">{meta.total} pieces</span>
        <div className="field" style={{ minWidth: 220 }}>
          <select
            className="select"
            aria-label="Sort products"
            value={sort}
            onChange={(event) => updateParams({ sort: event.target.value })}
          >
            {SORTS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ProductGrid products={products} loading={loading} />

      <Pagination
        page={meta.page}
        pages={meta.pages}
        onChange={(nextPage) => updateParams({ page: nextPage }, true)}
      />
    </div>
  );
}
