import { useState } from "react";
import { subscriberService } from "../services";
import useApi from "../hooks/useApi";
import { useToast } from "../context/ToastContext";
import { formatDate } from "../lib/format";
import { Trash, Users } from "../lib/icons";
import Loading from "../components/ui/Loading";
import EmptyState from "../components/ui/EmptyState";
import ConfirmDialog from "../components/ui/ConfirmDialog";

export default function Subscribers() {
  const toast = useToast();
  const { data, loading, error, refetch } = useApi(() => subscriberService.list(), []);
  const [pendingDelete, setPendingDelete] = useState(null);

  const subscribers = data?.data ?? [];
  const activeCount = subscribers.filter((subscriber) => subscriber.is_active).length;

  async function handleDelete() {
    if (!pendingDelete) return;
    try {
      await subscriberService.remove(pendingDelete.id);
      toast.success("Subscriber removed.", "Deleted");
      refetch();
    } catch (err) {
      toast.error(err.message, "Could not delete");
    }
  }

  return (
    <div className="stack">
      <div className="toolbar">
        <span className="dim">
          {subscribers.length} total · {activeCount} active
        </span>
      </div>

      <section className="panel">
        {loading ? (
          <Loading label="Loading subscribers…" />
        ) : error ? (
          <div className="alert alert--error">{error.message}</div>
        ) : subscribers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No subscribers yet"
            message="Newsletter sign-ups from the storefront footer will appear here."
          />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Status</th>
                  <th className="ta-right">Joined</th>
                  <th className="ta-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.id}>
                    <td>{subscriber.email}</td>
                    <td>
                      <span className={`pill pill--${subscriber.is_active ? "active" : "archived"}`}>
                        {subscriber.is_active ? "Active" : "Unsubscribed"}
                      </span>
                    </td>
                    <td className="ta-right dim">{formatDate(subscriber.created_at)}</td>
                    <td className="ta-right">
                      <button
                        type="button"
                        className="icon-btn icon-btn--danger"
                        onClick={() => setPendingDelete(subscriber)}
                        aria-label={`Remove ${subscriber.email}`}
                        title="Remove"
                      >
                        <Trash size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Remove subscriber"
        message={`Remove “${pendingDelete?.email}” from the list?`}
        confirmLabel="Remove"
        onConfirm={handleDelete}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
}
