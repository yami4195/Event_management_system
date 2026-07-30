import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Calendar, MapPin, DollarSign, Image as ImageIcon, CheckCircle, AlertCircle } from "lucide-react";

export default function EventForm({ initialData = null, onSubmit, isSubmitting = false, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    category: "Technology & AI",
    startDate: "",
    endDate: "",
    location: "",
    isOnline: false,
    price: 0,
    currency: "ETB",
    capacity: 100,
    image: "",
    description: "",
    status: "Draft",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        category: initialData.category || "Technology & AI",
        startDate: initialData.startDate ? initialData.startDate.substring(0, 16) : "",
        endDate: initialData.endDate ? initialData.endDate.substring(0, 16) : "",
        location: initialData.location || "",
        isOnline: initialData.isOnline || false,
        price: initialData.price || 0,
        currency: initialData.currency || "ETB",
        capacity: initialData.capacity || 100,
        image: initialData.image || "",
        description: initialData.description || "",
        status: initialData.status || "Draft",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Event title is required";
    if (!formData.startDate) newErrors.startDate = "Start date & time is required";
    if (!formData.isOnline && !formData.location.trim()) newErrors.location = "Location venue is required";
    if (formData.capacity <= 0) newErrors.capacity = "Capacity must be greater than 0";
    if (!formData.description.trim()) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...formData,
      price: Number(formData.price),
      capacity: Number(formData.capacity),
      image: formData.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          {initialData ? "Edit Event Details" : "Create New Event"}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Fill in the details below to host your event on the platform.
        </p>
      </div>

      {/* Basic Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Event Title *
          </label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Addis Tech Summit 2026"
            className={errors.title ? "border-rose-500 focus:ring-rose-500" : ""}
          />
          {errors.title && <p className="text-xs text-rose-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.title}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-black/20"
          >
            <option value="Technology & AI">Technology & AI</option>
            <option value="Business & Finance">Business & Finance</option>
            <option value="Music & Festivals">Music & Festivals</option>
            <option value="Design & UX">Design & UX</option>
            <option value="Sports & Fitness">Sports & Fitness</option>
            <option value="Health & Wellness">Health & Wellness</option>
            <option value="Education & STEM">Education & STEM</option>
            <option value="Conferences & Summits">Conferences & Summits</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-black/20"
          >
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-black dark:text-white" /> Start Date & Time *
          </label>
          <Input
            type="datetime-local"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className={errors.startDate ? "border-rose-500" : ""}
          />
          {errors.startDate && <p className="text-xs text-rose-500">{errors.startDate}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-black dark:text-white" /> End Date & Time
          </label>
          <Input
            type="datetime-local"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Location */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-black dark:text-white" /> Location / Venue *
          </label>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              name="isOnline"
              checked={formData.isOnline}
              onChange={handleChange}
              className="rounded border-slate-300 text-black focus:ring-black dark:text-white dark:focus:ring-white"
            />
            This is an online event
          </label>
        </div>

        <Input
          name="location"
          value={formData.location}
          onChange={handleChange}
          disabled={formData.isOnline}
          placeholder={formData.isOnline ? "Google Meet / Zoom webinar link" : "e.g. Skylight Hotel Convention Center, Addis Ababa"}
          className={errors.location ? "border-rose-500" : ""}
        />
        {errors.location && <p className="text-xs text-rose-500">{errors.location}</p>}
      </div>

      {/* Tickets & Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-black dark:text-white" /> Ticket Price (ETB)
          </label>
          <Input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            placeholder="0 for Free Event"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Total Ticket Capacity *
          </label>
          <Input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            min="1"
            className={errors.capacity ? "border-rose-500" : ""}
          />
          {errors.capacity && <p className="text-xs text-rose-500">{errors.capacity}</p>}
        </div>
      </div>

      {/* Image URL */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-black dark:text-white" /> Cover Image URL
        </label>
        <Input
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://images.unsplash.com/photo-..."
        />
        {formData.image && (
          <div className="mt-2 h-32 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
          Description & Overview *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          placeholder="Describe your event highlights, speakers, agenda, and key info..."
          className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-black/20"
        />
        {errors.description && <p className="text-xs text-rose-500">{errors.description}</p>}
      </div>

      {/* Form Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-black hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black font-bold px-6 shadow-md"
        >
          {isSubmitting ? (
            "Saving Event..."
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              {initialData ? "Update Event" : "Publish Event"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
