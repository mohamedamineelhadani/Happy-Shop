import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { categoryService, productService } from "../services";
import useApi from "../hooks/useApi";
import { useToast } from "../context/ToastContext";
import { formatAmount, titleCase } from "../lib/format";
import { Edit, Package, Plus, Search, Trash } from "../lib/icons";
import Loading from "../components/ui/Loading";
import EmptyState from "../components/ui/EmptyState";
import StatusPill from "../components/ui/StatusPill";
import ConfirmDialog from "../components/ui/ConfirmDialog";

export default function Products() {
  const navigate = useNavigate();
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [query, setQuery] = useState({ search: "", categoryId: "" });
  const [pendingDelete, setPendingDelete] = useState(null);

  const categories = useApi(() => categoryService.list(), []);
  const { data, loading, error, refetch } = useApi(
    () =>
      productService.list({
        search: query.search || undefined,
        category_id: query.categoryId || undefined,
      }),
    [query]
  );

  const products = useMemo(() => data?.data ?? [], [data]);

  function applyFilters(event) {
    event.preventDefault();
    setQuery({ search: search.trim(), categoryId });
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    try {
      await productService.remove(pendingDelete.id);
      toast.success(`“${pendingDelete.title}” was deleted.`, "Product deleted");
      refetch();
    } catch (err) {
      toast.error(err.message, "Could not delete");
    }
  }

  return (
    <div className="stack">
      <div className="toolbar">
        <form className="toolbar__filters" onSubmit={applyFilters}>
          <div className="search">
            <Search size={17} />
            <input
              className="input"
              placeholder="Search products…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <select
            className="input"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
          >
            <option value="">All categories</option>
            {(categories.data?.data ?? []).map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <button type="submit" className="btn btn-ghost">
            Filter
          </button>
        </form>

        <button type="button" className="btn btn-gold" onClick={() => navigate("/products/new")}>
          <Plus size={17} />
          New product
        </button>
      </div>

      <section className="panel">
        {loading ? (
          <Loading label="Loading products…" />
        ) : error ? (
          <div className="alert alert--error">{error.message}</div>
        ) : products.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No products found"
            message="Try a different search, or add your first product."
            action={
              <button type="button" className="btn btn-gold" onClick={() => navigate("/products/new")}>
                <Plus size={17} />
                New product
              </button>
            }
          />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th className="ta-right">Price</th>
                  <th className="ta-right">Stock</th>
                  <th>Status</th>
                  <th className="ta-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="cell-product">
                        <img src={product.image} alt="" className="cell-product__thumb" />
                        <div>
                          <Link to={`/products/${product.id}/edit`} className="cell-product__title">
                            {product.title}
                          </Link>
                          {product.featured ? (
                            <span className="tag tag--gold">Featured</span>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="dim">{product.category?.name ?? "—"}</td>
                    <td className="ta-right">{formatAmount(product.price)}</td>
                    <td className="ta-right">
                      <span
                        className={
                          product.stock <= 0
                            ? "text-danger"
                            : product.stock <= 5
                              ? "text-warning"
                              : ""
                        }
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td>
                      <StatusPill status={product.status} />
                    </td>
                    <td className="ta-right">
                      <div className="row-actions">
                        <Link
                          to={`/products/${product.id}/edit`}
                          className="icon-btn"
                          aria-label={`Edit ${product.title}`}
                          title="Edit"
                        >
                          <Edit size={17} />
                        </Link>
                        <button
                          type="button"
                          className="icon-btn icon-btn--danger"
                          onClick={() => setPendingDelete(product)}
                          aria-label={`Delete ${product.title}`}
                          title="Delete"
                        >
                          <Trash size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && products.length > 0 ? (
          <p className="table-foot dim">
            {products.length} product{products.length === 1 ? "" : "s"}
          </p>
        ) : null}
      </section>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete product"
        message={`Delete “${pendingDelete?.title}”? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onClose={() => setPendingDelete(null)}
      />

      <p className="dim" style={{ fontSize: "0.8rem" }}>
        Tip: product status controls storefront visibility — {titleCase("active")} is live,{" "}
        {titleCase("draft")} and {titleCase("archived")} are hidden.
      </p>
    </div>
  );
}
