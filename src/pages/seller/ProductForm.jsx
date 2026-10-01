import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSellerData } from "../../context/SellerDataContext";
import { PRODUCT_TYPES } from "../../services/sellerStore";

const empty = {
  name: "",
  type: PRODUCT_TYPES[0],
  price: "",
  unit: "litre",
  stock: "",
  available: true,
  description: "",
};

function fromProduct(p) {
  return {
    name: p.name,
    type: p.type,
    price: String(p.price),
    unit: p.unit,
    stock: String(p.stock),
    available: p.available,
    description: p.description || "",
  };
}

export default function ProductForm() {
  const { productId } = useParams();
  const isEdit = Boolean(productId);
  const navigate = useNavigate();
  const { products, ready, addProduct, editProduct } = useSellerData();
  const [draft, setDraft] = useState(null);
  const [error, setError] = useState("");

  const existing = isEdit ? products.find((p) => p.id === productId) : null;
  const form = draft ?? (existing ? fromProduct(existing) : empty);

  if (!ready) return <p className="seller-empty">Loading…</p>;

  if (isEdit && !existing) {
    return (
      <div>
        <p className="seller-empty">Product not found.</p>
        <Link to="/seller/products" className="seller-btn seller-btn--ghost">
          Back to products
        </Link>
      </div>
    );
  }

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    const base = draft ?? (existing ? fromProduct(existing) : empty);
    setDraft({
      ...base,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      name: form.name.trim(),
      type: form.type,
      price: Number(form.price) || 0,
      unit: form.unit.trim() || "unit",
      stock: Number(form.stock) || 0,
      available: form.available,
      description: form.description.trim(),
    };
    if (!payload.name) {
      setError("Product name is required.");
      return;
    }
    try {
      if (isEdit) {
        editProduct(productId, payload);
      } else {
        addProduct(payload);
      }
      navigate("/seller/products");
    } catch (err) {
      setError(err.message || "Could not save product.");
    }
  };

  return (
    <div>
      <div className="seller-page__head">
        <div>
          <h1 className="seller-page__title">
            {isEdit ? "Edit product" : "Submit product for review"}
          </h1>
          <p className="seller-page__lede">
            You set the selling price. New listings are sent to the Product Reviewer for
            review.
          </p>
        </div>
      </div>

      <div className="seller-panel">
        {error ? <p className="seller-error">{error}</p> : null}
        <form className="seller-form" onSubmit={onSubmit}>
          <div className="seller-form__row seller-form__row--2">
            <div className="seller-field">
              <label htmlFor="name">Product name</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={onChange}
                required
              />
            </div>
            <div className="seller-field">
              <label htmlFor="type">Type</label>
              <select id="type" name="type" value={form.type} onChange={onChange}>
                {PRODUCT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="seller-form__row seller-form__row--3">
            <div className="seller-field">
              <label htmlFor="price">Your price (₹) — farmer decides</label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="1"
                value={form.price}
                onChange={onChange}
                required
              />
            </div>
            <div className="seller-field">
              <label htmlFor="unit">Unit</label>
              <input
                id="unit"
                name="unit"
                value={form.unit}
                onChange={onChange}
                placeholder="litre, kg, 500g"
                required
              />
            </div>
            <div className="seller-field">
              <label htmlFor="stock">Stock</label>
              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div className="seller-field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={onChange}
            />
          </div>

          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontWeight: 600,
            }}
          >
            <input
              type="checkbox"
              name="available"
              checked={form.available}
              onChange={onChange}
            />
            Available for sale
          </label>

          <div className="seller-actions">
            <button type="submit" className="seller-btn seller-btn--primary">
              {isEdit ? "Save changes" : "Submit for review"}
            </button>
            <Link to="/seller/products" className="seller-btn seller-btn--ghost">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
