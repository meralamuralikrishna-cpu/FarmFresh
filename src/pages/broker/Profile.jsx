import { useState } from "react";
import { useBrokerData } from "../../context/BrokerDataContext";

export default function Profile() {
  const { profile, ready, saveProfile } = useBrokerData();
  const [draft, setDraft] = useState(null);
  const [saved, setSaved] = useState(false);

  if (!ready || !profile) {
    return <p className="seller-empty">Loading profile…</p>;
  }

  const form = draft ?? profile;

  const onChange = (e) => {
    const { name, value } = e.target;
    setDraft({ ...(draft ?? profile), [name]: value });
    setSaved(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    saveProfile({
      name: form.name.trim(),
      phone: form.phone.trim(),
      region: form.region.trim(),
      bio: form.bio.trim(),
    });
    setDraft(null);
    setSaved(true);
  };

  return (
    <div>
      <div className="seller-page__head">
        <div>
          <h1 className="seller-page__title">Broker profile</h1>
          <p className="seller-page__lede">
            Your contact details for farmers in your region.
          </p>
        </div>
      </div>

      <div className="seller-panel">
        {saved ? (
          <p className="seller-badge seller-badge--ok" style={{ marginBottom: "1rem" }}>
            Profile saved
          </p>
        ) : null}
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
              />
            </div>
          </div>
          <div className="seller-field">
            <label htmlFor="region">Region</label>
            <input
              id="region"
              name="region"
              value={form.region}
              onChange={onChange}
            />
          </div>
          <div className="seller-field">
            <label htmlFor="bio">About</label>
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
