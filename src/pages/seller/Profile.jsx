import { useState } from "react";
import { useSellerData } from "../../context/SellerDataContext";

export default function Profile() {
  const { profile, ready, saveProfile } = useSellerData();
  const [draft, setDraft] = useState(null);
  const [saved, setSaved] = useState(false);

  const form = draft ?? profile;

  if (!ready || !form) return <p className="seller-empty">Loading profile…</p>;

  const onChange = (e) => {
    const base = draft ?? profile;
    setDraft({ ...base, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    saveProfile(form);
    setDraft(null);
    setSaved(true);
  };

  return (
    <div>
      <div className="seller-page__head">
        <div>
          <h1 className="seller-page__title">Seller profile</h1>
          <p className="seller-page__lede">
            Farm details shown to customers on FreshFarm.
          </p>
        </div>
      </div>

      <div className="seller-panel">
        {saved ? <p className="seller-success">Profile saved.</p> : null}
        <form className="seller-form" onSubmit={onSubmit}>
          <div className="seller-form__row seller-form__row--2">
            <div className="seller-field">
              <label htmlFor="farmName">Farm name</label>
              <input
                id="farmName"
                name="farmName"
                value={form.farmName}
                onChange={onChange}
                required
              />
            </div>
            <div className="seller-field">
              <label htmlFor="ownerName">Owner name</label>
              <input
                id="ownerName"
                name="ownerName"
                value={form.ownerName}
                onChange={onChange}
                required
              />
            </div>
          </div>
          <div className="seller-form__row seller-form__row--2">
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
          </div>
          <div className="seller-field">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              name="address"
              value={form.address}
              onChange={onChange}
              required
            />
          </div>
          <div className="seller-field">
            <label htmlFor="bio">About the farm</label>
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
