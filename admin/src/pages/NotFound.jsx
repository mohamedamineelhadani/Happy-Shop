import { Link } from "react-router-dom";
import { Alert } from "../lib/icons";

export default function NotFound() {
  return (
    <div className="stack">
      <div className="empty">
        <span className="empty__icon">
          <Alert size={26} />
        </span>
        <h3>Page not found</h3>
        <p>The page you are looking for does not exist.</p>
        <div className="empty__action">
          <Link to="/" className="btn btn-gold">
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
