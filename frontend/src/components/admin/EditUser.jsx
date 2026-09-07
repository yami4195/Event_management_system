import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Save, UserCheck, AlertCircle } from "lucide-react";
import { userService } from "@/services/user.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function EditUser() {
  const { userId, id } = useParams();
  const targetId = userId || id;
  const navigate = useNavigate();

  const [inputValues, setInputValues] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    role: "CUSTOMER",
    status: "Active",
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUser() {
      setLoading(true);
      setError(null);
      try {
        const res = await userService.getById(targetId);
        const u = res.data?.data?.user || res.data?.user;
        if (u) {
          setInputValues({
            firstname: u.firstname || "",
            lastname: u.lastname || "",
            email: u.email || "",
            phone: u.phone || "",
            role: (u.role || "CUSTOMER").toUpperCase(),
            status: "Active",
          });
        } else {
          setError("User not found.");
        }
      } catch (err) {
        console.error("Failed to load user:", err);
        setError("Failed to fetch user details from server.");
      } finally {
        setLoading(false);
      }
    }

    if (targetId) {
      loadUser();
    }
  }, [targetId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      await userService.update(targetId, {
        firstname: inputValues.firstname.trim(),
        lastname: inputValues.lastname.trim(),
        email: inputValues.email.trim(),
        phone: inputValues.phone.trim(),
        role: inputValues.role.toUpperCase(),
      });

      setIsSaved(true);
      setTimeout(() => {
        navigate("/admin/users");
      }, 1000);
    } catch (err) {
      console.error("Update user error:", err);
      setError(err.response?.data?.message || "Failed to update user profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-3" />
        <p className="text-sm font-medium text-slate-500">Loading user settings...</p>
      </div>
    );
  }

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
            Edit User Account
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

      {/* Error Banner */}
      {error && (
        <div className="rounded-lg bg-rose-600 px-4 py-3 text-sm font-semibold text-white shadow-md flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
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
            {/* First Name & Last Name */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  First Name
                </label>
                <Input
                  type="text"
                  name="firstname"
                  value={inputValues.firstname}
                  onChange={handleChange}
                  placeholder="First name"
                  required
                  className="h-10 bg-white border-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Last Name
                </label>
                <Input
                  type="text"
                  name="lastname"
                  value={inputValues.lastname}
                  onChange={handleChange}
                  placeholder="Last name"
                  required
                  className="h-10 bg-white border-slate-200"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Email Address
                </label>
                <Input
                  type="email"
                  name="email"
                  value={inputValues.email}
                  onChange={handleChange}
                  placeholder="user@example.com"
                  required
                  className="h-10 bg-white border-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Phone Number
                </label>
                <Input
                  type="text"
                  name="phone"
                  value={inputValues.phone}
                  onChange={handleChange}
                  placeholder="+251912345678"
                  className="h-10 bg-white border-slate-200"
                />
              </div>
            </div>

            {/* Role & Status Grid */}
            <div className="grid gap-5 sm:grid-cols-2">
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
                  <option value="CUSTOMER">Customer (Attendee)</option>
                  <option value="ORGANIZER">Organizer</option>
                  <option value="ADMIN">Administrator</option>
                </Select>
              </div>

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
                  <option value="Suspended">Suspended</option>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex items-center gap-3">
              <Button
                type="submit"
                disabled={isSaving}
                className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-10 px-5"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
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