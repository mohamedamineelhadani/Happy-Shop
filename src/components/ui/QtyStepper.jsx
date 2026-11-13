import { Minus, Plus } from "../../lib/icons";

export default function QtyStepper({
  value,
  min = 1,
  max = 99,
  onChange,
  label = "quantity",
}) {
  return (
    <div className="qty" role="group" aria-label={`Adjust ${label}`}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`Decrease ${label}`}
      >
        <Minus size={16} />
      </button>
      <span aria-live="polite">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`Increase ${label}`}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
