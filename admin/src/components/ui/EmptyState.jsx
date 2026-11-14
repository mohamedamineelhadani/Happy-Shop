export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="empty">
      {Icon ? (
        <span className="empty__icon">
          <Icon size={26} />
        </span>
      ) : null}
      <h3>{title}</h3>
      {message ? <p>{message}</p> : null}
      {action ? <div className="empty__action">{action}</div> : null}
    </div>
  );
}
