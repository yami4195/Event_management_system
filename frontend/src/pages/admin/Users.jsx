import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "@/services/user.service";
import {
  Plus,
  Search,
  RotateCcw,
  Eye,
  Pencil,
  UserX,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";

import UserStats from "@/components/admin/UserStats";
import RoleBadge from "@/components/common/RoleBadge";
import StatusBadge from "@/components/common/StatusBadge";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

const ITEMS_PER_PAGE = 10;

export default function Users() {
  const navigate = useNavigate();
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [actionNotice, setActionNotice] = useState(null);
  const [searchIconVisible, setSearchIconVisible] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await userService.getAll();
      const rawUsers = res.data?.data?.users || res.data?.users || [];
      const mapped = rawUsers.map((u) => {
        const fullName = `${u.firstname || ""} ${u.lastname || ""}`.trim() || "User";
        const role = u.role ? u.role.charAt(0).toUpperCase() + u.role.slice(1).toLowerCase() : "Customer";
        return {
          id: u.id || u.user_id,
          name: fullName,
          firstname: u.firstname || "",
          lastname: u.lastname || "",
          email: u.email || "",
          role: role,
          phone: u.phone || "",
          status: "Active",
          joinedDate: u.createdAt
            ? new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : "Recently",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id || u.email}`,
        };
      });
      setUserList(mapped);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setActionNotice("Failed to load users from the server.");
      setTimeout(() => setActionNotice(null), 4000);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return userList.filter((user) => {
      const matchesSearch =
        searchQuery === "" ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.includes(searchQuery);

      const matchesRole =
        roleFilter === "All" ||
        user.role.toLowerCase() === roleFilter.toLowerCase();

      const matchesStatus =
        statusFilter === "All" ||
        user.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [userList, searchQuery, roleFilter, statusFilter]);

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setRoleFilter("All");
    setStatusFilter("All");
    setCurrentPage(1);
  };

  const handleToggleSuspend = (userId, currentStatus) => {
    const newStatus = currentStatus === "Suspended" ? "Active" : "Suspended";
    setUserList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
    const targetUser = userList.find((u) => u.id === userId);
    setActionNotice(`${targetUser?.name || "User"} marked as ${newStatus}`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to permanently delete ${userName}? This will remove all their data.`)) {
      return;
    }
    try {
      await userService.delete(userId);
      setUserList((prev) => prev.filter((u) => u.id !== userId));
      setActionNotice(`User ${userName} deleted successfully.`);
      setTimeout(() => setActionNotice(null), 3000);
    } catch (err) {
      console.error("Delete user error:", err);
      setActionNotice(err.response?.data?.message || "Failed to delete user.");
      setTimeout(() => setActionNotice(null), 4000);
    }
  };

  const isFilterActive =
    searchQuery !== "" || roleFilter !== "All" || statusFilter !== "All";

  return (
    <div className="min-h-screen space-y-8 bg-slate-50 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Users Management
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Manage platform users, assign roles, and inspect account activity.
          </p>
        </div>
      </div>

      {/* Action Notification Toast/Notice */}
      {actionNotice && (
        <div className="rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-md transition-all">
          {actionNotice}
        </div>
      )}

      {/* Statistics Cards */}
      <UserStats userList={userList} />

      {/* Main Content Card: Search, Filters, Table & Pagination */}
      <Card className="border-slate-200/80 shadow-xs">
        <CardHeader className="border-b border-slate-100 pb-5">
          <CardTitle className="text-lg font-bold text-slate-900">
            All Registered Users ({filteredUsers.length})
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
                placeholder={searchIconVisible ? "      Search by name, email, or phone..." : "Search by name, email, or phone..."}
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
              <div className="w-[140px]">
                <Select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-10 border-slate-200"
                >
                  <option value="All">All Roles</option>
                  <option value="Admin">Admin</option>
                  <option value="Organizer">Organizer</option>
                  <option value="Customer">Customer</option>
                </Select>
              </div>

              <div className="w-[140px]">
                <Select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-10 border-slate-200"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
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
              <p className="text-sm font-medium text-slate-500">Loading user accounts...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
                <UserX className="h-8 w-8 stroke-[1.75]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                No users found.
              </h3>
              <p className="mt-1 text-sm text-slate-500 max-w-sm">
                No platform users matched your current search query or active filter criteria.
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
            /* Users Table */
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/70 hover:bg-slate-50/70 border-b border-slate-200/80">
                    <TableHead className="w-[80px] px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Avatar
                    </TableHead>
                    <TableHead className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Name
                    </TableHead>
                    <TableHead className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Email
                    </TableHead>
                    <TableHead className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Role
                    </TableHead>
                    <TableHead className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </TableHead>
                    <TableHead className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Joined
                    </TableHead>
                    <TableHead className="text-right px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      className="hover:bg-slate-50/60 transition-colors border-b border-slate-100"
                    >
                      {/* Avatar */}
                      <TableCell className="px-4 py-3">
                        <Avatar src={user.avatar} name={user.name} size="md" />
                      </TableCell>

                      {/* Name */}
                      <TableCell className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                        {user.name}
                      </TableCell>

                      {/* Email */}
                      <TableCell className="px-4 py-3 text-slate-600 whitespace-nowrap">
                        {user.email}
                      </TableCell>

                      {/* Role */}
                      <TableCell className="px-4 py-3 whitespace-nowrap">
                        <RoleBadge role={user.role} />
                      </TableCell>

                      {/* Status */}
                      <TableCell className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={user.status} />
                      </TableCell>

                      {/* Joined Date */}
                      <TableCell className="px-4 py-3 text-slate-500 text-sm whitespace-nowrap">
                        {user.joinedDate}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {/* View Button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            title="View User Details"
                            onClick={() => navigate(`/admin/users/${user.id}`)}
                            className="h-8 w-8 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          {/* Edit Button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Edit User"
                            className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                            onClick={() => navigate(`/admin/users/EditUser/${user.id}`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          {/* Suspend / Reactivate Button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            title={
                              user.status === "Suspended"
                                ? "Reactivate User"
                                : "Suspend User"
                            }
                            onClick={() =>
                              handleToggleSuspend(user.id, user.status)
                            }
                            className={`h-8 w-8 ${
                              user.status === "Suspended"
                                ? "text-emerald-600 hover:bg-emerald-50"
                                : "text-slate-500 hover:text-amber-600 hover:bg-amber-50"
                            }`}
                          >
                            {user.status === "Suspended" ? (
                              <UserCheck className="h-4 w-4" />
                            ) : (
                              <UserX className="h-4 w-4" />
                            )}
                          </Button>

                          {/* Delete Button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete User"
                            onClick={() => handleDeleteUser(user.id, user.name)}
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
          {filteredUsers.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 px-6 py-4">
              <span className="text-xs font-medium text-slate-500">
                Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredUsers.length)} to{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)} of{" "}
                {filteredUsers.length} users
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
    </div>
  );
}
