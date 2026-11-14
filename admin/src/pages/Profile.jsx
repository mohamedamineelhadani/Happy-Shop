import { useState } from "react";
import { authService } from "../services";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Field from "../components/ui/Field";
import Loading from "../components/ui/Loading";

const blankPasswords = () => ({
  current_password: "",
  password: "",
  password_confirmation: "",
});

export default function Profile() {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
  });
  const [passwords, setPasswords] = useState(blankPasswords);
  const [errors, setErrors] = useState(null);
  const [saving, setSaving] = useState(false);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setPassword(key, value) {
    setPasswords((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setErrors(null);

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
    };

    // Only send the password fields when the admin is actually changing it.
    if (passwords.current_password || passwords.password || passwords.password_confirmation) {
      payload.current_password = passwords.current_password;
      payload.password = passwords.password;
      payload.password_confirmation = passwords.password_confirmation;
    }

    try {
      const response = await authService.updateProfile(payload);
      updateUser(response.data);
      setPasswords(blankPasswords());
      toast.success("Your profile has been updated.", "Saved");
    } catch (err) {
      setErrors(err.errors);
      toast.error(err.message, "Could not save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="stack">
      <section className="panel panel--narrow">
        <header className="panel__head">
          <div>
            <h2>Your profile</h2>
            <span className="dim">Update your name, email address and password.</span>
          </div>
        </header>

        <div className="profile-id">
          <span className="avatar">{user?.name?.[0]?.toUpperCase() ?? "A"}</span>
          <span className="profile-id__info">
            <strong>{user?.name ?? "Admin"}</strong>
            <small className="dim">{user?.role ?? "administrator"}</small>
          </span>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form__row">
            <Field label="Name" htmlFor="pf-name" error={errors?.name}>
              <input
                id="pf-name"
                className="input"
                value={form.name}
                onChange={(event) => setField("name", event.target.value)}
                required
              />
            </Field>
            <Field label="Email" htmlFor="pf-email" error={errors?.email}>
              <input
                id="pf-email"
                type="email"
                className="input"
                value={form.email}
                onChange={(event) => setField("email", event.target.value)}
                required
              />
            </Field>
          </div>

          <h3 className="section-label">Change password</h3>
          <p className="dim">Leave these fields blank to keep your current password.</p>

          <Field
            label="Current password"
            htmlFor="pf-current"
            error={errors?.current_password}
          >
            <input
              id="pf-current"
              type="password"
              className="input"
              autoComplete="current-password"
              value={passwords.current_password}
              onChange={(event) => setPassword("current_password", event.target.value)}
            />
          </Field>

          <div className="form__row">
            <Field
              label="New password"
              htmlFor="pf-new"
              error={errors?.password}
              hint="At least 8 characters."
            >
              <input
                id="pf-new"
                type="password"
                className="input"
                autoComplete="new-password"
                value={passwords.password}
                onChange={(event) => setPassword("password", event.target.value)}
              />
            </Field>
            <Field
              label="Confirm new password"
              htmlFor="pf-confirm"
              error={errors?.password_confirmation}
            >
              <input
                id="pf-confirm"
                type="password"
                className="input"
                autoComplete="new-password"
                value={passwords.password_confirmation}
                onChange={(event) => setPassword("password_confirmation", event.target.value)}
              />
            </Field>
          </div>

          <div className="form__actions">
            <button type="submit" className="btn btn-gold" disabled={saving}>
              {saving ? <Loading label="Saving…" inline /> : "Save changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
