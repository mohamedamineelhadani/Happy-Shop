/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Alert, Check, Close, Info, Sparkles } from "../lib/icons";

const ToastContext = createContext(null);

const ICONS = {
  success: Check,
  error: Alert,
  warning: Alert,
  info: Info,
};

let counter = 0;

function ToastStack({ toasts, onClose }) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-stack" role="region" aria-live="polite" aria-label="Notifications">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type] || Sparkles;
        return (
          <div key={toast.id} className={`toast toast--${toast.type}`}>
            <span className="toast__icon">
              <Icon size={18} />
            </span>
            <div>
              {toast.title ? <div className="toast__title">{toast.title}</div> : null}
              {toast.message ? <div className="toast__msg">{toast.message}</div> : null}
            </div>
            <button
              type="button"
              className="toast__close"
              onClick={() => onClose(toast.id)}
              aria-label="Dismiss notification"
            >
              <Close size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (type, message, title) => {
      counter += 1;
      const id = `toast-${counter}`;
      setToasts((current) => [...current, { id, type, message, title }]);
      setTimeout(() => remove(id), 4200);
    },
    [remove]
  );

  const api = useMemo(
    () => ({
      push,
      success: (message, title) => push("success", message, title),
      error: (message, title) => push("error", message, title),
      info: (message, title) => push("info", message, title),
      warning: (message, title) => push("warning", message, title),
      remove,
    }),
    [push, remove]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastStack toasts={toasts} onClose={remove} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside a <ToastProvider>.");
  }
  return context;
}
