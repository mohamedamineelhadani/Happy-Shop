import { cn } from "../../lib/format";

export default function SectionHeading({
  eyebrow,
  title,
  text,
  action,
  align = "left",
  className,
}) {
  return (
    <div
      className={cn("section-head", className)}
      style={align === "center" ? { justifyContent: "center", textAlign: "center" } : undefined}
    >
      <div style={align === "center" ? { display: "flex", flexDirection: "column", alignItems: "center" } : undefined}>
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        {title ? <h2 className="mt-2">{title}</h2> : null}
        {text ? <p className="lead">{text}</p> : null}
      </div>
      {action}
    </div>
  );
}
