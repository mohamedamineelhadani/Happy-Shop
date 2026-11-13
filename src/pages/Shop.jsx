import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, Search } from "../lib/icons";
import { productService, categoryService } from "../services";
import useApi from "../hooks/useApi";
import ProductGrid from "../components/product/ProductGrid";
import Pagination from "../components/ui/Pagination";

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
  { value: "title", label: "A – Z" },
];

const PRICE_RANGES = [
  { value: "", label: "Any price" },
  { value: "0-300", label: "Under 300" },
  { value: "300-800", label: "300 – 800" },
  { value: "800-2000", label: "800 – 2,000" },
  { value: "2000-", label: "2,000+" },
];

const PER_PAGE = 9;

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "newest";
  const range = searchParams.get("range") || "";
  const page = Number(searchParams.get("page") || 1);

  const [min, max] = range.split("-");
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const { data, loading, error } = useApi(
    () =>
      productService.list({
        category,
        search,
        sort,
        min: min || undefined,
        max: max || undefined,
        page,
        per_page: PER_PAGE,
      }),
    [category, search, sort, min, max, page]
  );

  const { data: categoryData } = useApi(() => categoryService.list(), []);

  const products = data?.data?.items ?? [];
  const meta = data?.data?.meta ?? { total: 0, page: 1, pages: 0 };
  const categories = categoryData?.data ?? [];

  function updateParams(patch, { keepPage = false } = {}) {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) => {
      if (value === "" || value == null) next.delete(key);
      else next.set(key, String(value));
    });
    if (!keepPage) next.delete("page");
    setSearchParams(next);
  }

  function submitSearch(event) {
    event.preventDefault();
    updateParams({ search: searchInput.trim() });
  }

  return (
    <div className="container section">
      <div className="page-head" style={{ borderBottom: "none", paddingBottom: 0 }}>
        <span className="eyebrow">The collection</span>
        <h1>Shop all products</h1>
        <p className="lead">
          {meta.total} pieces across {categories.length || "several"} categories.
        </p>
      </div>

      <div className="shop-layout">
        <aside className="sidebar">
          <div className="sidebar__group">
            <h4>Categories</h4>
            <div className="sidebar__list">
              <button
                type="button"
                className={!category ? "is-active" : undefined}
                onClick={() => updateParams({ category: "" })}
              >
                All products <span>{meta.total}</span>
              </button>
              {categories.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={category === item.slug ? "is-active" : undefined}
                  onClick={() => updateParams({ category: item.slug })}
                >
                  {item.name} <span>{item.product_count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar__group">
            <h4>Price</h4>
            <div className="sidebar__list">
              {PRICE_RANGES.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={range === option.value ? "is-active" : undefined}
                  onClick={() => updateParams({ range: option.value })}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div>
          <form className="filters" onSubmit={submitSearch}>
            <div className="search-field">
              <Search size={18} />
              <input
                type="search"
                className="input"
                placeholder="Search products…"
                aria-label="Search products"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="sort">Sort by</label>
              <select
                id="sort"
                className="select"
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

            <div className="field">
              <label htmlFor="range">Price range</label>
              <select
                id="range"
                className="select"
                value={range}
                onChange={(event) => updateParams({ range: event.target.value })}
              >
                {PRICE_RANGES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-gold">
              <Filter size={16} /> Apply
            </button>
          </form>

          <div className="results-bar mt-6">
            <span className="dim">
              Showing {products.length} of {meta.total} results
            </span>
            {(category || search || range || sort !== "newest") && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setSearchParams(new URLSearchParams())}
              >
                Clear filters
              </button>
            )}
          </div>

          {error ? (
            <p className="badge badge-danger">{error.message}</p>
          ) : (
            <ProductGrid
              products={products}
              loading={loading}
              emptyTitle="No products match your filters"
            />
          )}

          <Pagination
            page={meta.page}
            pages={meta.pages}
            onChange={(nextPage) => updateParams({ page: nextPage }, { keepPage: true })}
          />
        </div>
      </div>
    </div>
  );
}
