import { useState, useEffect, useRef } from "react";
import { FiUploadCloud, FiX } from "react-icons/fi";
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
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        categoryId: initialData.category_id || initialData.category?.id || initialData.categoryId || "",
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : "",
        time: initialData.time || "",
        location: initialData.location || "",
        price: initialData.price || 0,
        capacity: initialData.capacity || "",
      });

      // Show existing image as preview if editing
      if (initialData.imageUrl) {
        setImagePreview(initialData.imageUrl);
      }
    }

    const fetchCategories = async () => {
      try {
        const res = await categoriesService.getAll();

        const data = res.data?.data?.categories ?? [];
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors(prev => ({ ...prev, image: "Please select a valid image file" }));
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: "Image must be less than 5MB" }));
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors(prev => ({ ...prev, image: "" }));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (imagePreview && !imagePreview.startsWith("http")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: "Image must be less than 5MB" }));
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, image: "" }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time is required";
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
      onSubmit(formData, imageFile);
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
              <option key={cat.category_id} value={cat.category_id}>
                {cat.name}
              </option>
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
          <label className="form-group__label">Time *</label>
          <input
            type="time"
            name="time"
            className={`form-group__input ${errors.time ? "form-group__input--error" : ""}`}
            value={formData.time}
            onChange={handleChange}
          />
          {errors.time && <span className="form-group__error">{errors.time}</span>}
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

      {/* Capacity & Price */}
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
      </div>

      {/* Cover Image Upload */}
      <div className="form-group">
        <label className="form-group__label">Cover Image</label>
        {imagePreview ? (
          <div className="image-upload__preview">
            <img src={imagePreview} alt="Cover preview" className="image-upload__preview-img" />
            <button
              type="button"
              className="image-upload__remove-btn"
              onClick={handleRemoveImage}
              title="Remove image"
            >
              <FiX />
            </button>
          </div>
        ) : (
          <div
            className="image-upload__dropzone"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <FiUploadCloud className="image-upload__icon" />
            <p className="image-upload__text">
              <span className="image-upload__link">Click to upload</span> or drag and drop
            </p>
            <p className="image-upload__hint">PNG, JPG, WEBP up to 5MB</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        {errors.image && <span className="form-group__error">{errors.image}</span>}
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
