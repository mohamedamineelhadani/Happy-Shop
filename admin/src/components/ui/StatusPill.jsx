import { titleCase } from "../../lib/format";

export default function StatusPill({ status }) {
  return <span className={`pill pill--${status}`}>{titleCase(status)}</span>;
}
