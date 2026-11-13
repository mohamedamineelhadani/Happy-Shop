import { titleCase } from "../../lib/format";

export default function StatusPill({ status }) {
  return (
    <span className={`status-pill status--${status}`}>{titleCase(status)}</span>
  );
}
