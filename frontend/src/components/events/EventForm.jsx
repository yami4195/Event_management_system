import { useState, useEffect } from "react";
import { categoriesService } from "../../services";
import "./EventForm.css";

const EventForm = ({ initialData, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    date: "",
    time: "",
    location: "",
    price: 0,
    capacity: "",
    imageUrl: "",
  });

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        categoryId: initialData.category?.id || initialData.categoryId || "",
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : "",
        time: initialData.time || "",
        location: initialData.location || "",
        price: initialData.price || 0,
        capacity: initialData.capacity || "",
        imageUrl: initialData.imageUrl || "",
      });
    }

    const fetchCategories = async () => {
      try {
        const mockCategories = [
          { id: 1, name: "Technology" },
          { id: 2, name: "Music" },
          { id: 3, name: "Business" },
          { id: 4, name: "Arts" },
        ];
        
        try {
          const res = await categoriesService.getAll();
          if (res.data?.data && res.data.data.length > 0) {
            setCategories(res.data.data);
          } else {
             setCategories(mockCategories);
          }
        } catch {
           setCategories(mockCategories);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };

    fetchCategories();
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === "" ? "" : Number(value)) : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.categoryId) newErrors.categoryId = "Category is required";
    if (formData.price < 0) newErrors.price = "Price cannot be negative";
    if (formData.capacity && formData.capacity <= 0) newErrors.capacity = "Capacity must be greater than 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form className="event-form" onSubmit={handleSubmit} noValidate>
      {/* Title & Category */}
      <div className="event-form__row">
        <div className="form-group" style={{ flex: 2 }}>
          <label className="form-group__label">Event Title *</label>
          <input
            type="text"
            name="title"
            className={`form-group__input ${errors.title ? "form-group__input--error" : ""}`}
            placeholder="E.g., Tech Summit 2025"
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <span className="form-group__error">{errors.title}</span>}
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-group__label">Category *</label>
          <select
            name="categoryId"
            className={`form-group__select ${errors.categoryId ? "form-group__input--error" : ""}`}
            value={formData.categoryId}
            onChange={handleChange}
          >
            <option value="">Select category...</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.categoryId && <span className="form-group__error">{errors.categoryId}</span>}
        </div>
      </div>

      {/* Date, Time, Location */}
      <div className="event-form__row">
        <div className="form-group">
          <label className="form-group__label">Date *</label>
          <input
            type="date"
            name="date"
            className={`form-group__input ${errors.date ? "form-group__input--error" : ""}`}
            value={formData.date}
            onChange={handleChange}
          />
          {errors.date && <span className="form-group__error">{errors.date}</span>}
        </div>
        
        <div className="form-group">
          <label className="form-group__label">Time</label>
          <input
            type="time"
            name="time"
            className="form-group__input"
            value={formData.time}
            onChange={handleChange}
          />
        </div>

        <div className="form-group" style={{ flex: 2 }}>
          <label className="form-group__label">Location *</label>
          <input
            type="text"
            name="location"
            className={`form-group__input ${errors.location ? "form-group__input--error" : ""}`}
            placeholder="Venue name or address"
            value={formData.location}
            onChange={handleChange}
          />
          {errors.location && <span className="form-group__error">{errors.location}</span>}
        </div>
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-group__label">Description</label>
        <textarea
          name="description"
          className="form-group__input event-form__textarea"
          placeholder="What is this event about?"
          rows="5"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      {/* Capacity & Price & Image */}
      <div className="event-form__row">
        <div className="form-group">
          <label className="form-group__label">Ticket Price ($) *</label>
          <input
            type="number"
            name="price"
            min="0"
            step="0.01"
            className={`form-group__input ${errors.price ? "form-group__input--error" : ""}`}
            value={formData.price}
            onChange={handleChange}
          />
          {errors.price && <span className="form-group__error">{errors.price}</span>}
        </div>

        <div className="form-group">
          <label className="form-group__label">Max Capacity</label>
          <input
            type="number"
            name="capacity"
            min="1"
            className={`form-group__input ${errors.capacity ? "form-group__input--error" : ""}`}
            placeholder="Leave empty for unlimited"
            value={formData.capacity}
            onChange={handleChange}
          />
          {errors.capacity && <span className="form-group__error">{errors.capacity}</span>}
        </div>

        <div className="form-group" style={{ flex: 2 }}>
          <label className="form-group__label">Cover Image URL</label>
          <input
            type="url"
            name="imageUrl"
            className="form-group__input"
            placeholder="https://example.com/image.jpg"
            value={formData.imageUrl}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="event-form__actions">
        <button
          type="submit"
          className="btn btn--primary btn--lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <><span className="spinner-border" /> Saving Event...</>
          ) : (
            "Save Event"
          )}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
