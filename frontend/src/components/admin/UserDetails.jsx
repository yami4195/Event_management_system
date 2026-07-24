import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Calendar, } from "lucide-react";
import { users } from "@/data/users";
import RoleBadge from "@/components/common/RoleBadge";
import StatusBadge from "@/components/common/StatusBadge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function UserDetails() {
  const { userId, id } = useParams();
  const targetId = userId || id;
  const navigate = useNavigate();

  const user = users.find((u) => u.id === targetId) || {
    id: targetId,
    name: "User Not Found",
    email: "N/A",
    role: "Customer",
    status: "Inactive",
    joinedDate: "N/A",
    avatar: null,
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
            User Profile & Details
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-600">
            Viewing details for ID: <code className="bg-slate-200/80 px-1.5 py-0.5 rounded text-xs font-mono text-slate-800 font-bold">{targetId}</code>
          </p>
        </div>
      </div>

      {/* User Information Card */}
      <Card className="border-slate-200/80 shadow-xs max-w-4xl">
        <CardHeader className="border-b border-slate-100 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar src={user.avatar} name={user.name} size="lg" className="h-16 w-16 text-xl" />
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">
                  {user.name}
                </CardTitle>
                <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <Mail className="h-3.5 w-3.5" />
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <RoleBadge role={user.role} />
              <StatusBadge status={user.status} />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                User ID
              </span>
              <p className="text-sm font-semibold text-slate-800">{user.id}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Email Address
              </span>
              <p className="text-sm font-semibold text-slate-800">{user.email}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Account Role
              </span>
              <div className="pt-1">
                <RoleBadge role={user.role} />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Account Status
              </span>
              <div className="pt-1">
                <StatusBadge status={user.status} />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Joined Date
              </span>
              <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-slate-400" />
                {user.joinedDate}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}