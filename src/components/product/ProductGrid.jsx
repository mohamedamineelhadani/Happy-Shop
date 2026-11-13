import ProductCard from "./ProductCard";
import { ProductGridSkeleton } from "../ui/Skeleton";
import EmptyState from "../ui/EmptyState";
import { Package } from "../../lib/icons";

export default function ProductGrid({ products, loading, emptyAction, emptyTitle }) {
  if (loading) {
    return <ProductGridSkeleton />;
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title={emptyTitle || "No products found"}
        message="Try a different search term, category or price range."
        action={emptyAction}
      />
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
