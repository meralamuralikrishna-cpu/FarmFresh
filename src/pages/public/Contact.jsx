import { useState } from "react";
import "./PlaceholderPage.css";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="placeholder">
      <div className="placeholder__inner" style={{ maxWidth: "28rem" }}>
        <p className="placeholder__eyebrow">Contact</p>
        <h1>Talk to FreshFarm</h1>
        <p>
          Questions about orders, farm onboarding, or delivery routes? Send a
          note — demo form stores nothing on a server.
        </p>

        {sent ? (
          <p className="seller-success" style={{ marginTop: "1.25rem" }}>
            Thanks{form.name ? `, ${form.name}` : ""}. We’ll get back to{" "}
            {form.email || "you"} soon.
          </p>
        ) : (
          <form
            className="seller-form"
            style={{ marginTop: "1.25rem", textAlign: "left" }}
            onSubmit={onSubmit}
          >
            <div className="seller-field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={onChange}
                required
              />
            </div>
            <div className="seller-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                required
              />
            </div>
            <div className="seller-field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={onChange}
                required
              />
            </div>
            <button type="submit" className="seller-btn seller-btn--primary">
              Send message
            </button>
          </form>
        )}

        <p style={{ marginTop: "1.5rem", color: "var(--muted)", fontSize: "0.9rem" }}>
          Support: hello@freshfarm.demo · +91 98000 00000
        </p>
      </div>
    </div>
  );
}
