import { useState, useMemo, useEffect, useCallback } from "react";
import {
  ClipboardList,
  Search,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { registrationsService } from "@/services/registrations.service";
import StatCard from "@/components/admin/StatCard";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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

const ITEMS_PER_PAGE = 8;

export default function Registrations() {
  const [regList, setRegList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [actionNotice, setActionNotice] = useState(null);
  const [searchIconVisible, setSearchIconVisible] = useState(true);

  // Modal State
  const [viewingReg, setViewingReg] = useState(null);

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await registrationsService.getAll();
      const raw = res.data?.data?.registrations || res.data?.registrations || [];
      const mapped = raw.map((r) => {
        const compositeId = `${r.user_id}_${r.event_id}`;
        const status = r.status ? r.status.charAt(0).toUpperCase() + r.status.slice(1).toLowerCase() : "Confirmed";
        return {
          id: compositeId,
          userId: r.user_id,
          eventId: r.event_id,
          userName: r.user_name || "Attendee",
          userEmail: r.user_email || "",
          eventName: r.event_title || "Event",
          registrationDate: r.registration_date
            ? new Date(r.registration_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : "Recent",
          status: status,
        };
      });
      setRegList(mapped);
    } catch (err) {
      console.error("Failed to load registrations:", err);
      showToast("Failed to fetch registrations from the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const showToast = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Filtered Registrations
  const filteredRegistrations = useMemo(() => {
    return regList.filter((reg) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        reg.userName.toLowerCase().includes(q) ||
        reg.userEmail.toLowerCase().includes(q) ||
        reg.eventName.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "All" ||
        reg.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [regList, searchQuery, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = regList.length;
    const confirmed = regList.filter((r) => r.status === "Confirmed").length;
    const cancelled = regList.filter((r) => r.status === "Cancelled").length;
    return { total, confirmed, cancelled };
  }, [regList]);

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filteredRegistrations.length / ITEMS_PER_PAGE));
  const paginatedRegistrations = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRegistrations.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRegistrations, currentPage]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setCurrentPage(1);
  };

  const handleToggleStatus = async (compositeId, currentStatus) => {
    const targetStatus = currentStatus === "Confirmed" ? "cancelled" : "confirmed";
    try {
      await registrationsService.updateStatus(compositeId, targetStatus);
      showToast(`Registration status updated to ${targetStatus}.`);
      fetchRegistrations();
    } catch (err) {
      console.error("Update registration status error:", err);
      showToast(err.response?.data?.message || "Failed to update registration status.");
    }
  };

  const handleDelete = async (compositeId) => {
    if (!window.confirm("Are you sure you want to cancel and remove this registration?")) {
      return;
    }
    try {
      await registrationsService.cancelRegistration(compositeId);
      showToast("Registration removed successfully.");
      fetchRegistrations();
    } catch (err) {
      console.error("Delete registration error:", err);
      showToast(err.response?.data?.message || "Failed to remove registration.");
    }
  };

  const handleExportCSV = () => {
    if (filteredRegistrations.length === 0) return;
    const headers = ["Registration ID", "Attendee Name", "Email", "Event Title", "Date", "Status"];
    const rows = filteredRegistrations.map((r) => [
      r.id,
      `"${r.userName}"`,
      `"${r.userEmail}"`,
      `"${r.eventName}"`,
      `"${r.registrationDate}"`,
      r.status,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `registrations_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isFilterActive = searchQuery !== "" || statusFilter !== "All";

  return (
    <div className="min-h-screen space-y-8 bg-slate-50 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Registrations Management
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Review event passes, check-in status, and attendee participation records.
          </p>
        </div>

        <Button
          onClick={handleExportCSV}
          variant="outline"
          className="shrink-0 gap-2 border-slate-200 bg-white font-semibold text-slate-700 hover:text-slate-900"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-md transition-all">
          {actionNotice}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard
          title="Total Registrations"
          value={stats.total.toString()}
          icon={ClipboardList}
          description="All time ticket passes"
          variant="blue"
        />
        <StatCard
          title="Confirmed"
          value={stats.confirmed.toString()}
          icon={CheckCircle2}
          description="Active attendees"
          variant="emerald"
        />
        <StatCard
          title="Cancelled"
          value={stats.cancelled.toString()}
          icon={XCircle}
          description="Revoked passes"
          variant="purple"
        />
      </div>

      {/* Main Content Card: Search, Filters, Table & Pagination */}
      <Card className="border-slate-200/80 shadow-xs">
        <CardHeader className="border-b border-slate-100 pb-5">
          <CardTitle className="text-lg font-bold text-slate-900">
            Attendee Registrations ({filteredRegistrations.length})
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
                placeholder={searchIconVisible ? "      Search by attendee name, email, or event title..." : "Search by attendee name, email, or event title..."}
                value={searchQuery}
                onChange={(e) => {
                  setSearchIconVisible(e.target.value === "");
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-10 border-slate-200 bg-white"
              />
            </div>

            {/* Filter Selects & Reset */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-[150px]">
                <Select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-10 border-slate-200"
                >
                  <option value="All">All Statuses</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
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
              <p className="text-sm font-medium text-slate-500">Loading registrations...</p>
            </div>
          ) : filteredRegistrations.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
                <ClipboardList className="h-8 w-8 stroke-[1.75]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                No registrations found.
              </h3>
              <p className="mt-1 text-sm text-slate-500 max-w-sm">
                No attendee registrations matched your current search filters.
              </p>
              {isFilterActive && (
                <Button
                  variant="outline"
                  onClick={handleResetFilters}
                  className="mt-5 gap-2 border-slate-200 font-semibold"
                >
                  <RotateCcw className="h-4 w-4" />
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            /* Registrations Table */
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/70 hover:bg-slate-50/70 border-b border-slate-200/80">
                    <TableHead className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Attendee
                    </TableHead>
                    <TableHead className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Email
                    </TableHead>
                    <TableHead className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Event Title
                    </TableHead>
                    <TableHead className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Registered Date
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
                  {paginatedRegistrations.map((reg) => (
                    <TableRow
                      key={reg.id}
                      className="hover:bg-slate-50/60 transition-colors border-b border-slate-100"
                    >
                      {/* Name */}
                      <TableCell className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                        {reg.userName}
                      </TableCell>

                      {/* Email */}
                      <TableCell className="px-4 py-3 text-slate-600 whitespace-nowrap">
                        {reg.userEmail}
                      </TableCell>

                      {/* Event Title */}
                      <TableCell className="px-4 py-3 font-medium text-slate-800 max-w-xs truncate">
                        {reg.eventName}
                      </TableCell>

                      {/* Date */}
                      <TableCell className="px-4 py-3 text-slate-500 text-sm whitespace-nowrap">
                        {reg.registrationDate}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="px-4 py-3 whitespace-nowrap">
                        <Badge
                          className={
                            reg.status === "Confirmed"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-medium"
                              : "bg-rose-50 text-rose-700 border-rose-200 font-medium"
                          }
                        >
                          {reg.status}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {/* View Button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            title="View Details"
                            onClick={() => setViewingReg(reg)}
                            className="h-8 w-8 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          {/* Toggle Status */}
                          <Button
                            variant="ghost"
                            size="icon"
                            title={reg.status === "Confirmed" ? "Cancel Registration" : "Confirm Registration"}
                            onClick={() => handleToggleStatus(reg.id, reg.status)}
                            className={`h-8 w-8 ${
                              reg.status === "Confirmed"
                                ? "text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                                : "text-emerald-600 hover:bg-emerald-50"
                            }`}
                          >
                            {reg.status === "Confirmed" ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                          </Button>

                          {/* Delete */}
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete Registration"
                            onClick={() => handleDelete(reg.id)}
                            className="h-8 w-8 text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination Controls */}
          {filteredRegistrations.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 px-6 py-4">
              <span className="text-xs font-medium text-slate-500">
                Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredRegistrations.length)} to{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredRegistrations.length)} of{" "}
                {filteredRegistrations.length} registrations
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

      {/* View Registration Modal */}
      {viewingReg && (
        <Dialog open={!!viewingReg} onOpenChange={() => setViewingReg(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900">
                Registration Pass Details
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-2 text-sm text-slate-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-400">Attendee</span>
                  <p className="mt-0.5 font-semibold text-slate-900">{viewingReg.userName}</p>
                </div>
                <div>
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-400">Email</span>
                  <p className="mt-0.5 text-slate-600">{viewingReg.userEmail}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-400">Event Title</span>
                <p className="mt-0.5 font-semibold text-slate-900">{viewingReg.eventName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                <div>
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-400">Registration Date</span>
                  <p className="mt-0.5 text-slate-600">{viewingReg.registrationDate}</p>
                </div>
                <div>
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-400">Status</span>
                  <p className="mt-0.5 font-semibold text-emerald-600">{viewingReg.status}</p>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button
                variant="outline"
                onClick={() => setViewingReg(null)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}