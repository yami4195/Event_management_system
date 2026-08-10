import { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  DollarSign,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Upload,
  Sparkles,
  Users,
  Clock,
  Globe,
  Building,
  Tag,
  FileText,
  Eye,
  Check,
  Zap,
  Layers,
} from "lucide-react";
import { categoriesService } from "../../services/category.service";
import "../../styles/components/create-event.css";

const PRESET_IMAGES = [
  {
    name: "Tech & AI Summit",
    url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80",
  },
  {
    name: "Business & Finance",
    url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1000&auto=format&fit=crop&q=80",
  },
  {
    name: "Music & Concert",
    url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1000&auto=format&fit=crop&q=80",
  },
  {
    name: "Workshop & Design",
    url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000&auto=format&fit=crop&q=80",
  },
];

export default function EventForm({
  initialData = null,
  onSubmit,
  isSubmitting = false,
  onCancel,
}) {
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeStep, setActiveStep] = useState(0); // 0 = All Sections, 1 = Basic, 2 = Logistics, 3 = Pricing, 4 = Media

  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    category: "Technology & AI",
    date: "",
    time: "10:00",
    location: "",
    isOnline: false,
    pricingType: "paid",
    price: 0,
    currency: "ETB",
    capacity: 100,
    image: "",
    description: "",
    status: "upcoming",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await categoriesService.getAll();
        const cats =
          res.data?.data?.categories || res.data?.categories || res.data || [];
        setCategories(cats);
        if (cats.length > 0 && !formData.category_id) {
          setFormData((prev) => ({
            ...prev,
            category_id: cats[0].category_id || cats[0].id,
            category: cats[0].name || prev.category,
          }));
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    if (initialData) {
      const priceVal = Number(initialData.price || 0);
      const isOnlineVal =
        initialData.isOnline ||
        Boolean(
          initialData.location &&
            initialData.location.toLowerCase().includes("online")
        );

      let parsedDate = "";
      if (initialData.date) {
        try {
          parsedDate = new Date(initialData.date).toISOString().substring(0, 10);
        } catch {
          parsedDate = String(initialData.date).substring(0, 10);
        }
      }

      setFormData({
        title: initialData.title || "",
        category_id: initialData.category_id || "",
        category: initialData.category || "Technology & AI",
        date: parsedDate,
        time: initialData.time || "10:00",
        location: initialData.location || "",
        isOnline: isOnlineVal,
        pricingType: priceVal === 0 ? "free" : "paid",
        price: priceVal,
        currency: initialData.currency || "ETB",
        capacity: Number(initialData.capacity || 100),
        image: initialData.image || initialData.imageUrl || "",
        description: initialData.description || "",
        status: (initialData.status || "upcoming").toLowerCase(),
      });

      const initialImg = initialData.image || initialData.imageUrl || "";
      if (initialImg) {
        setImagePreview(initialImg);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "category_id") {
        const selectedCat = categories.find(
          (c) => String(c.category_id || c.id) === String(value)
        );
        if (selectedCat) {
          updated.category = selectedCat.name;
        }
      }
      return updated;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handlePricingTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      pricingType: type,
      price: type === "free" ? 0 : prev.price > 0 ? prev.price : 100,
    }));
  };

  const handleLocationTypeChange = (isOnlineVal) => {
    setFormData((prev) => ({
      ...prev,
      isOnline: isOnlineVal,
      location: isOnlineVal ? "Online Webinar / Zoom" : "",
    }));
    if (errors.location) {
      setErrors((prev) => ({ ...prev, location: null }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const processSelectedFile = (file) => {
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        image: "Please upload a valid image file (PNG, JPG, WebP)",
      }));
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFormData((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: null }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handlePresetImageSelect = (url) => {
    setImageFile(null);
    setImagePreview(url);
    setFormData((prev) => ({ ...prev, image: url }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Event title is required";
    if (!formData.date) newErrors.date = "Event date is required";
    if (!formData.time.trim()) newErrors.time = "Event start time is required";
    if (!formData.isOnline && !formData.location.trim())
      newErrors.location = "Physical venue location is required";
    if (formData.capacity <= 0)
      newErrors.capacity = "Capacity must be at least 1 seat";
    if (!formData.description.trim())
      newErrors.description = "Event description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 120, behavior: "smooth" });
      return;
    }

    let finalCatId = formData.category_id;
    if (!finalCatId && categories.length > 0) {
      finalCatId = categories[0].category_id || categories[0].id;
    }

    const payload = {
      title: formData.title.trim(),
      category_id: finalCatId,
      date: formData.date,
      time: formData.time.trim(),
      location: formData.isOnline ? "Online / Web" : formData.location.trim(),
      capacity: Number(formData.capacity),
      price: formData.pricingType === "free" ? 0 : Number(formData.price),
      status: formData.status.toLowerCase() === "published" ? "upcoming" : formData.status.toLowerCase(),
      description: formData.description.trim(),
    };

    if (imageFile) {
      payload.image = imageFile;
    } else if (formData.image) {
      payload.image = formData.image;
    }

    onSubmit(payload);
  };

  const displayDateStr = formData.startDate
    ? new Date(formData.startDate).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : formData.date
    ? new Date(formData.date).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Date To Be Announced";

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Step Navigation Bar for Maximum Spaciousness */}
      <div className="form-step-nav-bar">
        <button
          type="button"
          onClick={() => setActiveStep(0)}
          className={`form-step-tab-btn ${activeStep === 0 ? "active" : ""}`}
        >
          <Layers className="w-4 h-4" />
          <span>All Sections View</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveStep(1)}
          className={`form-step-tab-btn ${activeStep === 1 ? "active" : ""}`}
        >
          <span className="form-step-num-badge">1</span>
          <span>Basic Info</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveStep(2)}
          className={`form-step-tab-btn ${activeStep === 2 ? "active" : ""}`}
        >
          <span className="form-step-num-badge">2</span>
          <span>Logistics & Venue</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveStep(3)}
          className={`form-step-tab-btn ${activeStep === 3 ? "active" : ""}`}
        >
          <span className="form-step-num-badge">3</span>
          <span>Tickets & Pricing</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveStep(4)}
          className={`form-step-tab-btn ${activeStep === 4 ? "active" : ""}`}
        >
          <span className="form-step-num-badge">4</span>
          <span>Media Banner</span>
        </button>
      </div>

      <div className="event-form-grid">
        {/* ======================================================== */}
        {/* LEFT COLUMN: Modular Card Sections                        */}
        {/* ======================================================== */}
        <div className="form-sections-column">
          {/* SECTION 1: Basic Information */}
          {(activeStep === 0 || activeStep === 1) && (
            <div className="form-card-section">
              <div className="section-header-title">
                <div className="section-icon-box section-icon-blue">
                  <Tag className="w-5 h-5" />
                </div>
                <div className="section-heading-text">
                  <h3>1. Basic Event Information</h3>
                  <p>Define the title, category, and publishing status for attendees.</p>
                </div>
              </div>

              {/* Event Title */}
              <div className="form-group-spacious">
                <label className="form-label-custom">
                  <span>
                    Event Title <span className="required-star">*</span>
                  </span>
                  <span className="field-char-count">{formData.title.length}/100</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  maxLength={100}
                  placeholder="e.g. Addis Tech & AI Innovation Summit 2026"
                  className={`form-input-custom ${errors.title ? "has-error" : ""}`}
                />
                {errors.title && (
                  <div className="field-error-text">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.title}
                  </div>
                )}
              </div>

              {/* Category & Status Row */}
              <div className="form-row-2col">
                <div className="form-group-spacious">
                  <label className="form-label-custom">Topic Category</label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="form-select-custom"
                  >
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <option
                          key={cat.category_id || cat.id}
                          value={cat.category_id || cat.id}
                        >
                          {cat.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Technology & AI">Technology & AI</option>
                        <option value="Business & Finance">Business & Finance</option>
                        <option value="Music & Festivals">Music & Festivals</option>
                        <option value="Design & UX">Design & UX</option>
                        <option value="Sports & Fitness">Sports & Fitness</option>
                        <option value="Health & Wellness">Health & Wellness</option>
                        <option value="Education & STEM">Education & STEM</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="form-group-spacious">
                  <label className="form-label-custom">Event Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="form-select-custom"
                  >
                    <option value="upcoming">Upcoming (Public)</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: Date, Time & Venue */}
          {(activeStep === 0 || activeStep === 2) && (
            <div className="form-card-section">
              <div className="section-header-title">
                <div className="section-icon-box section-icon-indigo">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="section-heading-text">
                  <h3>2. Schedule & Venue Logistics</h3>
                  <p>Specify start/end timing and physical address or virtual link.</p>
                </div>
              </div>

              {/* Date & Time Pickers */}
              <div className="form-row-2col">
                <div className="form-group-spacious">
                  <label className="form-label-custom">
                    <span>
                      Event Date <span className="required-star">*</span>
                    </span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`form-input-custom ${errors.date ? "has-error" : ""}`}
                  />
                  {errors.date && (
                    <div className="field-error-text">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.date}
                    </div>
                  )}
                </div>

                <div className="form-group-spacious">
                  <label className="form-label-custom">
                    <span>
                      Exact Event Start Time <span className="required-star">*</span>
                    </span>
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className={`form-input-custom ${errors.time ? "has-error" : ""}`}
                  />
                  {errors.time && (
                    <div className="field-error-text">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.time}
                    </div>
                  )}
                </div>
              </div>

              {/* Event Format Selector */}
              <div className="form-group-spacious">
                <label className="form-label-custom">Event Format & Location Type</label>

                <div className="option-toggle-grid">
                  <button
                    type="button"
                    onClick={() => handleLocationTypeChange(false)}
                    className={`toggle-card-btn ${!formData.isOnline ? "active" : ""}`}
                  >
                    <div className="toggle-icon-wrap">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="toggle-label-title">In-Person Venue</div>
                      <div className="toggle-label-sub">Physical Hall / Hotel</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLocationTypeChange(true)}
                    className={`toggle-card-btn ${formData.isOnline ? "active" : ""}`}
                  >
                    <div className="toggle-icon-wrap">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="toggle-label-title">Virtual Event</div>
                      <div className="toggle-label-sub">Online Zoom / Meet Link</div>
                    </div>
                  </button>
                </div>

                <div style={{ marginTop: "8px" }}>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    disabled={formData.isOnline}
                    placeholder={
                      formData.isOnline
                        ? "Google Meet / Zoom webinar link"
                        : "e.g. Skylight Hotel Grand Ballroom, Bole, Addis Ababa"
                    }
                    className={`form-input-custom ${errors.location ? "has-error" : ""}`}
                  />
                  {errors.location && (
                    <div className="field-error-text">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.location}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: Tickets, Pricing & Capacity */}
          {(activeStep === 0 || activeStep === 3) && (
            <div className="form-card-section">
              <div className="section-header-title">
                <div className="section-icon-box section-icon-emerald">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div className="section-heading-text">
                  <h3>3. Tickets, Pricing & Capacity</h3>
                  <p>Choose admission type, ticket pricing in ETB, and maximum seat limit.</p>
                </div>
              </div>

              {/* Admission Type Toggle */}
              <div className="form-group-spacious">
                <label className="form-label-custom">Admission Pricing Mode</label>

                <div className="option-toggle-grid">
                  <button
                    type="button"
                    onClick={() => handlePricingTypeChange("free")}
                    className={`toggle-card-btn ${formData.pricingType === "free" ? "active" : ""}`}
                  >
                    <div className="toggle-icon-wrap">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="toggle-label-title">Free Admission</div>
                      <div className="toggle-label-sub">No cost for attendees</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePricingTypeChange("paid")}
                    className={`toggle-card-btn ${formData.pricingType === "paid" ? "active" : ""}`}
                  >
                    <div className="toggle-icon-wrap">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="toggle-label-title">Paid Ticket</div>
                      <div className="toggle-label-sub">Set ticket price (ETB)</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Pricing & Capacity Fields */}
              <div className="form-row-2col">
                <div className="form-group-spacious">
                  <label className="form-label-custom">Ticket Price (ETB)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.pricingType === "free" ? 0 : formData.price}
                    onChange={handleChange}
                    disabled={formData.pricingType === "free"}
                    min="0"
                    placeholder="0"
                    className="form-input-custom"
                  />
                </div>

                <div className="form-group-spacious">
                  <label className="form-label-custom">
                    <span>
                      Total Seat Capacity <span className="required-star">*</span>
                    </span>
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    min="1"
                    className={`form-input-custom ${errors.capacity ? "has-error" : ""}`}
                  />
                  {errors.capacity && (
                    <div className="field-error-text">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.capacity}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: Media & Cover Image */}
          {(activeStep === 0 || activeStep === 4) && (
            <div className="form-card-section">
              <div className="section-header-title">
                <div className="section-icon-box section-icon-amber">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div className="section-heading-text">
                  <h3>4. Media Banner & Description</h3>
                  <p>Upload a cover image directly to Cloudinary and provide overview details.</p>
                </div>
              </div>

              {/* Cloudinary Drag & Drop Box */}
              <div className="form-group-spacious">
                <label className="form-label-custom">Cover Image Banner</label>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`dropzone-upload-box ${isDragOver ? "drag-over" : ""}`}
                >
                  {imagePreview ? (
                    <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", border: "1px solid #cbd5e1", maxHeight: "200px" }}>
                      <img src={imagePreview} alt="Cover Preview" style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                      <label className="upload-btn-label" style={{ position: "absolute", bottom: "12px", right: "12px", background: "rgba(15,23,42,0.85)", backdropFilter: "blur(8px)" }}>
                        <Upload className="w-4 h-4" /> Change Image
                        <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
                      </label>
                    </div>
                  ) : (
                    <>
                      <div className="upload-icon-circle">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="upload-title">Drag and drop your event banner here</p>
                      <p className="upload-sub">High resolution PNG, JPG, or WebP files supported</p>
                      <label className="upload-btn-label">
                        <Upload className="w-4 h-4" /> Browse & Upload to Cloudinary
                        <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
                      </label>
                    </>
                  )}
                </div>

                {/* Preset Image Options */}
                <div style={{ marginTop: "12px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#64748b" }}>
                    Or select a curated preset banner image:
                  </span>
                  <div className="preset-banners-grid">
                    {PRESET_IMAGES.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => selectPresetImage(preset.url)}
                        className={`preset-banner-thumb ${imagePreview === preset.url ? "selected" : ""}`}
                      >
                        <img src={preset.url} alt={preset.name} />
                        <div className="preset-banner-caption">{preset.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Event Description */}
              <div className="form-group-spacious">
                <label className="form-label-custom">
                  <span>
                    Event Overview & Description <span className="required-star">*</span>
                  </span>
                  <span className="field-char-count">{formData.description.length} chars</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe key highlights, keynote speakers, agenda, target audience, and guidelines..."
                  className={`form-textarea-custom ${errors.description ? "has-error" : ""}`}
                />
                {errors.description && (
                  <div className="field-error-text">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.description}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form Actions Footer Bar */}
          <div className="form-actions-footer">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="btn-secondary-custom"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary-custom"
            >
              {isSubmitting ? (
                <span>Saving Event...</span>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>{initialData ? "Update Event" : "Publish Event"}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: Sticky Real-Time Live Preview               */}
        {/* ======================================================== */}
        <div className="live-preview-sidebar">
          <div className="preview-sidebar-header">
            <div className="preview-sidebar-title">
              <Eye className="w-4 h-4" style={{ color: "#2563eb" }} /> Live Attendee Preview
            </div>
            <span className="preview-live-badge">Real-Time</span>
          </div>

          <div className="live-preview-card">
            {/* Media Banner Header */}
            <div className="preview-media-header">
              {imagePreview ? (
                <img src={imagePreview} alt="Event Preview" />
              ) : (
                <div className="preview-placeholder-bg">
                  <ImageIcon className="w-10 h-10 mb-2" style={{ opacity: 0.5, color: "#3b82f6" }} />
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#94a3b8" }}>
                    Upload or select a cover image
                  </span>
                </div>
              )}

              <span className="preview-badge-status">{formData.status}</span>
              <span className="preview-badge-price">
                {formData.pricingType === "free" || Number(formData.price) === 0
                  ? "FREE"
                  : `${formData.price} ETB`}
              </span>
            </div>

            {/* Content Body */}
            <div className="preview-card-content">
              <div className="preview-category-pill">
                <Tag className="w-3 h-3" />
                <span>{formData.category}</span>
              </div>

              <h4 className="preview-event-title">
                {formData.title.trim() || "Untitled Event Title"}
              </h4>

              <div className="preview-meta-list">
                <div className="preview-meta-item">
                  <div className="preview-meta-icon">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span>{displayDateStr} • {formData.time}</span>
                </div>

                <div className="preview-meta-item">
                  <div className="preview-meta-icon" style={{ color: "#4f46e5" }}>
                    {formData.isOnline ? <Globe className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                  </div>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {formData.location || "Venue location to be announced"}
                  </span>
                </div>
              </div>

              <div className="preview-capacity-box">
                <div className="preview-capacity-header">
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Users className="w-3.5 h-3.5" /> Seats Limit
                  </span>
                  <span>0 / {formData.capacity} Seats</span>
                </div>
                <div className="preview-progress-track">
                  <div className="preview-progress-bar" />
                </div>
              </div>

              {formData.description && (
                <p className="preview-desc-snippet">
                  {formData.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
