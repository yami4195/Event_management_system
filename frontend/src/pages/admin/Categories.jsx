import { useState, useMemo } from "react";
import {
  Tag,
  Plus,
  Search,
  RotateCcw,
  Pencil,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Cpu,
  Briefcase,
  Palette,
  Music,
  Heart,
  BookOpen,
  Gamepad2,
  Utensils,
  Camera,
  Trophy,
  Sparkles,
  Coins,
  Bot,
  Building,
  Leaf,
  Code,
  FolderX,
  Newspaper,
  Layers,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

import {
  categories as initialCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  bulkUpdateStatus,
  bulkDeleteCategories,
} from "@/data/categories";

import StatCard from "@/components/admin/StatCard";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardHeader,  CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const iconMap = {
  Cpu,
  Briefcase,
  Palette,
  Music,
  Heart,
  BookOpen,
  Gamepad2,
  Utensils,
  Camera,
  Trophy,
  Sparkles,
  Coins,
  Bot,
  Building,
  Leaf,
  Code,
  FolderX,
  Newspaper,
  Tag,
};

const ITEMS_PER_PAGE = 6;

export default function Categories() {
  const [categoryList, setCategoryList] = useState(()=>[...initialCategories]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("most_events");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [actionNotice, setActionNotice] = useState(null);
  const [searchIconVisible,setSearchIconVisible] = useState(true);

  // Modal States
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    icon: "Tag",
    color: "indigo",
    status: "Active",
  });

  // Delete Modal States
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(null);

  // View Details Modal State
  const [viewingCategory, setViewingCategory] = useState(null);

  
  // Filtered & Sorted Categories
  const filteredCategories = useMemo(() => {
    return categoryList
      .filter((cat) => {
        const matchesSearch =
          searchQuery === "" ||
          cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
          statusFilter === "All" ||
          cat.status.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "name_asc") return a.name.localeCompare(b.name);
        if (sortBy === "name_desc") return b.name.localeCompare(a.name);
        if (sortBy === "most_events") return b.eventsCount - a.eventsCount;
        return 0;
      });
  }, [categoryList, searchQuery, statusFilter, sortBy]);

  // Statistics Calculations
  const stats = useMemo(() => {
    const total = categoryList.length;
    const active = categoryList.filter((c) => c.status === "Active").length;
    const disabled = categoryList.filter((c) => c.status === "Disabled").length;
    const totalEvents = categoryList.reduce((acc, c) => acc + c.eventsCount, 0);

    return { total, active, disabled, totalEvents };
  }, [categoryList]);

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / ITEMS_PER_PAGE));
  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCategories.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCategories, currentPage]);

  // Bulk Selection Handlers
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(paginatedCategories.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkStatusChange = (status) => {
    bulkUpdateStatus(selectedIds, status);
    setCategoryList([...initialCategories]);
    setSelectedIds([]);
    showToast(`Bulk updated ${selectedIds.length} categories to "${status}"`);
  };

  const handleBulkDelete = () => {
    bulkDeleteCategories(selectedIds);
    setCategoryList([...initialCategories]);
    setSelectedIds([]);
    showToast(`Bulk deleted ${selectedIds.length} categories`);
  };

  const showToast = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  // Add / Edit Handlers
  const handleOpenAdd = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: "",
      description: "",
      icon: "Tag",
      color: "indigo",
      status: "Active",
    });
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name,
      description: cat.description,
      icon: cat.icon || "Tag",
      color: cat.color || "indigo",
      status: cat.status,
    });
    setIsAddEditOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategory(editingCategory.id, categoryForm);
      showToast(`Category "${categoryForm.name}" updated!`);
    } else {
      createCategory(categoryForm);
      showToast(`Category "${categoryForm.name}" created!`);
    }
    setCategoryList([...initialCategories]);
    setIsAddEditOpen(false);
  };

  // Single Delete Handler
  const handleOpenDelete = (cat) => {
    setDeletingCategory(cat);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingCategory) {
      deleteCategory(deletingCategory.id);
      setCategoryList([...initialCategories]);
      showToast(`Category "${deletingCategory.name}" deleted`);
      setIsDeleteOpen(false);
      setDeletingCategory(null);
    }
  };

  const handleToggleStatus = (cat) => {
    const newStatus = cat.status === "Active" ? "Disabled" : "Active";
    updateCategory(cat.id, { status: newStatus });
    setCategoryList([...initialCategories]);
    showToast(`Category "${cat.name}" is now ${newStatus}`);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setSortBy("most_events");
    setCurrentPage(1);
  };

  const isFilterActive =
    searchQuery !== "" || statusFilter !== "All" || sortBy !== "most_events";

  // Top 5 Categories for Analytics Progress Bars
  
  // Insight Metrics
  
  return (
    <div className="space-y-8 text-slate-900 dark:text-slate-100 pb-16 transition-colors duration-200">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Categories Management
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              <Tag className="h-3.5 w-3.5" />
              {categoryList.length} Total
            </span>
          </div>
          <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            Create, organize, edit, and manage event categories.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="shrink-0 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          Add Category
        </Button>
      </div>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="rounded-lg bg-slate-900 dark:bg-slate-800 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all flex items-center gap-2 border border-slate-800 dark:border-slate-700">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          {actionNotice}
        </div>
      )}

      {/* 4 Statistics Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Categories"
          value={stats.total.toString()}
          icon={Tag}
          description="Total categories created"
          trend={{ value: "+2 new", isPositive: true }}
          variant="indigo"
        />

        <StatCard
          title="Active Categories"
          value={stats.active.toString()}
          icon={CheckCircle2}
          description="Currently active on platform"
          trend={{ value: "Live", isPositive: true }}
          variant="emerald"
        />

        <StatCard
          title="Disabled Categories"
          value={stats.disabled.toString()}
          icon={XCircle}
          description="Inactive categories"
          trend={{ value: "Disabled", isPositive: false }}
          variant="rose"
        />

        <StatCard
          title="Total Events"
          value={stats.totalEvents.toString()}
          icon={Layers}
          description="Categorized events"
          trend={{ value: "+14%", isPositive: true }}
          variant="blue"
        />
      </section>
<p>`</p>
      {/* Search, Filters, Bulk Actions Toolbar */}
      <Card className="border-slate-200/80 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              {searchIconVisible &&(
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />)}
              <Input
                type="text"
                placeholder="        Search categories by name, description..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchIconVisible(e.target.value=="");
                  setCurrentPage(1);
                }}
                className="pl-9 h-9 border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800 text-xs dark:text-slate-100"
              />
            </div>

            {/* Filter & Sort Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Filter */}
              <div className="w-[140px]">
                <Select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-9 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-slate-100"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Disabled">Disabled</option>
                </Select>
              </div>

              {/* Sort Options */}
              <div className="w-[150px]">
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-9 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-slate-100"
                >
                  <option value="most_events">Most Events</option>
                  <option value="name_asc">Name A-Z</option>
                  <option value="name_desc">Name Z-A</option>
                </Select>
              </div>

              {/* Reset Button */}
              {isFilterActive && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="h-9 gap-1.5 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Bulk Selection Bar */}
          {selectedIds.length > 0 && (
            <div className="mt-3 flex items-center justify-between bg-indigo-50 dark:bg-indigo-950/40 p-2.5 rounded-lg border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-900 dark:text-indigo-200">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-600 animate-ping" />
                {selectedIds.length} Categories Selected
              </span>

              <div className="flex items-center gap-2">
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => handleBulkStatusChange("Active")}
                  className="h-7 text-[11px] font-bold border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60"
                >
                  Enable
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => handleBulkStatusChange("Disabled")}
                  className="h-7 text-[11px] font-bold border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800"
                >
                  Disable
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={handleBulkDelete}
                  className="h-7 text-[11px] font-bold border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60"
                >
                  Delete Selected
                </Button>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-0">
          {filteredCategories.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-4">
                <Tag className="h-8 w-8 stroke-[1.75]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                No categories found.
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                Create your first category to organize platform events cleanly.
              </p>
              {isFilterActive && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="mt-5 gap-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <RotateCcw className="h-4 w-4" />
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            /* Categories Table */
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-50/70 border-b border-slate-200 dark:border-slate-800">
                    <TableHead className="w-[40px] px-4 py-3.5">
                      <input
                        type="checkbox"
                        checked={
                          paginatedCategories.length > 0 &&
                          selectedIds.length === paginatedCategories.length
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </TableHead>
                    <TableHead className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Category
                    </TableHead>
                    <TableHead className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Description
                    </TableHead>
                    <TableHead className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Events
                    </TableHead>
                    <TableHead className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Created Date
                    </TableHead>
                    <TableHead className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Status
                    </TableHead>
                    <TableHead className="text-right px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCategories.map((cat) => {
                    const IconComp = iconMap[cat.icon] || Tag;
                    const isSelected = selectedIds.includes(cat.id);

                    return (
                      <TableRow
                        key={cat.id}
                        className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors border-b border-slate-100 dark:border-slate-800 ${
                          isSelected ? "bg-indigo-50/40 dark:bg-indigo-950/20" : ""
                        }`}
                      >
                        {/* Select Checkbox */}
                        <TableCell className="px-4 py-3.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(cat.id)}
                            className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </TableCell>

                        {/* Category Name + Icon */}
                        <TableCell className="px-4 py-3.5 font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 shrink-0">
                              <IconComp className="h-4 w-4" />
                            </div>
                            <span>{cat.name}</span>
                          </div>
                        </TableCell>

                        {/* Description */}
                        <TableCell className="px-4 py-3.5 text-xs text-slate-600 dark:text-slate-300 max-w-[260px] truncate">
                          {cat.description}
                        </TableCell>

                        {/* Events Count */}
                        <TableCell className="px-4 py-3.5 font-semibold text-indigo-600 dark:text-indigo-400 text-xs whitespace-nowrap">
                          {cat.eventsCount} Events
                        </TableCell>

                        {/* Created Date */}
                        <TableCell className="px-4 py-3.5 text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">
                          {cat.createdDate}
                        </TableCell>

                        {/* Status */}
                        <TableCell className="px-4 py-3.5 whitespace-nowrap">
                          {cat.status === "Active" ? (
                            <Badge className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 shadow-none font-bold text-[11px] gap-1">
                              ● Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 font-bold text-[11px] gap-1">
                              ○ Disabled
                            </Badge>
                          )}
                        </TableCell>

                        {/* Actions Menu */}
                        <TableCell className="px-4 py-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              title="View Details"
                              onClick={() => setViewingCategory(cat)}
                              className="h-8 w-8 text-slate-500 dark:text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              title="Edit Category"
                              onClick={() => handleOpenEdit(cat)}
                              className="h-8 w-8 text-slate-500 dark:text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              title={cat.status === "Active" ? "Disable Category" : "Enable Category"}
                              onClick={() => handleToggleStatus(cat)}
                              className={`h-8 w-8 ${
                                cat.status === "Active"
                                  ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/50"
                                  : "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                              }`}
                            >
                              {cat.status === "Active" ? (
                                <XCircle className="h-4 w-4" />
                              ) : (
                                <CheckCircle2 className="h-4 w-4" />
                              )}
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              title="Delete Category"
                              onClick={() => handleOpenDelete(cat)}
                              className="h-8 w-8 text-slate-500 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination Controls */}
          {filteredCategories.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800 px-6 py-4">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredCategories.length)} to{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredCategories.length)} of{" "}
                {filteredCategories.length} categories
              </span>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="h-8 px-3 text-xs gap-1 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Previous
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`h-8 w-8 text-xs font-semibold ${
                      pageNum === currentPage
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {pageNum}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="h-8 px-3 text-xs gap-1 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>


      {/* Add / Edit Category Modal */}
      <Dialog open={isAddEditOpen} onOpenChange={setIsAddEditOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">
                Category Name
              </label>
              <Input
                type="text"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                placeholder="e.g. Technology, Health & Wellness"
                required
                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">
                Description
              </label>
              <Input
                type="text"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                placeholder="Brief category summary & topics..."
                required
                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">
                  Icon
                </label>
                <Select
                  value={categoryForm.icon}
                  onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-xs"
                >
                  <option value="Tag">Tag</option>
                  <option value="Cpu">Cpu (Tech)</option>
                  <option value="Briefcase">Briefcase (Business)</option>
                  <option value="Palette">Palette (Design)</option>
                  <option value="Music">Music</option>
                  <option value="Heart">Heart (Health)</option>
                  <option value="BookOpen">BookOpen (Education)</option>
                  <option value="Gamepad2">Gamepad (Gaming)</option>
                  <option value="Utensils">Utensils (Food)</option>
                  <option value="Camera">Camera (Photo)</option>
                  <option value="Trophy">Trophy (Sports)</option>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">
                  Status
                </label>
                <Select
                  value={categoryForm.status}
                  onChange={(e) => setCategoryForm({ ...categoryForm, status: e.target.value })}
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-xs"
                >
                  <option value="Active">Active</option>
                  <option value="Disabled">Disabled</option>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddEditOpen(false)}
                className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                Save Category
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[440px] bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Delete Category
            </DialogTitle>
          </DialogHeader>

          {deletingCategory && (
            <div className="space-y-3 pt-2 text-xs">
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                Are you sure you want to delete the category{" "}
                <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                  "{deletingCategory.name}"
                </span>
                ?
              </p>

              {deletingCategory.eventsCount > 0 ? (
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 font-semibold space-y-1">
                  <p className="flex items-center gap-1.5 font-bold">
                    <ShieldAlert className="h-4 w-4 text-amber-600" />
                    Assigned Events Warning
                  </p>
                  <p className="text-[11px] font-normal text-amber-800 dark:text-amber-300">
                    This category is assigned to{" "}
                    <strong>{deletingCategory.eventsCount} existing events</strong>.
                    Deleting it may orphan those events. Consider disabling it instead.
                  </p>
                </div>
              ) : (
                <p className="text-slate-500 dark:text-slate-400">
                  This action cannot be undone.
                </p>
              )}
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDelete}
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold"
            >
              Delete Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Modal */}
      <Dialog open={!!viewingCategory} onOpenChange={() => setViewingCategory(null)}>
        <DialogContent className="sm:max-w-[480px] bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Tag className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Category Details
            </DialogTitle>
          </DialogHeader>

          {viewingCategory && (
            <div className="space-y-4 pt-2 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                    {viewingCategory.name}
                  </span>
                  {viewingCategory.status === "Active" ? (
                    <Badge className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 shadow-none font-bold text-[11px]">
                      ● Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 font-bold text-[11px]">
                      ○ Disabled
                    </Badge>
                  )}
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-medium">
                  {viewingCategory.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Assigned Events
                  </span>
                  <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                    {viewingCategory.eventsCount}
                  </span>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Created Date
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {viewingCategory.createdDate}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="pt-3">
            <Button
              type="button"
              onClick={() => setViewingCategory(null)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}