import { useState } from "react";
import { categoryService } from "../services";
import useApi from "../hooks/useApi";
import { useToast } from "../context/ToastContext";
import { Edit, Layers, Plus, Trash } from "../lib/icons";
import Loading from "../components/ui/Loading";
import EmptyState from "../components/ui/EmptyState";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import CategoryForm from "../components/category/CategoryForm";

export default function Categories() {
  const toast = useToast();
  const { data, loading, error, refetch } = useApi(() => categoryService.list(), []);

  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const categories = data?.data ?? [];

  async function handleSave(payload) {
    setSaving(true);
    setErrors(null);
    try {
      if (editing) {
        await categoryService.update(editing.id, payload);
        toast.success("Category updated.", "Saved");
      } else {
        await categoryService.create(payload);
        toast.success("Category created.", "Saved");
      }
      setEditing(null);
      setCreating(false);
      refetch();
    } catch (err) {
      setErrors(err.errors);
      toast.error(err.message, "Could not save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    try {
      await categoryService.remove(pendingDelete.id);
      toast.success(`“${pendingDelete.name}” was deleted.`, "Category deleted");
      refetch();
    } catch (err) {
      toast.error(err.message, "Could not delete");
    }
  }

  const modalOpen = creating || Boolean(editing);

  function closeModal() {
    setCreating(false);
    setEditing(null);
    setErrors(null);
  }

  return (
    <div className="stack">
      <div className="toolbar">
        <span className="dim">
          {categories.length} categor{categories.length === 1 ? "y" : "ies"}
        </span>
        <button type="button" className="btn btn-gold" onClick={() => setCreating(true)}>
          <Plus size={17} />
          New category
        </button>
      </div>

      <section className="panel">
        {loading ? (
          <Loading label="Loading categories…" />
        ) : error ? (
          <div className="alert alert--error">{error.message}</div>
        ) : categories.length === 0 ? (
          <EmptyState icon={Layers} title="No categories yet" message="Create your first category." />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Description</th>
                  <th className="ta-right">Products</th>
                  <th className="ta-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td>
                      <strong>{category.name}</strong>
                    </td>
                    <td className="dim">
                      <code>{category.slug}</code>
                    </td>
                    <td className="dim">{category.description || "—"}</td>
                    <td className="ta-right">{category.product_count}</td>
                    <td className="ta-right">
                      <div className="row-actions">
                        <button
                          type="button"
                          className="icon-btn"
                          onClick={() => setEditing(category)}
                          aria-label={`Edit ${category.name}`}
                          title="Edit"
                        >
                          <Edit size={17} />
                        </button>
                        <button
                          type="button"
                          className="icon-btn icon-btn--danger"
                          onClick={() => setPendingDelete(category)}
                          aria-label={`Delete ${category.name}`}
                          title="Delete"
                        >
                          <Trash size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Modal
        open={modalOpen}
        title={editing ? "Edit category" : "New category"}
        onClose={closeModal}
      >
        <CategoryForm
          category={editing}
          submitting={saving}
          errors={errors}
          onSubmit={handleSave}
          onCancel={closeModal}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete category"
        message={`Delete “${pendingDelete?.name}”? Its products will become uncategorised.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
}
