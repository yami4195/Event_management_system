import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Save, UserCheck } from "lucide-react";
import { getUserById, updateUser } from "@/data/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function EditUser() {
  const { userId, id } = useParams();
  const targetId = userId || id;
  const navigate = useNavigate();

  const [inputValues, setInputValues] = useState({
    name: "",
    email: "",
    role: "Customer",
    status: "Active",
    joinedDate: "",
  });

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const existingUser = getUserById(targetId);
    if (existingUser) {
      setInputValues({
        name: existingUser.name || "",
        role: existingUser.role || "Customer",
        status: existingUser.status || "Active",
        joinedDate: existingUser.joinedDate || "",
      });
    }
  }, [targetId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(targetId, inputValues);
    setIsSaved(true);
    setTimeout(() => {
      navigate("/admin/users");
    }, 800);
  };

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-6 lg:p-8 text-slate-900">
      {/* Back Button & Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <Button
            variant="outline"
            onClick={() => navigate("/admin/users")}
            className="mb-3 gap-2 border-slate-200 bg-white text-slate-700 hover:text-slate-900 shadow-xs h-8 px-3 text-xs font-semibold"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Users
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Edit User Information
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Update account details for user ID: <code className="bg-slate-200/80 px-1.5 py-0.5 rounded text-xs font-mono text-slate-800 font-bold">{targetId}</code>
          </p>
        </div>
      </div>

      {/* Success Banner */}
      {isSaved && (
        <div className="rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-md flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          User information updated successfully! Redirecting...
        </div>
      )}

      {/* Edit Form Card */}
      <Card className="border-slate-200/80 shadow-xs max-w-2xl">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="text-lg font-bold text-slate-900">
            User Account Settings
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Full Name
              </label>
              <Input
                type="text"
                name="name"
                value={inputValues.name}
                onChange={handleChange}
                placeholder="Enter user's full name"
                required
                className="h-10 bg-white border-slate-200"
              />
            </div>

           

            {/* Role & Status Grid */}
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Role Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Role
                </label>
                <Select
                  name="role"
                  value={inputValues.role}
                  onChange={handleChange}
                  className="h-10 border-slate-200 bg-white"
                >
                    <option value="Select role" disabled>Select role</option>
                  <option value="Admin">Admin</option>
                  <option value="Organizer">Organizer</option>
                  <option value="Customer">Customer</option>
                </Select>
              </div>

              {/* Status Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Account Status
                </label>
                <Select
                  name="status"
                  value={inputValues.status}
                  onChange={handleChange}
                  className="h-10 border-slate-200 bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </Select>
              </div>
            </div>

            {/* Joined Date Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Joined Date
              </label>
              <Input
                type="text"
                name="joinedDate"
                value={inputValues.joinedDate}
                onChange={handleChange}
                placeholder="e.g. Jan 12, 2024"
                className="h-10 bg-white border-slate-200"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex items-center gap-3">
              <Button
                type="submit"
                className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-10 px-5"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/users")}
                className="h-10 border-slate-200 text-slate-600 hover:text-slate-900"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}