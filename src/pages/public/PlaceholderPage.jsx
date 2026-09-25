import { Link } from "react-router-dom";
import "./PlaceholderPage.css";

export default function PlaceholderPage({ title, blurb }) {
  return (
    <section className="placeholder">
      <div className="placeholder__inner">
        <h1>{title}</h1>
        <p>{blurb}</p>
        <Link to="/" className="placeholder__back">
          ← Back home
        </Link>
      </div>
    </section>
  );
}
