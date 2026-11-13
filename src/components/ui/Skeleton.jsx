import { cn } from "../../lib/format";

export function SkeletonLine({ width = "100%", className }) {
  return (
    <div className={cn("skeleton skeleton-line", className)} style={{ width }} />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-media" />
      <div className="skeleton-body">
        <SkeletonLine width="38%" />
        <SkeletonLine width="86%" />
        <SkeletonLine width="58%" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
