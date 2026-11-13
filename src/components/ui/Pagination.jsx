import { ChevronLeft, ChevronRight } from "../../lib/icons";

export default function Pagination({ page, pages, onChange }) {
  if (!pages || pages <= 1) return null;

  const numbers = [];
  for (let index = 1; index <= pages; index += 1) {
    const isEdge = index === 1 || index === pages;
    const isNear = Math.abs(index - page) <= 1;
    if (isEdge || isNear) {
      numbers.push(index);
    } else if (numbers[numbers.length - 1] !== "gap") {
      numbers.push("gap");
    }
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>

      {numbers.map((item, index) =>
        item === "gap" ? (
          <span key={`gap-${index}`} className="dim" style={{ padding: "0 0.3rem" }}>
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={item === page ? "is-active" : undefined}
            onClick={() => onChange(item)}
            aria-current={item === page ? "page" : undefined}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= pages}
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}
