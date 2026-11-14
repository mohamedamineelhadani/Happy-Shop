import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { categoryService, productService } from "../services";
import { useToast } from "../context/ToastContext";
import { ChevronLeft } from "../lib/icons";
import Loading from "../components/ui/Loading";
import ProductForm from "../components/product/ProductForm";

export default function ProductEdit() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [categoryResponse, productResponse] = await Promise.all([
          categoryService.list(),
          isNew ? Promise.resolve(null) : productService.get(id),
        ]);
        if (!active) return;
        setCategories(categoryResponse.data ?? []);
        if (productResponse) setProduct(productResponse.data);
      } catch (error) {
        if (active) toast.error(error.message, "Could not load product");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isNew]);

  async function handleSubmit(payload) {
    setSaving(true);
    setErrors(null);
    try {
      if (isNew) {
        await productService.create(payload);
        toast.success("Product created.", "Saved");
      } else {
        await productService.update(id, payload);
        toast.success("Product updated.", "Saved");
      }
      navigate("/products");
    } catch (error) {
      setErrors(error.errors);
      toast.error(error.message, "Could not save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loading label="Loading product…" />;

  return (
    <div className="stack">
      <Link to="/products" className="back-link">
        <ChevronLeft size={17} />
        Back to products
      </Link>

      <section className="panel">
        <header className="panel__head">
          <h2>{isNew ? "New product" : `Edit “${product?.title ?? ""}”`}</h2>
        </header>
        <ProductForm
          product={product}
          categories={categories}
          submitting={saving}
          errors={errors}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/products")}
        />
      </section>
    </div>
  );
}
