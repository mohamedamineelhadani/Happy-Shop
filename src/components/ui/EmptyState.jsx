import { Search } from "../../lib/icons";

export default function EmptyState({
  icon: Icon = Search,
  title = "Nothing here yet",
  message,
  action,
}) {
  return (
    <div className="empty-state anim-fade-in">
      <span className="empty-state__icon">
        <Icon size={30} />
      </span>
      <h3>{title}</h3>
      {message ? <p className="muted">{message}</p> : null}
      {action}
    </div>
  );
}
