import { useState } from "react";
import { Download, FileText, FileSpreadsheet, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ReportsExportPanel() {
  const [downloadNotice, setDownloadNotice] = useState(null);

  const reports = [
    { title: "Revenue Report 2026", type: "Financial", count: "342 Records" },
    { title: "User Growth & Registrations", type: "Analytics", count: "2,500 Users" },
    { title: "Event Performance & Attendance", type: "Events", count: "142 Events" },
    { title: "Ticket Sales Summary", type: "Sales", count: "3,840 Tickets" },
    { title: "Organizer Ranking & Revenue", type: "Organizers", count: "38 Organizers" },
  ];

  const handleExport = (reportTitle, format) => {
    // Generate CSV content
    const csvData = `Report,Format,ExportedAt\n"${reportTitle}",${format},"${new Date().toISOString()}"\n`;
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${reportTitle.toLowerCase().replace(/\s+/g, "_")}.${format.toLowerCase()}`;
    link.click();
    URL.revokeObjectURL(url);

    setDownloadNotice(`Exported "${reportTitle}" as ${format}`);
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  return (
    <Card className="border-slate-200/80 shadow-xs bg-white">
      <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <FileText className="h-4 w-4 text-indigo-600" />
          Dashboard Reports & Export
        </CardTitle>
        {downloadNotice && (
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {downloadNotice}
          </span>
        )}
      </CardHeader>
      <CardContent className="pt-3 px-3 pb-3 space-y-2">
        {reports.map((rep, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 gap-2"
          >
            <div>
              <h5 className="text-xs font-bold text-slate-900">{rep.title}</h5>
              <span className="text-[10px] font-medium text-slate-500">
                {rep.type} • {rep.count}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Button
                size="xs"
                variant="outline"
                onClick={() => handleExport(rep.title, "CSV")}
                className="h-7 text-[10px] font-bold border-slate-200 text-slate-700 bg-white gap-1"
              >
                <Download className="h-3 w-3" />
                CSV
              </Button>

              <Button
                size="xs"
                variant="outline"
                onClick={() => handleExport(rep.title, "Excel")}
                className="h-7 text-[10px] font-bold border-emerald-200 text-emerald-700 bg-emerald-50/50 gap-1"
              >
                <FileSpreadsheet className="h-3 w-3" />
                Excel
              </Button>

              <Button
                size="xs"
                variant="outline"
                onClick={() => handleExport(rep.title, "PDF")}
                className="h-7 text-[10px] font-bold border-rose-200 text-rose-700 bg-rose-50/50 gap-1"
              >
                <FileText className="h-3 w-3" />
                PDF
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
