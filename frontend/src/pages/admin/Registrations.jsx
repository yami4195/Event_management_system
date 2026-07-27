import { useState, useMemo } from "react";
import {
  ClipboardList,
  Search,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock3,
  Download,
  FileSpreadsheet,
  Eye,
  Pencil,
  Trash2,
  UserCheck,
  UserX,
 
  ChevronLeft,
  ChevronRight,
  Activity,
  
} from "lucide-react";

import {
  registrations as initialRegistrations,
  updateRegistration,
  deleteRegistration,
  bulkUpdateRegistrations,
  bulkDeleteRegistrations,
} from "@/data/registrations";

import StatCard from "@/components/admin/StatCard";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
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

const ITEMS_PER_PAGE = 6;

export default function Registrations() {
  const [regList, setRegList] = useState(()=>[...initialRegistrations]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [attendanceFilter, setAttendanceFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [actionNotice, setActionNotice] = useState(null);
  const [searchIconVisible,setSearchIconVisible] = useState(true);

  // Modal / Details Drawer States
  const [viewingReg, setViewingReg] = useState(null);
  const [editingReg, setEditingReg] = useState(null);
  const [editForm, setEditForm] = useState({ status: "Confirmed", paymentStatus: "Paid", attendance: "Checked In" });

  // Delete Confirmation State
  const [deletingReg, setDeletingReg] = useState(null);

 
  // Filtered Registrations
  const filteredRegistrations = useMemo(() => {
    return regList.filter((reg) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        reg.id.toLowerCase().includes(q) ||
        reg.userName.toLowerCase().includes(q) ||
        reg.userEmail.toLowerCase().includes(q) ||
        reg.eventName.toLowerCase().includes(q) ||
        reg.organizer.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "All" ||
        reg.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesPayment =
        paymentFilter === "All" ||
        reg.paymentStatus.toLowerCase() === paymentFilter.toLowerCase();

      const matchesAttendance =
        attendanceFilter === "All" ||
        reg.attendance.toLowerCase() === attendanceFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesPayment && matchesAttendance;
    });
  }, [regList, searchQuery, statusFilter, paymentFilter, attendanceFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = 3482; // Platform overall total
    const confirmed = 3105;
    const pending = 241;
    const cancelled = 136;
    return { total, confirmed, pending, cancelled };
  }, []);

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filteredRegistrations.length / ITEMS_PER_PAGE));
  const paginatedRegistrations = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRegistrations.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRegistrations, currentPage]);

  const showToast = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  // Bulk Selection Handlers
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(paginatedRegistrations.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkApprove = () => {
    bulkUpdateRegistrations(selectedIds, { status: "Confirmed" });
    setRegList([...initialRegistrations]);
    setSelectedIds([]);
    showToast(`Approved ${selectedIds.length} registrations`);
  };

  const handleBulkCancel = () => {
    bulkUpdateRegistrations(selectedIds, { status: "Cancelled" });
    setRegList([...initialRegistrations]);
    setSelectedIds([]);
    showToast(`Cancelled ${selectedIds.length} registrations`);
  };

  const handleBulkDelete = () => {
    bulkDeleteRegistrations(selectedIds);
    setRegList([...initialRegistrations]);
    setSelectedIds([]);
    showToast(`Deleted ${selectedIds.length} registrations`);
  };

  const handleExportData = (format) => {
    const csvContent =
      "RegistrationID,UserName,UserEmail,EventName,Date,PaymentStatus,Attendance,Status\n" +
      filteredRegistrations
        .map(
          (r) =>
            `"${r.id}","${r.userName}","${r.userEmail}","${r.eventName}","${r.date}","${r.paymentStatus}","${r.attendance}","${r.status}"`
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `registrations_report.${format.toLowerCase()}`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`Exported registrations report as ${format}`);
  };

  // Single Action Handlers
  const handleToggleCheckIn = (reg) => {
    const newAtt = reg.attendance === "Checked In" ? "Absent" : "Checked In";
    const newTime =
      newAtt === "Checked In"
        ? new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
        : "-";
    updateRegistration(reg.id, { attendance: newAtt, checkInTime: newTime });
    setRegList([...initialRegistrations]);
    showToast(`Registration ${reg.id} attendance set to "${newAtt}"`);
  };

  const handleOpenEdit = (reg) => {
    setEditingReg(reg);
    setEditForm({
      status: reg.status,
      paymentStatus: reg.paymentStatus,
      attendance: reg.attendance,
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (editingReg) {
      updateRegistration(editingReg.id, editForm);
      setRegList([...initialRegistrations]);
      showToast(`Updated registration ${editingReg.id}`);
      setEditingReg(null);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingReg) {
      deleteRegistration(deletingReg.id);
      setRegList([...initialRegistrations]);
      showToast(`Deleted registration ${deletingReg.id}`);
      setDeletingReg(null);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setPaymentFilter("All");
    setAttendanceFilter("All");
    setCurrentPage(1);
  };

  const isFilterActive =
    searchQuery !== "" ||
    statusFilter !== "All" ||
    paymentFilter !== "All" ||
    attendanceFilter !== "All";

  // Attendance Overview calculations
  const totalCheckedIn = regList.filter((r) => r.attendance === "Checked In").length;
  const totalAbsent = regList.filter((r) => r.attendance === "Absent").length;
  const attendancePct = Math.round((totalCheckedIn / (regList.length || 1)) * 100);

  return (
    <div className="space-y-8 text-slate-900 dark:text-slate-100 pb-16 transition-colors duration-200">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Registrations Management
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              <ClipboardList className="h-3.5 w-3.5" />
              {stats.total.toLocaleString()} Total
            </span>
          </div>
          <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            Monitor event registrations, attendance, ticket status, and payments.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExportData("CSV")}
            className="gap-1.5 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExportData("Excel")}
            className="gap-1.5 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            Export Excel
          </Button>
        </div>
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
          title="Total Registrations"
          value={stats.total.toLocaleString()}
          icon={ClipboardList}
          description="Total event registrations"
          trend={{ value: "+12% overall", isPositive: true }}
          variant="indigo"
        />

        <StatCard
          title="Confirmed"
          value={stats.confirmed.toLocaleString()}
          icon={CheckCircle2}
          description="Confirmed attendees"
          trend={{ value: "89% rate", isPositive: true }}
          variant="emerald"
        />

        <StatCard
          title="Pending"
          value={stats.pending.toString()}
          icon={Clock3}
          description="Requires payment or review"
          trend={{ value: "Pending", isPositive: false }}
          variant="amber"
        />

        <StatCard
          title="Cancelled"
          value={stats.cancelled.toString()}
          icon={XCircle}
          description="Cancelled or refunded"
          trend={{ value: "4% rate", isPositive: false }}
          variant="rose"
        />
      </section>
<p>`</p>
      {/* Search, Filters, Bulk Selection Toolbar */}
      <Card className="border-slate-200/80 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              {searchIconVisible &&(
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />)}
              <Input
                type="text"
                placeholder="       Search registrations by ID, user name, email, event..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchIconVisible(e.target.value=="");
                  setCurrentPage(1);
                }}
                className="pl-9 h-9 border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800 text-xs dark:text-slate-100"
              />
            </div>

            {/* Filters Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Registration Status Filter */}
              <div className="w-[130px]">
                <Select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-9 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-slate-100"
                >
                  <option value="All">All Statuses</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </Select>
              </div>

              {/* Payment Filter */}
              <div className="w-[130px]">
                <Select
                  value={paymentFilter}
                  onChange={(e) => {
                    setPaymentFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-9 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-slate-100"
                >
                  <option value="All">All Payments</option>
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Refunded">Refunded</option>
                </Select>
              </div>

              {/* Attendance Filter */}
              <div className="w-[130px]">
                <Select
                  value={attendanceFilter}
                  onChange={(e) => {
                    setAttendanceFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-9 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs dark:text-slate-100"
                >
                  <option value="All">All Attendance</option>
                  <option value="Checked In">Checked In</option>
                  <option value="Absent">Absent</option>
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
                {selectedIds.length} Registrations Selected
              </span>

              <div className="flex items-center gap-2">
                <Button
                  size="xs"
                  variant="outline"
                  onClick={handleBulkApprove}
                  className="h-7 text-[11px] font-bold border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60"
                >
                  Approve
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={handleBulkCancel}
                  className="h-7 text-[11px] font-bold border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800"
                >
                  Cancel Selected
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => handleExportData("CSV")}
                  className="h-7 text-[11px] font-bold border-indigo-300 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60"
                >
                  Export CSV
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
          {filteredRegistrations.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-4">
                <ClipboardList className="h-8 w-8 stroke-[1.75]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                No registrations found.
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                Registrations will appear here when users register for events.
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
            /* Registration Table */
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-50/70 border-b border-slate-200 dark:border-slate-800">
                    <TableHead className="w-[40px] px-4 py-3.5">
                      <input
                        type="checkbox"
                        checked={
                          paginatedRegistrations.length > 0 &&
                          selectedIds.length === paginatedRegistrations.length
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </TableHead>
                    <TableHead className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Registration ID
                    </TableHead>
                    <TableHead className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      User
                    </TableHead>
                    <TableHead className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Event
                    </TableHead>
                    <TableHead className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Date
                    </TableHead>
                    <TableHead className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Payment
                    </TableHead>
                    <TableHead className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Attendance
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
                  {paginatedRegistrations.map((reg) => {
                    const isSelected = selectedIds.includes(reg.id);

                    return (
                      <TableRow
                        key={reg.id}
                        className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors border-b border-slate-100 dark:border-slate-800 ${
                          isSelected ? "bg-indigo-50/40 dark:bg-indigo-950/20" : ""
                        }`}
                      >
                        {/* Checkbox */}
                        <TableCell className="px-4 py-3.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(reg.id)}
                            className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </TableCell>

                        {/* Registration ID */}
                        <TableCell className="px-4 py-3.5 font-mono text-xs font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                          {reg.id}
                        </TableCell>

                        {/* User Info */}
                        <TableCell className="px-4 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <Avatar src={reg.userAvatar} name={reg.userName} size="sm" className="h-8 w-8" />
                            <div>
                              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                                {reg.userName}
                              </span>
                              <span className="text-[10px] font-medium text-slate-400 block">
                                {reg.userEmail}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        {/* Event Info */}
                        <TableCell className="px-4 py-3.5 max-w-[180px] truncate">
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block truncate">
                            {reg.eventName}
                          </span>
                          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 block truncate">
                            by {reg.organizer}
                          </span>
                        </TableCell>

                        {/* Date */}
                        <TableCell className="px-4 py-3.5 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                          {reg.date}
                        </TableCell>

                        {/* Payment Status */}
                        <TableCell className="px-4 py-3.5 whitespace-nowrap">
                          {reg.paymentStatus === "Paid" ? (
                            <Badge className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 shadow-none font-bold text-[10px]">
                              Paid ({reg.amount})
                            </Badge>
                          ) : reg.paymentStatus === "Unpaid" ? (
                            <Badge className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800 shadow-none font-bold text-[10px]">
                              Unpaid
                            </Badge>
                          ) : (
                            <Badge className="bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800 shadow-none font-bold text-[10px]">
                              Refunded
                            </Badge>
                          )}
                        </TableCell>

                        {/* Attendance */}
                        <TableCell className="px-4 py-3.5 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleCheckIn(reg)}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                              reg.attendance === "Checked In"
                                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                            }`}
                          >
                            {reg.attendance === "Checked In" ? (
                              <UserCheck className="h-3 w-3" />
                            ) : (
                              <UserX className="h-3 w-3" />
                            )}
                            {reg.attendance}
                          </button>
                        </TableCell>

                        {/* Status */}
                        <TableCell className="px-4 py-3.5 whitespace-nowrap">
                          {reg.status === "Confirmed" ? (
                            <Badge className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 shadow-none font-bold text-[10px]">
                              Confirmed
                            </Badge>
                          ) : reg.status === "Pending" ? (
                            <Badge className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800 shadow-none font-bold text-[10px]">
                              Pending
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="shadow-none font-bold text-[10px]">
                              Cancelled
                            </Badge>
                          )}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="px-4 py-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              title="View Registration Details"
                              onClick={() => setViewingReg(reg)}
                              className="h-8 w-8 text-slate-500 dark:text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              title="Edit Registration"
                              onClick={() => handleOpenEdit(reg)}
                              className="h-8 w-8 text-slate-500 dark:text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              title="Delete Registration"
                              onClick={() => setDeletingReg(reg)}
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
          {filteredRegistrations.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800 px-6 py-4">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
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
<p>`</p>
      {/* Analytics & Recent Registrations Panel */}
      <section className="grid gap-6 lg:grid-cols-3 items-start">
        {/* Attendance Overview Progress Meter (2 Cols) */}
        <Card className="lg:col-span-2 border-slate-200/80 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <UserCheck className="h-18 w-4 text-emerald-600 dark:text-emerald-400" />
                Attendance Overview
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {attendancePct}% Check-in Rate
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">
                  Checked In ({totalCheckedIn} Registrants)
                </span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  {attendancePct}%
                </span>
              </div>
              <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${attendancePct}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-0.5">
                  Present / Checked In
                </span>
                <span className="text-lg font-black text-slate-900 dark:text-slate-100">
                  {totalCheckedIn}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">
                  Absent / Not Arrived
                </span>
                <span className="text-lg font-black text-slate-900 dark:text-slate-100">
                  {totalAbsent}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Registrations Side Panel (1 Col) */}
        <Card className="border-slate-200/80 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Activity className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              Latest Registrations
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 px-4 pb-2 space-y-3">
            {regList.slice(0, 4).map((reg) => (
              <div
                key={reg.id}
                onClick={() => setViewingReg(reg)}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-100 dark:border-slate-800 cursor-pointer transition-colors"
              >
                <Avatar src={reg.userAvatar} name={reg.userName} size="sm" className="h-8 w-8" />
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    {reg.userName}
                  </h5>
                  <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate">
                    {reg.eventName}
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {reg.id}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Registration Details Side Drawer / Modal */}
      <Dialog open={!!viewingReg} onOpenChange={() => setViewingReg(null)}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Registration Details
            </DialogTitle>
          </DialogHeader>

          {viewingReg && (
            <div className="space-y-4 pt-2 text-xs">
              {/* Registrant Info */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Registrant Information
                </span>
                <div className="flex items-center gap-3 pt-1">
                  <Avatar src={viewingReg.userAvatar} name={viewingReg.userName} size="md" className="h-10 w-10" />
                  <div>
                    <div className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                      {viewingReg.userName}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400">{viewingReg.userEmail}</div>
                    <div className="text-slate-500 dark:text-slate-400">{viewingReg.userPhone}</div>
                  </div>
                </div>
              </div>

              {/* Event Info */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Event Information
                </span>
                <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {viewingReg.eventName}
                </div>
                <div className="text-slate-500 dark:text-slate-400">
                  Organizer: <strong>{viewingReg.organizer}</strong>
                </div>
                <div className="text-slate-500 dark:text-slate-400">
                  Venue: {viewingReg.venue}
                </div>
              </div>

              {/* Ticket & Payment Details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Ticket Details
                  </span>
                  <div className="font-bold text-slate-900 dark:text-slate-100">
                    {viewingReg.ticketType}
                  </div>
                  <div className="text-indigo-600 dark:text-indigo-400 font-semibold">
                    {viewingReg.numTickets} Tickets ({viewingReg.amount})
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Payment Method
                  </span>
                  <div className="font-bold text-slate-900 dark:text-slate-100 truncate">
                    {viewingReg.paymentMethod}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 font-mono text-[10px] truncate">
                    {viewingReg.transactionId}
                  </div>
                </div>
              </div>

              {/* Attendance & Check-in Time */}
              <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 block">
                    Attendance Status
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {viewingReg.attendance}
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {viewingReg.checkInTime}
                </span>
              </div>
            </div>
          )}

          <DialogFooter className="pt-3">
            <Button
              type="button"
              onClick={() => setViewingReg(null)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Registration Modal */}
      <Dialog open={!!editingReg} onOpenChange={() => setEditingReg(null)}>
        <DialogContent className="sm:max-w-[440px] bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
              Edit Registration #{editingReg?.id}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveEdit} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">
                Registration Status
              </label>
              <Select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-xs"
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">
                Payment Status
              </label>
              <Select
                value={editForm.paymentStatus}
                onChange={(e) => setEditForm({ ...editForm, paymentStatus: e.target.value })}
                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-xs"
              >
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Refunded">Refunded</option>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">
                Attendance Status
              </label>
              <Select
                value={editForm.attendance}
                onChange={(e) => setEditForm({ ...editForm, attendance: e.target.value })}
                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-xs"
              >
                <option value="Checked In">Checked In</option>
                <option value="Absent">Absent</option>
              </Select>
            </div>

            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingReg(null)}
                className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deletingReg} onOpenChange={() => setDeletingReg(null)}>
        <DialogContent className="sm:max-w-[420px] bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Delete Registration
            </DialogTitle>
          </DialogHeader>

          {deletingReg && (
            <div className="space-y-2 pt-2 text-xs">
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                Are you sure you want to delete registration record{" "}
                <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                  #{deletingReg.id}
                </span>{" "}
                for <strong>{deletingReg.userName}</strong>?
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                This action will permanently remove this registration entry.
              </p>
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingReg(null)}
              className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDelete}
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold"
            >
              Delete Registration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}