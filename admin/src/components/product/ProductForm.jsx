import { useState } from "react";
import Field from "../ui/Field";
import ImageUploader from "../ui/ImageUploader";
import Loading from "../ui/Loading";
import { PRODUCT_STATUSES, titleCase } from "../../lib/format";

function blank() {
  return {
    title: "",
    price: "",
    old_price: "",
    category_id: "",
    stock: "0",
    status: "active",
    featured: false,
    description: "",
    image: "",
  };
}

function fromProduct(product) {
  if (!product) return blank();
  return {
    title: product.title ?? "",
    price: product.price ?? "",
    old_price: product.old_price ?? "",
    category_id: product.category?.id ?? "",
    stock: product.stock ?? 0,
    status: product.status ?? "active",
    featured: Boolean(product.featured),
    description: product.description ?? "",
    image: product.image ?? "",
  };
}

export default function ProductForm({ product, categories, submitting, errors, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => fromProduct(product));

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({
      title: form.title.trim(),
      price: form.price === "" ? 0 : Number(form.price),
      old_price: form.old_price === "" ? null : Number(form.old_price),
      category_id: form.category_id === "" ? null : Number(form.category_id),
      stock: Number(form.stock || 0),
      status: form.status,
      featured: form.featured ? 1 : 0,
      description: form.description.trim(),
      image: form.image.trim() || null,
    });
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form__grid">
        <div className="form__col">
          <Field label="Title" htmlFor="p-title" error={errors?.title}>
            <input
              id="p-title"
              className="input"
              value={form.title}
              onChange={(event) => set("title", event.target.value)}
              placeholder="Leather Weekender Bag"
              required
            />
          </Field>

          <div className="form__row">
            <Field label="Price (MAD)" htmlFor="p-price" error={errors?.price}>
              <input
                id="p-price"
                type="number"
                min="0"
                step="0.01"
                className="input"
                value={form.price}
                onChange={(event) => set("price", event.target.value)}
                required
              />
            </Field>
            <Field
              label="Compare-at price"
              htmlFor="p-old-price"
              hint="Optional — shows a discount badge."
            >
              <input
                id="p-old-price"
                type="number"
                min="0"
                step="0.01"
                className="input"
                value={form.old_price}
                onChange={(event) => set("old_price", event.target.value)}
              />
            </Field>
          </div>

          <div className="form__row">
            <Field label="Category" htmlFor="p-category">
              <select
                id="p-category"
                className="input"
                value={form.category_id}
                onChange={(event) => set("category_id", event.target.value)}
              >
                <option value="">Uncategorised</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Stock" htmlFor="p-stock">
              <input
                id="p-stock"
                type="number"
                min="0"
                className="input"
                value={form.stock}
                onChange={(event) => set("stock", event.target.value)}
              />
            </Field>
          </div>

          <div className="form__row">
            <Field label="Status" htmlFor="p-status">
              <select
                id="p-status"
                className="input"
                value={form.status}
                onChange={(event) => set("status", event.target.value)}
              >
                {PRODUCT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {titleCase(status)}
                  </option>
                ))}
              </select>
            </Field>
            <label className="switch-field">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) => set("featured", event.target.checked)}
              />
              <span className="switch" aria-hidden="true" />
              <span>Featured on the home page</span>
            </label>
          </div>

          <Field label="Description" htmlFor="p-desc" error={errors?.description}>
            <textarea
              id="p-desc"
              className="input textarea"
              rows={6}
              value={form.description}
              onChange={(event) => set("description", event.target.value)}
              placeholder="Tell the story of this piece…"
              required
            />
          </Field>
        </div>

        <div className="form__col">
          <ImageUploader value={form.image} onChange={(url) => set("image", url)} />
        </div>
      </div>

      <div className="form__actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="btn btn-gold" disabled={submitting}>
          {submitting ? <Loading label="Saving…" inline /> : product ? "Save changes" : "Create product"}
        </button>
      </div>
    </form>
  );
}
