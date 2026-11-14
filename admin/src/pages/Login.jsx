import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Logo } from "../lib/icons";
import Field from "../components/ui/Field";
import Loading from "../components/ui/Loading";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const redirectTo = location.state?.from?.pathname || "/";

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const user = await login({ email: email.trim(), password });
      toast.success(`Welcome back, ${user.name}.`, "Signed in");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login">
      <div className="login__panel">
        <div className="login__brand">
          <Logo size={34} />
          <span className="brand__name">
            Happy<span>Shop</span>
          </span>
          <span className="brand__tag">Admin</span>
        </div>

        <h1>Sign in</h1>
        <p className="dim">Manage products, orders and messages.</p>

        {error ? <div className="alert alert--error">{error}</div> : null}

        <form className="form" onSubmit={handleSubmit}>
          <Field label="Email" htmlFor="email">
            <input
              id="email"
              type="email"
              className="input"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@happyshop.test"
              required
            />
          </Field>

          <Field label="Password" htmlFor="password">
            <input
              id="password"
              type="password"
              className="input"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
            />
          </Field>

          <button type="submit" className="btn btn-gold btn-block btn-lg" disabled={busy}>
            {busy ? <Loading label="Signing in…" inline /> : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
