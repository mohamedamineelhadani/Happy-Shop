import { Link } from "react-router-dom";
import { ArrowRight } from "../lib/icons";

export default function NotFound() {
  return (
    <div className="container">
      <div className="notfound">
        <span className="notfound__code">404</span>
        <h1>This page has gone missing.</h1>
        <p className="lead" style={{ marginInline: "auto" }}>
          The page you are looking for doesn’t exist or has been moved.
        </p>
        <div className="hero__actions" style={{ justifyContent: "center" }}>
          <Link to="/" className="btn btn-gold">
            Back home
          </Link>
          <Link to="/shop" className="btn btn-outline">
            Shop the collection <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
