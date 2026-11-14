import { useState } from "react";
import Field from "../ui/Field";
import Loading from "../ui/Loading";

export default function CategoryForm({ category, submitting, errors, onSubmit, onCancel }) {
  const [name, setName] = useState(category?.name ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [icon, setIcon] = useState(category?.icon ?? "");

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      icon: icon.trim() || null,
    });
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <Field label="Name" htmlFor="c-name" error={errors?.name}>
        <input
          id="c-name"
          className="input"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Watches"
          required
        />
      </Field>

      <Field label="Description" htmlFor="c-desc" hint="Shown on the categories page.">
        <textarea
          id="c-desc"
          className="input textarea"
          rows={3}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Timeless pieces, built to last."
        />
      </Field>

      <Field
        label="Icon key"
        htmlFor="c-icon"
        hint="Optional — a short slug such as “watch” or “bag”."
      >
        <input
          id="c-icon"
          className="input"
          value={icon}
          onChange={(event) => setIcon(event.target.value)}
          placeholder="watch"
        />
      </Field>

      <div className="form__actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="btn btn-gold" disabled={submitting}>
          {submitting ? <Loading label="Saving…" inline /> : category ? "Save changes" : "Create category"}
        </button>
      </div>
    </form>
  );
}
