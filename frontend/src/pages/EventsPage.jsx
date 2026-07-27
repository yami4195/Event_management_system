import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Sparkles, X, AlertCircle, SlidersHorizontal, ChevronDown, CalendarDays,
} from "lucide-react";
import EventFilter from "../components/events/EventFilter";
import EventCategories from "../components/events/EventCategories";
import EventsList from "../components/events/EventsList";
import EventCTA from "../components/events/EventCTA";
import { MOCK_EVENTS, MOCK_CATEGORIES } from "../data/mockEventsData";
import { eventsService, categoriesService } from "../services";

const PAGE_SIZE = 9;

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function parseDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function withinDateRange(eventDate, range) {
  if (!range) return true;
  const d = parseDate(eventDate);
  if (!d) return false;
  const now = new Date();
  const sod = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (range === "today")      return d >= sod && d < new Date(sod.getTime() + 86400000);
  if (range === "this_week")  return d >= sod && d < new Date(sod.getTime() + 7 * 86400000);
  if (range === "this_month") return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d >= sod;
  return true;
}

function deriveStatus(evt) {
  if (evt.status === "Sold Out" || evt.status === "Almost Full") return evt.status;
  const seats = evt.seatsLeft ?? Math.max((evt.capacity || 0) - (evt.attendees || 0), 0);
  if (seats <= 0) return "Sold Out";
  if (seats <= 15) return "Almost Full";
  return "Open";
}

const DATE_LABELS = { "": "Anytime", today: "Today", this_week: "This Week", this_month: "This Month" };

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [events,     setEvents]     = useState([]);
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [isLoading,  setIsLoading]  = useState(true);
  const [loadError,  setLoadError]  = useState(null);

  const [searchTerm,       setSearchTerm]       = useState(searchParams.get("q")        || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get("location") || "");
  const [selectedDateRange,setSelectedDateRange]= useState(searchParams.get("when")     || "");
  const [selectedStatus,   setSelectedStatus]   = useState(searchParams.get("status")   || "");
  const [sortBy,           setSortBy]           = useState(searchParams.get("sort")     || "upcoming");
  const [visibleCount,     setVisibleCount]     = useState(PAGE_SIZE);

  /* URL sync */
  useEffect(() => {
    const p = {};
    if (searchTerm)        p.q        = searchTerm;
    if (selectedCategory)  p.category = selectedCategory;
    if (selectedLocation)  p.location = selectedLocation;
    if (selectedDateRange) p.when     = selectedDateRange;
    if (selectedStatus)    p.status   = selectedStatus;
    if (sortBy !== "upcoming") p.sort = sortBy;
    setSearchParams(p, { replace: true });
  }, [searchTerm, selectedCategory, selectedLocation, selectedDateRange, selectedStatus, sortBy, setSearchParams]);

  /* Data load */
  useEffect(() => {
    let alive = true;
    (async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const [catRes, evtRes] = await Promise.allSettled([
          categoriesService?.getAll?.(),
          eventsService?.getAll?.(),
        ]);
        if (!alive) return;

        if (catRes.status === "fulfilled" && catRes.value?.data?.data?.categories?.length) {
          setCategories(catRes.value.data.data.categories.map((c) => ({
            id: c.category_id || c.id, name: c.name, slug: c.name, icon: "Grid",
          })));
        }

        if (evtRes.status === "fulfilled" && evtRes.value?.data) {
          const payload = evtRes.value.data;
          const items = Array.isArray(payload) ? payload : payload.data?.events || payload.events || payload.data || [];
          setEvents(items.length > 0 ? items : MOCK_EVENTS);
          if (items.length === 0) setLoadError("Showing sample events — live data temporarily unavailable.");
        } else {
          setEvents(MOCK_EVENTS);
          if (evtRes.status === "rejected") setLoadError("Showing sample events — live data temporarily unavailable.");
        }
      } catch {
        if (alive) { setEvents(MOCK_EVENTS); setLoadError("Showing sample events — live data temporarily unavailable."); }
      } finally {
        if (alive) setIsLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  /* Filter + sort */
  const filteredEvents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const filtered = events.filter((evt) => {
      if (term) {
        const hay = [evt.title, evt.description, evt.location, evt.organizer || evt.organizer_name]
          .filter(Boolean).join(" ").toLowerCase();
        if (!hay.includes(term)) return false;
      }
      if (selectedCategory) {
        const cat = (evt.category || evt.category_name || "").toLowerCase();
        if (cat !== selectedCategory.toLowerCase()) return false;
      }
      if (selectedLocation && !(evt.location || "").toLowerCase().includes(selectedLocation.toLowerCase())) return false;
      if (selectedDateRange && !withinDateRange(evt.date, selectedDateRange)) return false;
      if (selectedStatus && deriveStatus(evt) !== selectedStatus) return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "price_low")  return (typeof a.price === "number" ? a.price : 0) - (typeof b.price === "number" ? b.price : 0);
      if (sortBy === "popular")    return (b.attendees || 0) - (a.attendees || 0);
      if (sortBy === "newest")     return (parseDate(b.date)?.getTime() || 0) - (parseDate(a.date)?.getTime() || 0);
      return (parseDate(a.date)?.getTime() || 0) - (parseDate(b.date)?.getTime() || 0);
    });
  }, [events, searchTerm, selectedCategory, selectedLocation, selectedDateRange, selectedStatus, sortBy]);

  /* Active filter chips */
  const activeFilters = useMemo(() => {
    const chips = [];
    if (searchTerm)        chips.push({ key: "q",        label: `"${searchTerm}"`,                            clear: () => setSearchTerm("") });
    if (selectedCategory)  chips.push({ key: "category", label: `Category: ${selectedCategory}`,              clear: () => setSelectedCategory("") });
    if (selectedLocation)  chips.push({ key: "location", label: `Location: ${selectedLocation}`,              clear: () => setSelectedLocation("") });
    if (selectedDateRange) chips.push({ key: "when",     label: `When: ${DATE_LABELS[selectedDateRange] || selectedDateRange}`, clear: () => setSelectedDateRange("") });
    if (selectedStatus)    chips.push({ key: "status",   label: `Status: ${selectedStatus}`,                  clear: () => setSelectedStatus("") });
    return chips;
  }, [searchTerm, selectedCategory, selectedLocation, selectedDateRange, selectedStatus]);

  const handleResetFilters = useCallback(() => {
    setSearchTerm(""); setSelectedCategory(""); setSelectedLocation("");
    setSelectedDateRange(""); setSelectedStatus(""); setSortBy("upcoming");
    setVisibleCount(PAGE_SIZE);
  }, []);

  useEffect(() => { setVisibleCount(PAGE_SIZE); },
    [searchTerm, selectedCategory, selectedLocation, selectedDateRange, selectedStatus, sortBy]);

  const visibleEvents = useMemo(() => filteredEvents.slice(0, visibleCount), [filteredEvents, visibleCount]);
  const hasMore = visibleCount < filteredEvents.length;

  return (
    <div className="w-full min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">

      {/* ── 1. PAGE HEADER ─────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold tracking-wide mb-4">
            <CalendarDays className="h-3.5 w-3.5" /> Event Discovery
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
            Find Your Next <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">Experience</span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
            Browse tech summits, music festivals, workshops, and more — filtered to what matters to you.
          </p>
        </div>
      </div>

      {/* ── 2. STICKY FILTER BAR ───────────────────────────────────────────── */}
      <div className="sticky z-30" style={{ top: "64px" }}>
        <EventFilter
          categories={categories}
          searchTerm={searchTerm}             setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
          selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation}
          selectedDateRange={selectedDateRange} setSelectedDateRange={setSelectedDateRange}
          selectedStatus={selectedStatus}     setSelectedStatus={setSelectedStatus}
          sortBy={sortBy}                     setSortBy={setSortBy}
          totalResultsCount={filteredEvents.length}
          onResetFilters={handleResetFilters}
        />
      </div>

      {/* ── 3. CATEGORY PILLS ──────────────────────────────────────────────── */}
      <EventCategories
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* ── 4. RESULTS GRID ────────────────────────────────────────────────── */}
      <section id="events-results" className="py-12 bg-slate-50/60 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Results header */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold tracking-wide mb-2">
                  <Sparkles className="h-3.5 w-3.5" /> All Events
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {isLoading ? "Loading events…" : `${filteredEvents.length} event${filteredEvents.length === 1 ? "" : "s"} found`}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Conferences, summits, masterclasses, and experiences worldwide.
                </p>
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mr-1">
                  <SlidersHorizontal className="h-3.5 w-3.5" /> Active:
                </span>
                {activeFilters.map((chip) => (
                  <button
                    key={chip.key}
                    onClick={chip.clear}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
                  >
                    {chip.label} <X className="h-3 w-3" />
                  </button>
                ))}
                <button onClick={handleResetFilters} className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline ml-1">
                  Clear all
                </button>
              </div>
            )}

            {/* API error banner */}
            {loadError && !isLoading && (
              <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-sm">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{loadError}</span>
              </div>
            )}
          </div>

          {/* Cards */}
          <EventsList events={visibleEvents} isLoading={isLoading} onResetFilters={handleResetFilters} />

          {/* Load more */}
          {!isLoading && hasMore && (
            <div className="mt-12 flex flex-col items-center gap-2">
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="inline-flex items-center gap-2 px-6 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-semibold text-sm shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
              >
                Load more events <ChevronDown className="h-4 w-4" />
              </button>
              <span className="text-xs text-slate-400">Showing {visibleCount} of {filteredEvents.length}</span>
            </div>
          )}
          {!isLoading && !hasMore && filteredEvents.length > 0 && (
            <p className="mt-12 text-center text-xs text-slate-400">
              You've reached the end · {filteredEvents.length} event{filteredEvents.length === 1 ? "" : "s"} shown
            </p>
          )}
        </div>
      </section>

      {/* ── 5. ORGANIZER CTA ───────────────────────────────────────────────── */}
      <EventCTA />
    </div>
  );
}
