import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminTable({ title, columns = [], data = [] }) {
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "published":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200 shadow-none">
            Published
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 shadow-none">
            Pending
          </Badge>
        );
      case "cancelled":
      case "canceled":
        return (
          <Badge variant="destructive" className="shadow-none">
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="shadow-xs border-slate-200/80">
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-slate-900">
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              {columns.map((col, index) => (
                <TableHead
                  key={index}
                  className="font-semibold text-slate-600 text-xs uppercase tracking-wider px-4 py-3"
                >
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length || 1}
                  className="text-center py-6 text-slate-500"
                >
                  No data available.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-slate-50/50">
                  <TableCell className="font-semibold text-slate-900 px-4 py-3.5">
                    {row.title}
                  </TableCell>
                  <TableCell className="text-slate-600 px-4 py-3.5">
                    {row.organizer}
                  </TableCell>
                  <TableCell className="text-slate-500 px-4 py-3.5">
                    {row.date}
                  </TableCell>
                   <TableCell className="text-slate-500 px-4 py-3.5">
                    {row.location}
                  </TableCell>
                  <TableCell className="px-4 py-3.5">
                    {getStatusBadge(row.status)}
                  </TableCell>
                  <TableCell className="px-4 py-3.5">
                    <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-medium">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}