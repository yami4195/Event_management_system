import { useState, useMemo, useEffect, useCallback } from "react";
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

import { categoriesService } from "@/services/category.service";
import StatCard from "@/components/admin/StatCard";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
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

const ITEMS_PER_PAGE = 8;

export default function Categories() {
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name_asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [actionNotice, setActionNotice] = useState(null);
  const [searchIconVisible, setSearchIconVisible] = useState(true);

  // Modal States
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    icon: "Tag",
    color: "indigo",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Modal States
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // View Details Modal State
  const [viewingCategory, setViewingCategory] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await categoriesService.getAll();
      const raw = res.data?.data?.categories || res.data?.categories || [];
      const mapped = raw.map((c) => ({
        id: c.category_id || c.id,
        name: c.name,
        description: c.description || "No description provided.",
        eventsCount: Number(c.events_count) || 0,
        status: "Active",
        icon: "Tag",
        color: "indigo",
        createdAt: c.created_at,
      }));
      setCategoryList(mapped);
    } catch (err) {
      console.error("Failed to load categories:", err);
      showToast("Failed to fetch categories from the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const showToast = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Filtered & Sorted Categories
  const filteredCategories = useMemo(() => {
    return categoryList
      .filter((cat) => {
        const matchesSearch =
          searchQuery === "" ||
          cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.description.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "name_asc") return a.name.localeCompare(b.name);
        if (sortBy === "name_desc") return b.name.localeCompare(a.name);
        if (sortBy === "most_events") return b.eventsCount - a.eventsCount;
        return 0;
      });
  }, [categoryList, searchQuery, sortBy]);

  // Statistics Calculations
  const stats = useMemo(() => {
    const total = categoryList.length;
    const totalEvents = categoryList.reduce((acc, c) => acc + c.eventsCount, 0);
    return { total, active: total, totalEvents };
  }, [categoryList]);

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / ITEMS_PER_PAGE));
  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCategories.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCategories, currentPage]);

  // Add / Edit Handlers
  const handleOpenAdd = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: "",
      description: "",
      icon: "Tag",
      color: "indigo",
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
    });
    setIsAddEditOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      showToast("Category name cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await categoriesService.update(editingCategory.id, {
          name: categoryForm.name.trim(),
          description: categoryForm.description.trim(),
        });
        showToast(`Category "${categoryForm.name}" updated successfully!`);
      } else {
        await categoriesService.create({
          name: categoryForm.name.trim(),
          description: categoryForm.description.trim(),
        });
        showToast(`Category "${categoryForm.name}" created successfully!`);
      }
      setIsAddEditOpen(false);
      fetchCategories();
    } catch (err) {
      console.error("Save category error:", err);
      showToast(err.response?.data?.message || "Failed to save category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Single Delete Handler
  const handleOpenDelete = (cat) => {
    setDeletingCategory(cat);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    setIsDeleting(true);
    try {
      await categoriesService.delete(deletingCategory.id);
      showToast(`Category "${deletingCategory.name}" deleted successfully.`);
      setIsDeleteOpen(false);
      setDeletingCategory(null);
      fetchCategories();
    } catch (err) {
      console.error("Delete category error:", err);
      showToast(err.response?.data?.message || "Failed to delete category.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSortBy("name_asc");
    setCurrentPage(1);
  };

  const isFilterActive = searchQuery !== "";

  return (
    <div className="min-h-screen space-y-8 bg-slate-50 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Categories Management
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Organize event classifications, tags, and directory discovery.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="shrink-0 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          Create Category
        </Button>
      </div>

      {/* Action Notification Toast/Notice */}
      {actionNotice && (
        <div className="rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-md transition-all">
          {actionNotice}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Categories"
          value={stats.total.toString()}
          icon={Layers}
          description="All active event classifications"
          variant="blue"
        />
        <StatCard
          title="Active Classifications"
          value={stats.active.toString()}
          icon={Tag}
          description="Available for organizer listings"
          variant="emerald"
        />
        <StatCard
          title="Filtered Categories"
          value={filteredCategories.length.toString()}
          icon={Sparkles}
          description="Matching current query"
          variant="indigo"
        />
      </div>

      {/* Main Content Card: Search, Filters, Table & Pagination */}
      <Card className="border-slate-200/80 shadow-xs">
        <CardHeader className="border-b border-slate-100 pb-5">
          <CardTitle className="text-lg font-bold text-slate-900">
            Category Directory ({filteredCategories.length})
          </CardTitle>

          {/* Search & Filters Toolbar */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              {searchIconVisible && (
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              )}
              <Input
                type="text"
                placeholder={searchIconVisible ? "      Search category name or description..." : "Search category name or description..."}
                value={searchQuery}
                onChange={(e) => {
                  setSearchIconVisible(e.target.value === "");
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-10 border-slate-200 bg-white"
              />
            </div>

            {/* Sort Select & Reset */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-[160px]">
                <Select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-10 border-slate-200"
                >
                  <option value="name_asc">Name (A-Z)</option>
                  <option value="name_desc">Name (Z-A)</option>
                  <option value="most_events">Most Events</option>
                </Select>
              </div>

              {isFilterActive && (
                <Button
                  variant="outline"
                  onClick={handleResetFilters}
                  className="h-10 gap-1.5 border-slate-200 text-slate-600 hover:text-slate-900"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3" />
              <p className="text-sm font-medium text-slate-500">Loading categories...</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
                <Tag className="h-8 w-8 stroke-[1.75]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                No categories found.
              </h3>
              <p className="mt-1 text-sm text-slate-500 max-w-sm">
                No event categories match your current search query.
              </p>
              {isFilterActive && (
                <Button
                  variant="outline"
                  onClick={handleResetFilters}
                  className="mt-5 gap-2 border-slate-200 font-semibold"
                >
                  <RotateCcw className="h-4 w-4" />
                  Clear Filter
                </Button>
              )}
            </div>
          ) : (
            /* Categories Table */
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/70 hover:bg-slate-50/70 border-b border-slate-200/80">
                    <TableHead className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Category Name
                    </TableHead>
                    <TableHead className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Description
                    </TableHead>
                    <TableHead className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </TableHead>
                    <TableHead className="text-right px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCategories.map((cat) => {
                    return (
                      <TableRow
                        key={cat.id}
                        className="hover:bg-slate-50/60 transition-colors border-b border-slate-100"
                      >
                        {/* Name & Icon */}
                        <TableCell className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                              <Tag className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{cat.name}</p>
                              <span className="text-xs text-slate-400 font-mono">ID: {cat.id.slice(0, 8)}...</span>
                            </div>
                          </div>
                        </TableCell>

                        {/* Description */}
                        <TableCell className="px-4 py-3 text-slate-600 max-w-md truncate">
                          {cat.description}
                        </TableCell>

                        {/* Status */}
                        <TableCell className="px-4 py-3 whitespace-nowrap">
                          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium">
                            Active
                          </Badge>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="px-4 py-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            {/* View Button */}
                            <Button
                              variant="ghost"
                              size="icon"
                              title="View Category Details"
                              onClick={() => setViewingCategory(cat)}
                              className="h-8 w-8 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            {/* Edit Button */}
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Edit Category"
                              onClick={() => handleOpenEdit(cat)}
                              className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            {/* Delete Button */}
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Delete Category"
                              onClick={() => handleOpenDelete(cat)}
                              className="h-8 w-8 text-slate-500 hover:text-rose-600 hover:bg-rose-50"
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 px-6 py-4">
              <span className="text-xs font-medium text-slate-500">
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
                  className="h-8 px-3 text-xs gap-1 border-slate-200 font-medium"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Previous
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <Button
                      key={pageNum}
                      variant={pageNum === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`h-8 w-8 text-xs font-semibold ${
                        pageNum === currentPage
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : "border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {pageNum}
                    </Button>
                  )
                )}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="h-8 px-3 text-xs gap-1 border-slate-200 font-medium"
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
      {isAddEditOpen && (
        <Dialog open={isAddEditOpen} onOpenChange={setIsAddEditOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900">
                {editingCategory ? "Edit Category" : "Create New Category"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Category Name *
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Artificial Intelligence & ML"
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, name: e.target.value })
                  }
                  required
                  className="h-10 border-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief description of event themes falling under this category..."
                  value={categoryForm.description}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, description: e.target.value })
                  }
                  className="w-full rounded-md border border-slate-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <DialogFooter className="pt-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddEditOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  {isSubmitting ? "Saving..." : editingCategory ? "Save Changes" : "Create Category"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* View Category Modal */}
      {viewingCategory && (
        <Dialog open={!!viewingCategory} onOpenChange={() => setViewingCategory(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Tag className="h-5 w-5 text-indigo-600" />
                {viewingCategory.name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-2 text-sm text-slate-700">
              <div>
                <span className="font-bold text-xs uppercase tracking-wider text-slate-400">Description</span>
                <p className="mt-1 text-slate-600">{viewingCategory.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                <div>
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-400">Category ID</span>
                  <p className="mt-0.5 text-xs font-mono text-slate-500">{viewingCategory.id}</p>
                </div>
                <div>
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-400">Status</span>
                  <p className="mt-0.5 font-semibold text-emerald-600">{viewingCategory.status}</p>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button
                variant="outline"
                onClick={() => setViewingCategory(null)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && deletingCategory && (
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-rose-600 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Delete Category
              </DialogTitle>
            </DialogHeader>

            <p className="text-sm text-slate-600 pt-2">
              Are you sure you want to delete <strong className="text-slate-900">{deletingCategory.name}</strong>?
              This action cannot be undone. Any events currently assigned to this category must be reassigned first.
            </p>

            <DialogFooter className="pt-4 gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDeleteOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="bg-rose-600 hover:bg-rose-700 text-white font-semibold"
              >
                {isDeleting ? "Deleting..." : "Delete Permanently"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}