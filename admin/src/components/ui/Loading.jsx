import { Spinner } from "../../lib/icons";

export default function Loading({ label = "Loading…", inline = false }) {
  if (inline) {
    return (
      <span className="loading-inline">
        <Spinner size={16} /> {label}
      </span>
    );
  }

  return (
    <div className="loading-block">
      <Spinner size={26} />
      <span>{label}</span>
    </div>
  );
}
