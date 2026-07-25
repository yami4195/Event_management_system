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
          <Badge className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 border-emerald-200 dark:border-emerald-800 shadow-none">
            Published
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-100 border-amber-200 dark:border-amber-800 shadow-none">
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
    <Card className="shadow-xs border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {title && (
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              {columns.map((col, index) => (
                <TableHead
                  key={index}
                  className="font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider px-4 py-3"
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
                  className="text-center py-6 text-slate-500 dark:text-slate-400"
                >
                  No data available.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800"
                >
                  <TableCell className="font-semibold text-slate-900 dark:text-slate-100 px-4 py-3.5">
                    {row.title}
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-300 px-4 py-3.5">
                    {row.organizer}
                  </TableCell>
                  <TableCell className="text-slate-500 dark:text-slate-400 px-4 py-3.5">
                    {row.date}
                  </TableCell>
                  <TableCell className="text-slate-500 dark:text-slate-400 px-4 py-3.5">
                    {row.location}
                  </TableCell>
                  <TableCell className="px-4 py-3.5">
                    {getStatusBadge(row.status)}
                  </TableCell>
                  <TableCell className="px-4 py-3.5">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 text-xs font-medium border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                    >
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