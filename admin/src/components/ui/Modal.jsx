import { useEffect } from "react";
import { Close } from "../../lib/icons";

export default function Modal({ open, title, onClose, children, footer, size = "md" }) {
  useEffect(() => {
    if (!open) return undefined;

    function onKey(event) {
      if (event.key === "Escape") onClose?.();
    }

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal__backdrop" onClick={() => onClose?.()} />
      <div className={`modal__panel modal__panel--${size}`}>
        <header className="modal__head">
          <h2>{title}</h2>
          <button
            type="button"
            className="icon-btn"
            onClick={() => onClose?.()}
            aria-label="Close dialog"
          >
            <Close size={18} />
          </button>
        </header>
        <div className="modal__body">{children}</div>
        {footer ? <footer className="modal__foot">{footer}</footer> : null}
      </div>
    </div>
  );
}
