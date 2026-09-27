import { useEffect, useState } from "react";
import { useMiddlemanData } from "../../context/MiddlemanDataContext";

export default function Profile() {
  const { profile, ready, saveProfile } = useMiddlemanData();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    vehicle: "",
    area: "",
    bio: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        phone: profile.phone || "",
        email: profile.email || "",
        vehicle: profile.vehicle || "",
        area: profile.area || "",
        bio: profile.bio || "",
      });
    }
  }, [profile]);

  if (!ready) return <p className="seller-empty">Loading…</p>;

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    saveProfile(form);
    setMessage("Profile saved.");
  };

  return (
    <div>
      <div className="seller-page__head">
        <div>
          <h1 className="seller-page__title">Profile</h1>
          <p className="seller-page__lede">
            Your delivery partner details shown to sellers and customers.
          </p>
        </div>
      </div>

      <div className="seller-panel">
        {message ? <p className="seller-success">{message}</p> : null}
        <form className="seller-form" onSubmit={onSubmit}>
          <div className="seller-form__row seller-form__row--2">
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
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={onChange}
                required
              />
            </div>
          </div>
          <div className="seller-form__row seller-form__row--2">
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
              <label htmlFor="area">Area</label>
              <input
                id="area"
                name="area"
                value={form.area}
                onChange={onChange}
              />
            </div>
          </div>
          <div className="seller-field">
            <label htmlFor="vehicle">Vehicle</label>
            <input
              id="vehicle"
              name="vehicle"
              value={form.vehicle}
              onChange={onChange}
            />
          </div>
          <div className="seller-field">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={form.bio}
              onChange={onChange}
            />
          </div>
          <div className="seller-actions">
            <button type="submit" className="seller-btn seller-btn--primary">
              Save profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
