import { useState } from "react";
import { contactService } from "../services";
import useApi from "../hooks/useApi";
import { useToast } from "../context/ToastContext";
import { formatDate } from "../lib/format";
import { Check, Mail, Trash } from "../lib/icons";
import Loading from "../components/ui/Loading";
import EmptyState from "../components/ui/EmptyState";
import ConfirmDialog from "../components/ui/ConfirmDialog";

export default function Messages() {
  const toast = useToast();
  const { data, loading, error, refetch } = useApi(() => contactService.list(), []);
  const [pendingDelete, setPendingDelete] = useState(null);

  const messages = data?.data ?? [];

  async function markRead(message) {
    try {
      await contactService.markRead(message.id);
      toast.success("Marked as read.", "Updated");
      refetch();
    } catch (err) {
      toast.error(err.message, "Could not update");
    }
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    try {
      await contactService.remove(pendingDelete.id);
      toast.success("Message deleted.", "Deleted");
      refetch();
    } catch (err) {
      toast.error(err.message, "Could not delete");
    }
  }

  return (
    <div className="stack">
      <section className="panel">
        {loading ? (
          <Loading label="Loading messages…" />
        ) : error ? (
          <div className="alert alert--error">{error.message}</div>
        ) : messages.length === 0 ? (
          <EmptyState icon={Mail} title="No messages yet" message="Contact form submissions will appear here." />
        ) : (
          <ul className="messages">
            {messages.map((message) => (
              <li key={message.id} className={`message${message.is_read ? "" : " is-unread"}`}>
                <div className="message__head">
                  <div>
                    <strong>{message.subject || "(No subject)"}</strong>
                    <span className="dim">
                      {message.full_name} · {message.email}
                      {message.phone ? ` · ${message.phone}` : ""}
                    </span>
                  </div>
                  <div className="row-actions">
                    <span className="dim message__date">{formatDate(message.created_at)}</span>
                    {!message.is_read ? (
                      <button
                        type="button"
                        className="icon-btn"
                        onClick={() => markRead(message)}
                        title="Mark as read"
                        aria-label="Mark as read"
                      >
                        <Check size={17} />
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="icon-btn icon-btn--danger"
                      onClick={() => setPendingDelete(message)}
                      title="Delete"
                      aria-label="Delete message"
                    >
                      <Trash size={17} />
                    </button>
                  </div>
                </div>
                <p className="message__body">{message.message}</p>
                <a className="link" href={`mailto:${message.email}`}>
                  Reply by email
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete message"
        message={`Delete the message from “${pendingDelete?.full_name}”? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
}
